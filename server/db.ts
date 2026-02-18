import { eq, desc, and, gte } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, skills, forecasts, reports, alerts, Skill, Forecast, Report, Alert, InsertSkill, InsertForecast, InsertReport, InsertAlert } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
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
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Skills queries
export async function getAllSkills() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(skills).orderBy(skills.name);
}

export async function getSkillById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(skills).where(eq(skills.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createSkill(skill: InsertSkill) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(skills).values(skill);
  return result;
}

export async function updateSkill(id: number, updates: Partial<InsertSkill>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(skills).set(updates).where(eq(skills.id, id));
}

// Forecasts queries
export async function getForecastsBySkillId(skillId: number, limit = 12) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(forecasts)
    .where(eq(forecasts.skillId, skillId))
    .orderBy(desc(forecasts.forecastDate))
    .limit(limit);
}

export async function createForecast(forecast: InsertForecast) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(forecasts).values(forecast);
}

export async function getRecentForecasts(days = 30) {
  const db = await getDb();
  if (!db) return [];
  const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  return db.select().from(forecasts)
    .where(gte(forecasts.createdAt, cutoffDate))
    .orderBy(desc(forecasts.createdAt));
}

// Reports queries
export async function createReport(report: InsertReport) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(reports).values(report);
}

export async function getReportsByUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(reports)
    .where(eq(reports.generatedBy, userId))
    .orderBy(desc(reports.createdAt));
}

export async function getReportById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(reports).where(eq(reports.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Alerts queries
export async function createAlert(alert: InsertAlert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(alerts).values(alert);
}

export async function getUnreadAlerts() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(alerts)
    .where(eq(alerts.isRead, false))
    .orderBy(desc(alerts.createdAt));
}

export async function getAlertsByType(type: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(alerts)
    .where(eq(alerts.type, type as any))
    .orderBy(desc(alerts.createdAt));
}

export async function markAlertAsRead(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(alerts).set({ isRead: true }).where(eq(alerts.id, id));
}

export async function getMetrics() {
  const db = await getDb();
  if (!db) return null;
  
  const skillCount = await db.select({ count: skills.id }).from(skills);
  const forecastCount = await db.select({ count: forecasts.id }).from(forecasts);
  const alertCount = await db.select({ count: alerts.id }).from(alerts);
  const unreadAlerts = await db.select({ count: alerts.id }).from(alerts).where(eq(alerts.isRead, false));
  
  return {
    totalSkills: skillCount[0]?.count || 0,
    totalForecasts: forecastCount[0]?.count || 0,
    totalAlerts: alertCount[0]?.count || 0,
    unreadAlerts: unreadAlerts[0]?.count || 0,
  };
}
