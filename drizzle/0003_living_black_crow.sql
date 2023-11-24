ALTER TABLE `addresses` MODIFY COLUMN `line1` text NOT NULL;--> statement-breakpoint
ALTER TABLE `addresses` MODIFY COLUMN `city` text NOT NULL;--> statement-breakpoint
ALTER TABLE `addresses` MODIFY COLUMN `state` text NOT NULL;--> statement-breakpoint
ALTER TABLE `addresses` MODIFY COLUMN `postal_code` text NOT NULL;--> statement-breakpoint
ALTER TABLE `addresses` MODIFY COLUMN `country` text NOT NULL;--> statement-breakpoint
ALTER TABLE `orders` MODIFY COLUMN `name` text NOT NULL;--> statement-breakpoint
ALTER TABLE `orders` MODIFY COLUMN `email` text NOT NULL;