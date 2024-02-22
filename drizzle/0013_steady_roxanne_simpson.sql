ALTER TABLE `products` ADD `average_ratings` decimal(2,1) DEFAULT '0';--> statement-breakpoint
ALTER TABLE `ratings` DROP COLUMN `average_ratings`;