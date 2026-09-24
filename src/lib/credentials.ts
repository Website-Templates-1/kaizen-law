/**
 * Owner credentials overlay. Bootstrap username/hash live in env; once the
 * client sets a password in /admin/account, the scrypt hash is stored here
 * (encrypted with AUTH_SECRET) via the existing GitHub/filesystem content
 * store. No extra packages — node:crypto only.
 *
 * Env credentials keep working until a custom password is saved. After that,
 * only the overlay is accepted, so the studio-issued password cannot linger.
 */
import "server-only";
import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  scryptSync,
} from "node:crypto";
import { readFile, writeFile } from "@/lib/github";

export const CREDENTIALS_PATH = "content/_credentials.json";

export interface OwnerRecord {
  username: string;
  passwordHash: string;
  updatedAt: string;
}

function key(): Buffer {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error("AUTH_SECRET is missing or too short (need >= 16 chars).");
  }
  return scryptSync(secret, "kaizen-credentials-v1", 32);
}

function encrypt(plaintext: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(), iv);
  const enc = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `v1.${iv.toString("hex")}.${tag.toString("hex")}.${enc.toString("hex")}`;
}

function decrypt(payload: string): string {
  const [version, ivHex, tagHex, dataHex] = payload.split(".");
  if (version !== "v1" || !ivHex || !tagHex || !dataHex) {
    throw new Error("Unrecognized credentials payload");
  }
  const decipher = createDecipheriv(
    "aes-256-gcm",
    key(),
    Buffer.from(ivHex, "hex"),
  );
  decipher.setAuthTag(Buffer.from(tagHex, "hex"));
  return Buffer.concat([
    decipher.update(Buffer.from(dataHex, "hex")),
    decipher.final(),
  ]).toString("utf8");
}

function asRecord(value: unknown): OwnerRecord | null {
  if (!value || typeof value !== "object") return null;
  const rec = value as Partial<OwnerRecord>;
  if (
    typeof rec.username !== "string" ||
    !rec.username.trim() ||
    typeof rec.passwordHash !== "string" ||
    !rec.passwordHash.includes(":")
  ) {
    return null;
  }
  return {
    username: rec.username.trim(),
    passwordHash: rec.passwordHash.trim(),
    updatedAt:
      typeof rec.updatedAt === "string" ? rec.updatedAt : new Date().toISOString(),
  };
}

function envRecord(): OwnerRecord | null {
  const username = process.env.OWNER_USERNAME?.trim();
  const passwordHash = process.env.OWNER_PASSWORD_HASH?.trim().replace(/%+$/, "");
  if (!username || !passwordHash || !passwordHash.includes(":")) return null;
  return { username, passwordHash, updatedAt: "" };
}

/** True once the owner has saved a password through the admin UI. */
export async function hasCustomPassword(): Promise<boolean> {
  const file = await readFile(CREDENTIALS_PATH);
  return Boolean(file?.text?.trim());
}

/**
 * Custom overlay if present and valid; otherwise the env bootstrap.
 * Returns null when neither is configured.
 */
export async function loadOwnerRecord(): Promise<OwnerRecord | null> {
  const file = await readFile(CREDENTIALS_PATH);
  const raw = file?.text?.trim();
  if (raw) {
    try {
      const parsed = JSON.parse(raw.startsWith("v1.") ? decrypt(raw) : raw);
      const record = asRecord(parsed);
      if (record) return record;
    } catch {
      // Corrupt overlay — fall back to env so the owner is not locked out.
    }
  }
  return envRecord();
}

export async function saveOwnerPassword(
  username: string,
  passwordHash: string,
): Promise<void> {
  const record: OwnerRecord = {
    username: username.trim(),
    passwordHash,
    updatedAt: new Date().toISOString(),
  };
  await writeFile(
    CREDENTIALS_PATH,
    encrypt(JSON.stringify(record)),
    "Update admin credentials",
  );
}
