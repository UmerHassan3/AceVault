import { ForgotPasswordForm } from "./forgot-password-form";

export const dynamic = "force-dynamic";

export default function ForgotPasswordPage() {
  return (
    <div className="relative flex flex-1 items-center justify-center bg-zinc-50 px-4 dark:bg-black">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 hidden bg-[radial-gradient(ellipse_at_center,rgba(220,38,38,0.18),transparent_60%)] dark:block"
      />
      <div className="w-full max-w-sm rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-red-900/30 dark:bg-zinc-950">
        <div className="mb-6 flex flex-col gap-1">
          <h1 className="text-lg font-semibold">Forgot password</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Enter your admin email and we&apos;ll send you a reset link.
          </p>
        </div>
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
