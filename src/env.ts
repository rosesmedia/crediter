import { exit } from "process";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  DATABASE_URL: z.string(),
  PUBLIC_URL: z
    .string()
    .refine((str) => !str.endsWith("/"), "PUBLIC_URL must not end with a '/'"),
  ROSES_SCHEDULER_BASE_URL: z
    .string()
    .refine(
      (str) => !str.endsWith("/"),
      "ROSES_SCHEDULER_BASE_URL must not end with a '/'",
    ),
  ROSES_SCHEDULER_INSTANCE: z.string().optional(),
  ROSES_SCHEDULER_PERIOD: z.string(),
  ROSES_SCHEDULER_API_KEY: z.string(),
});

export function validateEnv(
  env?: unknown,
): NodeJS.ProcessEnv | z.infer<typeof envSchema> {
  if (process.env.SKIP_ENV_VALIDATION === "1") return process.env;
  const envResult = envSchema.safeParse(env ?? process.env);
  if (!envResult.success) {
    console.error("Error: Bad env configuration");
    for (const error of envResult.error.issues) {
      console.error(
        `   variable ${error.path.join(".")} ${error.code}, ${error.message}`,
      );
    }
    exit(1);
  }
  return envResult.data;
}

export const env = validateEnv();
