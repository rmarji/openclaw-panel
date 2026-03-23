import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { agents, subscriptions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userAgents = await db.query.agents.findMany({
    where: eq(agents.userId, session.user.id),
    orderBy: (a, { desc }) => [desc(a.createdAt)],
  });

  const userSubs = await db.query.subscriptions.findMany({
    where: eq(subscriptions.userId, session.user.id),
    orderBy: (s, { desc }) => [desc(s.createdAt)],
  });

  return NextResponse.json({
    agents: userAgents.map((a) => ({
      id: a.id,
      name: a.name,
      slug: a.slug,
      status: a.status,
      domain: a.domain,
      telegramBotUsername: a.telegramBotUsername,
      provisionError: a.provisionError,
      provisionedAt: a.provisionedAt,
      createdAt: a.createdAt,
    })),
    subscription: userSubs[0]
      ? {
          id: userSubs[0].id,
          tier: userSubs[0].tier,
          status: userSubs[0].status,
          billingPeriod: userSubs[0].billingPeriod,
          currentPeriodEnd: userSubs[0].currentPeriodEnd,
        }
      : null,
  });
}
