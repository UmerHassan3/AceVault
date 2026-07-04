"use client";

import { motion } from "motion/react";

export function SuccessCheck() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10">
      <motion.svg
        width="64"
        height="64"
        viewBox="0 0 64 64"
        fill="none"
        initial="hidden"
        animate="visible"
      >
        <motion.circle
          cx="32"
          cy="32"
          r="28"
          stroke="currentColor"
          strokeWidth="4"
          className="text-emerald-500"
          variants={{
            hidden: { pathLength: 0, opacity: 0 },
            visible: { pathLength: 1, opacity: 1 },
          }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
        <motion.path
          d="M20 33 L28 41 L45 24"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-emerald-500"
          variants={{
            hidden: { pathLength: 0, opacity: 0 },
            visible: { pathLength: 1, opacity: 1 },
          }}
          transition={{ duration: 0.35, ease: "easeOut", delay: 0.35 }}
        />
      </motion.svg>
      <motion.p
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.25 }}
        className="text-sm font-medium text-zinc-600 dark:text-zinc-300"
      >
        Sale recorded
      </motion.p>
    </div>
  );
}
