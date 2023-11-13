CREATE TABLE `addresses` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`line1` text,
	`line2` text,
	`city` text,
	`state` text,
	`postal_code` text,
	`country` text,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `addresses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`store_id` int,
	`items` json,
	`total` decimal(10,2) DEFAULT '0',
	`name` text,
	`email` text,
	`address` int,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `orders_id` PRIMARY KEY(`id`)
);
