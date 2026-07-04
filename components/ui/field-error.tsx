"use client";

import { AnimatePresence, motion } from "motion/react";

export function FieldError({ message }: { message?: string }) {
  return (
    <AnimatePresence mode="wait">
      {message ? (
        <motion.p
          key={message}
          initial={{ opacity: 0, x: 0 }}
          animate={{ opacity: 1, x: [0, -6, 6, -4, 4, 0] }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="text-xs font-medium text-red-600 dark:text-red-400"
        >
          {message}
        </motion.p>
      ) : null}
    </AnimatePresence>
  );
}
