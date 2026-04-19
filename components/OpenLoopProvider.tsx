"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type {
  AlertItem,
  Event,
  LiveFilter,
  PulseLabel,
  SimulationMeta,
  TabId,
} from "@/lib/types";
import { DEMO_ANCHOR_MS as T } from "@/lib/demoTime";
import { cloneSeedEvents } from "@/lib/seedData";
import { advanceSimulation, applyUserPulse, getTickIntervalMs } from "@/lib/simulation";
import { isUpgrade } from "@/lib/stateUtils";

const INITIAL_ALERTS: AlertItem[] = [
  {
    id: "seed-a",
    at: T - 420_000,
    eventId: "cpw-ai-alignment",
    eventName: "MIT AI Alignment: Sandwiches & AI Risk",
    type: "state_up",
    message: "MIT AI Alignment: Sandwiches & AI Risk just got good",
  },
  {
    id: "seed-b",
    at: T - 310_000,
    eventId: "cpw-closing-show",
    eventName: "CPW Closing Show",
    type: "surge",
    message: "CPW Closing Show is surging",
  },
  {
    id: "seed-c",
    at: T - 180_000,
    eventId: "cpw-rocket-team",
    eventName: "MIT Rocket Team: Info Session + Lab Tour",
    type: "flip",
    message: "MIT Rocket Team: Info Session + Lab Tour flipped from warming to packed",
  },
];

function defaultMeta(): SimulationMeta {
  return {
    tickIndex: 0,
    running: true,
    speed: 1,
    forcedSurgeUntil: {},
  };
}

interface OpenLoopContextValue {
  events: Event[];
  alerts: AlertItem[];
  meta: SimulationMeta;
  tab: TabId;
  setTab: (t: TabId) => void;
  liveFilter: LiveFilter;
  setLiveFilter: (f: LiveFilter) => void;
  selectedEventId: string | null;
  openEvent: (id: string) => void;
  closeEvent: () => void;
  toggleWatch: (id: string) => void;
  submitPulse: (id: string, label: PulseLabel) => void;
  setRunning: (v: boolean) => void;
  setSpeed: (s: SimulationMeta["speed"]) => void;
  resetDemo: () => void;
  forceSurge: (eventId: string) => void;
}

const OpenLoopContext = createContext<OpenLoopContextValue | null>(null);

export function OpenLoopProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<Event[]>(() => cloneSeedEvents());
  const [alerts, setAlerts] = useState<AlertItem[]>(() => [...INITIAL_ALERTS]);
  const [meta, setMeta] = useState<SimulationMeta>(defaultMeta);
  const [tab, setTab] = useState<TabId>("live");
  const [liveFilter, setLiveFilter] = useState<LiveFilter>("all");
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const eventsRef = useRef(events);
  const metaRef = useRef(meta);
  eventsRef.current = events;
  metaRef.current = meta;

  const tick = useCallback(() => {
    const now = Date.now();
    const m = metaRef.current;
    if (!m.running) return;
    const { events: next, newAlerts } = advanceSimulation(eventsRef.current, m, now);
    setEvents(next);
    setMeta((prev) => ({
      ...prev,
      tickIndex: prev.tickIndex + 1,
      forcedSurgeUntil: { ...prev.forcedSurgeUntil },
    }));
    if (newAlerts.length) {
      setAlerts((prev) => [...newAlerts, ...prev].slice(0, 120));
    }
  }, []);

  useEffect(() => {
    if (!meta.running) return;
    const ms = getTickIntervalMs(meta.speed);
    const id = window.setInterval(tick, ms);
    return () => window.clearInterval(id);
  }, [meta.speed, meta.running, tick]);

  const openEvent = useCallback((id: string) => setSelectedEventId(id), []);
  const closeEvent = useCallback(() => setSelectedEventId(null), []);

  const toggleWatch = useCallback((id: string) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, watched: !e.watched } : e))
    );
  }, []);

  const submitPulse = useCallback((id: string, label: PulseLabel) => {
    const now = Date.now();
    const ev = eventsRef.current.find((x) => x.id === id);
    if (!ev) return;
    const before = ev.state;
    const updated = applyUserPulse(ev, label, now);
    const after = updated.state;
    const notify =
      ev.watched &&
      isUpgrade(before, after) &&
      (after === "good" || after === "packed" || after === "crazy");
    if (notify) {
      const alertType = after === "crazy" ? ("surge" as const) : ("state_up" as const);
      setAlerts((a) =>
        [
          {
            id: `pulse-${id}-${now}`,
            at: now,
            eventId: id,
            eventName: ev.name,
            type: alertType,
            message:
              after === "crazy"
                ? `${ev.name} went crazy good`
                : `${ev.name} just crossed into ${after}`,
          },
          ...a,
        ].slice(0, 120)
      );
    }
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id !== id) return e;
        if (notify) return { ...updated, lastAlertAt: now };
        return updated;
      })
    );
  }, []);

  const setRunning = useCallback((v: boolean) => {
    setMeta((m) => ({ ...m, running: v }));
  }, []);

  const setSpeed = useCallback((s: SimulationMeta["speed"]) => {
    setMeta((m) => ({ ...m, speed: s }));
  }, []);

  const resetDemo = useCallback(() => {
    setEvents(cloneSeedEvents());
    setAlerts([...INITIAL_ALERTS]);
    setMeta(defaultMeta());
    setSelectedEventId(null);
  }, []);

  const forceSurge = useCallback((eventId: string) => {
    setMeta((m) => ({
      ...m,
      forcedSurgeUntil: {
        ...m.forcedSurgeUntil,
        [eventId]: m.tickIndex + 16,
      },
    }));
  }, []);

  const value = useMemo<OpenLoopContextValue>(
    () => ({
      events,
      alerts,
      meta,
      tab,
      setTab,
      liveFilter,
      setLiveFilter,
      selectedEventId,
      openEvent,
      closeEvent,
      toggleWatch,
      submitPulse,
      setRunning,
      setSpeed,
      resetDemo,
      forceSurge,
    }),
    [
      events,
      alerts,
      meta,
      tab,
      liveFilter,
      selectedEventId,
      openEvent,
      closeEvent,
      toggleWatch,
      submitPulse,
      setRunning,
      setSpeed,
      resetDemo,
      forceSurge,
    ]
  );

  return <OpenLoopContext.Provider value={value}>{children}</OpenLoopContext.Provider>;
}

export function useOpenLoop(): OpenLoopContextValue {
  const ctx = useContext(OpenLoopContext);
  if (!ctx) throw new Error("useOpenLoop must be used within OpenLoopProvider");
  return ctx;
}
