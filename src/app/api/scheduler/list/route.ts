import { getSchedulerFixtures } from "@/server/scheduler";
import { NextResponse } from "next/server";

export async function GET() {
  const data = await getSchedulerFixtures();

  return NextResponse.json(data);
}
