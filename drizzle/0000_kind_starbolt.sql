CREATE TABLE `product` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`store_id` int,
	`product_name` text,
	`description` text,
	`price` decimal(10,2) DEFAULT '0',
	`stock` int DEFAULT 0,
	CONSTRAINT `product_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `stores` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`user_id` serial AUTO_INCREMENT,
	`storename` varchar(255),
	`description` text,
	CONSTRAINT `stores_id` PRIMARY KEY(`id`)
);
