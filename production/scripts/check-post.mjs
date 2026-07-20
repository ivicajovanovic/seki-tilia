import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const args = process.argv.slice(2);
const postArgumentIndex = args.indexOf("--post");
const postArgument = postArgumentIndex === -1 ? undefined : args[postArgumentIndex + 1];

if (!postArgument) {
  console.error("Koristi: node production/scripts/check-post.mjs --post productions/GGGG/MM/001-GGGG-MM-DD-naziv");
  process.exit(1);
}

const postDirectory = resolve(postArgument);
const errors = [];
const warnings = [];
const readJson = (name) => {
  const path = resolve(postDirectory, name);
  if (!existsSync(path)) {
    errors.push(`Nedostaje ${name}.`);
    return null;
  }
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    errors.push(`${name} nije validan JSON.`);
    return null;
  }
};

const input = readJson("input.json");
const videoProps = readJson("video-props.json");
const reviewPath = resolve(postDirectory, "review.md");
const review = existsSync(reviewPath) ? readFileSync(reviewPath, "utf8") : "";
const captionPath = ["generated/caption.md", "final/caption.md"].map((file) => resolve(postDirectory, file)).find(existsSync);
const caption = captionPath ? readFileSync(captionPath, "utf8") : "";

if (input?.postType === null) errors.push("Nije odabran tip objave.");
if (input?.product === null && input?.postType !== "lokacija") warnings.push("Nije unet proizvod ili tema objave.");
if (input?.confirmedOffer && (input.confirmedOffer.price || input.confirmedOffer.discount) && !input.confirmedOffer.validUntil) {
  errors.push("Akcija ima cenu ili popust, ali nema potvrđen rok trajanja.");
}
if (input?.claims && !Array.isArray(input.claims)) errors.push("Polje claims mora biti niz tvrdnji sa izvorima.");
if (Array.isArray(input?.claims)) {
  for (const claim of input.claims) {
    if (!claim.text || !claim.source) errors.push("Svaka zdravstvena ili produktna tvrdnja mora imati tekst i izvor.");
  }
}

for (const field of ["eyebrow", "headline", "supportingText", "offerLabel", "cta"]) {
  if (!videoProps?.[field]?.trim()) errors.push(`video-props.json: prazno polje ${field}.`);
}

if (!caption) warnings.push("Caption još nije sačuvan u generated/caption.md ili final/caption.md.");
if (!review.includes("Status: SPREMNO ZA LJUDSKU PROVERU")) errors.push("review.md nema status SPREMNO ZA LJUDSKU PROVERU.");

const textToCheck = [
  JSON.stringify(input ?? {}),
  JSON.stringify(videoProps ?? {}),
  caption,
  review,
].join(" ").toLocaleLowerCase("sr-Latn-RS");

const prohibitedPatterns = [
  { pattern: /\bantibiotik\w*/u, reason: "pominjanje antibiotika" },
  { pattern: /\blekov?i?\b/u, reason: "pominjanje leka" },
  { pattern: /\bleči\w*|\bizleči\w*/u, reason: "tvrdnja o lečenju" },
  { pattern: /\bgarantuje\w*|\btrenutno rešava\w*/u, reason: "obećanje rezultata" },
  { pattern: /\bbezbedno za svakoga\b/u, reason: "apsolutna bezbednosna tvrdnja" },
  { pattern: /—/u, reason: "upotreba em crte" },
];

for (const { pattern, reason } of prohibitedPatterns) {
  if (pattern.test(textToCheck)) errors.push(`Blokirano: ${reason}.`);
}

for (const warning of warnings) console.warn(`UPOZORENJE: ${warning}`);
for (const error of errors) console.error(`BLOKADA: ${error}`);

if (errors.length > 0) process.exit(1);
console.log("PROVERA PROŠLA: paket je spreman za ljudsku proveru i pregled finalnih fajlova.");
