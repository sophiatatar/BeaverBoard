"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import type { Event } from "@/lib/types";
import { EventRow } from "./EventRow";

export function EventBottomSheet({
  events,
  onOpenEvent,
}: {
  events: Event[];
  onOpenEvent: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      layout
      className="mt-3 overflow-hidden rounded-t-3xl border border-white/10 bg-[#090a0f]/95 shadow-[0_-18px_60px_rgba(0,0,0,0.55)] backdrop-blur-xl"
      animate={{ maxHeight: expanded ? "58vh" : "38vh" }}
      transition={{ type: "spring", stiffness: 300, damping: 34 }}
    >
      <div className="flex justify-center py-2">
        <button
          type="button"
          aria-label={expanded ? "Collapse sheet" : "Expand sheet"}
          onClick={() => setExpanded((e) => !e)}
          className="h-1.5 w-12 rounded-full bg-white/20"
        />
      </div>
      <div className="px-4 pb-2">
        <div className="flex items-end justify-between gap-2">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">Nearby</p>
            <p className="text-base font-semibold text-zinc-100">Live events</p>
          </div>
          <button
            type="button"
            onClick={() => setExpanded((e) => !e)}
            className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-zinc-300"
          >
            {expanded ? "Collapse" : "Expand"}
          </button>
        </div>
      </div>
      <div className="max-h-[46vh] space-y-2 overflow-y-auto px-3 pb-5 pt-1">
        {events.length === 0 ? (
          <p className="px-2 py-6 text-center text-sm text-zinc-500">No events match this filter.</p>
        ) : (
          events.map((e) => (
            <EventRow key={e.id} event={e} onOpen={() => onOpenEvent(e.id)} />
          ))
        )}
      </div>
    </motion.div>
  );
}
