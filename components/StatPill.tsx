"use client";

export function StatPill({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: "neutral" | "warm";
}) {
  return (
    <div
      className={`rounded-xl border px-3 py-2 ${
        accent === "warm"
          ? "border-amber-500/25 bg-amber-500/5"
          : "border-white/10 bg-white/[0.03]"
      }`}
    >
      <p className="text-[10px] uppercase tracking-wider text-zinc-500">{label}</p>
      <p className="text-sm font-medium text-zinc-100">{value}</p>
    </div>
  );
}
