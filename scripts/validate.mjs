import fs from "node:fs";
import vm from "node:vm";
import { execFileSync } from "node:child_process";

const files = [
  "worker.js",
  "amon-owner.js",
  "public/amon-supabase.js"
];

let failed = false;

for (const file of files) {
  try {
    execFileSync(process.execPath, ["--check", file], { stdio: "pipe" });
    console.log("PASS", file);
  } catch (error) {
    failed = true;
    const detail = error?.stderr?.toString() || error?.stdout?.toString() || error.message;
    console.error("FAIL", file, detail);
  }
}

const html = fs.readFileSync("public/index.html", "utf8");
const scripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)]
  .map((m) => m[1])
  .filter(Boolean);

console.log("Found inline scripts:", scripts.length);

for (let i = 0; i < scripts.length; i++) {
  try {
    new vm.Script(scripts[i], { filename: `public/index.html#script-${i + 1}` });
    console.log("PASS public/index.html#script-" + (i + 1));
  } catch (error) {
    failed = true;
    console.error("FAIL public/index.html#script-" + (i + 1), error.message);
  }
}

process.exitCode = failed ? 1 : 0;
