import { Nav } from "@/components/layout/nav";
import { PageTransition } from "@/components/layout/page-transition";
import { SignOutButton } from "@/components/layout/sign-out-button";
import { requireAdmin } from "@/lib/auth/session";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="flex min-h-full flex-1 flex-col bg-zinc-50 dark:bg-zinc-950">
      <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-white/10 dark:bg-zinc-950/80">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-md bg-zinc-900 text-xs font-bold text-zinc-50 dark:bg-zinc-50 dark:text-zinc-900">
              AS
            </span>
            <span className="text-sm font-semibold tracking-tight">
              Account Sales Admin
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 sm:justify-end">
            <Nav />
            <SignOutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <PageTransition>{children}</PageTransition>
      </main>
    </div>
  );
}
