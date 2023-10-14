CREATE TABLE `carts` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`items` json,
	`isClosed` boolean DEFAULT false,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `carts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `products` MODIFY COLUMN `category` enum('clothing','backpack','shoes') NOT NULL;