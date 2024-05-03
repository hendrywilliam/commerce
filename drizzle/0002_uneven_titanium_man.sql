ALTER TABLE "orders" ALTER COLUMN "items" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "category" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "image" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "ratings" ALTER COLUMN "one_star_rating" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "ratings" ALTER COLUMN "two_stars_rating" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "ratings" ALTER COLUMN "three_stars_rating" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "ratings" ALTER COLUMN "four_stars_rating" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "ratings" ALTER COLUMN "five_stars_rating" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "ratings" ALTER COLUMN "accumulated_total_ratings" SET NOT NULL;