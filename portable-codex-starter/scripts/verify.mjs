import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const root = resolve(process.cwd());
const tempTarget = mkdtempSync(join(tmpdir(), "portable-codex-starter-"));

try {
  exec("node", ["scripts/generate-agents.mjs"], root);
  exec("node", ["scripts/install.mjs", "--target", tempTarget, "--with-config"], root);
  exec("node", ["scripts/doctor.mjs", "--target", tempTarget], root);
  console.log(`\nVerification succeeded. Smoke target: ${tempTarget}`);
} finally {
  rmSync(tempTarget, { recursive: true, force: true });
}

function exec(command, args, cwd) {
  execFileSync(command, args, {
    cwd,
    stdio: "inherit",
  });
}
