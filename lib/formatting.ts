import type { EventState } from "./types";

export function formatClock(ms: number): string {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(ms));
}

export function formatRelativeShort(ms: number): string {
  const s = Math.floor((Date.now() - ms) / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export function stateLabel(s: EventState): string {
  const map: Record<EventState, string> = {
    dead: "Dead",
    warming: "Warming Up",
    good: "Good",
    packed: "Packed",
    crazy: "Crazy Good",
  };
  return map[s];
}

export function trendArrow(t: "rising" | "flat" | "falling"): string {
  if (t === "rising") return "↑";
  if (t === "falling") return "↓";
  return "→";
}
