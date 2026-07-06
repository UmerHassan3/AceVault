"use client";

import { useId, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";

import { cn } from "@/lib/utils";

export function ExpandableImage({
  src,
  alt,
  width = 64,
  height = 64,
  className,
}: {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const layoutId = useId();

  return (
    <>
      <motion.button
        type="button"
        layoutId={layoutId}
        onClick={() => setOpen(true)}
        className={cn("block overflow-hidden rounded-md", className)}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        aria-label={`Expand ${alt}`}
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="size-full object-cover"
        />
      </motion.button>

      <AnimatePresence>
        {open
          ? createPortal(
              <motion.div
                className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 p-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                onClick={() => setOpen(false)}
              >
                <motion.div
                  layoutId={layoutId}
                  className="max-h-[85vh] max-w-[85vw] overflow-hidden rounded-lg shadow-2xl"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={alt}
                    className="max-h-[85vh] max-w-[85vw] object-contain"
                  />
                </motion.div>
              </motion.div>,
              document.body
            )
          : null}
      </AnimatePresence>
    </>
  );
}
