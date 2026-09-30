import fs from "node:fs";
import vm from "node:vm";
import { execFileSync } from "node:child_process";

const requiredFiles = [
  "worker.js",
  "wrangler.toml",
  "package.json",
  "public/index.html",
  "public/amon-supabase.js",
  "amon-owner.js",
  "amon-rules.js"
];

let failed = false;

for (const file of requiredFiles) {
  if (!fs.existsSync(file)) {
    failed = true;
    console.error("FAIL missing file:", file);
  } else {
    console.log("PASS file:", file);
  }
}

const workerText = fs.existsSync("worker.js") ? fs.readFileSync("worker.js", "utf8") : "";
const requiredStageAContracts = [
  "inferAMONTaskProfile",
  "secondaryTaskTypes",
  "needsExternalVerification",
  "needsCurrentVerification",
  "explicitConstraints",
  "outputFormat",
  "confidence",
  "complexity",
  "risk",
  "extractTaskEntities",
  "decision",
  "executionPlan",
  "successCriteria",
  "temporalScope",
  "geographicScope",
  "privacySensitive",
  "extractAIResponse",
  "_amonText",
  "AI_EMPTY_RESPONSE"
];
for (const contract of requiredStageAContracts) {
  if (!workerText.includes(contract)) {
    failed = true;
    console.error("FAIL Stage A contract:", contract);
  } else {
    console.log("PASS Stage A contract:", contract);
  }
}

if (/async\\s+async\\s+async|async\\s+async\\s+function\\s+runStageBReasoning/.test(workerText)) {
  failed = true;
  console.error("FAIL Stage B: duplicate async declaration detected");
} else {
  console.log("PASS Stage B: no duplicate async declaration");
}

if (!/async function runStageBReasoning\s*\(/.test(workerText)) {
  failed = true;
  console.error("FAIL Stage B: runStageBReasoning must be async because it awaits AI paths");
} else {
  console.log("PASS Stage B: async council orchestration");
}

if (/function runStageBReasoning\s*\([^)]*\)\s*\{[\s\S]*?await /.test(workerText)) {
  failed = true;
  console.error("FAIL Stage B: await used in non-async reasoning function");
} else {
  console.log("PASS Stage B: no invalid await pattern");
}

const syntaxFiles = [
  "worker.js",
  "amon-owner.js",
  "public/amon-supabase.js",
  "amon-rules.js"
];

for (const file of syntaxFiles) {
  if (!fs.existsSync(file)) continue;
  try {
    execFileSync(process.execPath, ["--check", file], { stdio: "pipe" });
    console.log("PASS syntax:", file);
  } catch (error) {
    failed = true;
    const detail =
      error?.stderr?.toString() ||
      error?.stdout?.toString() ||
      error.message;
    console.error("FAIL syntax:", file, detail);
  }
}

if (fs.existsSync("public/index.html")) {
  const html = fs.readFileSync("public/index.html", "utf8");
  const scripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)]
    .map((m) => m[1])
    .filter(Boolean);

  console.log("Found inline scripts:", scripts.length);

  for (let i = 0; i < scripts.length; i++) {
    try {
      new vm.Script(scripts[i], {
        filename: `public/index.html#script-${i + 1}`
      });
      console.log("PASS inline:", `public/index.html#script-${i + 1}`);
    } catch (error) {
      failed = true;
      console.error(
        "FAIL inline:",
        `public/index.html#script-${i + 1}`,
        error.message
      );
    }
  }
}

if (fs.existsSync("wrangler.toml")) {
  const wrangler = fs.readFileSync("wrangler.toml", "utf8");

  if (!/^\s*main\s*=\s*"worker\.js"\s*$/m.test(wrangler)) {
    failed = true;
    console.error("FAIL wrangler: main must point to worker.js");
  } else {
    console.log("PASS wrangler: main -> worker.js");
  }

  if (!/^\s*directory\s*=\s*"\.\/public"\s*$/m.test(wrangler)) {
    failed = true;
    console.error("FAIL wrangler: assets directory must be ./public");
  } else {
    console.log("PASS wrangler: assets -> ./public");
  }
}

process.exitCode = failed ? 1 : 0;
