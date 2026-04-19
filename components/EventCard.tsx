"use client";

import { motion } from "framer-motion";
import type { Event } from "@/lib/types";
import { RelativeTime } from "./RelativeTime";
import { StateBadge } from "./StateBadge";
import { trendArrow } from "@/lib/formatting";
import { nearFlip, pointsToNextTier } from "@/lib/stateUtils";

export function EventCard({
  event,
  onOpen,
}: {
  event: Event;
  onOpen: () => void;
}) {
  const surge = event.isSurging;
  const close = event.state !== "crazy" && nearFlip(event.momentumScore);
  const pts = pointsToNextTier(event.momentumScore);

  return (
    <motion.button
      type="button"
      layout
      onClick={onOpen}
      whileTap={{ scale: 0.99 }}
      className={`relative w-full overflow-hidden rounded-2xl border px-4 py-4 text-left ${
        surge
          ? "border-fuchsia-500/45 bg-gradient-to-br from-fuchsia-500/15 via-[#0c0d12] to-[#08090c] shadow-[0_0_40px_rgba(217,70,239,0.18)]"
          : "border-white/10 bg-white/[0.03]"
      }`}
    >
      {surge && (
        <motion.div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(244,63,94,0.18),transparent_55%)]"
          animate={{ opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-base font-semibold text-zinc-50">{event.name}</p>
          <p className="mt-1 text-xs text-zinc-500">
            {event.distanceMinutes} min · {event.locationName}
          </p>
        </div>
        <div className="text-right">
          <motion.p
            key={event.attendance}
            initial={{ opacity: 0.7 }}
            animate={{ opacity: 1 }}
            className="text-lg font-semibold tabular-nums text-zinc-50"
          >
            {event.attendance}
          </motion.p>
          <p className="text-[11px] text-zinc-500">attending</p>
        </div>
      </div>
      <div className="relative mt-3 flex flex-wrap items-center gap-2">
        <StateBadge state={event.state} />
        <span className="rounded-full border border-white/10 bg-black/30 px-2 py-0.5 text-[11px] text-zinc-400">
          Trend {trendArrow(event.trend)} {event.trend}
        </span>
        {close && (
          <span className="rounded-full border border-amber-500/35 bg-amber-500/10 px-2 py-0.5 text-[11px] text-amber-200">
            ~{pts.toFixed(0)} pts to flip
          </span>
        )}
        {surge && (
          <span className="rounded-full border border-fuchsia-500/40 bg-fuchsia-500/15 px-2 py-0.5 text-[11px] font-medium text-fuchsia-100">
            Surging
          </span>
        )}
      </div>
      <p className="relative mt-3 text-xs text-zinc-500">
        Last alert:{" "}
        {event.lastAlertAt ? <RelativeTime at={event.lastAlertAt} /> : "—"}
      </p>
    </motion.button>
  );
}
