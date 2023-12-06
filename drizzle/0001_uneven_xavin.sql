CREATE TABLE `payments` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`store_id` int NOT NULL,
	`stripeAccountId` text NOT NULL,
	`detailsSubmitted` boolean DEFAULT false,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `payments_id` PRIMARY KEY(`id`)
);
