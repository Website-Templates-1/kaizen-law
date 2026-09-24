/**
 * Owner credential verification + session cookie helpers.
 *
 * Bootstrap credentials live in OWNER_USERNAME / OWNER_PASSWORD_HASH. After
 * the owner sets a password in /admin/account, the overlay in the content
 * store takes over. Hashing is scrypt ("saltHex:hashHex"). Server-only.
 */
import "server-only";
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import {
  SESSION_COOKIE,
  SESSION_TTL_SECONDS,
  signSession,
  verifySession,
} from "@/lib/session";
import { loadOwnerRecord, saveOwnerPassword } from "@/lib/credentials";

const KEYLEN = 64;
export const MIN_PASSWORD_LENGTH = 10;
export const MAX_PASSWORD_LENGTH = 128;

function safeEqualStr(a: string, b: string): boolean {
  const ab = Buffer.from(a, "utf8");
  const bb = Buffer.from(b, "utf8");
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

export function hashPassword(password: string): string {
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, KEYLEN);
  return `${salt.toString("hex")}:${hash.toString("hex")}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [saltHex, hashHex] = stored.split(":");
  if (!saltHex || !hashHex) return false;
  try {
    const expected = Buffer.from(hashHex, "hex");
    const actual = scryptSync(password, Buffer.from(saltHex, "hex"), KEYLEN);
    return expected.length === actual.length && timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}

export function passwordPolicyError(password: string): string | null {
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Use at least ${MIN_PASSWORD_LENGTH} characters.`;
  }
  if (password.length > MAX_PASSWORD_LENGTH) {
    return `Keep the password under ${MAX_PASSWORD_LENGTH} characters.`;
  }
  if (/\s/.test(password)) {
    return "Don't include spaces.";
  }
  return null;
}

/** Verify a username/password against overlay credentials, else env bootstrap. */
export async function verifyCredentials(
  username: string,
  password: string,
): Promise<boolean> {
  const stored = await loadOwnerRecord();
  if (!stored) return false;

  const usernameOk = safeEqualStr(username, stored.username);
  const passwordOk = verifyPassword(password, stored.passwordHash);
  return usernameOk && passwordOk;
}

/** Replace the owner password. Caller must already have verified the current one. */
export async function replaceOwnerPassword(
  username: string,
  nextPassword: string,
): Promise<void> {
  await saveOwnerPassword(username, hashPassword(nextPassword));
}

/** Set the signed session cookie (call from a Route Handler). */
export async function startSession(username: string): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, signSession(username), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function endSession(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

/** True if the current request carries a valid owner session. */
export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies();
  return verifySession(store.get(SESSION_COOKIE)?.value) !== null;
}
