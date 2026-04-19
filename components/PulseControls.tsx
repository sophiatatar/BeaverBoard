"use client";

import { motion } from "framer-motion";
import type { EventState } from "@/lib/types";
import { stateLabel } from "@/lib/formatting";

const order: EventState[] = ["dead", "warming", "good", "packed", "crazy"];

export function PulseControls({
  onPulse,
}: {
  onPulse: (label: EventState) => void;
}) {
  return (
    <div className="space-y-2">
      <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">Send a pulse</p>
      <div className="grid grid-cols-5 gap-2">
        {order.map((s) => (
          <motion.button
            key={s}
            type="button"
            whileTap={{ scale: 0.96 }}
            onClick={() => onPulse(s)}
            className="rounded-xl border border-white/10 bg-white/[0.04] px-1 py-2 text-[10px] font-medium leading-tight text-zinc-200 shadow-inner shadow-black/40"
          >
            {stateLabel(s).split(" ").slice(0, 2).join(" ")}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
