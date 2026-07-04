"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";

const links = [
  { href: "/new-accounts", label: "New Accounts" },
  { href: "/sold-accounts", label: "Sold Accounts" },
  { href: "/credentials-to-change", label: "Credentials to Change" },
];

export function Nav() {
  const pathname = usePathname();
  const containerRef = useRef<HTMLElement>(null);
  const [pill, setPill] = useState<{ left: number; width: number } | null>(
    null
  );

  useLayoutEffect(() => {
    const measure = () => {
      const container = containerRef.current;
      if (!container) return;
      const activeEl = container.querySelector<HTMLElement>(
        '[data-active="true"]'
      );
      if (!activeEl) {
        setPill(null);
        return;
      }
      setPill({ left: activeEl.offsetLeft, width: activeEl.offsetWidth });
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [pathname]);

  return (
    <nav
      ref={containerRef}
      className="relative flex flex-wrap gap-1 rounded-lg bg-zinc-100 p-1 dark:bg-zinc-900/60"
    >
      {pill ? (
        <motion.span
          className="absolute inset-y-1 rounded-md bg-zinc-900 shadow-sm dark:bg-zinc-50"
          animate={{ left: pill.left, width: pill.width }}
          transition={{ type: "spring", stiffness: 500, damping: 35 }}
        />
      ) : null}
      {links.map((link) => {
        const active = pathname?.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            data-active={active}
            className={cn(
              "relative z-10 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              active
                ? "text-zinc-50 dark:text-zinc-900"
                : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
