import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().trim().email({ message: "Enter a valid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

export type LoginInput = z.infer<typeof LoginSchema>;
