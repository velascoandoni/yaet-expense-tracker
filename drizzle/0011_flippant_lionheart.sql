ALTER TABLE "expenses" ADD COLUMN "was_split" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "expenses" ADD COLUMN "was_merged" boolean DEFAULT false;