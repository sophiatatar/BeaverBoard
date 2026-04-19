"use client";

import { motion } from "framer-motion";
import type { EventState } from "@/lib/types";
import { stateLabel } from "@/lib/formatting";

const border: Record<EventState, string> = {
  dead: "border-zinc-600/80 bg-zinc-900/60",
  warming: "border-amber-500/40 bg-amber-950/35",
  good: "border-emerald-500/40 bg-emerald-950/35",
  packed: "border-orange-500/40 bg-orange-950/35",
  crazy: "border-fuchsia-500/45 bg-fuchsia-950/40",
};

const text: Record<EventState, string> = {
  dead: "text-zinc-300",
  warming: "text-amber-200",
  good: "text-emerald-200",
  packed: "text-orange-200",
  crazy: "text-fuchsia-100",
};

export function StateBadge({ state }: { state: EventState }) {
  return (
    <motion.span
      layout
      initial={{ opacity: 0.85, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 420, damping: 28 }}
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium tracking-wide ${border[state]} ${text[state]}`}
    >
      {stateLabel(state)}
    </motion.span>
  );
}
