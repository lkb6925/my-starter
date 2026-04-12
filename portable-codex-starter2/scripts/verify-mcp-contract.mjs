import { readFile } from "node:fs/promises";
import { join } from "node:path";

const root = process.cwd();

const files = {
  config: join(root, ".codex", "config.toml"),
  configExample: join(root, ".codex", "config.toml.example"),
  mcpExample: join(root, ".codex", "mcp-servers.example.toml"),
  agents: join(root, "AGENTS.md"),
  readme: join(root, "README.md"),
  mcpGuide: join(root, "docs", "mcp-setup.md"),
  postgresReadonly: join(root, ".agents", "skills", "postgres-readonly", "SKILL.md"),
  schemaToMigration: join(root, ".agents", "skills", "schema-to-migration", "SKILL.md"),
};

const contents = Object.fromEntries(
  await Promise.all(
    Object.entries(files).map(async ([key, path]) => [key, await readFile(path, "utf8")]),
  ),
);

const checks = [
  {
    name: "config includes openaiDeveloperDocs",
    ok: /\[mcp_servers\.openaiDeveloperDocs\]/.test(contents.config),
  },
  {
    name: "config includes context7",
    ok: /\[mcp_servers\.context7\]/.test(contents.config),
  },
  {
    name: "config example includes openaiDeveloperDocs",
    ok: /\[mcp_servers\.openaiDeveloperDocs\]/.test(contents.configExample),
  },
  {
    name: "config example includes context7",
    ok: /\[mcp_servers\.context7\]/.test(contents.configExample),
  },
  {
    name: "MCP example includes OpenAPI placeholder",
    ok: /\[mcp_servers\.openapi\]/.test(contents.mcpExample),
  },
  {
    name: "MCP example includes Postgres placeholder",
    ok: /\[mcp_servers\.postgres\]/.test(contents.mcpExample),
  },
  {
    name: "AGENTS enforces MCP routing section",
    ok: /## MCP Routing/.test(contents.agents),
  },
  {
    name: "AGENTS prefers GitHub plugin over GitHub MCP",
    ok: /Prefer the GitHub plugin over a separate GitHub MCP/.test(contents.agents),
  },
  {
    name: "AGENTS includes Postgres read-only rule",
    ok: /Treat `Postgres MCP` as read-only schema inspection by default\./.test(contents.agents),
  },
  {
    name: "AGENTS includes migration-only DB change rule",
    ok: /generate migration code in the repo instead of mutating the database through MCP/.test(contents.agents),
  },
  {
    name: "README documents postgres-readonly",
    ok: /`postgres-readonly`/.test(contents.readme),
  },
  {
    name: "README documents schema-to-migration",
    ok: /`schema-to-migration`/.test(contents.readme),
  },
  {
    name: "MCP guide documents OpenAPI routing",
    ok: /`OpenAPI`/.test(contents.mcpGuide),
  },
  {
    name: "MCP guide documents Postgres safety",
    ok: /기본은 read-only 스키마 점검이다\./.test(contents.mcpGuide),
  },
  {
    name: "postgres-readonly skill forbids mutation",
    ok: /## Forbidden[\s\S]*`ALTER`/.test(contents.postgresReadonly),
  },
  {
    name: "schema-to-migration skill keeps Postgres MCP read-only",
    ok: /`Postgres MCP` is read-only here\./.test(contents.schemaToMigration),
  },
];

const failed = checks.filter((check) => !check.ok);

for (const check of checks) {
  console.log(`${check.ok ? "[OK]" : "[XX]"} ${check.name}`);
}

if (failed.length > 0) {
  console.error(`\nMCP contract verification failed: ${failed.length} issue(s).`);
  process.exit(1);
}

console.log("\nMCP contract verification passed.");
