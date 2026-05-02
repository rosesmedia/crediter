import { getIO } from "@repo/lib/socket/server";
import dayjs from "dayjs";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { env } from "@repo/lib/env";

export const schedulerRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    if (!env.SCHEDULER_API_KEY || !env.SCHEDULER_PERIOD)
      return { ok: true, res: [] };
    const schedulerRes = await fetch(
      `https://schedule.roses.media/period/${env.SCHEDULER_PERIOD}/api/fixture/list`,
      {
        headers: {
          "api-key": env.SCHEDULER_API_KEY,
        },
      },
    );

    const resJson = await schedulerRes.json();

    const res = z
      .array(
        z.object({
          id: z.string(),
          name: z.string(),
          startTime: z.coerce.date(),
          endTime: z.coerce.date(),
          externalID: z.string().nullable(),
        }),
      )
      .parse(resJson);

    return { ok: true, res };
  }),

  import: protectedProcedure
    .input(z.object({ fixtureId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!env.SCHEDULER_API_KEY || !env.SCHEDULER_PERIOD) return { ok: false };
      const schedulerRes = await fetch(
        `https://schedule.roses.media/period/${env.SCHEDULER_PERIOD}/api/fixture/${input.fixtureId}/crew`,
        {
          headers: {
            "api-key": env.SCHEDULER_API_KEY,
          },
        },
      );

      const resJson = await schedulerRes.json();

      const res = z
        .object({
          fixtureId: z.string(),
          fixtureName: z.string(),
          fixtureStartTime: z.coerce.date(),
          credits: z.array(
            z.object({
              roleName: z.string(),
              sortOrder: z.number(),
              crew: z.array(z.string()),
            }),
          ),
        })
        .parse(resJson);

      const io = await getIO();

      const event = await ctx.db.event.create({
        data: {
          name: res.fixtureName,
          date: res.fixtureStartTime,
          created_by: { connect: { id: ctx.session.user.id } },
        },
      });

      io.in("users").emit("update:events");

      await Promise.all(
        res.credits.map(async (c, idx) => {
          const role = await ctx.db.creditRole.create({
            data: {
              name: c.roleName,
              order: idx,
              event: {
                connect: {
                  id: event.id,
                },
              },
            },
          });

          await ctx.db.creditRoleName.createMany({
            data: c.crew.map((crew, idx) => ({
              name: crew,
              order: idx,
              credit_role_id: role.id,
            })),
          });
        }),
      );

      io.in("users").emit(`update:event:${event.id}`);

      return { ok: true, res: { id: event.id } };
    }),
});
