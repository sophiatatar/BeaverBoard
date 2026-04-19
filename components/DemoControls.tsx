"use client";

import { motion } from "framer-motion";
import { useOpenLoop } from "./OpenLoopProvider";
import type { Event } from "@/lib/types";

function StatusRow({ e }: { e: Event }) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-xs">
      <span className="truncate font-medium text-zinc-200">{e.name}</span>
      <span
        className={`shrink-0 rounded-full px-2 py-0.5 ${
          e.trend === "rising"
            ? "bg-emerald-500/15 text-emerald-200"
            : e.trend === "falling"
              ? "bg-rose-500/15 text-rose-200"
              : "bg-zinc-500/15 text-zinc-300"
        }`}
      >
        {e.trend}
      </span>
    </div>
  );
}

export function DemoControls() {
  const { events, meta, setRunning, setSpeed, resetDemo, forceSurge } = useOpenLoop();

  return (
    <div className="space-y-5 px-1 pb-6">
      <div>
        <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">Simulation</p>
        <p className="mt-1 text-lg font-semibold text-white">Demo cockpit</p>
        <p className="mt-1 text-sm text-zinc-500">
          Control the live engine. Everything updates instantly — no backend required.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          onClick={() => setRunning(!meta.running)}
          className={`rounded-full border px-4 py-2 text-sm font-medium ${
            meta.running
              ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-100"
              : "border-white/15 bg-white/[0.04] text-zinc-200"
          }`}
        >
          {meta.running ? "Pause" : "Play"}
        </motion.button>
        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          onClick={resetDemo}
          className="rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-sm font-medium text-zinc-200"
        >
          Reset demo
        </motion.button>
      </div>

      <div>
        <p className="text-xs font-medium text-zinc-400">Speed</p>
        <div className="mt-2 flex gap-2">
          {([1, 2, 4] as const).map((s) => (
            <motion.button
              key={s}
              type="button"
              whileTap={{ scale: 0.97 }}
              onClick={() => setSpeed(s)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                meta.speed === s
                  ? "border-fuchsia-500/45 bg-fuchsia-500/15 text-fuchsia-100"
                  : "border-white/10 bg-black/30 text-zinc-400"
              }`}
            >
              {s}x
            </motion.button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-medium text-zinc-400">Force surge</p>
        <div className="mt-2 max-h-56 grid grid-cols-2 gap-2 overflow-y-auto pr-1">
          {events.map((e) => (
            <motion.button
              key={e.id}
              type="button"
              whileTap={{ scale: 0.98 }}
              onClick={() => forceSurge(e.id)}
              className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-left text-xs text-zinc-200"
            >
              <span className="line-clamp-2 font-medium">{e.name}</span>
            </motion.button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-transparent p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">System status</p>
        <p className="mt-1 text-sm text-zinc-400">
          Tick <span className="tabular-nums text-zinc-200">{meta.tickIndex}</span> ·{" "}
          {meta.running ? "Running" : "Paused"} · {meta.speed}x
        </p>
        <p className="mt-1 text-xs text-zinc-500">
          One simulation step per second at 1× — counts, trends, and badges all advance on that loop.
        </p>
        <div className="mt-3 space-y-2">
          <p className="text-[11px] uppercase tracking-wider text-zinc-500">Momentum by event</p>
          {events.map((e) => (
            <StatusRow key={e.id} e={e} />
          ))}
        </div>
      </div>
    </div>
  );
}
