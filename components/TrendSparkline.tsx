"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

export function TrendSparkline({ values }: { values: number[] }) {
  const slice = useMemo(() => values.slice(-24), [values]);
  return (
    <div className="relative h-20 w-full overflow-hidden rounded-xl border border-white/10 bg-gradient-to-b from-white/[0.07] to-transparent px-2 py-2">
      <div className="flex h-full items-end justify-between gap-px">
        {slice.map((v, i) => {
          const h = Math.max(8, (v / 100) * 100);
          return (
            <motion.div
              key={i}
              className="w-full max-w-[6px] rounded-sm bg-gradient-to-t from-fuchsia-500/25 via-emerald-400/45 to-amber-300/55"
              initial={{ height: "10%" }}
              animate={{ height: `${h}%` }}
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
            />
          );
        })}
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-[#07080b] to-transparent" />
    </div>
  );
}
