import { LoginForm } from "./login-form";

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 px-4 dark:bg-black">
      <div className="w-full max-w-sm rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
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
        <LoginForm />
      </div>
    </div>
  );
}
