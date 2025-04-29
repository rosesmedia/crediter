import { getSchedulerFixtureCrew } from "@/server/scheduler";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params: promiseParams }: { params: Promise<{ fixtureId: string }> },
) {
  const params = await promiseParams;

  const data = await getSchedulerFixtureCrew(params.fixtureId);

  return NextResponse.json(data);
}
