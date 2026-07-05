"use server";

import { createHash, randomBytes } from "node:crypto";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AuthError, CredentialsSignin } from "next-auth";

import { signIn, signOut } from "@/auth";
import { db } from "@/db";
import { passwordResetTokens, users } from "@/db/schema";
import { sendPasswordResetEmail } from "@/lib/email";
import { passwordResetRateLimit } from "@/lib/ratelimit";
import {
  LoginSchema,
  RequestPasswordResetSchema,
  ResetPasswordSchema,
} from "@/lib/validations/auth";

export type LoginState = { error?: string } | undefined;

const DASHBOARD_PATH = "/new-accounts";
const RESET_TOKEN_TTL_MS = 60 * 60 * 1000;

async function getBaseUrl() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "http";
  return `${proto}://${host}`;
}

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

export type RequestResetState = { success?: boolean; error?: string } | undefined;

export async function requestPasswordResetAction(
  _prevState: RequestResetState,
  formData: FormData
): Promise<RequestResetState> {
  const parsed = RequestPasswordResetSchema.safeParse({
    email: formData.get("email"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { success } = await passwordResetRateLimit.limit(ip);
  if (!success) {
    return { error: "Too many requests. Please try again later." };
  }

  // Always respond the same way whether or not the email matches an admin
  // account, so this endpoint can't be used to enumerate valid logins.
  const user = await db.query.users.findFirst({
    where: eq(users.email, parsed.data.email),
  });

  if (user) {
    const rawToken = randomBytes(32).toString("hex");
    const tokenHash = createHash("sha256").update(rawToken).digest("hex");
    const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS);

    await db.insert(passwordResetTokens).values({
      userId: user.id,
      tokenHash,
      expiresAt,
    });

    const baseUrl = await getBaseUrl();
    const resetUrl = `${baseUrl}/reset-password?token=${rawToken}`;
    try {
      await sendPasswordResetEmail(user.email, resetUrl);
    } catch (error) {
      // Don't leak SMTP failures to the client — this response is
      // intentionally identical whether or not the email exists/sent.
      console.error("Failed to send password reset email:", error);
    }
  }

  return { success: true };
}

export type ResetPasswordState = { error?: string } | undefined;

export async function resetPasswordAction(
  _prevState: ResetPasswordState,
  formData: FormData
): Promise<ResetPasswordState> {
  const parsed = ResetPasswordSchema.safeParse({
    token: formData.get("token"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const tokenHash = createHash("sha256").update(parsed.data.token).digest("hex");
  const record = await db.query.passwordResetTokens.findFirst({
    where: eq(passwordResetTokens.tokenHash, tokenHash),
  });

  if (!record || record.expiresAt.getTime() < Date.now()) {
    return { error: "This reset link is invalid or has expired." };
  }

  const passwordHash = await bcrypt.hash(parsed.data.newPassword, 12);
  await db
    .update(users)
    .set({ passwordHash })
    .where(eq(users.id, record.userId));
  await db
    .delete(passwordResetTokens)
    .where(eq(passwordResetTokens.id, record.id));

  redirect("/login?reset=success");
}
