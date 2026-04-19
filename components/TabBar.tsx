"use client";

import { motion } from "framer-motion";
import type { TabId } from "@/lib/types";

const tabs: { id: TabId; label: string; icon: string }[] = [
  { id: "live", label: "Live", icon: "◎" },
  { id: "watchlist", label: "Watchlist", icon: "◇" },
  { id: "alerts", label: "Alerts", icon: "!" },
  { id: "demo", label: "Demo", icon: "⚙" },
];

export function TabBar({ tab, onChange }: { tab: TabId; onChange: (t: TabId) => void }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-[#05060a]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-lg items-stretch justify-between px-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] pt-2">
        {tabs.map((t) => {
          const active = tab === t.id;
          return (
            <motion.button
              key={t.id}
              type="button"
              onClick={() => onChange(t.id)}
              whileTap={{ scale: 0.96 }}
              className={`relative flex flex-1 flex-col items-center gap-0.5 rounded-xl py-2 text-[10px] font-medium ${
                active ? "text-white" : "text-zinc-500"
              }`}
            >
              {active && (
                <motion.span
                  layoutId="tabGlow"
                  className="absolute inset-0 rounded-xl bg-white/[0.06]"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative z-10 text-sm">{t.icon}</span>
              <span className="relative z-10">{t.label}</span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}
