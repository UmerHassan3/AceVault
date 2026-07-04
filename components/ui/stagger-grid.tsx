"use client";

import { Children } from "react";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

export function StaggerGrid({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={cn(
        "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
        className
      )}
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {Children.map(children, (child) => (
        <motion.div
          variants={itemVariants}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
