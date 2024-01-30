CREATE TABLE `newsletters` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`email` varchar(256) NOT NULL,
	`status` enum('subscribed','unsubscribed') NOT NULL,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `newsletters_id` PRIMARY KEY(`id`)
);
