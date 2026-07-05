import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().trim().email({ message: "Enter a valid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

export type LoginInput = z.infer<typeof LoginSchema>;

export const GENERIC_RESET_MESSAGE =
  "If that email is registered, a reset link is on its way.";

export const RequestPasswordResetSchema = z.object({
  email: z.string().trim().email({ message: "Enter a valid email address." }),
});

export type RequestPasswordResetInput = z.infer<typeof RequestPasswordResetSchema>;

export const ResetPasswordSchema = z
  .object({
    token: z.string().min(1, { message: "Missing reset token." }),
    newPassword: z
      .string()
      .min(8, { message: "Must be at least 8 characters." }),
    confirmPassword: z.string().min(1, { message: "Required." }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;
