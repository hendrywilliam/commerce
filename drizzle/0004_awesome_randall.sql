CREATE TABLE `comments` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`product_id` int NOT NULL,
	`user_id` int NOT NULL,
	`comment` text NOT NULL,
	`rating` tinyint NOT NULL DEFAULT 0,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `comments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `addresses` RENAME COLUMN `postalCode` TO `postal_code`;--> statement-breakpoint
ALTER TABLE `addresses` RENAME COLUMN `createdAt` TO `created_at`;--> statement-breakpoint
ALTER TABLE `carts` RENAME COLUMN `createdAt` TO `created_at`;--> statement-breakpoint
ALTER TABLE `orders` RENAME COLUMN `stripePaymentIntentId` TO `stripe_payment_intent_id`;--> statement-breakpoint
ALTER TABLE `orders` RENAME COLUMN `stripePaymentIntentStatus` TO `stripe_payment_intent_status`;--> statement-breakpoint
ALTER TABLE `orders` RENAME COLUMN `createdAt` TO `created_at`;--> statement-breakpoint
ALTER TABLE `payments` RENAME COLUMN `storeId` TO `store_id`;--> statement-breakpoint
ALTER TABLE `payments` RENAME COLUMN `stripeAccountId` TO `stripe_account_id`;--> statement-breakpoint
ALTER TABLE `payments` RENAME COLUMN `detailsSubmitted` TO `details_submitted`;--> statement-breakpoint
ALTER TABLE `payments` RENAME COLUMN `createdAt` TO `created_at`;--> statement-breakpoint
ALTER TABLE `products` RENAME COLUMN `rating` TO `total_rating`;--> statement-breakpoint
ALTER TABLE `products` RENAME COLUMN `createdAt` TO `created_at`;--> statement-breakpoint
ALTER TABLE `stores` RENAME COLUMN `createdAt` TO `created_at`;--> statement-breakpoint
ALTER TABLE `carts` ADD `is_closed` boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE `carts` DROP COLUMN `isClosed`;