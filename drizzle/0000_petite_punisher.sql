CREATE TABLE `carts` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`items` json,
	`isClosed` boolean DEFAULT false,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `carts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`store_id` int,
	`name` text,
	`description` text,
	`price` decimal(10,2) NOT NULL DEFAULT '0',
	`stock` int DEFAULT 0,
	`rating` int NOT NULL DEFAULT 0,
	`category` enum('clothing','backpack','shoes') NOT NULL,
	`image` json,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `products_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `stores` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`active` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `stores_id` PRIMARY KEY(`id`)
);
