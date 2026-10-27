DROP INDEX "name_amount_date_idx";--> statement-breakpoint
ALTER TABLE "types" ADD COLUMN "emoji" text DEFAULT '❓' NOT NULL;--> statement-breakpoint
ALTER TABLE "types" ADD COLUMN "color" text DEFAULT '#f5f8fa' NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "name_amount_date_final_balance_idx" ON "expenses" USING btree ("name","amount","date","final_balance","user_id");--> statement-breakpoint
ALTER TABLE "types" ADD CONSTRAINT "types_emoji_unique" UNIQUE("emoji");--> statement-breakpoint
ALTER TABLE "types" ADD CONSTRAINT "types_color_unique" UNIQUE("color");