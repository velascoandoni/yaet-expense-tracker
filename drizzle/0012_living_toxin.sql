ALTER TABLE "types" ALTER COLUMN "color" SET DEFAULT '#ffffffff';--> statement-breakpoint
ALTER TABLE "types" ADD COLUMN "text_color" text DEFAULT '#000000ff' NOT NULL;--> statement-breakpoint