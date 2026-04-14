import { cp, mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "./lib/cli-utils.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packRoot = resolve(__dirname, "..");

const args = parseArgs(process.argv.slice(2));
const target = resolve(args.target || process.cwd());
const skillsRoot = args["skills-root"] || ".agents";
const withConfig = Boolean(args["with-config"]);
const coreOnly = Boolean(args["core-only"]);

await ensureDir(target);
await copyInto(join(packRoot, "AGENTS.md"), join(target, "AGENTS.md"));
await copyTree(join(packRoot, ".codex", "agents"), join(target, ".codex", "agents"));
await copyTree(join(packRoot, ".omx"), join(target, ".omx"));
await copyInto(join(packRoot, "README.md"), join(target, ".codex", "starter-docs", "README.md"));
await copyTree(join(packRoot, "docs"), join(target, ".codex", "starter-docs", "docs"));
await mergeGitignore(join(packRoot, ".gitignore"), join(target, ".gitignore"));

if (skillsRoot === ".agents" || skillsRoot === "both") {
  await copyTree(join(packRoot, ".agents", "skills"), join(target, ".agents", "skills"));
}

if (skillsRoot === ".codex" || skillsRoot === "both") {
  await copyTree(join(packRoot, ".agents", "skills"), join(target, ".codex", "skills"));
}

if (withConfig) {
  await copyInto(
    join(packRoot, ".codex", "config.toml.example"),
    join(target, ".codex", "config.toml.example"),
  );
  await copyInto(
    join(packRoot, ".codex", "mcp-servers.example.toml"),
    join(target, ".codex", "mcp-servers.example.toml"),
  );
  try {
    await stat(join(target, ".codex", "config.toml"));
  } catch {
    await copyInto(
      join(packRoot, ".codex", "config.toml"),
      join(target, ".codex", "config.toml"),
    );
  }
}

if (!coreOnly) {
  await copyTree(join(packRoot, ".devcontainer"), join(target, ".devcontainer"));
}

const modeLabel = coreOnly ? "core-only portable starter2" : "full portable starter2";
console.log(`Installed ${modeLabel} into ${target}`);

async function ensureDir(path) {
  await mkdir(path, { recursive: true });
}

async function copyInto(source, destination) {
  await mkdir(dirname(destination), { recursive: true });
  await cp(source, destination, { force: true });
}

async function copyTree(source, destination) {
  try {
    const info = await stat(source);
    if (!info.isDirectory()) {
      await copyInto(source, destination);
      return;
    }
  } catch {
    return;
  }
  await mkdir(dirname(destination), { recursive: true });
  await cp(source, destination, { recursive: true, force: true });
}

async function mergeGitignore(source, destination) {
  let sourceText = "";
  try {
    sourceText = await readFile(source, "utf8");
  } catch {
    return;
  }

  const sourceLines = sourceText
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  let destinationText = "";
  try {
    destinationText = await readFile(destination, "utf8");
  } catch {
    destinationText = "";
  }

  const destinationLines = new Set(
    destinationText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0),
  );

  const missingLines = sourceLines.filter((line) => !destinationLines.has(line));
  if (missingLines.length === 0) {
    return;
  }

  const separator = destinationText.length > 0 && !destinationText.endsWith("\n") ? "\n" : "";
  const prefix = destinationText.length > 0 ? "\n# portable-codex-starter2\n" : "";
  const merged = `${destinationText}${separator}${prefix}${missingLines.join("\n")}\n`;
  await mkdir(dirname(destination), { recursive: true });
  await writeFile(destination, merged, "utf8");
}
