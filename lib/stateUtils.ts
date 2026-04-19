import type { EventState } from "./types";

const ORDER: EventState[] = ["dead", "warming", "good", "packed", "crazy"];

export function scoreToState(score: number): EventState {
  if (score < 20) return "dead";
  if (score < 40) return "warming";
  if (score < 60) return "good";
  if (score < 80) return "packed";
  return "crazy";
}

export function stateIndex(s: EventState): number {
  return ORDER.indexOf(s);
}

export function isUpgrade(before: EventState, after: EventState): boolean {
  return stateIndex(after) > stateIndex(before);
}

export function pointsToNextTier(score: number): number {
  const s = scoreToState(score);
  const caps: Record<EventState, number> = {
    dead: 20,
    warming: 40,
    good: 60,
    packed: 80,
    crazy: 100,
  };
  return Math.max(0, caps[s] - score);
}

export function nearFlip(score: number): boolean {
  return pointsToNextTier(score) > 0 && pointsToNextTier(score) <= 12;
}

export function momentumLabel(score: number, trend: "rising" | "flat" | "falling"): string {
  const s = scoreToState(score);
  if (s === "crazy" && trend === "rising") return "Peak energy";
  if (s === "packed" || s === "crazy") return "High momentum";
  if (trend === "rising" && (s === "dead" || s === "warming")) return "Building";
  if (trend === "falling") return "Cooling";
  if (s === "good") return "Steady";
  return "Quiet";
}
