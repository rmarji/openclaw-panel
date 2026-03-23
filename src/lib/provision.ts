import { db } from "@/lib/db";
import { agents, telegramBotPool } from "@/lib/db/schema";
import { eq, isNull } from "drizzle-orm";
import { execRemote } from "@/lib/admin/ssh";

/**
 * Provisions an OpenClaw agent instance on Server 3 via Coolify.
 * Updates agent status as it progresses: pending → provisioning → ready | error
 */
export async function provisionAgent(agentId: string): Promise<void> {
  try {
    // Mark as provisioning
    await db
      .update(agents)
      .set({ status: "provisioning", updatedAt: new Date() })
      .where(eq(agents.id, agentId));

    const agent = await db.query.agents.findFirst({
      where: eq(agents.id, agentId),
    });
    if (!agent) throw new Error("Agent not found");

    // Allocate a Telegram bot from the pool (two-step to avoid subquery issues)
    const availableBot = await db.query.telegramBotPool.findFirst({
      where: isNull(telegramBotPool.allocatedToAgentId),
    });

    if (!availableBot) {
      throw new Error("No available Telegram bots in pool");
    }

    const [bot] = await db
      .update(telegramBotPool)
      .set({ allocatedToAgentId: agentId })
      .where(eq(telegramBotPool.id, availableBot.id))
      .returning();

    // Deploy via the deploy-openclaw.sh script on Server 1
    // The script creates Coolify service, configures compose, starts containers,
    // installs Manifest, syncs Traefik, and outputs credentials
    const anthropicKey = process.env.OPENCLAW_ANTHROPIC_KEY || "";
    const deployCmd = [
      `/data/coolify/scripts/deploy-openclaw.sh`,
      agent.slug,
      bot.botToken,
      anthropicKey,
    ].join(" ");

    const output = await execRemote("server1", deployCmd);

    // Parse Coolify UUID from deploy output
    const uuidMatch = output.match(/coolify_uuid=([a-z0-9]+)/);
    const domainMatch = output.match(/domain=([^\s]+)/);
    const gatewayMatch = output.match(/gateway_token=([^\s]+)/);

    const coolifyUuid = uuidMatch?.[1] || null;
    const domain = domainMatch?.[1] || `${agent.slug}.claw.jogeeks.com`;
    const gatewayToken = gatewayMatch?.[1] || null;

    // Update agent record with deployment details
    await db
      .update(agents)
      .set({
        status: "ready",
        coolifyUuid,
        domain,
        telegramBotUsername: bot.botUsername,
        gatewayToken,
        provisionedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(agents.id, agentId));

    console.log(`Agent ${agent.slug} provisioned successfully`);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`Provisioning failed for agent ${agentId}:`, message);

    await db
      .update(agents)
      .set({
        status: "error",
        provisionError: message,
        updatedAt: new Date(),
      })
      .where(eq(agents.id, agentId));
  }
}

/**
 * Returns the count of available bots in the pool.
 */
export async function getAvailableBotCount(): Promise<number> {
  const result = await db.query.telegramBotPool.findMany({
    where: isNull(telegramBotPool.allocatedToAgentId),
  });
  return result.length;
}
