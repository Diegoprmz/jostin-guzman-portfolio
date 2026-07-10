import { NextResponse } from "next/server";
import { getProjectBySlug } from "@/lib/projects";

/** GET /api/projects/[slug] — full project with POIs, or 404. */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return NextResponse.json(
      { success: false, error: `Project "${slug}" not found` },
      { status: 404 },
    );
  }

  return NextResponse.json({ success: true, data: project });
}
