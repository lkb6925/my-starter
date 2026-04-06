import {
  appendJsonl,
  detectCommandPreview,
  inferToolName,
  readStdin,
  safeParseJson,
  summarize,
} from "./common.mjs";

const eventName = process.argv[2] || "event";
const raw = await readStdin();
const parsed = safeParseJson(raw);
const payload = parsed ?? (raw.trim() ? raw : null);

appendJsonl("audit.jsonl", {
  ts: new Date().toISOString(),
  event: eventName,
  tool: inferToolName(parsed ?? {}),
  preview: detectCommandPreview(raw, parsed),
  payload: summarize(payload),
});
