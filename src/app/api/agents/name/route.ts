import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { agents } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { provisionAgent } from "@/lib/provision";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, agentId } = await req.json();

  if (!name || typeof name !== "string" || name.length < 2 || name.length > 40) {
    return NextResponse.json(
      { error: "Name must be 2-40 characters" },
      { status: 400 }
    );
  }

  // Generate slug from name
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 30);

  // Check slug uniqueness
  const existing = await db.query.agents.findFirst({
    where: eq(agents.slug, slug),
  });
  if (existing && existing.id !== agentId) {
    return NextResponse.json(
      { error: "That name is taken, try another" },
      { status: 409 }
    );
  }

  // Find the user's pending agent
  const agent = agentId
    ? await db.query.agents.findFirst({
        where: and(eq(agents.id, agentId), eq(agents.userId, session.user.id)),
      })
    : await db.query.agents.findFirst({
        where: and(
          eq(agents.userId, session.user.id),
          eq(agents.status, "pending")
        ),
        orderBy: (a, { desc }) => [desc(a.createdAt)],
      });

  if (!agent) {
    return NextResponse.json({ error: "No agent found" }, { status: 404 });
  }

  // Update agent name and slug
  await db
    .update(agents)
    .set({ name, slug, updatedAt: new Date() })
    .where(eq(agents.id, agent.id));

  // Start provisioning in the background
  // Next.js 16 supports top-level async operations that outlive the response
  provisionAgent(agent.id).catch((err) =>
    console.error("Background provisioning error:", err)
  );

  return NextResponse.json({
    agentId: agent.id,
    name,
    slug,
    status: "provisioning",
  });
}
