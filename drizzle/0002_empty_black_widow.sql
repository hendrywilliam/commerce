ALTER TABLE `addresses` RENAME COLUMN `postal_code` TO `postalCode`;--> statement-breakpoint
ALTER TABLE `orders` RENAME COLUMN `store_id` TO `storeId`;--> statement-breakpoint
ALTER TABLE `payments` RENAME COLUMN `store_id` TO `storeId`;--> statement-breakpoint
ALTER TABLE `payments` RENAME COLUMN `created_at` TO `createdAt`;