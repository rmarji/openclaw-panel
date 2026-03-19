const BASE_URL = process.env.COOLIFY_API_URL || "http://host.docker.internal:8000/api/v1";
const TOKEN = process.env.COOLIFY_API_TOKEN || "";

async function coolifyFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Accept: "application/json",
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  if (!res.ok) throw new Error(`Coolify ${path}: ${res.status} ${res.statusText}`);
  return res.json();
}

export async function listServices() {
  return coolifyFetch("/services");
}

export async function getService(uuid: string) {
  return coolifyFetch(`/services/${uuid}`);
}

export async function getServiceEnvs(uuid: string) {
  return coolifyFetch(`/services/${uuid}/envs`);
}

export async function updateServiceEnv(uuid: string, key: string, value: string) {
  return coolifyFetch(`/services/${uuid}/envs`, {
    method: "PATCH",
    body: JSON.stringify({ key, value }),
  });
}

export async function restartService(uuid: string) {
  return coolifyFetch(`/services/${uuid}/restart`, { method: "POST" });
}
