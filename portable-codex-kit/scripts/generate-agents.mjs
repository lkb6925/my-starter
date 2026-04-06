#!/usr/bin/env node

import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, join, parse } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packRoot = join(__dirname, "..");
const promptsDir = join(packRoot, "prompt-sources");
const agentsDir = join(packRoot, ".codex", "agents");

const ROLE_DESCRIPTIONS = new Map([
  ["analyst", "Requirements clarity, hidden constraints, acceptance criteria"],
  ["api-reviewer", "API contracts, compatibility, interface review"],
  ["architect", "System design, boundaries, interfaces, tradeoffs"],
  ["build-fixer", "Build, typecheck, and toolchain failure resolution"],
  ["code-reviewer", "Comprehensive code review across quality concerns"],
  ["code-simplifier", "Behavior-preserving cleanup and simplification"],
  ["critic", "Challenge weak plans, assumptions, and verification gaps"],
  ["debugger", "Root-cause analysis and regression isolation"],
  ["dependency-expert", "SDK, package, and dependency evaluation"],
  ["designer", "UI and interaction design with implementation awareness"],
  ["executor", "Direct implementation and end-to-end completion"],
  ["explore", "Fast repository mapping and read-only investigation"],
  ["git-master", "Git hygiene, branching, commits, rebasing"],
  ["information-architect", "Content structure, information design, taxonomy"],
  ["performance-reviewer", "Performance analysis and optimization review"],
  ["planner", "Execution planning and sequencing"],
  ["product-analyst", "Product framing, needs, constraints, outcomes"],
  ["product-manager", "Prioritization, scope, delivery decisions"],
  ["qa-tester", "Interactive verification and runtime behavior checks"],
  ["quality-reviewer", "Maintainability and defect-focused review"],
  ["quality-strategist", "Quality strategy and release readiness"],
  ["researcher", "Broad research and answer synthesis"],
  ["security-reviewer", "Security review and trust-boundary analysis"],
  ["sisyphus-lite", "Persistent executor for iterative implementation"],
  ["style-reviewer", "Naming, style, conventions, formatting review"],
  ["team-executor", "Execution-focused coordinator for multi-agent tasks"],
  ["team-orchestrator", "Multi-agent coordination and work partitioning"],
  ["test-engineer", "Test design, coverage, and failure isolation"],
  ["ux-researcher", "User experience evaluation and research framing"],
  ["verifier", "Claim validation, verification, completion evidence"],
  ["vision", "High-level direction and product vision synthesis"],
  ["writer", "Documentation, migration notes, user-facing writing"],
]);

const HIGH_REASONING = new Set([
  "architect",
  "build-fixer",
  "code-reviewer",
  "debugger",
  "designer",
  "executor",
  "git-master",
  "security-reviewer",
  "verifier",
]);

const LOW_REASONING = new Set(["explore", "qa-tester", "style-reviewer"]);

function stripFrontmatter(content) {
  const match = content.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/);
  return match ? content.slice(match[0].length).trim() : content.trim();
}

function sanitizePrompt(content) {
  const lines = stripFrontmatter(content).split(/\r?\n/);
  const out = [];

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith("<!-- OMX:")) continue;
    if (trimmed.includes(".omx/")) continue;
    if (/\bomx explore\b/i.test(trimmed)) continue;
    if (/\bomx sparkshell\b/i.test(trimmed)) continue;
    if (/\bralplan\b/i.test(trimmed)) continue;
    if (/\bralph\b/i.test(trimmed)) continue;
    if (/\bdeep-interview\b/i.test(trimmed)) continue;
    if (/\bOMX Explore\b/i.test(trimmed)) continue;
    if (trimmed.includes("{{ARGUMENTS}}")) continue;
    if (trimmed.includes("wrapWithPreamble")) continue;
    if (trimmed.includes("src/agents/preamble.ts")) continue;

    out.push(
      line
        .replaceAll("`omx`", "`Codex`")
        .replaceAll("OMX", "Codex")
        .replaceAll("omx", "codex"),
    );
  }

  return out.join("\n")
    .replace(/\bAskUserQuestion\b/g, "the user")
    .replace(/\bUse Write to save plans\./g, "Save plans where the current repository conventions expect them.")
    .replace(/\blsp_diagnostics(_directory)?\b/g, "available diagnostics tools")
    .replace(/\bast_grep_search\b/g, "structural search tools")
    .replace(/\bast_grep_replace\b/g, "structural editing tools")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function escapeTomlBasicString(value) {
  return value.replaceAll("\\", "\\\\").replaceAll('"', '\\"');
}

function escapeTomlMultiline(value) {
  return value.replace(/"{3,}/g, (match) => match.split("").join("\\"));
}

function resolveReasoning(roleName) {
  if (LOW_REASONING.has(roleName)) return "low";
  if (HIGH_REASONING.has(roleName)) return "high";
  return "medium";
}

async function main() {
  await mkdir(agentsDir, { recursive: true });

  const files = (await readdir(promptsDir))
    .filter((name) => name.endsWith(".md"))
    .sort((a, b) => a.localeCompare(b));

  let generated = 0;

  for (const file of files) {
    const roleName = parse(file).name;
    if (roleName === "explore-harness") continue;

    const promptPath = join(promptsDir, file);
    const raw = await readFile(promptPath, "utf-8");
    const sanitized = sanitizePrompt(raw);

    await writeFile(promptPath, `${sanitized}\n`);

    const description =
      ROLE_DESCRIPTIONS.get(roleName) ?? `${roleName} portable custom agent`;

    const toml = [
      `name = "${escapeTomlBasicString(roleName)}"`,
      `description = "${escapeTomlBasicString(description)}"`,
      'model = "gpt-5.4-mini"',
      `reasoning_effort = "${resolveReasoning(roleName)}"`,
      'developer_instructions = """',
      escapeTomlMultiline(sanitized),
      '"""',
      "",
    ].join("\n");

    await writeFile(join(agentsDir, `${roleName}.toml`), toml);
    generated += 1;
  }

  console.log(`Generated ${generated} agent TOML files in ${agentsDir}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
