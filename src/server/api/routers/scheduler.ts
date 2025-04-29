import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import {
  getSchedulerFixtureCrew,
  getSchedulerFixtures,
} from "@/server/scheduler";

export const schedulerRouter = createTRPCRouter({
  listFixtures: protectedProcedure.query(() => getSchedulerFixtures()),

  getFixtureCrew: protectedProcedure
    .input(z.string())
    .query(({ input }) => getSchedulerFixtureCrew(input)),
});
