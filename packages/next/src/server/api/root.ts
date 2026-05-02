import { testRouter } from "@/server/api/routers/test";
import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { creditRoleNamesRouter } from "./routers/credit-role-names";
import { creditRolesRouter } from "./routers/credit-roles";
import { creditsRouter } from "./routers/credits";
import { eventsRouter } from "./routers/events";
import { schedulerRouter } from "./routers/scheduler";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  credits: creditsRouter,
  creditRoles: creditRolesRouter,
  creditRoleNames: creditRoleNamesRouter,
  events: eventsRouter,
  scheduler: schedulerRouter,
  test: testRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
