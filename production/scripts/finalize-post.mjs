import { copyFileSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const args = process.argv.slice(2);
const postArgument = args[args.indexOf("--post") + 1];
if (!postArgument) {
  console.error("Koristi: node production/scripts/finalize-post.mjs --post productions/GGGG/MM/<id>");
  process.exit(1);
}

const postDirectory = resolve(postArgument);
const inputPath = resolve(postDirectory, "input.json");
if (!existsSync(inputPath)) {
  console.error("input.json ne postoji za navedeni paket.");
  process.exit(1);
}
const input = JSON.parse(readFileSync(inputPath, "utf8"));
const workflow = input?.workflow;
const approvals = ["text-and-feed", "story", "video"];
if (workflow?.currentStep !== "finalization" || approvals.some((step) => workflow.steps?.[step]?.status !== "approved")) {
  console.error("Finalizacija je blokirana dok korisnik ne odobri tekst i Feed, Story, pa video, tim redosledom.");
  process.exit(1);
}

const exports = [
  ["generated/caption.md", "final/caption.md"],
  ["generated/feed-1080x1350.png", "final/feed-1080x1350.png"],
  ["generated/story-1080x1920.png", "final/story-1080x1920.png"],
  ["generated/reels-1080x1920.mp4", "final/reels-1080x1920.mp4"],
];
const missing = exports.map(([source]) => source).filter((source) => !existsSync(resolve(postDirectory, source)));
if (missing.length > 0) {
  console.error(`Finalizacija je blokirana. Nedostaju: ${missing.join(", ")}.`);
  process.exit(1);
}
for (const [source, target] of exports) copyFileSync(resolve(postDirectory, source), resolve(postDirectory, target));
workflow.steps.finalization = { status: "completed", finalizedAt: new Date().toISOString() };
workflow.currentStep = "completed";
input.workflow = workflow;
writeFileSync(inputPath, `${JSON.stringify(input, null, 2)}\n`);
console.log("Finalizacija završena. Artefakti iz generated/ kopirani su u final/.");
