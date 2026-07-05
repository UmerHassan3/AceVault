import Image from "next/image";

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
    <div className="relative flex min-h-full flex-1 flex-col bg-zinc-50 dark:bg-black">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 -z-10 hidden h-130 bg-[radial-gradient(ellipse_at_top,rgba(220,38,38,0.16),transparent_65%)] dark:block"
      />
      <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-red-900/20 dark:bg-black/80">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/images/exotic-store-logo.jpeg"
              alt="Exotic Store"
              width={48}
              height={48}
              className="size-12 rounded-md object-cover"
              priority
            />
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
