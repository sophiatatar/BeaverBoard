"use client";

import { motion } from "framer-motion";
import type { Event } from "@/lib/types";
import { EventMarker } from "./EventMarker";
import { stateFillClass } from "@/lib/uiTokens";
import type { EventState } from "@/lib/types";

const legend: { s: EventState; label: string }[] = [
  { s: "dead", label: "Dead" },
  { s: "warming", label: "Warming" },
  { s: "good", label: "Good" },
  { s: "packed", label: "Packed" },
  { s: "crazy", label: "Crazy" },
];

export function EventMap({
  events,
  onSelectEvent,
}: {
  events: Event[];
  onSelectEvent: (id: string) => void;
}) {
  return (
    <div className="relative mx-auto w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-[#05060a] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
      <div
        className="relative aspect-[4/3] w-full"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "28px 28px",
        }}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(217,70,239,0.08),transparent_55%),radial-gradient(ellipse_at_70%_65%,rgba(52,211,153,0.07),transparent_50%)]" />

        {/* Stylized paths */}
        <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-40" viewBox="0 0 100 100">
          <path
            d="M8 78 Q 35 62 52 70 T 92 58"
            fill="none"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="0.6"
          />
          <path
            d="M12 28 L 42 22 L 68 35 L 88 18"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="0.5"
          />
          <path
            d="M22 88 L 38 52 L 58 62 L 78 44"
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="0.45"
          />
        </svg>

        {/* Building blocks */}
        <motion.div
          className="absolute left-[8%] top-[12%] h-[18%] w-[22%] rounded-md bg-white/[0.06] ring-1 ring-white/10"
          initial={{ opacity: 0.7 }}
          animate={{ opacity: [0.65, 0.85, 0.65] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute left-[38%] top-[8%] h-[12%] w-[18%] rounded-md bg-white/[0.05] ring-1 ring-white/10" />
        <div className="absolute left-[62%] top-[18%] h-[22%] w-[26%] rounded-md bg-white/[0.055] ring-1 ring-white/10" />
        <div className="absolute left-[18%] top-[58%] h-[16%] w-[30%] rounded-md bg-white/[0.05] ring-1 ring-white/10" />
        <div className="absolute left-[72%] top-[58%] h-[14%] w-[16%] rounded-md bg-white/[0.045] ring-1 ring-white/10" />

        {events.map((e) => (
          <EventMarker key={e.id} event={e} onSelect={() => onSelectEvent(e.id)} />
        ))}

        <div className="pointer-events-none absolute left-3 top-3 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[10px] font-medium text-zinc-300 backdrop-blur">
          Campus live map
        </div>
      </div>

      <div className="flex flex-wrap gap-2 border-t border-white/10 bg-black/30 px-3 py-2.5">
        <span className="w-full text-[10px] uppercase tracking-wider text-zinc-500">Legend</span>
        {legend.map((l) => (
          <span
            key={l.s}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-2 py-0.5 text-[10px] text-zinc-300"
          >
            <span className={`h-2 w-2 rounded-full ${stateFillClass(l.s)}`} />
            {l.label}
          </span>
        ))}
      </div>
    </div>
  );
}
