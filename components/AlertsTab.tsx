"use client";

import { useOpenLoop } from "./OpenLoopProvider";
import { AlertList } from "./AlertList";

export function AlertsTab() {
  const { alerts, openEvent } = useOpenLoop();

  return (
    <div className="space-y-4 px-1 pb-6">
      <div>
        <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">Alerts</p>
        <h2 className="text-xl font-semibold text-white">Momentum signals</h2>
        <p className="mt-1 text-sm text-zinc-500">Only what matters — state jumps and surges.</p>
      </div>
      <AlertList alerts={alerts} onOpenEvent={openEvent} />
    </div>
  );
}
