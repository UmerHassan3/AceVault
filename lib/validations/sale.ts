import { z } from "zod";

import { CurrencyEnum, PHONE_REGEX } from "./account";

export const ChangeTypeEnum = z.enum(["instant", "scheduled"]);

export const SaleSchema = z
  .object({
    accountId: z.string().uuid(),
    buyerName: z.string().trim().min(1, { message: "Required." }).max(200),
    buyerEmail: z.string().trim().email({ message: "Enter a valid email." }),
    buyerNumber: z
      .string()
      .trim()
      .regex(PHONE_REGEX, { message: "Enter a valid phone number." }),
    guaranteeDays: z.coerce
      .number()
      .int()
      .min(0, { message: "Must be 0 or more." }),
    price: z.coerce.number().positive({ message: "Enter a valid price." }),
    priceCurrency: CurrencyEnum,
    changeType: ChangeTypeEnum,
    scheduledDays: z.coerce.number().int().min(1).max(6).optional(),
  })
  .refine(
    (data) => data.changeType === "instant" || data.scheduledDays !== undefined,
    {
      message: "Select the number of days.",
      path: ["scheduledDays"],
    }
  );

export type SaleInput = z.infer<typeof SaleSchema>;
