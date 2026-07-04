"use server";

import { redirect } from "next/navigation";

import { signIn, signOut } from "@/auth";
import { LoginSchema } from "@/lib/validations/auth";

export type LoginState = { error?: string } | undefined;

const DASHBOARD_PATH = "/new-accounts";

export async function loginAction(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const parsed = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const redirectUrl = await signIn("credentials", {
    ...parsed.data,
    redirect: false,
    redirectTo: DASHBOARD_PATH,
  });

  const url = new URL(redirectUrl);
  const code = url.searchParams.get("code");

  if (code === "too_many_attempts") {
    return { error: "Too many attempts. Please wait a minute and try again." };
  }
  if (code) {
    return { error: "Invalid email or password." };
  }

  redirect(url.pathname + url.search);
}

export async function signOutAction() {
  await signOut({ redirect: false });
  redirect("/login");
}
