"use client";

import { useActionState, useState } from "react";
import Link from "next/link";

import { requestPasswordResetAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  GENERIC_RESET_MESSAGE,
  RequestPasswordResetSchema,
} from "@/lib/validations/auth";

export function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState(
    requestPasswordResetAction,
    undefined
  );
  const [fieldError, setFieldError] = useState<string | undefined>();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    const formData = new FormData(event.currentTarget);
    const parsed = RequestPasswordResetSchema.safeParse({
      email: formData.get("email"),
    });
    if (!parsed.success) {
      event.preventDefault();
      setFieldError(parsed.error.issues[0]?.message);
      return;
    }
    setFieldError(undefined);
  }

  if (state?.success) {
    return (
      <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
        {GENERIC_RESET_MESSAGE}
      </p>
    );
  }

  return (
    <form action={formAction} onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          className={cn(fieldError && "border-red-500")}
        />
        <FieldError message={fieldError} />
      </div>
      {state?.error ? (
        <p className="text-sm text-red-600 dark:text-red-400">{state.error}</p>
      ) : null}
      <Button type="submit" disabled={pending} className="mt-2">
        {pending ? "Sending..." : "Send reset link"}
      </Button>
      <Link
        href="/login"
        className="text-center text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
      >
        Back to sign in
      </Link>
    </form>
  );
}
