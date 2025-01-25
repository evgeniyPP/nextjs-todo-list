CREATE TABLE `todos` (
	`id` text PRIMARY KEY NOT NULL,
	`text` text NOT NULL,
	`isCompleted` integer NOT NULL,
	`timestamp` integer DEFAULT (strftime('%s', 'now'))
);
