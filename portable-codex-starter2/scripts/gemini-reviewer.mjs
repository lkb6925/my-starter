#!/usr/bin/env node

import { execSync } from "node:child_process";
import fs from "node:fs";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-pro";

if (!GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY is not set. Please export it.");
  process.exit(1);
}

function sh(cmd) {
  try {
    return execSync(cmd, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
  } catch (err) {
    return "";
  }
}

function getChangedFiles() {
  const out = sh("git diff --name-only HEAD");
  return out ? out.split("\n").filter(Boolean) : [];
}

function readFileSafe(path) {
  try {
    return fs.readFileSync(path, "utf8");
  } catch {
    return "";
  }
}

const diff = sh("git diff HEAD");
const changedFiles = getChangedFiles();

if (!diff.trim()) {
  console.log(JSON.stringify({ verdict: "pass", issues: [] }, null, 2));
  process.exit(0);
}

const fileContents = changedFiles.map((file) => ({
  file,
  content: readFileSafe(file).slice(0, 20000)
}));

const agentsMd = fs.existsSync("AGENTS.md") ? readFileSafe("AGENTS.md").slice(0, 12000) : "";

const systemPrompt = `
You are a brutally strict senior software architect with 15 years of experience reviewing production systems.
Review the provided code changes. Focus only on:
1. algorithm design and time/space complexity
2. architectural weaknesses
3. missing edge cases and exception handling
4. missing functionality implied by the implementation
5. maintainability risks

Rules:
- Never praise. Only report things that should be fixed.
- Be specific and harsh, but technically correct.
- Return ONLY valid JSON.
- If no meaningful issues exist, return {"verdict":"pass","issues":[]}

JSON format:
{
  "verdict": "pass" | "fail",
  "issues": [
    {
      "severity": "critical" | "high" | "medium" | "low",
      "category": "correctness" | "performance" | "architecture" | "edge-case",
      "file": "path/to/file",
      "reason": "why this is a problem",
      "fix": "specific fix direction"
    }
  ]
}
`;

const userPrompt = `
# Context (AGENTS.md)
${agentsMd || "(none)"}

# Changed files
${JSON.stringify(fileContents, null, 2)}

# Diff
${diff.slice(0, 120000)}
`;

const body = {
  contents: [{ role: "user", parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }],
  generationConfig: { temperature: 0.1, topP: 0.8, responseMimeType: "application/json" }
};

const resp = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
  { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }
);

if (!resp.ok) {
  const text = await resp.text();
  console.error(`Gemini API error: ${resp.status}\n${text}`);
  process.exit(1);
}

const data = await resp.json();
const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

try {
  const parsed = JSON.parse(text);
  console.log(JSON.stringify(parsed, null, 2));
} catch (err) {
  console.error("Failed to parse Gemini JSON response.", text);
  process.exit(1);
}
