import bcrypt from "bcryptjs";
import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { loginRateLimit } from "@/lib/ratelimit";
import { LoginSchema } from "@/lib/validations/auth";

class TooManyAttemptsError extends CredentialsSignin {
  code = "too_many_attempts";
}

class InvalidCredentialsError extends CredentialsSignin {
  code = "invalid_credentials";
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  trustHost: true,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials, request) => {
        const parsed = LoginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const ip =
          request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
          "unknown";
        const { success } = await loginRateLimit.limit(ip);
        if (!success) throw new TooManyAttemptsError();

        const { email, password } = parsed.data;
        if (email !== process.env.ADMIN_EMAIL) {
          throw new InvalidCredentialsError();
        }

        const passwordHash = process.env.ADMIN_PASSWORD_HASH ?? "";
        const valid = await bcrypt.compare(password, passwordHash);
        if (!valid) throw new InvalidCredentialsError();

        return { id: "admin", email };
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      return user?.email === process.env.ADMIN_EMAIL;
    },
  },
});
