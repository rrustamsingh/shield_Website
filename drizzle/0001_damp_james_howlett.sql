CREATE TABLE `applicationNotes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`applicationId` int NOT NULL,
	`authorId` int NOT NULL,
	`note` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `applicationNotes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `applications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`fullName` varchar(160) NOT NULL,
	`collegeEmail` varchar(320) NOT NULL,
	`personalEmail` varchar(320),
	`phone` varchar(30) NOT NULL,
	`rollNumber` varchar(40) NOT NULL,
	`branch` varchar(120) NOT NULL,
	`year` varchar(20) NOT NULL,
	`primaryDomain` varchar(160) NOT NULL,
	`secondaryDomain` varchar(160),
	`skills` text NOT NULL,
	`experience` text,
	`links` text,
	`motivation` text NOT NULL,
	`resumeUrl` varchar(500),
	`status` enum('submitted','under_review','shortlisted','selected','waitlisted','not_selected') NOT NULL DEFAULT 'submitted',
	`assignedDomain` varchar(160),
	`managementRemark` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `applications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `auditLogs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`actorId` int,
	`action` varchar(120) NOT NULL,
	`entity` varchar(80) NOT NULL,
	`entityId` int,
	`metadata` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `auditLogs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `contactMessages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(160) NOT NULL,
	`email` varchar(320) NOT NULL,
	`subject` varchar(200) NOT NULL,
	`message` text NOT NULL,
	`read` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `contactMessages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `domains` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(160) NOT NULL,
	`category` enum('technical','non_technical') NOT NULL,
	`description` text NOT NULL,
	`skills` text NOT NULL,
	`icon` varchar(40) NOT NULL DEFAULT 'shield',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `domains_id` PRIMARY KEY(`id`),
	CONSTRAINT `domains_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(200) NOT NULL,
	`slug` varchar(220) NOT NULL,
	`description` text NOT NULL,
	`venue` varchar(180) NOT NULL,
	`eventDate` timestamp NOT NULL,
	`category` varchar(80) NOT NULL,
	`status` enum('upcoming','completed') NOT NULL DEFAULT 'upcoming',
	`registrationUrl` varchar(500),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `events_id` PRIMARY KEY(`id`),
	CONSTRAINT `events_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `teamMembers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(160) NOT NULL,
	`position` varchar(160) NOT NULL,
	`domain` varchar(160) NOT NULL,
	`category` enum('leadership','technical','non_technical') NOT NULL,
	`bio` text NOT NULL,
	`initials` varchar(8) NOT NULL,
	`githubUrl` varchar(500),
	`linkedinUrl` varchar(500),
	`sortOrder` int NOT NULL DEFAULT 0,
	`active` boolean NOT NULL DEFAULT true,
	CONSTRAINT `teamMembers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `applications_email_idx` ON `applications` (`collegeEmail`);--> statement-breakpoint
CREATE INDEX `applications_status_idx` ON `applications` (`status`);--> statement-breakpoint
CREATE INDEX `events_date_idx` ON `events` (`eventDate`);