"use client";

import { motion } from "framer-motion";
import type { LiveFilter } from "@/lib/types";

const filters: { id: LiveFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "rising", label: "Rising" },
  { id: "watched", label: "Watched" },
  { id: "hot", label: "Hot" },
];

export function TopHeader({
  filter,
  onFilter,
}: {
  filter: LiveFilter;
  onFilter: (f: LiveFilter) => void;
}) {
  return (
    <header className="flex flex-col gap-3 px-1 pt-2">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">Beaver Board</p>
          <h1 className="text-2xl font-semibold tracking-tight text-white">Momentum nearby</h1>
        </div>
        <div className="rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-medium text-emerald-200">
          Live
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => {
          const active = filter === f.id;
          return (
            <motion.button
              key={f.id}
              type="button"
              onClick={() => onFilter(f.id)}
              whileTap={{ scale: 0.97 }}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                active
                  ? "border-white/25 bg-white/[0.12] text-white"
                  : "border-white/10 bg-white/[0.03] text-zinc-400 hover:border-white/15"
              }`}
            >
              {f.label}
            </motion.button>
          );
        })}
      </div>
    </header>
  );
}
