import fs from "node:fs";
import vm from "node:vm";

const files = [
  "worker.js",
  "amon-owner.js",
  "public/amon-supabase.js"
];

let failed = false;

function checkJs(file) {
  const source = fs.readFileSync(file, "utf8");
  try {
    if (file === "worker.js") {
      new vm.SourceTextModule(source);
    } else {
      new vm.Script(source, { filename: file });
    }
    console.log("PASS", file);
  } catch (error) {
    failed = true;
    console.error("FAIL", file, error.message);
  }
}

for (const file of files) checkJs(file);

const html = fs.readFileSync("public/index.html", "utf8");
const scripts = [...html.matchAll(/<script(?:\\s[^>]*)?>([\\s\\S]*?)<\\/script>/gi)].map((m) => m[1]).filter(Boolean);
console.log("PASS public/index.html inline scripts:", scripts.length);

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
