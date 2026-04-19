import type { AlertItem, Event, PulseHistoryEntry, PulseLabel, SimulationMeta, Trend } from "./types";
import { scoreToState, isUpgrade, stateIndex } from "./stateUtils";

/** Base interval: 1s at 1× speed — demo feels immediate; still divided by sim speed (2×, 4×). */
const TICK_MS = 1000;
const HISTORY_LEN = 28;
/** Net score gain over SURGE_WINDOW ticks → surge (tuned for 1s ticks, visible but stable). */
const SURGE_DELTA = 4;
const SURGE_WINDOW = 3;

function hash32(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Deterministic 0..1 from id + tick */
export function det01(id: string, tick: number, salt: number): number {
  const x = Math.sin((hash32(id) % 10000) * 0.0001 + tick * 0.17 + salt * 1.7) * 10000;
  return x - Math.floor(x);
}

export function getTickIntervalMs(speed: SimulationMeta["speed"]): number {
  return Math.round(TICK_MS / speed);
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

function trendFromDelta(d: number): Trend {
  if (d > 0.25) return "rising";
  if (d < -0.25) return "falling";
  return "flat";
}

const PULSE_WEIGHT: Record<PulseLabel, number> = {
  dead: -4,
  warming: 3,
  good: 8,
  packed: 14,
  crazy: 22,
};

function recentPulseBoost(e: Event, now: number): number {
  let b = 0;
  for (const p of e.pulseHistory) {
    const age = now - p.at;
    if (age > 180_000) continue;
    const w = Math.exp(-age / 55_000) * (p.source === "user" ? 1.35 : 0.55);
    b += PULSE_WEIGHT[p.label] * w;
  }
  return b;
}

function trimPulseHistory(ph: PulseHistoryEntry[], now: number): PulseHistoryEntry[] {
  return ph.filter((p) => now - p.at < 240_000);
}

export interface TickResult {
  events: Event[];
  newAlerts: AlertItem[];
}

export function advanceSimulation(
  events: Event[],
  meta: SimulationMeta,
  now: number
): TickResult {
  const tick = meta.tickIndex;
  const newAlerts: AlertItem[] = [];
  const next = events.map((src) => {
    const prevState = src.state;
    const prevScore = src.momentumScore;
    const e: Event = {
      ...src,
      pulseHistory: trimPulseHistory([...src.pulseHistory], now),
      recentActivity: [...src.recentActivity],
      pulseCounts: { ...src.pulseCounts },
      momentumHistory: [...src.momentumHistory],
    };

    const forced = meta.forcedSurgeUntil[e.id] !== undefined && tick <= meta.forcedSurgeUntil[e.id];
    const r1 = det01(e.id, tick, 1);
    const r2 = det01(e.id, tick, 2);
    const wave =
      Math.sin(tick * 0.11 + hash32(e.id) * 0.0000001) * 5 +
      Math.cos(tick * 0.055 + e.demoBias) * 2.5;

    let organic = wave * (0.42 + Math.abs(e.demoBias) * 0.55);
    organic *= e.demoBias >= 0 ? 1 : -0.85;
    organic += (r1 - 0.5) * 2 * e.demoBias;
    organic += (r2 - 0.5) * 1;

    if (forced) {
      organic += 11 + det01(e.id, tick, 9) * 7;
    }

    const pulseBoost = recentPulseBoost(e, now);

    let score = prevScore + organic * 0.72 + pulseBoost * 0.11;
    score += (e.attendance - e.baseAttendance) * 0.018;

    const attendanceTarget =
      e.baseAttendance +
      (score / 100) * 58 * (0.85 + det01(e.id, tick, 3) * 0.3) +
      (forced ? 22 : 0);
    const nextAttendance = Math.round(
      e.attendance + (attendanceTarget - e.attendance) * (0.22 + det01(e.id, tick, 4) * 0.1)
    );

    score = clamp(score, 0, 100);
    const st = scoreToState(score);

    const scoreRing = [...e.momentumHistory, score];
    while (scoreRing.length > HISTORY_LEN) scoreRing.shift();

    const older =
      scoreRing.length > SURGE_WINDOW + 1
        ? scoreRing[scoreRing.length - SURGE_WINDOW - 1]
        : scoreRing[0];
    const surgeRaw = score - older > SURGE_DELTA || forced;
    /** Light hysteresis: avoids rapid on/off flicker on markers when the wave wiggles. */
    const isSurging =
      surgeRaw || (e.isSurging && score >= prevScore - 1.5);

    const deltaTrend = score - prevScore;
    const trend = trendFromDelta(deltaTrend);

    let recentActivity = e.recentActivity;
    let lastAlertAt = e.lastAlertAt;

    if (isUpgrade(prevState, st)) {
      const label =
        st === "crazy"
          ? "crazy good"
          : st === "packed"
            ? "packed"
            : st === "good"
              ? "good"
              : st === "warming"
                ? "warming up"
                : "quiet";
      recentActivity = [
        { at: now, message: `Energy shifted — now ${label}` },
        ...e.recentActivity,
      ].slice(0, 12);

      if (e.watched && (st === "good" || st === "packed" || st === "crazy")) {
        const id = `al-${e.id}-${tick}-${stateIndex(st)}`;
        newAlerts.push({
          id,
          at: now,
          eventId: e.id,
          eventName: e.name,
          type: st === "crazy" ? "surge" : "state_up",
          message:
            st === "crazy"
              ? `${e.name} went crazy good`
              : `${e.name} just got ${st === "good" ? "good" : st}`,
        });
        lastAlertAt = now;
      }

      if (prevState === "warming" && st === "packed") {
        newAlerts.push({
          id: `al-flip-${e.id}-${tick}`,
          at: now,
          eventId: e.id,
          eventName: e.name,
          type: "flip",
          message: `${e.name} flipped from warming to packed`,
        });
      }
    }

    if (surgeRaw && e.watched && !e.isSurging && !isUpgrade(prevState, st)) {
      newAlerts.push({
        id: `al-surge-${e.id}-${tick}`,
        at: now,
        eventId: e.id,
        eventName: e.name,
        type: "surge",
        message: `${e.name} is surging`,
      });
      lastAlertAt = now;
    }

    return {
      ...e,
      momentumScore: score,
      state: st,
      attendance: clamp(nextAttendance, 4, 420),
      trend,
      momentumHistory: scoreRing,
      isSurging,
      recentActivity,
      lastAlertAt,
    };
  });

  return { events: next, newAlerts };
}

export function applyUserPulse(event: Event, label: PulseLabel, now: number): Event {
  const bump =
    label === "dead"
      ? -6
      : label === "warming"
        ? 8
        : label === "good"
          ? 16
          : label === "packed"
            ? 22
            : 28;
  const momentumScore = clamp(event.momentumScore + bump, 0, 100);
  const state = scoreToState(momentumScore);
  const ring = [...event.momentumHistory, momentumScore];
  while (ring.length > HISTORY_LEN) ring.shift();
  const trend: Trend = bump >= 12 ? "rising" : bump <= -4 ? "falling" : event.trend;
  return {
    ...event,
    pulseCounts: { ...event.pulseCounts, [label]: event.pulseCounts[label] + 1 },
    pulseHistory: [{ at: now, label, source: "user" as const }, ...event.pulseHistory].slice(0, 40),
    momentumScore,
    state,
    momentumHistory: ring,
    recentActivity: [{ at: now, message: `You sent a pulse: ${label}` }, ...event.recentActivity].slice(0, 12),
    trend,
  };
}
