import {
  boolean,
  index,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const domains = mysqlTable("domains", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 160 }).notNull().unique(),
  category: mysqlEnum("category", ["technical", "non_technical"]).notNull(),
  description: text("description").notNull(),
  skills: text("skills").notNull(),
  icon: varchar("icon", { length: 40 }).default("shield").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const events = mysqlTable("events", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  slug: varchar("slug", { length: 220 }).notNull().unique(),
  description: text("description").notNull(),
  venue: varchar("venue", { length: 180 }).notNull(),
  eventDate: timestamp("eventDate").notNull(),
  category: varchar("category", { length: 80 }).notNull(),
  status: mysqlEnum("status", ["upcoming", "completed"]).default("upcoming").notNull(),
  registrationUrl: varchar("registrationUrl", { length: 500 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({ dateIdx: index("events_date_idx").on(table.eventDate) }));

export const teamMembers = mysqlTable("teamMembers", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  position: varchar("position", { length: 160 }).notNull(),
  domain: varchar("domain", { length: 160 }).notNull(),
  category: mysqlEnum("category", ["leadership", "technical", "non_technical"]).notNull(),
  bio: text("bio").notNull(),
  initials: varchar("initials", { length: 8 }).notNull(),
  githubUrl: varchar("githubUrl", { length: 500 }),
  linkedinUrl: varchar("linkedinUrl", { length: 500 }),
  sortOrder: int("sortOrder").default(0).notNull(),
  active: boolean("active").default(true).notNull(),
});

export const applications = mysqlTable("applications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  fullName: varchar("fullName", { length: 160 }).notNull(),
  collegeEmail: varchar("collegeEmail", { length: 320 }).notNull(),
  personalEmail: varchar("personalEmail", { length: 320 }),
  phone: varchar("phone", { length: 30 }).notNull(),
  rollNumber: varchar("rollNumber", { length: 40 }).notNull(),
  branch: varchar("branch", { length: 120 }).notNull(),
  year: varchar("year", { length: 20 }).notNull(),
  primaryDomain: varchar("primaryDomain", { length: 160 }).notNull(),
  secondaryDomain: varchar("secondaryDomain", { length: 160 }),
  skills: text("skills").notNull(),
  experience: text("experience"),
  links: text("links"),
  motivation: text("motivation").notNull(),
  resumeUrl: varchar("resumeUrl", { length: 500 }),
  status: mysqlEnum("status", ["submitted", "under_review", "shortlisted", "selected", "waitlisted", "not_selected"]).default("submitted").notNull(),
  assignedDomain: varchar("assignedDomain", { length: 160 }),
  managementRemark: text("managementRemark"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  emailIdx: index("applications_email_idx").on(table.collegeEmail),
  statusIdx: index("applications_status_idx").on(table.status),
}));

export const contactMessages = mysqlTable("contactMessages", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  subject: varchar("subject", { length: 200 }).notNull(),
  message: text("message").notNull(),
  read: boolean("read").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const applicationNotes = mysqlTable("applicationNotes", {
  id: int("id").autoincrement().primaryKey(),
  applicationId: int("applicationId").notNull(),
  authorId: int("authorId").notNull(),
  note: text("note").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const auditLogs = mysqlTable("auditLogs", {
  id: int("id").autoincrement().primaryKey(),
  actorId: int("actorId"),
  action: varchar("action", { length: 120 }).notNull(),
  entity: varchar("entity", { length: 80 }).notNull(),
  entityId: int("entityId"),
  metadata: text("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Application = typeof applications.$inferSelect;
export type Domain = typeof domains.$inferSelect;
export type Event = typeof events.$inferSelect;
export type TeamMember = typeof teamMembers.$inferSelect;
