"use client";

import { useMemo } from "react";
import { useOpenLoop } from "./OpenLoopProvider";
import { EventCard } from "./EventCard";

export function WatchlistTab() {
  const { events, openEvent } = useOpenLoop();
  const watched = useMemo(
    () => [...events].filter((e) => e.watched).sort((a, b) => a.distanceMinutes - b.distanceMinutes),
    [events]
  );

  return (
    <div className="space-y-4 px-1 pb-6">
      <div>
        <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">Watchlist</p>
        <h2 className="text-xl font-semibold text-white">Events on your radar</h2>
        <p className="mt-1 text-sm text-zinc-500">Surging rooms surface automatically.</p>
      </div>
      {watched.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-white/15 px-4 py-10 text-center text-sm text-zinc-500">
          Nothing watched yet. Tap Watch on an event to track momentum before you commit.
        </p>
      ) : (
        <div className="space-y-3">
          {watched.map((e) => (
            <EventCard key={e.id} event={e} onOpen={() => openEvent(e.id)} />
          ))}
        </div>
      )}
    </div>
  );
}
