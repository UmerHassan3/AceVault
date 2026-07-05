import Image from "next/image";
import Link from "next/link";

import { LoginForm } from "./login-form";

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; reset?: string }>;
}) {
  const { error, reset } = await searchParams;

  return (
    <div className="relative flex flex-1 items-center justify-center bg-zinc-50 px-4 dark:bg-black">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 hidden bg-[radial-gradient(ellipse_at_center,rgba(220,38,38,0.18),transparent_60%)] dark:block"
      />
      <div className="flex w-full max-w-sm flex-col items-center">
        <Image
          src="/images/exotic-store-logo.jpeg"
          alt="Exotic Store"
          width={160}
          height={160}
          priority
          className="size-32 rounded-2xl object-cover"
        />
        <Image
          src="/images/dino-bhai-logo.jpeg"
          alt="By Dino Bhai"
          width={220}
          height={147}
          className="-mt-4 h-auto w-40 object-contain"
        />

        <div className="mt-6 w-full rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-red-900/30 dark:bg-zinc-950">
          <div className="mb-6 flex flex-col gap-1">
            <h1 className="text-lg font-semibold">Admin sign in</h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Gaming account sales admin panel
            </p>
          </div>
          {error === "AccessDenied" ? (
            <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-950/40 dark:text-red-400">
              That account is not authorized to access this panel.
            </p>
          ) : null}
          {reset === "success" ? (
            <p className="mb-4 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
              Your password has been reset. Sign in with your new password.
            </p>
          ) : null}
          <LoginForm />
          <Link
            href="/forgot-password"
            className="mt-4 block text-center text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
          >
            Forgot password?
          </Link>
        </div>
      </div>
    </div>
  );
}
