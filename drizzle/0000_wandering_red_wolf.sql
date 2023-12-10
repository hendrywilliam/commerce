CREATE TABLE `addresses` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`line1` text NOT NULL,
	`line2` text,
	`city` text NOT NULL,
	`state` text NOT NULL,
	`postalCode` text NOT NULL,
	`country` text NOT NULL,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `addresses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `carts` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`items` json,
	`isClosed` boolean DEFAULT false,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `carts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`storeId` int,
	`items` json,
	`total` decimal(10,2) DEFAULT '0',
	`name` text NOT NULL,
	`email` text NOT NULL,
	`address` int,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `orders_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `payments` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`storeId` int NOT NULL,
	`stripeAccountId` text NOT NULL,
	`detailsSubmitted` boolean DEFAULT false,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `payments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`store_id` int,
	`name` text NOT NULL,
	`slug` varchar(256) NOT NULL,
	`description` text,
	`price` decimal(10,2) NOT NULL DEFAULT '0',
	`stock` int NOT NULL DEFAULT 1,
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
	`slug` varchar(256) NOT NULL,
	`description` text NOT NULL,
	`active` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `stores_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `productSlugIndex` ON `products` (`slug`);--> statement-breakpoint
CREATE INDEX `storeSlugIndex` ON `stores` (`slug`);