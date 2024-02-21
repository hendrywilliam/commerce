ALTER TABLE `newsletters` RENAME COLUMN `createdAt` TO `created_at`;--> statement-breakpoint
ALTER TABLE `orders` RENAME COLUMN `userId` TO `user_id`;--> statement-breakpoint
ALTER TABLE `orders` RENAME COLUMN `storeId` TO `store_id`;--> statement-breakpoint
ALTER TABLE `comments` MODIFY COLUMN `user_id` varchar(256) NOT NULL;