import { createHash, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "admin_token";
const COOKIE_MAX_AGE = 60 * 60 * 24;

const attempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = attempts.get(ip);
  if (!record || now > record.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (record.count >= MAX_ATTEMPTS) return false;
  record.count++;
  return true;
}

export function verifyToken(input: string): boolean {
  const expected = process.env.ADMIN_TOKEN;
  if (!expected) return false;
  const inputHash = Buffer.from(hashToken(input));
  const expectedHash = Buffer.from(hashToken(expected));
  if (inputHash.length !== expectedHash.length) return false;
  return timingSafeEqual(inputHash, expectedHash);
}

export async function isAuthenticated(): Promise<boolean> {
  const expected = process.env.ADMIN_TOKEN;
  if (!expected) return false;
  const jar = await cookies();
  const cookie = jar.get(COOKIE_NAME);
  if (!cookie?.value) return false;
  const expectedHash = Buffer.from(hashToken(expected));
  const cookieHash = Buffer.from(cookie.value);
  if (expectedHash.length !== cookieHash.length) return false;
  return timingSafeEqual(expectedHash, cookieHash);
}

export function verifyRefreshToken(input: string): boolean {
  const expected = process.env.ADMIN_REFRESH_TOKEN;
  if (!expected || !input) return false;
  const inputHash = Buffer.from(hashToken(input));
  const expectedHash = Buffer.from(hashToken(expected));
  if (inputHash.length !== expectedHash.length) return false;
  return timingSafeEqual(inputHash, expectedHash);
}
