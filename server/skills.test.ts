import { describe, it, expect, beforeAll } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock admin user context
function createAdminContext(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "admin-user",
      email: "admin@example.com",
      name: "Admin User",
      loginMethod: "manus",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

// Mock regular user context
function createUserContext(): TrpcContext {
  return {
    user: {
      id: 2,
      openId: "regular-user",
      email: "user@example.com",
      name: "Regular User",
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("Skills Router", () => {
  it("should list all skills", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    
    const skills = await caller.skills.list();
    expect(Array.isArray(skills)).toBe(true);
    expect(skills.length).toBeGreaterThan(0);
  });

  it("should get a skill by ID", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    
    const skill = await caller.skills.getById({ id: 1 });
    if (skill) {
      expect(skill.id).toBe(1);
      expect(skill.name).toBeDefined();
    }
  });

  it("should allow admin to create a skill", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.skills.create({
      name: "Test Skill",
      description: "A test skill",
      category: "Testing",
      difficulty: "intermediate",
      currentDemand: 75,
    });
    
    expect(result).toBeDefined();
  });

  it("should prevent non-admin from creating a skill", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);
    
    try {
      await caller.skills.create({
        name: "Test Skill",
        description: "A test skill",
        category: "Testing",
        difficulty: "intermediate",
        currentDemand: 75,
      });
      expect.fail("Should have thrown FORBIDDEN error");
    } catch (error: any) {
      expect(error.code).toBe("FORBIDDEN");
    }
  });

  it("should allow admin to update a skill", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.skills.update({
      id: 1,
      name: "Updated Skill",
      currentDemand: 85,
    });
    
    expect(result).toBeDefined();
  });
});

describe("Forecasts Router", () => {
  it("should get forecasts by skill ID", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    
    const forecasts = await caller.forecasts.getBySkill({ skillId: 1 });
    expect(Array.isArray(forecasts)).toBe(true);
  });

  it("should get recent forecasts", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    
    const forecasts = await caller.forecasts.getRecent({ days: 30 });
    expect(Array.isArray(forecasts)).toBe(true);
  });

  it("should allow admin to create a forecast", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.forecasts.create({
      skillId: 1,
      forecastDate: new Date(),
      predictedDemand: 80,
      confidence: 85,
      trend: "increasing",
      notes: "Test forecast",
    });
    
    expect(result).toBeDefined();
  });

  it("should prevent non-admin from creating a forecast", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);
    
    try {
      await caller.forecasts.create({
        skillId: 1,
        forecastDate: new Date(),
        predictedDemand: 80,
        confidence: 85,
        trend: "increasing",
        notes: "Test forecast",
      });
      expect.fail("Should have thrown FORBIDDEN error");
    } catch (error: any) {
      expect(error.code).toBe("FORBIDDEN");
    }
  });
});

describe("Alerts Router", () => {
  it("should get unread alerts", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    
    const alerts = await caller.alerts.getUnread();
    expect(Array.isArray(alerts)).toBe(true);
  });

  it("should allow admin to create an alert", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.alerts.create({
      title: "Test Alert",
      description: "A test alert",
      type: "system",
      severity: "medium",
    });
    
    expect(result).toBeDefined();
  });

  it("should prevent non-admin from creating an alert", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);
    
    try {
      await caller.alerts.create({
        title: "Test Alert",
        description: "A test alert",
        type: "system",
        severity: "medium",
      });
      expect.fail("Should have thrown FORBIDDEN error");
    } catch (error: any) {
      expect(error.code).toBe("FORBIDDEN");
    }
  });

  it("should mark alert as read", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.alerts.markAsRead({ id: 1 });
    expect(result).toBeDefined();
  });
});

describe("Reports Router", () => {
  it("should get reports by user", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    
    const reports = await caller.reports.getByUser();
    expect(Array.isArray(reports)).toBe(true);
  });

  it("should allow authenticated user to create a report", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.reports.create({
      title: "Test Report",
      description: "A test report",
      type: "csv",
      s3Key: "test-key",
      s3Url: "https://example.com/test",
      fileSize: 1024,
    });
    
    expect(result).toBeDefined();
  });
});

describe("Metrics Router", () => {
  it("should get overview metrics", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    
    const metrics = await caller.metrics.getOverview();
    expect(metrics).toBeDefined();
    expect(metrics?.totalSkills).toBeGreaterThanOrEqual(0);
    expect(metrics?.totalForecasts).toBeGreaterThanOrEqual(0);
    expect(metrics?.totalAlerts).toBeGreaterThanOrEqual(0);
  });
});
