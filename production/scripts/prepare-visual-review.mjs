import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(scriptDirectory, "../..");
const args = process.argv.slice(2);
const postIndex = args.indexOf("--post");
const postArgument = postIndex === -1 ? undefined : args[postIndex + 1];

if (!postArgument) {
  console.error("Koristi: node production/scripts/prepare-visual-review.mjs --post productions/GGGG/MM/001-GGGG-MM-DD-naziv");
  process.exit(1);
}

const postDirectory = resolve(postArgument);
const generatedDirectory = join(postDirectory, "generated");
const finalDirectory = join(postDirectory, "final");
const feedPath = join(finalDirectory, "feed-1080x1350.png");
const storyPath = join(finalDirectory, "story-1080x1920.png");
const reelsOfferPath = join(generatedDirectory, "reels-offer.png");
const reelsIntroPath = join(generatedDirectory, "reels-intro.png");
const reelsClosingPath = join(generatedDirectory, "reels-closing.png");
const reelsMp4Path = join(finalDirectory, "reels-1080x1920.mp4");
const draftPath = join(generatedDirectory, "feed-draft.png");
const inputPath = join(postDirectory, "input.json");
const propsPath = join(postDirectory, "video-props.json");
const directionPath = join(generatedDirectory, "design-direction.json");
const rendererPath = join(repositoryRoot, "video-renderer/src/Composition.tsx");
const rendererCssPath = join(repositoryRoot, "video-renderer/src/index.css");
const referenceManifestPath = join(repositoryRoot, "brand/design-references/references.json");
if (!existsSync(referenceManifestPath)) {
  console.error("Nedostaje brand/design-references/references.json.");
  process.exit(1);
}
const referenceManifest = JSON.parse(readFileSync(referenceManifestPath, "utf8"));
const referenceFiles = Array.isArray(referenceManifest?.approved) ? referenceManifest.approved : [];
if (referenceFiles.length === 0 || referenceFiles.some((file) => typeof file !== "string" || !/^[a-z0-9][a-z0-9-]*\.png$/.test(file))) {
  console.error("references.json mora sadržati neprazan niz bezbednih ASCII PNG identifikatora.");
  process.exit(1);
}
const referencePaths = referenceFiles.map((file) => join(repositoryRoot, "brand/design-references", file));
const comparisonPath = join(generatedDirectory, "reference-comparison.png");
const formatPath = join(generatedDirectory, "format-comparison.png");
const reviewPath = join(generatedDirectory, "quality-review.json");

for (const path of [feedPath, storyPath, reelsIntroPath, reelsOfferPath, reelsClosingPath, reelsMp4Path, draftPath, inputPath, propsPath, directionPath, rendererPath, rendererCssPath, referenceManifestPath, ...referencePaths]) {
  if (!existsSync(path)) {
    console.error(`Nedostaje fajl potreban za vizuelni pregled: ${relative(repositoryRoot, path)}`);
    process.exit(1);
  }
}

const runFfmpeg = (inputPaths, filter, outputPath) => {
  const ffmpegArgs = ["-y"];
  for (const path of inputPaths) ffmpegArgs.push("-i", path);
  ffmpegArgs.push("-filter_complex", filter, "-map", "[out]", "-frames:v", "1", outputPath);
  const result = spawnSync("ffmpeg", ffmpegArgs, { encoding: "utf8" });
  if (result.status !== 0) throw new Error(result.stderr.trim() || `ffmpeg nije napravio ${outputPath}`);
};

const comparisonInputs = [...referencePaths, feedPath];
const comparisonLabels = comparisonInputs.map((_, index) => `comparison${index}`);
const comparisonFilter = [
  ...comparisonInputs.map((_, index) => `[${index}:v]scale=360:450:force_original_aspect_ratio=decrease,pad=360:450:(ow-iw)/2:(oh-ih)/2:color=0xF7F5EC[${comparisonLabels[index]}]`),
  `${comparisonLabels.map((label) => `[${label}]`).join("")}hstack=inputs=${comparisonInputs.length}[out]`,
].join(";");
runFfmpeg(comparisonInputs, comparisonFilter, comparisonPath);

runFfmpeg(
  [feedPath, storyPath, reelsIntroPath, reelsOfferPath, reelsClosingPath],
  [
    "[0:v]scale=270:480:force_original_aspect_ratio=decrease,pad=270:480:(ow-iw)/2:(oh-ih)/2:color=0x0F1519[a]",
    "[1:v]scale=270:480:force_original_aspect_ratio=decrease,pad=270:480:(ow-iw)/2:(oh-ih)/2:color=0x0F1519[b]",
    "[2:v]scale=270:480:force_original_aspect_ratio=decrease,pad=270:480:(ow-iw)/2:(oh-ih)/2:color=0x0F1519[c]",
    "[3:v]scale=270:480:force_original_aspect_ratio=decrease,pad=270:480:(ow-iw)/2:(oh-ih)/2:color=0x0F1519[d]",
    "[4:v]scale=270:480:force_original_aspect_ratio=decrease,pad=270:480:(ow-iw)/2:(oh-ih)/2:color=0x0F1519[e]",
    "[a][b][c][d][e]hstack=inputs=5[out]",
  ].join(";"),
  formatPath,
);

const hash = (path) => createHash("sha256").update(readFileSync(path)).digest("hex");
const renderHashes = {
  feed: hash(feedPath),
  story: hash(storyPath),
  reelsOffer: hash(reelsOfferPath),
  reelsIntro: hash(reelsIntroPath),
  reelsClosing: hash(reelsClosingPath),
  reelsMp4: hash(reelsMp4Path),
  feedDraft: hash(draftPath),
  referenceComparison: hash(comparisonPath),
  formatComparison: hash(formatPath),
  input: hash(inputPath),
  videoProps: hash(propsPath),
  designDirection: hash(directionPath),
  renderer: hash(rendererPath),
  rendererCss: hash(rendererCssPath),
  referenceManifest: hash(referenceManifestPath),
  ...Object.fromEntries(referenceFiles.map((file, index) => [`reference:${file}`, hash(referencePaths[index])])),
};
const previous = existsSync(reviewPath) ? JSON.parse(readFileSync(reviewPath, "utf8")) : null;
const unchanged = previous && Object.entries(renderHashes).every(([key, value]) => previous.renderHashes?.[key] === value);
const emptyCriterion = { score: null, note: null };

const qualityReview = {
  version: 1,
  status: unchanged ? previous.status : "pending",
  evidence: {
    referenceComparison: "generated/reference-comparison.png",
    formatComparison: "generated/format-comparison.png",
  },
  renderHashes,
  criteria: unchanged ? previous.criteria : {
    compositionAndBalance: { ...emptyCriterion },
    hierarchyAndMobileImpact: { ...emptyCriterion },
    productIntegrationAndGrounding: { ...emptyCriterion },
    depthLightingAndFinish: { ...emptyCriterion },
    referenceLevelDistinctiveness: { ...emptyCriterion },
    formatAdaptation: { ...emptyCriterion },
    reelsDynamics: { ...emptyCriterion },
  },
  weakestArea: unchanged ? previous.weakestArea : null,
  revisionEvidence: unchanged ? previous.revisionEvidence : {
    issueFound: null,
    changeMade: null,
    before: "generated/feed-draft.png",
    after: "final/feed-1080x1350.png",
  },
  independentReview: unchanged ? previous.independentReview : {
    performed: false,
    reviewerId: null,
    method: null,
    rawArtifactOnly: false,
    verdict: null,
    notes: null,
  },
};

writeFileSync(reviewPath, `${JSON.stringify(qualityReview, null, 2)}\n`);
console.log(`Sačuvani dokazi poređenja i kvalitet-review: ${relative(repositoryRoot, reviewPath)}`);
console.log("Otvori obe comparison slike, oceni svaki kriterijum 1–5 i dokumentuj najmanje jednu stvarnu reviziju. Prag je 4/5 po kriterijumu.");
