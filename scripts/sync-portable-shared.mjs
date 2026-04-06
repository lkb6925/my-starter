import { cp, mkdir, readFile, rm, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const repoRoot = resolve(__dirname, "..");
const starterRoot = join(repoRoot, "portable-codex-starter");
const checkOnly = process.argv.includes("--check");

const sharedFiles = [
  ".devcontainer/devcontainer.json",
  ".devcontainer/scripts/post-create.sh",
  ".github/hooks/copilot-policy.json",
  ".github/hooks/logs/.gitignore",
  ".github/hooks/scripts/common.mjs",
  ".github/hooks/scripts/hook-log.mjs",
  ".github/hooks/scripts/pre-tool-policy.mjs",
  ".github/workflows/copilot-setup-steps.yml",
];

const drifts = [];

for (const relPath of sharedFiles) {
  const source = join(starterRoot, relPath);
  const target = join(repoRoot, relPath);

  if (!existsSync(source)) {
    throw new Error(`Missing starter source file: ${source}`);
  }

  if (checkOnly) {
    const matches = await filesMatch(source, target);
    if (!matches) drifts.push(relPath);
    continue;
  }

  await mkdir(dirname(target), { recursive: true });
  await cp(source, target, { force: true });
  console.log(`Synced ${relPath}`);
}

if (checkOnly) {
  if (drifts.length > 0) {
    console.error("Portable shared layer drift detected:");
    for (const relPath of drifts) {
      console.error(`- ${relPath}`);
    }
    process.exitCode = 1;
  } else {
    console.log("Portable shared layer is in sync.");
  }
}

const staleArtifacts = [
  join(repoRoot, ".github", "hooks", "logs", "policy.jsonl"),
];

if (!checkOnly) {
  for (const artifact of staleArtifacts) {
    if (existsSync(artifact)) {
      await rm(artifact, { force: true });
      console.log(`Removed stale artifact ${artifact}`);
    }
  }
}

async function filesMatch(source, target) {
  try {
    const [sourceInfo, targetInfo] = await Promise.all([stat(source), stat(target)]);
    if (!sourceInfo.isFile() || !targetInfo.isFile()) return false;
    const [sourceText, targetText] = await Promise.all([
      readFile(source, "utf8"),
      readFile(target, "utf8"),
    ]);
    return sourceText === targetText;
  } catch {
    return false;
  }
}
