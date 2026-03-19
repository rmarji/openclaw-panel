import { NodeSSH } from "node-ssh";
import { writeFileSync, existsSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";

interface PoolEntry {
  conn: NodeSSH;
  lastUsed: number;
}

const pool = new Map<string, PoolEntry>();
const MAX_IDLE_MS = 60_000;
const KEY_PATH = join(tmpdir(), "admin-ssh-key");

function ensureKeyFile(): string {
  if (!existsSync(KEY_PATH)) {
    const b64 = process.env.SSH_PRIVATE_KEY;
    if (!b64) throw new Error("SSH_PRIVATE_KEY env var not set");
    writeFileSync(KEY_PATH, Buffer.from(b64, "base64"), { mode: 0o600 });
  }
  return KEY_PATH;
}

export const SERVERS = {
  server1: { host: process.env.SERVER1_HOST || "localhost", label: "Server 1" },
  claw2: { host: process.env.CLAW2_HOST || "100.113.7.11", label: "CLAW2" },
  server3: { host: process.env.SERVER3_HOST || "87.99.143.175", label: "Server 3" },
} as const;

export type RemoteServer = keyof typeof SERVERS;

export async function getConnection(server: RemoteServer): Promise<NodeSSH> {
  const entry = pool.get(server);
  if (entry?.conn.isConnected()) {
    entry.lastUsed = Date.now();
    return entry.conn;
  }
  const ssh = new NodeSSH();
  const keyPath = ensureKeyFile();
  await ssh.connect({
    host: SERVERS[server].host,
    username: "root",
    privateKeyPath: keyPath,
    readyTimeout: 10_000,
  });
  pool.set(server, { conn: ssh, lastUsed: Date.now() });
  return ssh;
}

export async function execRemote(server: RemoteServer, command: string): Promise<string> {
  const ssh = await getConnection(server);
  const result = await ssh.execCommand(command, { execOptions: { timeout: 15_000 } });
  return result.stdout || result.stderr || "";
}

if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of pool) {
      if (now - entry.lastUsed > MAX_IDLE_MS) {
        entry.conn.dispose();
        pool.delete(key);
      }
    }
  }, 30_000);
}
