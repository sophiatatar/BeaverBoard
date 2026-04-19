"use client";

import { motion } from "framer-motion";
import type { AlertItem } from "@/lib/types";
import { RelativeTime } from "./RelativeTime";

const typeLabel: Record<AlertItem["type"], string> = {
  state_up: "State",
  surge: "Surge",
  packed: "Packed",
  flip: "Flip",
};

export function AlertList({
  alerts,
  onOpenEvent,
}: {
  alerts: AlertItem[];
  onOpenEvent: (id: string) => void;
}) {
  if (!alerts.length) {
    return (
      <p className="px-2 py-12 text-center text-sm text-zinc-500">
        No alerts yet. Watch events and we will ping you when momentum flips.
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {alerts.map((a) => (
        <motion.li
          key={a.id}
          layout
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button
            type="button"
            onClick={() => onOpenEvent(a.eventId)}
            className="flex w-full items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-left"
          >
            <div className="mt-0.5 h-9 w-9 shrink-0 rounded-xl bg-gradient-to-br from-fuchsia-500/30 to-emerald-500/20 ring-1 ring-white/10" />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-semibold text-zinc-100">{a.eventName}</p>
                <span className="rounded-full border border-white/10 bg-black/30 px-2 py-0.5 text-[10px] text-zinc-400">
                  {typeLabel[a.type]}
                </span>
              </div>
              <p className="mt-1 text-sm text-zinc-300">{a.message}</p>
              <p className="mt-2 text-xs text-zinc-500">
                <RelativeTime at={a.at} />
              </p>
            </div>
          </button>
        </motion.li>
      ))}
    </ul>
  );
}
