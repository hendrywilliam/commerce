ALTER TABLE `ratings` MODIFY COLUMN `accumulated_total_ratings` int NOT NULL;--> statement-breakpoint
ALTER TABLE `ratings` MODIFY COLUMN `total_ratings` int NOT NULL;