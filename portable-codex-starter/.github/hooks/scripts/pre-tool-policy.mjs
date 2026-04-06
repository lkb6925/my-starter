import {
  appendJsonl,
  collectStrings,
  detectCommandPreview,
  inferToolName,
  readStdin,
  safeParseJson,
} from "./common.mjs";

const raw = await readStdin();
const parsed = safeParseJson(raw);
const toolName = inferToolName(parsed ?? {});
const preview = detectCommandPreview(raw, parsed);

const shellishTool = /^(bash|shell|terminal|runCommands?)$/i.test(toolName);

if (!shellishTool) {
  appendJsonl("policy.jsonl", {
    ts: new Date().toISOString(),
    action: "allow",
    tool: toolName,
    reason: "non-shell tool",
    preview,
  });
  process.exit(0);
}

const haystack = [raw, ...collectStrings(parsed)].join("\n").toLowerCase();

const denyRules = [
  {
    name: "git-reset-hard",
    pattern: /\bgit\s+reset\s+--hard\b/,
    reason: "avoid destructive history rewrites from the agent layer",
  },
  {
    name: "git-clean-force",
    pattern: /\bgit\s+clean\s+-f[dix]*\b/,
    reason: "avoid deleting untracked files without an explicit human decision",
  },
  {
    name: "git-checkout-discard",
    pattern: /\bgit\s+checkout\s+--\b/,
    reason: "avoid discarding local changes through checkout restore syntax",
  },
  {
    name: "git-push-force",
    pattern: /\bgit\s+push\b[^\n]*\s(--force(?:-with-lease)?|-f)\b/,
    reason: "avoid force-pushing from automated agent execution",
  },
  {
    name: "root-rm-rf",
    pattern: /\brm\s+-rf\s+\/($|[\s"'])|\bsudo\s+rm\s+-rf\s+\/($|[\s"'])/,
    reason: "block clearly destructive root-level deletion",
  },
  {
    name: "system-disk-commands",
    pattern: /\b(mkfs|fdisk|shutdown|reboot)\b/,
    reason: "block system-destructive or session-ending commands",
  },
];

const denied = denyRules.find((rule) => rule.pattern.test(haystack));

if (denied) {
  appendJsonl("policy.jsonl", {
    ts: new Date().toISOString(),
    action: "deny",
    tool: toolName,
    rule: denied.name,
    reason: denied.reason,
    preview,
  });

  console.error(`[copilot-policy] Blocked shell command: ${denied.reason}.`);
  process.exit(2);
}

appendJsonl("policy.jsonl", {
  ts: new Date().toISOString(),
  action: "allow",
  tool: toolName,
  preview,
});
