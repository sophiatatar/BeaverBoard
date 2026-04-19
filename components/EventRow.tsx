"use client";

import { motion } from "framer-motion";
import type { Event } from "@/lib/types";
import { StateBadge } from "./StateBadge";
import { trendArrow } from "@/lib/formatting";

export function EventRow({
  event,
  onOpen,
}: {
  event: Event;
  onOpen: () => void;
}) {
  return (
    <motion.button
      type="button"
      layout
      onClick={onOpen}
      whileTap={{ scale: 0.992 }}
      className="flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-3 text-left shadow-sm"
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-semibold text-zinc-100">{event.name}</p>
          {event.watched && (
            <span className="rounded-full border border-fuchsia-500/30 bg-fuchsia-500/10 px-1.5 py-0.5 text-[10px] text-fuchsia-200">
              Watched
            </span>
          )}
        </div>
        <p className="text-xs text-zinc-500">{event.distanceMinutes} min · {event.locationName}</p>
      </div>
      <div className="text-right">
        <motion.p
          key={event.attendance}
          initial={{ opacity: 0.6, y: 2 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm font-semibold tabular-nums text-zinc-100"
        >
          {event.attendance}
        </motion.p>
        <div className="mt-1 flex items-center justify-end gap-1">
          <StateBadge state={event.state} />
          <span className="text-xs text-zinc-500">{trendArrow(event.trend)}</span>
        </div>
      </div>
    </motion.button>
  );
}
