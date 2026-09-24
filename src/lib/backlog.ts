/**
 * Topic backlog store (content/_backlog.json) — the queue the AI generator
 * draws from. Read/append/write via the same content store as posts (GitHub in
 * prod, local-fs in dev). Server-only.
 */
import "server-only";
import { readFile, writeFile } from "@/lib/github";

export const BACKLOG_PATH = "content/_backlog.json";

export interface BacklogTopic {
  topic: string;
  notes?: string;
  used?: boolean;
}
export interface Backlog {
  topics: BacklogTopic[];
}

export async function readBacklog(): Promise<Backlog> {
  const f = await readFile(BACKLOG_PATH);
  if (!f) return { topics: [] };
  try {
    const j = JSON.parse(f.text) as Partial<Backlog>;
    return { topics: Array.isArray(j.topics) ? j.topics : [] };
  } catch {
    return { topics: [] };
  }
}

export function serializeBacklog(b: Backlog): string {
  return JSON.stringify(b, null, 2) + "\n";
}

export async function writeBacklog(b: Backlog, message: string): Promise<void> {
  await writeFile(BACKLOG_PATH, serializeBacklog(b), message);
}

export function unusedCount(b: Backlog): number {
  return b.topics.filter((t) => !t.used).length;
}

export function findQueuedTopic(
  b: Backlog,
  topic: string,
): BacklogTopic | undefined {
  return b.topics.find((t) => t.topic === topic && !t.used);
}

/**
 * Rename / restyle a queued (unused) topic. Rejects if the new title collides
 * with another entry (case-insensitive).
 */
export async function updateTopic(
  original: string,
  patch: { topic: string; notes?: string },
): Promise<void> {
  const b = await readBacklog();
  const i = b.topics.findIndex((t) => t.topic === original && !t.used);
  if (i < 0) throw new Error("Topic not found in the queue.");
  const topic = patch.topic.trim();
  if (!topic) throw new Error("Enter a topic");
  const clash = b.topics.some(
    (t, j) => j !== i && t.topic.trim().toLowerCase() === topic.toLowerCase(),
  );
  if (clash) throw new Error("That topic is already in the backlog");
  const notes = patch.notes?.trim();
  const next: BacklogTopic = { topic, used: false };
  if (notes) next.notes = notes;
  b.topics[i] = next;
  await writeBacklog(b, `Update backlog topic: ${topic}`);
}

/** Remove a queued (unused) topic. Used topics stay as history. */
export async function deleteTopic(topic: string): Promise<void> {
  const b = await readBacklog();
  const i = b.topics.findIndex((t) => t.topic === topic && !t.used);
  if (i < 0) throw new Error("Topic not found in the queue.");
  b.topics.splice(i, 1);
  await writeBacklog(b, `Remove backlog topic: ${topic}`);
}

/**
 * Append topics, skipping blanks and case-insensitive duplicates. Returns how
 * many were actually added.
 */
export async function addTopics(
  items: { topic: string; notes?: string }[],
): Promise<number> {
  const b = await readBacklog();
  const seen = new Set(b.topics.map((t) => t.topic.trim().toLowerCase()));
  let added = 0;
  for (const it of items) {
    const topic = it.topic?.trim();
    if (!topic || seen.has(topic.toLowerCase())) continue;
    seen.add(topic.toLowerCase());
    b.topics.push({
      topic,
      ...(it.notes?.trim() ? { notes: it.notes.trim() } : {}),
      used: false,
    });
    added += 1;
  }
  if (added > 0) await writeBacklog(b, `Add ${added} backlog topic(s)`);
  return added;
}
