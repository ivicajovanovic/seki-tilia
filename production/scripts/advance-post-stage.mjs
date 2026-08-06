import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const args = process.argv.slice(2);
const valueFor = (name) => {
  const index = args.indexOf(name);
  return index === -1 ? undefined : args[index + 1];
};
const postArgument = valueFor("--post");
const approvedStep = valueFor("--approve");
const report = valueFor("--report")?.trim();
const validSteps = ["text-and-feed", "story", "video"];

if (!postArgument || !approvedStep || !validSteps.includes(approvedStep) || !report) {
  console.error('Koristi: node production/scripts/advance-post-stage.mjs --post productions/GGGG/MM/<id> --approve text-and-feed|story|video --report "Jedna rečenica izveštaja."');
  process.exit(1);
}
if (report.split(/[.!?]+/u).filter(Boolean).length !== 1) {
  console.error("Izveštaj između koraka mora imati tačno jednu rečenicu.");
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
if (!workflow?.steps || workflow.currentStep !== approvedStep || !workflow.steps[approvedStep]) {
  console.error(`Paket nije u koraku ${approvedStep}. Sledeći dozvoljeni korak je ${workflow?.currentStep ?? "nepoznat"}.`);
  process.exit(1);
}

const requiredFiles = {
  "text-and-feed": ["generated/caption.md", "generated/feed-1080x1350.png"],
  story: ["generated/story-1080x1920.png"],
  video: ["generated/reels-1080x1920.mp4", "generated/reels-intro.png", "generated/reels-offer.png", "generated/reels-closing.png"],
};
const missing = requiredFiles[approvedStep].filter((file) => !existsSync(resolve(postDirectory, file)));
if (missing.length > 0) {
  console.error(`Korak ${approvedStep} ne može biti odobren. Nedostaju: ${missing.join(", ")}.`);
  process.exit(1);
}

workflow.steps[approvedStep] = { status: "approved", report, approvedAt: new Date().toISOString() };
workflow.currentStep = approvedStep === "text-and-feed" ? "story" : approvedStep === "story" ? "video" : "finalization";
input.workflow = workflow;
writeFileSync(inputPath, `${JSON.stringify(input, null, 2)}\n`);
console.log(`Odobren korak ${approvedStep}. Sledeći korak: ${workflow.currentStep}.`);
