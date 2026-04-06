import { cp, mkdir, readdir, readFile, writeFile } from "fs/promises";
import { dirname, join, resolve } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packRoot = resolve(__dirname, "..");
const repoRoot = resolve(packRoot, "..");

const sourcePromptsDir = join(repoRoot, "prompts");
const targetPromptsDir = join(packRoot, "prompt-sources");
const sourceSkillsDir = join(repoRoot, "skills");
const auditPath = join(packRoot, "docs", "sync-audit.json");

await mkdir(targetPromptsDir, { recursive: true });
await mkdir(dirname(auditPath), { recursive: true });

const promptFiles = (await readdir(sourcePromptsDir))
  .filter((name) => name.endsWith(".md"))
  .filter((name) => name !== "explore-harness.md")
  .sort((a, b) => a.localeCompare(b));

for (const file of promptFiles) {
  await cp(join(sourcePromptsDir, file), join(targetPromptsDir, file), {
    force: true,
  });
}

const skillDirs = (await readdir(sourceSkillsDir, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort((a, b) => a.localeCompare(b));

const audit = {
  generated_at: new Date().toISOString(),
  source_repo_root: repoRoot,
  source_prompts_dir: sourcePromptsDir,
  target_prompts_dir: targetPromptsDir,
  source_skills_dir: sourceSkillsDir,
  prompt_count: promptFiles.length,
  original_skill_count: skillDirs.length,
  prompts: [],
  original_skills: skillDirs,
};

for (const file of promptFiles) {
  const content = await readFile(join(targetPromptsDir, file), "utf8");
  const description = extractFrontmatterValue(content, "description");
  audit.prompts.push({
    file,
    role: file.replace(/\.md$/, ""),
    description,
  });
}

await writeFile(auditPath, JSON.stringify(audit, null, 2));
console.log(
  `Synced ${promptFiles.length} prompt files and recorded ${skillDirs.length} upstream skills in the audit`,
);

function extractFrontmatterValue(content, key) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return "";
  const line = match[1]
    .split("\n")
    .find((entry) => entry.trim().startsWith(`${key}:`));
  if (!line) return "";
  return line.replace(/^[^:]+:\s*/, "").replace(/^"(.*)"$/, "$1").trim();
}
