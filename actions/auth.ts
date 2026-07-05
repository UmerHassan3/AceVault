"use server";

import { redirect } from "next/navigation";
import { AuthError, CredentialsSignin } from "next-auth";

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

  try {
    await signIn("credentials", {
      ...parsed.data,
      redirect: false,
      redirectTo: DASHBOARD_PATH,
    });
  } catch (error) {
    if (error instanceof CredentialsSignin) {
      if (error.code === "too_many_attempts") {
        return {
          error: "Too many attempts. Please wait a minute and try again.",
        };
      }
      return { error: "Invalid email or password." };
    }
    if (error instanceof AuthError) {
      return { error: "Something went wrong. Please try again." };
    }
    throw error;
  }

  redirect(DASHBOARD_PATH);
}

export async function signOutAction() {
  await signOut({ redirect: false });
  redirect("/login");
}
