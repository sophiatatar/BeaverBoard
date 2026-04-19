"use client";

import { motion } from "framer-motion";
import type { Event } from "@/lib/types";
import { stateFillClass, stateGlowClass, stateRingClass } from "@/lib/uiTokens";

export function EventMarker({
  event,
  onSelect,
}: {
  event: Event;
  onSelect: () => void;
}) {
  const surge = event.isSurging;
  return (
    <motion.button
      type="button"
      style={{ left: `${event.x}%`, top: `${event.y}%` }}
      className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      whileTap={{ scale: 0.94 }}
      aria-label={event.name}
    >
      {surge && (
        <motion.span
          className={`absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full ${stateFillClass(event.state)} opacity-30 blur-md`}
          animate={{ scale: [1, 1.25, 1], opacity: [0.25, 0.45, 0.25] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      <motion.div
        layout
        className={`relative flex h-11 min-w-[2.75rem] items-center justify-center rounded-2xl border border-white/10 bg-[#0c0d11]/90 px-2 text-[10px] font-semibold text-white shadow-lg ring-2 ring-offset-2 ring-offset-[#08090c] ${stateRingClass(event.state)} ${surge ? stateGlowClass(event.state) : ""}`}
        animate={surge ? { y: [0, -2, 0] } : { y: 0 }}
        transition={{ duration: 1.6, repeat: surge ? Infinity : 0, ease: "easeInOut" }}
      >
        <span className="tabular-nums">{event.attendance}</span>
      </motion.div>
    </motion.button>
  );
}
