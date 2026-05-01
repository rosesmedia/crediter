import { exec, spawn } from "node:child_process";
import util from "node:util";
import {
  CreditProgress,
  CreditState,
} from "@repo/lib/db/generated/prisma/enums";
import { env } from "@repo/lib/env";
import { getMinioClient } from "@repo/lib/minio";
import { getIO } from "@repo/lib/socket/server";
import { imageSize } from "image-size";
import { NextResponse } from "next/server";
import puppeteer from "puppeteer";
import z from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

const execAsync = util.promisify(exec);

export const creditsRouter = createTRPCRouter({
  read: protectedProcedure
    .input(z.object({ credit_id: z.cuid() }))
    .query(({ ctx, input }) => {
      return ctx.db.credit.findFirstOrThrow({
        where: {
          id: input.credit_id,
        },
      });
    }),

  generateCredits: protectedProcedure
    .input(z.object({ event_id: z.cuid() }))
    .mutation(async ({ ctx, input }) => {
      const io = await getIO();

      const asset = await ctx.db.credit.create({
        data: { event: { connect: { id: input.event_id } } },
      });

      io.in("users").emit(`update:event:${input.event_id}`);

      async function setCreditState({
        progress,
        state,
        size,
        path,
      }: {
        progress?: CreditProgress;
        state?: CreditState;
        size?: number;
        path?: string;
      }) {
        await ctx.db.credit.update({
          where: {
            id: asset.id,
          },
          data: {
            progress: progress,
            state: state,
            size: size,
            path: path,
          },
        });

        io.in("users").emit(`update:credits:${asset.id}`);
      }

      await setCreditState({
        state: CreditState.GENERATING,
        progress: CreditProgress.STARTED,
      });

      const browser = await puppeteer.launch({
        defaultViewport: {
          width: 1920,
          height: 1080,
          isLandscape: true,
        },
        executablePath: process.env.PUPPETEER_CHROME_PATH,
        args: ["--no-sandbox"],
      });

      const mktemp_res = await execAsync("mktemp -d");
      const tmpdir = mktemp_res.stdout.trim();

      function tmpdir_path<T extends string>(path: T): `${string}/${T}` {
        return `${tmpdir}/${path}`;
      }

      const page = await browser.newPage();

      await page.goto(
        `http://localhost:3000/generate/scrolling/${input.event_id}`,
        {
          waitUntil: "networkidle2",
          timeout: 0,
        },
      );

      await setCreditState({
        progress: CreditProgress.BROWSER_LAUNCHED,
      });

      const image = await page.screenshot({
        fullPage: true,
        path: tmpdir_path("screenshot.png"),
      });

      await browser.close();

      const dimensions = await imageSize(image);

      await setCreditState({
        progress: CreditProgress.IMAGE_SAVED,
      });

      // const PX_PER_FRAME = 6;

      // const TOTAL_FRAMES = Math.ceil((dimensions.height - 1080) / PX_PER_FRAME);
      const TOTAL_FRAMES = 900;

      const PX_PER_FRAME = (dimensions.height - 1080) / TOTAL_FRAMES;

      const quality_args = ["-r", "50", "-preset", "veryslow", "-crf", "10"];

      const scroll_args = [
        "-loop",
        "1",
        "-i",
        tmpdir_path("screenshot.png"),
        "-filter_complex",
        `fps=50,crop=1920:1080:0:(n*${PX_PER_FRAME})`,
        "-frames:v",
        `${TOTAL_FRAMES}`,
        "-pix_fmt",
        "yuv420p",
        ...quality_args,
        "-y",
        tmpdir_path("credits_scroll.mp4"),
      ];

      await new Promise<void>((resolve, reject) => {
        const child = spawn(process.env.FFMPEG_PATH ?? "ffmpeg", scroll_args);

        child.stderr.on("data", (chunk: Buffer) => {
          const data = chunk.toString();
          if (!data.startsWith("frame=")) return;

          const frameNumber = Number(
            data.substring(6, data.indexOf("fps=")).trim(),
          );

          const _progress = Math.round((frameNumber / TOTAL_FRAMES) * 100);
        });

        child.on("close", (code) => {
          if (code === 0) return resolve();
          reject(new Error(`Process exited with code ${code}`));
        });
      });

      await setCreditState({
        progress: CreditProgress.SCROLL_GENERATED,
      });

      const concat_args = [
        "-i",
        tmpdir_path("credits_scroll.mp4"),
        "-i",
        "assets/2026_endcard_15s.mp4",
        "-filter_complex",
        "[0:v]fps=50[v0];[1:v]fps=50[v1];[v0][v1]concat=n=2:v=1[outv]",
        "-map",
        "[outv]",
        ...quality_args,
        "-y",
        tmpdir_path("out_no_sound.mp4"),
      ];

      await new Promise<void>((resolve, reject) => {
        const child = spawn(process.env.FFMPEG_PATH ?? "ffmpeg", concat_args);

        child.on("close", (code) => {
          if (code === 0) return resolve();
          reject(new Error(`Process exited with code ${code}`));
        });
      });

      const add_theme_args = [
        "-i",
        tmpdir_path("out_no_sound.mp4"),
        "-i",
        "assets/theme_33s.wav",
        "-c:v",
        "copy",
        "-c:a",
        "copy",
        "-map",
        "0:v:0",
        "-map",
        "1:a:0",
        ...quality_args,
        "-y",
        tmpdir_path("out.mp4"),
      ];

      await new Promise<void>((resolve, reject) => {
        const child = spawn(
          process.env.FFMPEG_PATH ?? "ffmpeg",
          add_theme_args,
        );

        child.on("close", (code) => {
          if (code === 0) return resolve();
          reject(new Error(`Process exited with code ${code}`));
        });
      });

      await setCreditState({
        progress: CreditProgress.ENDCARD_ADDED,
      });

      const minioClient = getMinioClient();

      const minioPath = `roses-credits/${asset.id}`;

      await minioClient.fPutObject(
        env.MINIO_BUCKET,
        minioPath,
        tmpdir_path("out.mp4"),
        {
          "Content-Type": "video/mp4",
          "Content-Disposition": `attachment; filename="credits_${asset.id}.mp4"`,
        },
      );

      const objectStat = await minioClient.statObject(
        env.MINIO_BUCKET,
        minioPath,
      );

      await setCreditState({
        progress: CreditProgress.UPLOADED,
        size: objectStat.size,
        path: minioPath,
      });

      await exec(`rm -r ${tmpdir}`);

      await setCreditState({
        progress: CreditProgress.TIDIED,
        state: CreditState.READY,
      });

      return NextResponse.json(
        { ok: true },
        {
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-store",
          },
        },
      );
    }),
});
