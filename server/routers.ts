import { z } from "zod";
import { COOKIE_NAME } from "../shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, protectedProcedure, publicProcedure, router } from "./_core/trpc";
import {
  createApplication,
  createContactMessage,
  findApplication,
  getApplicationStats,
  getApplications,
  getDomains,
  getEvents,
  getTeamMembers,
  updateApplication,
} from "./db";

export const applicationSchema = z.object({
  fullName: z.string().min(2).max(160),
  collegeEmail: z.string().email(),
  personalEmail: z.string().email().optional().or(z.literal("")),
  phone: z.string().min(7).max(30),
  rollNumber: z.string().min(2).max(40),
  branch: z.string().min(2).max(120),
  year: z.string().min(1).max(20),
  primaryDomain: z.string().min(2).max(160),
  secondaryDomain: z.string().max(160).optional().or(z.literal("")),
  skills: z.string().min(2),
  experience: z.string().max(5000).optional().or(z.literal("")),
  links: z.string().max(1000).optional().or(z.literal("")),
  motivation: z.string().min(20).max(5000),
  consent: z.boolean().refine((value) => value, "Consent is required"),
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  public: router({
    domains: publicProcedure.query(() => getDomains()),
    events: publicProcedure.query(() => getEvents()),
    team: publicProcedure.query(() => getTeamMembers()),
    submitApplication: publicProcedure.input(applicationSchema).mutation(({ input }) =>
      createApplication({
        fullName: input.fullName,
        collegeEmail: input.collegeEmail,
        personalEmail: input.personalEmail || null,
        phone: input.phone,
        rollNumber: input.rollNumber,
        branch: input.branch,
        year: input.year,
        primaryDomain: input.primaryDomain,
        secondaryDomain: input.secondaryDomain || null,
        skills: input.skills,
        experience: input.experience || null,
        links: input.links || null,
        motivation: input.motivation,
      }),
    ),
    checkStatus: publicProcedure
      .input(z.object({ collegeEmail: z.string().email(), rollNumber: z.string().min(2) }))
      .query(({ input }) => findApplication(input.collegeEmail, input.rollNumber)),
    contact: publicProcedure
      .input(z.object({ name: z.string().min(2), email: z.string().email(), subject: z.string().min(2), message: z.string().min(10) }))
      .mutation(({ input }) => createContactMessage(input).then(() => ({ success: true }))),
  }),
  management: router({
    stats: adminProcedure.query(() => getApplicationStats()),
    applications: adminProcedure
      .input(z.object({ search: z.string().optional(), status: z.string().optional() }).optional())
      .query(({ input }) => getApplications(input?.search, input?.status)),
    updateApplication: adminProcedure
      .input(z.object({ id: z.number(), status: z.enum(["submitted", "under_review", "shortlisted", "selected", "waitlisted", "not_selected"]), assignedDomain: z.string().optional(), managementRemark: z.string().optional() }))
      .mutation(({ input }) => updateApplication(input.id, input)),
    whoAmI: protectedProcedure.query(({ ctx }) => ({ name: ctx.user.name, email: ctx.user.email, role: ctx.user.role })),
  }),
});

export type AppRouter = typeof appRouter;
