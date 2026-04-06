import { cp, mkdir, stat } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packRoot = resolve(__dirname, "..");

const args = parseArgs(process.argv.slice(2));
const target = resolve(args.target || process.cwd());
const skillsRoot = args["skills-root"] || ".agents";
const withConfig = Boolean(args["with-config"]);

await ensureDir(target);
await copyInto(join(packRoot, "AGENTS.md"), join(target, "AGENTS.md"));
await copyTree(join(packRoot, ".codex", "agents"), join(target, ".codex", "agents"));

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
  try {
    await stat(join(target, ".codex", "config.toml"));
  } catch {
    await copyInto(
      join(packRoot, ".codex", "config.toml"),
      join(target, ".codex", "config.toml"),
    );
  }
}

console.log(`Installed portable starter into ${target}`);

function parseArgs(argv) {
  const parsed = {};
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (!arg.startsWith("--")) continue;
    const key = arg.slice(2);
    const next = argv[index + 1];
    if (!next || next.startsWith("--")) {
      parsed[key] = true;
      continue;
    }
    parsed[key] = next;
    index += 1;
  }
  return parsed;
}

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
