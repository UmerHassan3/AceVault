"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { accounts, sales } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/session";
import { ActionError } from "@/lib/errors";
import { renderReceiptImage } from "@/lib/image-generation/receipt-image";
import { uploadImage } from "@/lib/imagekit";
import { mutationRateLimit } from "@/lib/ratelimit";
import { SaleSchema } from "@/lib/validations/sale";

export type SaleActionState = { error?: string; receiptUrl?: string } | undefined;

export async function createSale(
  _prevState: SaleActionState,
  formData: FormData
): Promise<SaleActionState> {
  const session = await requireAdmin();

  try {
    const { success } = await mutationRateLimit.limit(session.user!.email!);
    if (!success) throw new ActionError("Too many requests. Please slow down.");

    const parsed = SaleSchema.safeParse({
      accountId: formData.get("accountId"),
      buyerName: formData.get("buyerName"),
      buyerEmail: formData.get("buyerEmail"),
      buyerNumber: formData.get("buyerNumber"),
      guaranteeDays: formData.get("guaranteeDays"),
      price: formData.get("price"),
      priceCurrency: formData.get("priceCurrency"),
      changeType: formData.get("changeType"),
      scheduledDays: formData.get("scheduledDays") || undefined,
    });
    if (!parsed.success) {
      return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
    }
    const data = parsed.data;

    const account = await db.query.accounts.findFirst({
      where: eq(accounts.id, data.accountId),
    });
    if (!account) return { error: "Account not found." };
    if (account.status !== "available") {
      return { error: "This account has already been sold." };
    }

    const soldAt = new Date();
    const changeDeadlineAt =
      data.changeType === "scheduled" && data.scheduledDays
        ? new Date(soldAt.getTime() + data.scheduledDays * 24 * 60 * 60 * 1000)
        : null;

    const invoiceNo = `EX-${soldAt
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, "")}-${data.accountId.slice(0, 4).toUpperCase()}`;

    const receiptBuffer = await renderReceiptImage({
      invoiceNo,
      characterId: account.characterId,
      buyerName: data.buyerName,
      buyerEmail: data.buyerEmail,
      buyerNumber: data.buyerNumber,
      price: data.price.toString(),
      priceCurrency: data.priceCurrency,
      guaranteeDays: data.guaranteeDays,
      soldAt,
    });
    const receipt = await uploadImage(
      receiptBuffer,
      `receipt-${account.characterId}.png`,
      "receipts",
      { lossless: true }
    );

    // neon-http has no multi-statement transactions; db.batch sends both
    // statements in one atomic HTTP round-trip instead.
    await db.batch([
      db
        .update(accounts)
        .set({ status: "sold", updatedAt: soldAt })
        .where(eq(accounts.id, data.accountId)),
      db.insert(sales).values({
        accountId: data.accountId,
        buyerName: data.buyerName,
        buyerEmail: data.buyerEmail,
        buyerNumber: data.buyerNumber,
        changeType: data.changeType,
        scheduledDays: data.changeType === "scheduled" ? data.scheduledDays : null,
        changeDeadlineAt,
        guaranteeDays: data.guaranteeDays,
        price: data.price.toString(),
        priceCurrency: data.priceCurrency,
        receiptUrl: receipt.url,
        receiptFileId: receipt.fileId,
        soldAt,
      }),
    ]);

    revalidatePath("/new-accounts");
    revalidatePath("/sold-accounts");
    revalidatePath("/credentials-to-change");

    return { receiptUrl: receipt.url };
  } catch (error) {
    if (error instanceof ActionError) return { error: error.message };
    throw error;
  }
}
