import type { LucideIcon } from "lucide-react";

export function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-zinc-300 px-6 py-16 text-center dark:border-red-900/25">
      <div className="flex size-11 items-center justify-center rounded-full bg-zinc-100 text-zinc-400 dark:bg-red-500/10 dark:text-red-400/70">
        <Icon className="size-5" />
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {title}
        </p>
        <p className="text-sm text-zinc-500 dark:text-zinc-500">
          {description}
        </p>
      </div>
    </div>
  );
}
