const LITELLM_HOST = "https://litellm.claw.jogeeks.com";
const LITELLM_KEY = process.env.LITELLM_API_KEY || "";

export async function getSpendLogs(startDate?: string, endDate?: string) {
  const params = new URLSearchParams();
  if (startDate) params.set("start_date", startDate);
  if (endDate) params.set("end_date", endDate);
  const res = await fetch(`${LITELLM_HOST}/spend/logs?${params}`, {
    headers: { Authorization: `Bearer ${LITELLM_KEY}` },
  });
  if (!res.ok) throw new Error(`LiteLLM spend: ${res.status}`);
  return res.json();
}

export async function getModelInfo() {
  const res = await fetch(`${LITELLM_HOST}/model/info`, {
    headers: { Authorization: `Bearer ${LITELLM_KEY}` },
  });
  if (!res.ok) throw new Error(`LiteLLM model info: ${res.status}`);
  return res.json();
}
