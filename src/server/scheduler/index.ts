import { env } from "@/env";
import { z } from "zod";

export async function getSchedulerFixtures() {
  const res = await fetch(
    `${env.ROSES_SCHEDULER_BASE_URL}/${env.ROSES_SCHEDULER_INSTANCE ? env.ROSES_SCHEDULER_INSTANCE + "/" : ""}period/${env.ROSES_SCHEDULER_PERIOD}/api/fixture/list`,
    {
      headers: {
        "User-Agent": "Roses Media Crediter",
        "api-key": env.ROSES_SCHEDULER_API_KEY!,
      },
      method: "GET",
    },
  );

  const schema = z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      startTime: z.string(),
      endTime: z.string(),
      externalID: z.string().nullable(),
    }),
  );

  const data = await schema.parseAsync(await res.json());

  return data;
}

export async function getSchedulerFixtureCrew(fixtureId: string) {
  const res = await fetch(
    `${env.ROSES_SCHEDULER_BASE_URL}/${env.ROSES_SCHEDULER_INSTANCE ? env.ROSES_SCHEDULER_INSTANCE + "/" : ""}period/${env.ROSES_SCHEDULER_PERIOD}/api/fixture/${fixtureId}/crew`,
    {
      headers: {
        "User-Agent": "Roses Media Crediter",
        "api-key": env.ROSES_SCHEDULER_API_KEY!,
      },
      method: "GET",
    },
  );

  const schema = z.object({
    fixtureName: z.string(),
    credits: z.array(
      z.object({
        roleName: z.string(),
        sortOrder: z.number(),
        crew: z.array(z.string()),
      }),
    ),
  });

  const data = await schema.parseAsync(await res.json());

  return {
    ...data,
    credits: data.credits.sort((a, b) => a.sortOrder - b.sortOrder),
  };
}
