"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useOpenLoop } from "./OpenLoopProvider";
import { StateBadge } from "./StateBadge";
import { StatPill } from "./StatPill";
import { WatchButton } from "./WatchButton";
import { PulseControls } from "./PulseControls";
import { TrendSparkline } from "./TrendSparkline";
import { momentumLabel } from "@/lib/stateUtils";
import { formatClock } from "@/lib/formatting";
import type { EventState } from "@/lib/types";

export function EventDetailModal() {
  const { events, selectedEventId, closeEvent, toggleWatch, submitPulse } = useOpenLoop();
  const ev = events.find((e) => e.id === selectedEventId);

  return (
    <AnimatePresence>
      {ev && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            aria-label="Close"
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={closeEvent}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ y: 40, opacity: 0.9 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 28, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            className="relative z-10 flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl border border-white/10 bg-[#07080c] shadow-2xl sm:rounded-3xl"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_0%_0%,rgba(217,70,239,0.12),transparent_55%)]" />
            <div className="flex items-start justify-between gap-3 border-b border-white/10 px-5 pb-4 pt-5">
              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">{ev.category}</p>
                <h2 className="mt-1 text-xl font-semibold tracking-tight text-white">{ev.name}</h2>
                <p className="mt-1 text-sm text-zinc-400">
                  {ev.host} · {ev.locationName}
                </p>
              </div>
              <button
                type="button"
                onClick={closeEvent}
                className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-zinc-300"
              >
                Close
              </button>
            </div>

            <div className="space-y-4 overflow-y-auto px-5 py-4 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
              <div className="flex flex-wrap gap-2">
                <StatPill label="Tonight" value={`${ev.startTime} – ${ev.endTime}`} />
                <StatPill label="Walk" value={`${ev.distanceMinutes} min`} accent="warm" />
                <StatPill label="Momentum" value={`${Math.round(ev.momentumScore)} / 100`} />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <StateBadge state={ev.state} />
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-zinc-300">
                  {momentumLabel(ev.momentumScore, ev.trend)}
                </span>
              </div>

              <TrendSparkline values={ev.momentumHistory} />

              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">Attendance</p>
                  <motion.p
                    key={ev.attendance}
                    initial={{ opacity: 0.7, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl font-semibold tabular-nums text-white"
                  >
                    {ev.attendance}
                  </motion.p>
                </div>
                <WatchButton watched={ev.watched} onToggle={() => toggleWatch(ev.id)} />
              </div>

              <PulseControls
                onPulse={(label: EventState) => {
                  submitPulse(ev.id, label);
                }}
              />

              <div>
                <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">Recent activity</p>
                <ul className="mt-2 space-y-2">
                  {ev.recentActivity.slice(0, 8).map((a, idx) => (
                    <motion.li
                      key={`${a.at}-${idx}`}
                      layout
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex gap-3 rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2 text-sm text-zinc-300"
                    >
                      <span className="shrink-0 text-[11px] text-zinc-500">{formatClock(a.at)}</span>
                      <span className="leading-snug">{a.message}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
