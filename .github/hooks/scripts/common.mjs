import { appendFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const DEFAULT_LOG_DIR = join(process.cwd(), ".github", "hooks", "logs");

export async function readStdin() {
  return await new Promise((resolve) => {
    let raw = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk) => {
      raw += chunk;
    });
    process.stdin.on("end", () => resolve(raw));
    process.stdin.on("error", () => resolve(raw));
  });
}

export function safeParseJson(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function redactSecrets(value) {
  if (typeof value !== "string") return value;

  return value
    .replace(
      /\b([A-Z0-9_]*(?:TOKEN|SECRET|KEY|PASSWORD))=([^\s]+)/gi,
      (_, name) => `${name}=[REDACTED]`,
    )
    .replace(/\bgh[pousr]_[A-Za-z0-9_]+\b/g, "[REDACTED_GITHUB_TOKEN]")
    .replace(/\bsk-[A-Za-z0-9-_]+\b/g, "[REDACTED_OPENAI_KEY]");
}

export function normalizeWhitespace(value) {
  return redactSecrets(String(value)).replace(/\s+/g, " ").trim();
}

export function summarize(value, depth = 0) {
  if (depth > 2) return "[truncated]";
  if (value == null) return value;

  if (typeof value === "string") {
    return normalizeWhitespace(value).slice(0, 240);
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return value;
  }

  if (Array.isArray(value)) {
    return value.slice(0, 6).map((entry) => summarize(entry, depth + 1));
  }

  if (typeof value === "object") {
    const result = {};
    for (const [key, entry] of Object.entries(value).slice(0, 12)) {
      result[key] = summarize(entry, depth + 1);
    }
    return result;
  }

  return normalizeWhitespace(String(value)).slice(0, 240);
}

export function collectStrings(value, bucket = [], depth = 0) {
  if (depth > 4 || bucket.length >= 50 || value == null) return bucket;

  if (typeof value === "string") {
    const normalized = normalizeWhitespace(value);
    if (normalized) bucket.push(normalized);
    return bucket;
  }

  if (Array.isArray(value)) {
    for (const entry of value) {
      collectStrings(entry, bucket, depth + 1);
      if (bucket.length >= 50) break;
    }
    return bucket;
  }

  if (typeof value === "object") {
    for (const entry of Object.values(value)) {
      collectStrings(entry, bucket, depth + 1);
      if (bucket.length >= 50) break;
    }
  }

  return bucket;
}

export function inferToolName(value) {
  if (!value || typeof value !== "object") return "unknown";

  for (const key of ["tool", "toolName", "name", "commandName"]) {
    const candidate = value[key];
    if (typeof candidate === "string" && candidate.trim()) {
      return candidate.trim();
    }
  }

  if (value.tool && typeof value.tool === "object") {
    return inferToolName(value.tool);
  }

  return "unknown";
}

export function detectCommandPreview(raw, parsed) {
  const strings = [];
  if (typeof raw === "string" && raw.trim()) strings.push(normalizeWhitespace(raw));
  collectStrings(parsed, strings);

  const commandish = strings.find((entry) =>
    /\b(git|npm|cargo|node|bash|sh|rm|cp|mv|cat|ls|find|sed)\b/i.test(entry),
  );

  return (commandish || strings[0] || "").slice(0, 240);
}

export function appendJsonl(fileName, entry) {
  mkdirSync(DEFAULT_LOG_DIR, { recursive: true });
  appendFileSync(join(DEFAULT_LOG_DIR, fileName), `${JSON.stringify(entry)}\n`, "utf8");
}
