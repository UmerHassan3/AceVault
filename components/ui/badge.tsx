import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-red-600 text-white dark:bg-red-600 dark:text-white",
        secondary:
          "border-transparent bg-zinc-100 text-zinc-900 dark:bg-white/10 dark:text-zinc-50",
        success:
          "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-400",
        warning:
          "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/25 dark:bg-amber-500/10 dark:text-amber-400",
        outline:
          "border-zinc-200 text-zinc-700 dark:border-zinc-700 dark:text-zinc-300",
      },
      dot: {
        true: "",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      dot: false,
    },
  }
);

const dotColor: Record<string, string> = {
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  default: "bg-white",
  secondary: "bg-zinc-900 dark:bg-zinc-50",
  outline: "bg-zinc-500",
};

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

function Badge({ className, variant, dot, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {dot ? (
        <span
          className={cn(
            "size-1.5 rounded-full",
            dotColor[variant ?? "default"]
          )}
        />
      ) : null}
      {children}
    </div>
  );
}

export { Badge, badgeVariants };
