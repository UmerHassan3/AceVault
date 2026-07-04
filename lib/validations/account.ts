import { z } from "zod";

export const CurrencyEnum = z.enum(["USDT", "PKR"]);
export const PHONE_REGEX = /^\+?[0-9]{6,15}$/;

export const NewAccountSchema = z.object({
  boughtPrice: z.coerce.number().positive({ message: "Enter a valid price." }),
  boughtCurrency: CurrencyEnum,
  boughtFrom: z.string().trim().min(1, { message: "Required." }).max(200),
  guaranteeDays: z.coerce
    .number()
    .int()
    .min(0, { message: "Must be 0 or more." }),
  characterId: z.string().trim().min(1, { message: "Required." }).max(100),
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
  password: z
    .string()
    .min(1)
    .optional()
    .or(z.literal("").transform(() => undefined)),
});

export type UpdateContactInput = z.infer<typeof UpdateContactSchema>;
