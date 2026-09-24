/**
 * Content store for the "Git is the database" model.
 *
 * When GITHUB_TOKEN (+ owner/repo) is configured, reads/writes go through the
 * GitHub REST API against the live repo — so the admin panel sees freshly
 * committed drafts immediately, and "approve" commits to `main` (which the host
 * redeploys). With no token configured (local dev), it transparently falls back
 * to the local filesystem so the whole flow is testable offline.
 *
 * Server-only: holds the write token and must never reach the client bundle.
 */
import "server-only";
import fs from "node:fs/promises";
import path from "node:path";

const TOKEN = process.env.GITHUB_TOKEN;
const OWNER = process.env.GITHUB_OWNER;
const REPO = process.env.GITHUB_REPO;
const BRANCH = process.env.GITHUB_BRANCH || "main";
const API = "https://api.github.com";

export const usingGitHub = Boolean(TOKEN && OWNER && REPO);

interface FileContent {
  text: string;
  /** GitHub blob sha (needed to update); absent in local mode. */
  sha?: string;
}

function ghHeaders() {
  return {
    Authorization: `Bearer ${TOKEN}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

// Local-dev fallback only (no GitHub token). Dynamic path is intentional.
const abs = (repoPath: string) =>
  path.join(/*turbopackIgnore: true*/ process.cwd(), repoPath);

/* ---------------------------- read ---------------------------- */

export async function readFile(repoPath: string): Promise<FileContent | null> {
  if (!usingGitHub) {
    try {
      return { text: await fs.readFile(abs(repoPath), "utf8") };
    } catch {
      return null;
    }
  }
  const res = await fetch(
    `${API}/repos/${OWNER}/${REPO}/contents/${repoPath}?ref=${BRANCH}`,
    { headers: ghHeaders(), cache: "no-store" },
  );
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub read ${repoPath} failed: ${res.status}`);
  const json = (await res.json()) as { content: string; sha: string };
  return {
    text: Buffer.from(json.content, "base64").toString("utf8"),
    sha: json.sha,
  };
}

export async function listDir(repoPath: string): Promise<string[]> {
  if (!usingGitHub) {
    try {
      return await fs.readdir(abs(repoPath));
    } catch {
      return [];
    }
  }
  const res = await fetch(
    `${API}/repos/${OWNER}/${REPO}/contents/${repoPath}?ref=${BRANCH}`,
    { headers: ghHeaders(), cache: "no-store" },
  );
  if (res.status === 404) return [];
  if (!res.ok) throw new Error(`GitHub list ${repoPath} failed: ${res.status}`);
  const json = (await res.json()) as { name: string; type: string }[];
  return json.filter((e) => e.type === "file").map((e) => e.name);
}

/* ---------------------------- write ---------------------------- */

/** Create or update a single file. Fetches the current sha first (github). */
export async function writeFile(
  repoPath: string,
  text: string,
  message: string,
): Promise<void> {
  if (!usingGitHub) {
    await fs.mkdir(path.dirname(abs(repoPath)), { recursive: true });
    await fs.writeFile(abs(repoPath), text, "utf8");
    return;
  }
  const existing = await readFile(repoPath);
  const res = await fetch(`${API}/repos/${OWNER}/${REPO}/contents/${repoPath}`, {
    method: "PUT",
    headers: { ...ghHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      content: Buffer.from(text, "utf8").toString("base64"),
      branch: BRANCH,
      ...(existing?.sha ? { sha: existing.sha } : {}),
    }),
  });
  if (!res.ok) throw new Error(`GitHub write ${repoPath} failed: ${res.status}`);
}

/** Delete a single file (no-op if it doesn't exist). */
export async function deleteFile(
  repoPath: string,
  message: string,
): Promise<void> {
  if (!usingGitHub) {
    await fs.rm(abs(repoPath), { force: true });
    return;
  }
  const existing = await readFile(repoPath);
  if (!existing?.sha) return; // already gone
  const res = await fetch(`${API}/repos/${OWNER}/${REPO}/contents/${repoPath}`, {
    method: "DELETE",
    headers: { ...ghHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({ message, sha: existing.sha, branch: BRANCH }),
  });
  if (!res.ok)
    throw new Error(`GitHub delete ${repoPath} failed: ${res.status}`);
}

/** Commit several files atomically (used by the generator: post + backlog). */
export async function commitFiles(
  files: { path: string; text: string }[],
  message: string,
): Promise<void> {
  if (!usingGitHub) {
    for (const f of files) await writeFile(f.path, f.text, message);
    return;
  }
  const base = `${API}/repos/${OWNER}/${REPO}`;
  const gh = async (url: string, init?: RequestInit) => {
    const res = await fetch(url, {
      ...init,
      headers: { ...ghHeaders(), "Content-Type": "application/json" },
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`GitHub ${url} failed: ${res.status}`);
    return res.json();
  };

  const ref = await gh(`${base}/git/ref/heads/${BRANCH}`);
  const baseCommitSha = ref.object.sha as string;
  const baseCommit = await gh(`${base}/git/commits/${baseCommitSha}`);
  const baseTreeSha = baseCommit.tree.sha as string;

  const tree = await Promise.all(
    files.map(async (f) => {
      const blob = await gh(`${base}/git/blobs`, {
        method: "POST",
        body: JSON.stringify({ content: f.text, encoding: "utf-8" }),
      });
      return { path: f.path, mode: "100644", type: "blob", sha: blob.sha };
    }),
  );

  const newTree = await gh(`${base}/git/trees`, {
    method: "POST",
    body: JSON.stringify({ base_tree: baseTreeSha, tree }),
  });
  const newCommit = await gh(`${base}/git/commits`, {
    method: "POST",
    body: JSON.stringify({
      message,
      tree: newTree.sha,
      parents: [baseCommitSha],
    }),
  });
  await gh(`${base}/git/refs/heads/${BRANCH}`, {
    method: "PATCH",
    body: JSON.stringify({ sha: newCommit.sha }),
  });
}
