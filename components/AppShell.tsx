"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useOpenLoop } from "./OpenLoopProvider";
import { TabBar } from "./TabBar";
import { LiveTab } from "./LiveTab";
import { WatchlistTab } from "./WatchlistTab";
import { AlertsTab } from "./AlertsTab";
import { DemoControls } from "./DemoControls";
import { EventDetailModal } from "./EventDetailModal";
import { AlertBanner } from "./AlertBanner";

export function AppShell() {
  const { tab, setTab } = useOpenLoop();

  return (
    <div className="relative min-h-[100dvh] bg-[#05060a] text-zinc-100">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_50%_-10%,rgba(217,70,239,0.12),transparent_45%),radial-gradient(ellipse_at_80%_40%,rgba(52,211,153,0.08),transparent_40%)]" />

      <AlertBanner />

      <main className="relative z-10 mx-auto max-w-lg px-4 pb-28 pt-[calc(1rem+env(safe-area-inset-top))]">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
          >
            {tab === "live" && <LiveTab />}
            {tab === "watchlist" && <WatchlistTab />}
            {tab === "alerts" && <AlertsTab />}
            {tab === "demo" && <DemoControls />}
          </motion.div>
        </AnimatePresence>
      </main>

      <TabBar tab={tab} onChange={setTab} />
      <EventDetailModal />
    </div>
  );
}
