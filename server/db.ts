import { and, desc, eq, like, or } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  applications,
  contactMessages,
  domains,
  events,
  InsertUser,
  teamMembers,
  users,
} from "../drizzle/schema.js";
import { ENV } from "./_core/env.js";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;
  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  const textFields = ["name", "email", "loginMethod"] as const;
  for (const field of textFields) {
    if (user[field] !== undefined) {
      values[field] = user[field] ?? null;
      updateSet[field] = user[field] ?? null;
    }
  }
  if (user.lastSignedIn !== undefined) {
    values.lastSignedIn = user.lastSignedIn;
    updateSet.lastSignedIn = user.lastSignedIn;
  }
  if (user.role !== undefined) {
    values.role = user.role;
    updateSet.role = user.role;
  } else if (user.openId === ENV.ownerOpenId) {
    values.role = "admin";
    updateSet.role = "admin";
  }
  if (!values.lastSignedIn) values.lastSignedIn = new Date();
  if (!Object.keys(updateSet).length) updateSet.lastSignedIn = new Date();
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export async function getDomains() {
  const db = await getDb();
  return db ? db.select().from(domains).orderBy(domains.category, domains.name) : [];
}

export async function getEvents() {
  const db = await getDb();
  return db ? db.select().from(events).orderBy(desc(events.eventDate)) : [];
}

export async function getTeamMembers() {
  const db = await getDb();
  return db ? db.select().from(teamMembers).where(eq(teamMembers.active, true)).orderBy(teamMembers.sortOrder) : [];
}

export async function createApplication(input: typeof applications.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database is not configured");
  const existing = await db
    .select({ id: applications.id })
    .from(applications)
    .where(or(eq(applications.collegeEmail, input.collegeEmail), eq(applications.rollNumber, input.rollNumber)))
    .limit(1);
  if (existing.length) throw new Error("An application already exists for this email or roll number.");
  const result = await db.insert(applications).values(input);
  return { id: Number(result[0].insertId) };
}

export async function findApplication(collegeEmail: string, rollNumber: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(applications)
    .where(and(eq(applications.collegeEmail, collegeEmail), eq(applications.rollNumber, rollNumber)))
    .limit(1);
  return result[0];
}

export async function createContactMessage(input: typeof contactMessages.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database is not configured");
  await db.insert(contactMessages).values(input);
}

export async function getApplications(search?: string, status?: string) {
  const db = await getDb();
  if (!db) return [];
  const filters = [];
  if (search) {
    filters.push(or(like(applications.fullName, `%${search}%`), like(applications.collegeEmail, `%${search}%`), like(applications.rollNumber, `%${search}%`)));
  }
  if (status && status !== "all") filters.push(eq(applications.status, status as typeof applications.$inferSelect.status));
  return db.select().from(applications).where(filters.length ? and(...filters) : undefined).orderBy(desc(applications.createdAt));
}

export async function updateApplication(id: number, input: { status: typeof applications.$inferSelect.status; assignedDomain?: string; managementRemark?: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database is not configured");
  await db.update(applications).set(input).where(eq(applications.id, id));
}

export async function getApplicationStats() {
  const db = await getDb();
  if (!db) return { total: 0, shortlisted: 0, selected: 0, pending: 0 };
  const rows = await db.select().from(applications);
  return {
    total: rows.length,
    shortlisted: rows.filter((row) => row.status === "shortlisted").length,
    selected: rows.filter((row) => row.status === "selected").length,
    pending: rows.filter((row) => ["submitted", "under_review"].includes(row.status)).length,
  };
}
