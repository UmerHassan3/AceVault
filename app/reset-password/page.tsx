import Link from "next/link";

import { ResetPasswordForm } from "./reset-password-form";

export const dynamic = "force-dynamic";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  return (
    <div className="relative flex flex-1 items-center justify-center bg-zinc-50 px-4 dark:bg-black">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 hidden bg-[radial-gradient(ellipse_at_center,rgba(220,38,38,0.18),transparent_60%)] dark:block"
      />
      <div className="w-full max-w-sm rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-red-900/30 dark:bg-zinc-950">
        <div className="mb-6 flex flex-col gap-1">
          <h1 className="text-lg font-semibold">Reset password</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Choose a new password for your admin account.
          </p>
        </div>
        {token ? (
          <ResetPasswordForm token={token} />
        ) : (
          <div className="flex flex-col gap-3">
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-950/40 dark:text-red-400">
              This reset link is missing its token. Request a new one below.
            </p>
            <Link
              href="/forgot-password"
              className="text-center text-sm font-medium text-red-600 hover:text-red-500 dark:text-red-400"
            >
              Request a new link
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
