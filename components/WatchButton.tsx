"use client";

import { motion } from "framer-motion";

export function WatchButton({
  watched,
  onToggle,
}: {
  watched: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.97 }}
      onClick={onToggle}
      className={`relative overflow-hidden rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
        watched
          ? "border-fuchsia-500/50 bg-fuchsia-500/15 text-fuchsia-100"
          : "border-white/15 bg-white/[0.04] text-zinc-200 hover:border-white/25"
      }`}
    >
      <motion.span
        className="absolute inset-0 bg-gradient-to-r from-fuchsia-500/0 via-fuchsia-500/15 to-fuchsia-500/0"
        initial={false}
        animate={{ x: watched ? ["-100%", "100%"] : "-100%" }}
        transition={{ duration: 1.1, repeat: watched ? Infinity : 0, ease: "linear" }}
      />
      <span className="relative z-10">{watched ? "Watching" : "Watch"}</span>
    </motion.button>
  );
}
