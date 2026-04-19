"use client";

import { formatRelativeShort } from "@/lib/formatting";

/** Renders a relative time; suppresses hydration noise because `Date.now()` differs on server vs client. */
export function RelativeTime({ at }: { at: number }) {
  return (
    <span suppressHydrationWarning className="tabular-nums">
      {formatRelativeShort(at)}
    </span>
  );
}
