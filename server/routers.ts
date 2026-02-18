import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import * as db from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  skills: router({
    list: publicProcedure.query(() => db.getAllSkills()),
    getById: publicProcedure.input(z.object({ id: z.number() })).query(({ input }) => db.getSkillById(input.id)),
    create: protectedProcedure
      .input(z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        category: z.string().optional(),
        difficulty: z.enum(["beginner", "intermediate", "advanced", "expert"]).optional(),
        currentDemand: z.number().min(0).max(100).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user?.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        return db.createSkill({
          name: input.name,
          description: input.description,
          category: input.category,
          difficulty: input.difficulty,
          currentDemand: input.currentDemand,
        });
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        category: z.string().optional(),
        difficulty: z.enum(["beginner", "intermediate", "advanced", "expert"]).optional(),
        currentDemand: z.number().min(0).max(100).optional(),
        demandTrend: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user?.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        const { id, ...updates } = input;
        return db.updateSkill(id, updates);
      }),
  }),

  forecasts: router({
    getBySkill: publicProcedure
      .input(z.object({ skillId: z.number() }))
      .query(({ input }) => db.getForecastsBySkillId(input.skillId)),
    getRecent: publicProcedure
      .input(z.object({ days: z.number().optional() }))
      .query(({ input }) => db.getRecentForecasts(input.days)),
    create: protectedProcedure
      .input(z.object({
        skillId: z.number(),
        forecastDate: z.date(),
        predictedDemand: z.number().min(0).max(100),
        confidence: z.number().min(0).max(100),
        trend: z.enum(["increasing", "decreasing", "stable"]),
        notes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user?.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        return db.createForecast({
          skillId: input.skillId,
          forecastDate: input.forecastDate,
          predictedDemand: input.predictedDemand,
          confidence: input.confidence.toString(),
          trend: input.trend,
          notes: input.notes,
          createdBy: ctx.user.id,
        });
      }),
  }),

  reports: router({
    getByUser: protectedProcedure.query(({ ctx }) => db.getReportsByUser(ctx.user.id)),
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        const report = await db.getReportById(input.id);
        if (!report) throw new TRPCError({ code: "NOT_FOUND" });
        if (report.generatedBy !== ctx.user.id && ctx.user?.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        return report;
      }),
    create: protectedProcedure
      .input(z.object({
        title: z.string().min(1),
        description: z.string().optional(),
        type: z.enum(["csv", "pdf", "excel"]),
        s3Key: z.string(),
        s3Url: z.string(),
        fileSize: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return db.createReport({
          ...input,
          generatedBy: ctx.user.id,
        });
      }),
  }),

  alerts: router({
    getUnread: protectedProcedure.query(() => db.getUnreadAlerts()),
    getByType: protectedProcedure
      .input(z.object({ type: z.string() }))
      .query(({ input }) => db.getAlertsByType(input.type)),
    markAsRead: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input }) => db.markAlertAsRead(input.id)),
    create: protectedProcedure
      .input(z.object({
        title: z.string(),
        description: z.string().optional(),
        type: z.enum(["threshold", "system", "forecast", "user"]),
        severity: z.enum(["low", "medium", "high", "critical"]).optional(),
        skillId: z.number().optional(),
        data: z.any().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user?.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        return db.createAlert(input);
      }),
  }),

  metrics: router({
    getOverview: publicProcedure.query(() => db.getMetrics()),
  }),
});

export type AppRouter = typeof appRouter;
