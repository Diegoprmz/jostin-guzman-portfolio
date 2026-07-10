import { NextResponse } from "next/server";
import { getProjectSummaries } from "@/lib/projects";

/** GET /api/projects — list of project summaries for the menu. */
export function GET() {
  return NextResponse.json({
    success: true,
    data: getProjectSummaries(),
  });
}
