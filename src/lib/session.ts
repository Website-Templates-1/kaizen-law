/**
 * Signed session token — pure Node `crypto`, no dependencies.
 *
 * Kept separate from `auth.ts` (which uses `next/headers`) so `proxy.ts` can
 * verify a session at the edge of the request without pulling in server-only
 * cookie APIs. Token = base64url(payload) "." base64url(HMAC-SHA256(payload)).
 */
import { createHmac, timingSafeEqual } from "node:crypto";

export const SESSION_COOKIE = "admin_session";
export const SESSION_TTL_SECONDS = 8 * 60 * 60; // 8 hours

interface SessionPayload {
  sub: string; // owner username
  exp: number; // epoch seconds
}

function secret(): string {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 16)
    throw new Error("AUTH_SECRET is missing or too short (need >= 16 chars).");
  return s;
}

const b64url = (buf: Buffer) => buf.toString("base64url");

function hmac(data: string): Buffer {
  return createHmac("sha256", secret()).update(data).digest();
}

export function signSession(sub: string): string {
  const payload: SessionPayload = {
    sub,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  };
  const body = b64url(Buffer.from(JSON.stringify(payload), "utf8"));
  const sig = b64url(hmac(body));
  return `${body}.${sig}`;
}

/** Returns the payload if the signature is valid and unexpired, else null. */
export function verifySession(token: string | undefined): SessionPayload | null {
  if (!token || !token.includes(".")) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;

  let expected: Buffer;
  let provided: Buffer;
  try {
    expected = hmac(body);
    provided = Buffer.from(sig, "base64url");
  } catch {
    return null;
  }
  if (provided.length !== expected.length) return null;
  if (!timingSafeEqual(provided, expected)) return null;

  try {
    const payload = JSON.parse(
      Buffer.from(body, "base64url").toString("utf8"),
    ) as SessionPayload;
    if (typeof payload.exp !== "number" || payload.exp < Date.now() / 1000)
      return null;
    return payload;
  } catch {
    return null;
  }
}
