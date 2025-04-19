import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";

export async function GET(req: NextRequest, res: NextResponse) {
  const browser = await puppeteer.launch({
    defaultViewport: {
      width: 1920,
      height: 1080,
      isLandscape: true,
    },
    executablePath: process.env.PUPPETEER_CHROME_PATH,
  });
  const page = await browser.newPage();

  await page.goto("http://localhost:3000/credits", {
    waitUntil: "networkidle2",
    timeout: 0,
  });

  console.log("Taking screenshot");

  const image = await page.screenshot();

  console.log("Starting recording");

  // https://screenshotone.com/blog/how-to-record-videos-with-puppeteer/

  // const recorder = await page.screencast({
  //   ffmpegPath: process.env.PUPPETEER_FFMPEG_PATH,
  //   path: "test.mp4",
  //   format: "mp4",
  //   fps: 25,
  // });

  // await sleep(5000);

  // console.log("Stopping recording");
  // await recorder.stop();

  await browser.close();

  return new NextResponse(image, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "no-store",
    },
  });
}

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
