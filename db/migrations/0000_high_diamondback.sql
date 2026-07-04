CREATE TYPE "public"."account_status" AS ENUM('available', 'sold');--> statement-breakpoint
CREATE TYPE "public"."change_type" AS ENUM('instant', 'scheduled');--> statement-breakpoint
CREATE TYPE "public"."currency" AS ENUM('USDT', 'PKR');--> statement-breakpoint
CREATE TABLE "accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"bought_price" numeric(12, 2) NOT NULL,
	"bought_currency" "currency" NOT NULL,
	"bought_from" text NOT NULL,
	"guarantee_days" integer NOT NULL,
	"character_id" text NOT NULL,
	"email" text NOT NULL,
	"number" text NOT NULL,
	"password_encrypted" text NOT NULL,
	"screenshot1_url" text NOT NULL,
	"screenshot1_file_id" text NOT NULL,
	"screenshot2_url" text NOT NULL,
	"screenshot2_file_id" text NOT NULL,
	"backup_codes_url" text,
	"backup_codes_file_id" text,
	"status" "account_status" DEFAULT 'available' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sales" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"account_id" uuid NOT NULL,
	"buyer_name" text NOT NULL,
	"buyer_email" text NOT NULL,
	"buyer_number" text NOT NULL,
	"change_type" "change_type" NOT NULL,
	"scheduled_days" integer,
	"change_deadline_at" timestamp with time zone,
	"guarantee_days" integer NOT NULL,
	"price" numeric(12, 2) NOT NULL,
	"price_currency" "currency" NOT NULL,
	"receipt_url" text,
	"receipt_file_id" text,
	"sold_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "sales_account_id_unique" UNIQUE("account_id")
);
--> statement-breakpoint
ALTER TABLE "sales" ADD CONSTRAINT "sales_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE cascade ON UPDATE no action;