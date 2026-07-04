"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

import { Badge } from "@/components/ui/badge";

function computeRemaining(changeDeadlineAt: string | null): number {
  if (!changeDeadlineAt) return 0;
  return new Date(changeDeadlineAt).getTime() - Date.now();
}

function formatDuration(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return days > 0
    ? `${days}d ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
    : `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

export function CountdownBadge({
  changeType,
  changeDeadlineAt,
}: {
  changeType: "instant" | "scheduled";
  changeDeadlineAt: string | null;
}) {
  const [remainingMs, setRemainingMs] = useState(() =>
    computeRemaining(changeDeadlineAt)
  );
  const [justUnlocked, setJustUnlocked] = useState(false);
  const wasChangeableRef = useRef(
    changeType === "instant" || remainingMs <= 0
  );

  useEffect(() => {
    if (changeType === "instant") return;

    const interval = setInterval(() => {
      const next = computeRemaining(changeDeadlineAt);
      setRemainingMs(next);

      if (next <= 0 && !wasChangeableRef.current) {
        wasChangeableRef.current = true;
        setJustUnlocked(true);
        setTimeout(() => setJustUnlocked(false), 900);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [changeType, changeDeadlineAt]);

  const changeable = changeType === "instant" || remainingMs <= 0;

  if (changeable) {
    return (
      <motion.div
        className="inline-flex rounded-full"
        animate={
          justUnlocked
            ? { scale: [1, 1.2, 1] }
            : {
                boxShadow: [
                  "0 0 0 0 rgba(16, 185, 129, 0.45)",
                  "0 0 0 6px rgba(16, 185, 129, 0)",
                ],
              }
        }
        transition={
          justUnlocked
            ? { duration: 0.5, ease: "easeOut" }
            : { duration: 1.8, repeat: Infinity, ease: "easeOut" }
        }
      >
        <Badge variant="success" dot>
          Changeable
        </Badge>
      </motion.div>
    );
  }

  return (
    <Badge variant="warning" dot className="tabular-nums">
      Changeable in {formatDuration(remainingMs)}
    </Badge>
  );
}
