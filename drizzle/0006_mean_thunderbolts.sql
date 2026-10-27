DROP INDEX "name_amount_date_final_balance_idx";--> statement-breakpoint
ALTER TABLE "expenses" ADD COLUMN "repetition" numeric DEFAULT '1' NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "name_amount_date_repetition_idx" ON "expenses" USING btree ("name","amount","date","repetition","user_id");