import { relations } from "drizzle-orm";
import {
  integer,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const currencyEnum = pgEnum("currency", ["USDT", "PKR"]);
export const accountStatusEnum = pgEnum("account_status", [
  "available",
  "sold",
]);
export const changeTypeEnum = pgEnum("change_type", ["instant", "scheduled"]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const passwordResetTokens = pgTable("password_reset_tokens", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  tokenHash: text("token_hash").notNull().unique(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const accounts = pgTable("accounts", {
  id: uuid("id").primaryKey().defaultRandom(),
  boughtPrice: numeric("bought_price", { precision: 12, scale: 2 }).notNull(),
  boughtCurrency: currencyEnum("bought_currency").notNull(),
  boughtFrom: text("bought_from").notNull(),
  guaranteeDays: integer("guarantee_days").notNull(),
  characterId: text("character_id").notNull(),
  email: text("email").notNull(),
  number: text("number").notNull(),
  passwordEncrypted: text("password_encrypted").notNull(),
  screenshot1Url: text("screenshot1_url").notNull(),
  screenshot1FileId: text("screenshot1_file_id").notNull(),
  screenshot2Url: text("screenshot2_url").notNull(),
  screenshot2FileId: text("screenshot2_file_id").notNull(),
  backupCodesUrl: text("backup_codes_url"),
  backupCodesFileId: text("backup_codes_file_id"),
  status: accountStatusEnum("status").notNull().default("available"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const sales = pgTable("sales", {
  id: uuid("id").primaryKey().defaultRandom(),
  accountId: uuid("account_id")
    .notNull()
    .unique()
    .references(() => accounts.id, { onDelete: "cascade" }),
  buyerName: text("buyer_name").notNull(),
  buyerEmail: text("buyer_email").notNull(),
  buyerNumber: text("buyer_number").notNull(),
  changeType: changeTypeEnum("change_type").notNull(),
  scheduledDays: integer("scheduled_days"),
  changeDeadlineAt: timestamp("change_deadline_at", { withTimezone: true }),
  guaranteeDays: integer("guarantee_days").notNull(),
  price: numeric("price", { precision: 12, scale: 2 }).notNull(),
  priceCurrency: currencyEnum("price_currency").notNull(),
  receiptUrl: text("receipt_url"),
  receiptFileId: text("receipt_file_id"),
  soldAt: timestamp("sold_at", { withTimezone: true }).notNull().defaultNow(),
});

export const accountsRelations = relations(accounts, ({ one }) => ({
  sale: one(sales, {
    fields: [accounts.id],
    references: [sales.accountId],
  }),
}));

export const salesRelations = relations(sales, ({ one }) => ({
  account: one(accounts, {
    fields: [sales.accountId],
    references: [accounts.id],
  }),
}));

export type Account = typeof accounts.$inferSelect;
export type NewAccountRow = typeof accounts.$inferInsert;
export type Sale = typeof sales.$inferSelect;
export type NewSaleRow = typeof sales.$inferInsert;
export type User = typeof users.$inferSelect;
export type NewUserRow = typeof users.$inferInsert;
export type PasswordResetToken = typeof passwordResetTokens.$inferSelect;
export type NewPasswordResetTokenRow = typeof passwordResetTokens.$inferInsert;
