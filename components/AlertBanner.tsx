"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useOpenLoop } from "./OpenLoopProvider";

export function AlertBanner() {
  const { alerts, openEvent, tab } = useOpenLoop();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const top = alerts[0];
  const fresh = mounted && top && Date.now() - top.at < 7000;

  if (!top || !fresh) return null;

  return (
    <AnimatePresence>
      <motion.div
        key={top.id}
        initial={{ y: -48, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -32, opacity: 0 }}
        transition={{ type: "spring", stiffness: 380, damping: 32 }}
        className="pointer-events-auto fixed left-0 right-0 top-0 z-[60] flex justify-center px-3 pt-[calc(0.5rem+env(safe-area-inset-top))]"
      >
        <button
          type="button"
          onClick={() => {
            openEvent(top.eventId);
          }}
          className="flex max-w-lg items-center gap-3 rounded-2xl border border-fuchsia-500/35 bg-[#0a0b10]/90 px-4 py-3 text-left shadow-[0_18px_60px_rgba(0,0,0,0.55)] backdrop-blur-xl"
        >
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500/40 to-emerald-500/30 text-sm text-white">
            ◆
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] uppercase tracking-[0.16em] text-fuchsia-200/90">
              {tab === "live" ? "Live signal" : "New alert"}
            </p>
            <p className="truncate text-sm font-medium text-white">{top.message}</p>
          </div>
          <span className="text-xs text-zinc-400">Open</span>
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
