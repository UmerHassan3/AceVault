import { z } from "zod";

export const CurrencyEnum = z.enum(["USDT", "PKR"]);
export const PHONE_REGEX = /^\+?[0-9]{6,15}$/;

const optionalTrimmedString = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .or(z.literal("").transform(() => undefined));

export const NewAccountSchema = z.object({
  boughtPrice: z.coerce.number().positive({ message: "Enter a valid price." }),
  boughtCurrency: CurrencyEnum,
  boughtFrom: z.string().trim().min(1, { message: "Required." }).max(200),
  guaranteeDays: z.coerce
    .number()
    .int()
    .min(0, { message: "Must be 0 or more." }),
  characterId: z.string().trim().min(1, { message: "Required." }).max(100),
  description: optionalTrimmedString(2000),
  email: z.string().trim().email({ message: "Enter a valid email." }),
  number: z
    .string()
    .trim()
    .regex(PHONE_REGEX, { message: "Enter a valid phone number." }),
  password: z.string().min(1, { message: "Required." }),
});

export type NewAccountInput = z.infer<typeof NewAccountSchema>;

export const UpdateContactSchema = z.object({
  accountId: z.string().uuid(),
  email: z.string().trim().email({ message: "Enter a valid email." }),
  number: z
    .string()
    .trim()
    .regex(PHONE_REGEX, { message: "Enter a valid phone number." }),
  guaranteeDays: z.coerce
    .number()
    .int()
    .min(0, { message: "Must be 0 or more." }),
  password: z
    .string()
    .min(1)
    .optional()
    .or(z.literal("").transform(() => undefined)),
});

export type UpdateContactInput = z.infer<typeof UpdateContactSchema>;

const optionalString = z
  .string()
  .optional()
  .or(z.literal("").transform(() => undefined));

export const UpdateSoldAccountSchema = z
  .object({
    accountId: z.string().uuid(),
    email: z.string().trim().email({ message: "Enter a valid email." }),
    number: z
      .string()
      .trim()
      .regex(PHONE_REGEX, { message: "Enter a valid phone number." }),
    oldPassword: optionalString,
    newPassword: optionalString,
    confirmPassword: optionalString,
  })
  .refine(
    (data) =>
      !data.oldPassword && !data.newPassword && !data.confirmPassword
        ? true
        : !!data.oldPassword && !!data.newPassword && !!data.confirmPassword,
    {
      message: "Fill in the old, new, and confirm password to change it.",
      path: ["oldPassword"],
    }
  )
  .refine(
    (data) => !data.newPassword || data.newPassword === data.confirmPassword,
    {
      message: "New password and confirm password do not match.",
      path: ["confirmPassword"],
    }
  );

export type UpdateSoldAccountInput = z.infer<typeof UpdateSoldAccountSchema>;
