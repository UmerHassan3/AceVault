"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { accounts } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/session";
import { isSaleChangeable } from "@/lib/changeable";
import { decryptSecret, encryptSecret } from "@/lib/crypto";
import { ActionError } from "@/lib/errors";
import { renderCredentialsImage } from "@/lib/image-generation/credentials-image";
import { uploadImage } from "@/lib/imagekit";
import { mutationRateLimit } from "@/lib/ratelimit";
import { NewAccountSchema, UpdateContactSchema } from "@/lib/validations/account";
import { assertImageFile, assertOptionalImageFile } from "@/lib/validations/file";

export type ActionState = { error?: string; success?: boolean } | undefined;

async function enforceRateLimit(email: string) {
  const { success } = await mutationRateLimit.limit(email);
  if (!success) throw new ActionError("Too many requests. Please slow down.");
}

export async function createAccount(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await requireAdmin();

  try {
    await enforceRateLimit(session.user!.email!);

    const parsed = NewAccountSchema.safeParse({
      boughtPrice: formData.get("boughtPrice"),
      boughtCurrency: formData.get("boughtCurrency"),
      boughtFrom: formData.get("boughtFrom"),
      guaranteeDays: formData.get("guaranteeDays"),
      characterId: formData.get("characterId"),
      email: formData.get("email"),
      number: formData.get("number"),
      password: formData.get("password"),
    });
    if (!parsed.success) {
      return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
    }

    const screenshot1 = assertImageFile(formData.get("screenshot1"), "Screenshot 1");
    const screenshot2 = assertImageFile(formData.get("screenshot2"), "Screenshot 2");
    const backupCodes = assertOptionalImageFile(
      formData.get("backupCodes"),
      "Backup codes screenshot"
    );

    const [shot1, shot2, backup] = await Promise.all([
      uploadImage(
        Buffer.from(await screenshot1.arrayBuffer()),
        screenshot1.name,
        "accounts/screenshots"
      ),
      uploadImage(
        Buffer.from(await screenshot2.arrayBuffer()),
        screenshot2.name,
        "accounts/screenshots"
      ),
      backupCodes
        ? uploadImage(
            Buffer.from(await backupCodes.arrayBuffer()),
            backupCodes.name,
            "accounts/backup-codes"
          )
        : Promise.resolve(null),
    ]);

    const data = parsed.data;

    await db.insert(accounts).values({
      boughtPrice: data.boughtPrice.toString(),
      boughtCurrency: data.boughtCurrency,
      boughtFrom: data.boughtFrom,
      guaranteeDays: data.guaranteeDays,
      characterId: data.characterId,
      email: data.email,
      number: data.number,
      passwordEncrypted: encryptSecret(data.password),
      screenshot1Url: shot1.url,
      screenshot1FileId: shot1.fileId,
      screenshot2Url: shot2.url,
      screenshot2FileId: shot2.fileId,
      backupCodesUrl: backup?.url,
      backupCodesFileId: backup?.fileId,
    });

    revalidatePath("/new-accounts");
    return { success: true };
  } catch (error) {
    if (error instanceof ActionError) return { error: error.message };
    throw error;
  }
}

export async function updateAccountContact(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await requireAdmin();

  try {
    await enforceRateLimit(session.user!.email!);

    const parsed = UpdateContactSchema.safeParse({
      accountId: formData.get("accountId"),
      email: formData.get("email"),
      number: formData.get("number"),
      password: formData.get("password"),
    });
    if (!parsed.success) {
      return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
    }
    const data = parsed.data;

    const row = await db.query.accounts.findFirst({
      where: eq(accounts.id, data.accountId),
      with: { sale: true },
    });
    if (!row) return { error: "Account not found." };

    const allowed =
      row.status === "available" ||
      (row.status === "sold" && !!row.sale && isSaleChangeable(row.sale));
    if (!allowed) {
      return { error: "This account's credentials cannot be changed yet." };
    }

    await db
      .update(accounts)
      .set({
        email: data.email,
        number: data.number,
        ...(data.password ? { passwordEncrypted: encryptSecret(data.password) } : {}),
        updatedAt: new Date(),
      })
      .where(eq(accounts.id, data.accountId));

    revalidatePath("/new-accounts");
    revalidatePath("/credentials-to-change");
    revalidatePath("/sold-accounts");
    return { success: true };
  } catch (error) {
    if (error instanceof ActionError) return { error: error.message };
    throw error;
  }
}

export async function generateCredentialsImage(
  accountId: string
): Promise<{ url?: string; error?: string }> {
  const session = await requireAdmin();

  try {
    await enforceRateLimit(session.user!.email!);

    const account = await db.query.accounts.findFirst({
      where: eq(accounts.id, accountId),
    });
    if (!account) return { error: "Account not found." };

    const password = decryptSecret(account.passwordEncrypted);
    const buffer = await renderCredentialsImage({
      characterId: account.characterId,
      email: account.email,
      password,
      backupCodesUrl: account.backupCodesUrl,
    });

    const uploaded = await uploadImage(
      buffer,
      `credentials-${account.characterId}.png`,
      "credentials"
    );
    return { url: uploaded.url };
  } catch (error) {
    if (error instanceof ActionError) return { error: error.message };
    throw error;
  }
}
