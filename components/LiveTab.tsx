"use client";

import { useMemo } from "react";
import { useOpenLoop } from "./OpenLoopProvider";
import type { Event, LiveFilter } from "@/lib/types";
import { TopHeader } from "./TopHeader";
import { EventMap } from "./EventMap";
import { EventBottomSheet } from "./EventBottomSheet";

function filterEvents(events: Event[], f: LiveFilter): Event[] {
  const sorted = [...events].sort((a, b) => a.distanceMinutes - b.distanceMinutes);
  if (f === "all") return sorted;
  if (f === "rising") return sorted.filter((e) => e.trend === "rising");
  if (f === "watched") return sorted.filter((e) => e.watched);
  if (f === "hot") {
    return sorted.filter(
      (e) => e.isSurging || e.state === "packed" || e.state === "crazy" || (e.state === "good" && e.trend === "rising")
    );
  }
  return sorted;
}

export function LiveTab() {
  const { events, liveFilter, setLiveFilter, openEvent } = useOpenLoop();
  const list = useMemo(() => filterEvents(events, liveFilter), [events, liveFilter]);

  return (
    <div className="space-y-4">
      <TopHeader filter={liveFilter} onFilter={setLiveFilter} />
      <EventMap events={events} onSelectEvent={openEvent} />
      <EventBottomSheet events={list} onOpenEvent={openEvent} />
    </div>
  );
}
