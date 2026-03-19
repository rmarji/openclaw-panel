export async function getBotInfo(token: string) {
  const res = await fetch(`https://api.telegram.org/bot${token}/getMe`);
  const data = await res.json();
  return data.ok ? data.result : null;
}

export async function getWebhookInfo(token: string) {
  const res = await fetch(`https://api.telegram.org/bot${token}/getWebhookInfo`);
  const data = await res.json();
  return data.ok ? data.result : null;
}
