CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text,
	"avatar_url" text NOT NULL,
	"external_account_id" integer NOT NULL,
	CONSTRAINT "users_external_account_id_unique" UNIQUE("external_account_id")
);
--> statement-breakpoint
ALTER TABLE "goals" ALTER COLUMN "desired_weekly_frequency" SET NOT NULL;