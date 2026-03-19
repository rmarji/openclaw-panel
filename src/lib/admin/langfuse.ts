const LANGFUSE_HOST = "https://langfuse.claw.jogeeks.com";
const PUBLIC_KEY = process.env.LANGFUSE_PUBLIC_KEY || "";
const SECRET_KEY = process.env.LANGFUSE_SECRET_KEY || "";

function authHeader(): string {
  return `Basic ${Buffer.from(`${PUBLIC_KEY}:${SECRET_KEY}`).toString("base64")}`;
}

export async function getScores(params: { limit?: number; fromTimestamp?: string } = {}) {
  const query = new URLSearchParams();
  if (params.limit) query.set("limit", String(params.limit));
  if (params.fromTimestamp) query.set("fromTimestamp", params.fromTimestamp);
  const res = await fetch(`${LANGFUSE_HOST}/api/public/scores?${query}`, {
    headers: { Authorization: authHeader() },
  });
  if (!res.ok) throw new Error(`Langfuse scores: ${res.status}`);
  return res.json();
}

export async function getObservations(params: { type?: string; limit?: number; fromTimestamp?: string } = {}) {
  const query = new URLSearchParams();
  if (params.type) query.set("type", params.type);
  if (params.limit) query.set("limit", String(Math.min(params.limit, 100)));
  if (params.fromTimestamp) query.set("fromTimestamp", params.fromTimestamp);
  const res = await fetch(`${LANGFUSE_HOST}/api/public/observations?${query}`, {
    headers: { Authorization: authHeader() },
  });
  if (!res.ok) throw new Error(`Langfuse observations: ${res.status}`);
  return res.json();
}
