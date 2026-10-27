ALTER TABLE "expenses" RENAME COLUMN "split" TO "active";--> statement-breakpoint
ALTER TABLE "expenses" RENAME COLUMN "merged_expense_id" TO "merged_to";--> statement-breakpoint
ALTER TABLE "expenses" DROP CONSTRAINT "expenses_merged_expense_id_expenses_expense_id_fk";
--> statement-breakpoint
ALTER TABLE "expenses" ALTER COLUMN "raw" SET DEFAULT false;--> statement-breakpoint
ALTER TABLE "expenses" ALTER COLUMN "raw" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_merged_to_expenses_expense_id_fk" FOREIGN KEY ("merged_to") REFERENCES "public"."expenses"("expense_id") ON DELETE no action ON UPDATE no action;