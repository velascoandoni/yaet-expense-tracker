CREATE TABLE "expenses" (
	"expense_id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"date" date NOT NULL,
	"amount" numeric NOT NULL,
	"final_balance" numeric NOT NULL,
	"user_id" integer NOT NULL,
	"type_id" integer,
	"merged_expense_id" integer
);
--> statement-breakpoint
CREATE TABLE "types" (
	"type_id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "types_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"user_id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"password" text NOT NULL,
	"salt" text NOT NULL,
	"admin" boolean DEFAULT false,
	CONSTRAINT "users_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_type_id_types_type_id_fk" FOREIGN KEY ("type_id") REFERENCES "public"."types"("type_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_merged_expense_id_expenses_expense_id_fk" FOREIGN KEY ("merged_expense_id") REFERENCES "public"."expenses"("expense_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "name_amount_date_idx" ON "expenses" USING btree ("name","amount","date","user_id");