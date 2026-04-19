import type { EventState } from "./types";

export function stateRingClass(s: EventState): string {
  const map: Record<EventState, string> = {
    dead: "ring-zinc-500/50 shadow-[0_0_0_1px_rgba(113,113,122,0.35)]",
    warming: "ring-amber-400/55 shadow-[0_0_20px_rgba(251,191,36,0.25)]",
    good: "ring-emerald-400/55 shadow-[0_0_22px_rgba(52,211,153,0.28)]",
    packed: "ring-orange-400/55 shadow-[0_0_24px_rgba(251,146,60,0.3)]",
    crazy: "ring-fuchsia-500/60 shadow-[0_0_28px_rgba(217,70,239,0.45)]",
  };
  return map[s];
}

export function stateFillClass(s: EventState): string {
  const map: Record<EventState, string> = {
    dead: "bg-zinc-600",
    warming: "bg-amber-400",
    good: "bg-emerald-400",
    packed: "bg-orange-400",
    crazy: "bg-fuchsia-500",
  };
  return map[s];
}

export function stateGlowClass(s: EventState): string {
  const map: Record<EventState, string> = {
    dead: "",
    warming: "shadow-[0_0_24px_rgba(251,191,36,0.35)]",
    good: "shadow-[0_0_26px_rgba(52,211,153,0.35)]",
    packed: "shadow-[0_0_28px_rgba(251,146,60,0.38)]",
    crazy: "shadow-[0_0_36px_rgba(244,63,94,0.45)]",
  };
  return map[s];
}

export function stateTextClass(s: EventState): string {
  const map: Record<EventState, string> = {
    dead: "text-zinc-400",
    warming: "text-amber-300",
    good: "text-emerald-300",
    packed: "text-orange-300",
    crazy: "text-fuchsia-300",
  };
  return map[s];
}
