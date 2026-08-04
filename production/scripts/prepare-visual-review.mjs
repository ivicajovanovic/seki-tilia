import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
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
const inputPath = join(postDirectory, "input.json");
const propsPath = join(postDirectory, "video-props.json");
const directionPath = join(generatedDirectory, "design-direction.json");
for (const path of [inputPath, propsPath, directionPath]) {
  if (!existsSync(path)) {
    console.error(`Nedostaje fajl potreban za vizuelni pregled: ${relative(repositoryRoot, path)}`);
    process.exit(1);
  }
}
const input = JSON.parse(readFileSync(inputPath, "utf8"));
const videoProps = JSON.parse(readFileSync(propsPath, "utf8"));
const supportedFormats = new Set(["feed", "story", "reels"]);
const supportedAudioTracks = new Set([
  "mp3/clear-path.mp3",
  "mp3/clear-path-ambient.mp3",
  "mp3/open-sky-drift.mp3",
  "mp3/open-sky-drift-chill.mp3",
  "mp3/paper-sun-parade.mp3",
  "mp3/paper-sun-parade-upbeat.mp3",
]);
const requestedFormats = Array.isArray(input?.requestedFormats) ? input.requestedFormats : [];
if (requestedFormats.length === 0 || requestedFormats.some((format) => !supportedFormats.has(format)) || new Set(requestedFormats).size !== requestedFormats.length) {
  console.error("input.requestedFormats mora biti neprazan niz jedinstvenih vrednosti feed, story i/ili reels.");
  process.exit(1);
}
const artifactsByFormat = {
  feed: [{ key: "feed", path: join(finalDirectory, "feed-1080x1350.png") }],
  story: [{ key: "story", path: join(finalDirectory, "story-1080x1920.png") }],
  reels: [
    { key: "reelsIntro", path: join(generatedDirectory, "reels-intro.png") },
    { key: "reelsOffer", path: join(generatedDirectory, "reels-offer.png") },
    { key: "reelsClosing", path: join(generatedDirectory, "reels-closing.png") },
    { key: "reelsMp4", path: join(finalDirectory, "reels-1080x1920.mp4"), comparison: false },
  ],
};
const requestedArtifacts = requestedFormats.flatMap((format) => artifactsByFormat[format]);
const comparisonArtifacts = requestedArtifacts.filter((artifact) => artifact.comparison !== false);
const primaryArtifact = comparisonArtifacts[0];
const revisionArtifact = requestedFormats.includes("feed")
  ? { key: "feedDraft", path: join(generatedDirectory, "feed-draft.png"), before: "generated/feed-draft.png", after: "final/feed-1080x1350.png" }
  : requestedFormats.includes("story")
    ? { key: "storyDraft", path: join(generatedDirectory, "story-draft.png"), before: "generated/story-draft.png", after: "final/story-1080x1920.png" }
    : { key: "reelsIntroDraft", path: join(generatedDirectory, "reels-intro-draft.png"), before: "generated/reels-intro-draft.png", after: "generated/reels-intro.png" };
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

const coreSystemPaths = [
  rendererPath,
  rendererCssPath,
  referenceManifestPath,
  join(repositoryRoot, "brand/brand-config.json"),
  join(repositoryRoot, "brand/color-palette.json"),
  join(repositoryRoot, "video-renderer/package.json"),
  join(repositoryRoot, "video-renderer/package-lock.json"),
  join(repositoryRoot, "logos/logo-tamniji.svg"),
  join(repositoryRoot, "logos/logo-svetliji.svg"),
  join(repositoryRoot, "video-renderer/public/assets/logo-tamniji.svg"),
  join(repositoryRoot, "video-renderer/public/assets/logo-svetliji.svg"),
];
if (requestedFormats.includes("reels") && !supportedAudioTracks.has(videoProps?.audioTrack)) {
  console.error("Reels zahteva važeći audioTrack iz video-renderer/public/mp3/.");
  process.exit(1);
}
const audioPath = requestedFormats.includes("reels") ? join(repositoryRoot, "video-renderer/public", videoProps.audioTrack) : null;
for (const path of [...requestedArtifacts.map((artifact) => artifact.path), revisionArtifact.path, inputPath, propsPath, directionPath, ...coreSystemPaths, ...(audioPath ? [audioPath] : []), ...referencePaths]) {
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

const comparisonInputs = [...referencePaths, primaryArtifact.path];
const comparisonLabels = comparisonInputs.map((_, index) => `comparison${index}`);
const comparisonFilter = [
  ...comparisonInputs.map((_, index) => `[${index}:v]scale=360:450:force_original_aspect_ratio=decrease,pad=360:450:(ow-iw)/2:(oh-ih)/2:color=0xF7F5EC[${comparisonLabels[index]}]`),
  `${comparisonLabels.map((label) => `[${label}]`).join("")}hstack=inputs=${comparisonInputs.length}[out]`,
].join(";");
runFfmpeg(comparisonInputs, comparisonFilter, comparisonPath);

const formatLabels = comparisonArtifacts.map((_, index) => `format${index}`);
const formatFilter = comparisonArtifacts.length === 1
  ? "[0:v]scale=270:480:force_original_aspect_ratio=decrease,pad=270:480:(ow-iw)/2:(oh-ih)/2:color=0x0F1519[out]"
  : [
    ...comparisonArtifacts.map((_, index) => `[${index}:v]scale=270:480:force_original_aspect_ratio=decrease,pad=270:480:(ow-iw)/2:(oh-ih)/2:color=0x0F1519[${formatLabels[index]}]`),
    `${formatLabels.map((label) => `[${label}]`).join("")}hstack=inputs=${comparisonArtifacts.length}[out]`,
  ].join(";");
runFfmpeg(
  comparisonArtifacts.map((artifact) => artifact.path),
  formatFilter,
  formatPath,
);

const hash = (path) => createHash("sha256").update(readFileSync(path)).digest("hex");
const fontDirectory = join(repositoryRoot, "video-renderer/public/assets");
const fontPaths = readdirSync(fontDirectory, { withFileTypes: true })
  .filter((entry) => entry.isFile() && /\.(?:woff2?|ttf|otf)$/i.test(entry.name))
  .map((entry) => join(fontDirectory, entry.name))
  .sort();
const renderHashes = {
  ...Object.fromEntries(requestedArtifacts.map((artifact) => [artifact.key, hash(artifact.path)])),
  [revisionArtifact.key]: hash(revisionArtifact.path),
  referenceComparison: hash(comparisonPath),
  formatComparison: hash(formatPath),
  input: hash(inputPath),
  videoProps: hash(propsPath),
  designDirection: hash(directionPath),
  renderer: hash(rendererPath),
  rendererCss: hash(rendererCssPath),
  referenceManifest: hash(referenceManifestPath),
  brandConfig: hash(join(repositoryRoot, "brand/brand-config.json")),
  colorPalette: hash(join(repositoryRoot, "brand/color-palette.json")),
  rendererPackage: hash(join(repositoryRoot, "video-renderer/package.json")),
  rendererPackageLock: hash(join(repositoryRoot, "video-renderer/package-lock.json")),
  "logoCanonical:logo-tamniji.svg": hash(join(repositoryRoot, "logos/logo-tamniji.svg")),
  "logoCanonical:logo-svetliji.svg": hash(join(repositoryRoot, "logos/logo-svetliji.svg")),
  "logoRenderer:logo-tamniji.svg": hash(join(repositoryRoot, "video-renderer/public/assets/logo-tamniji.svg")),
  "logoRenderer:logo-svetliji.svg": hash(join(repositoryRoot, "video-renderer/public/assets/logo-svetliji.svg")),
  ...Object.fromEntries(fontPaths.map((path) => [`font:${relative(repositoryRoot, path)}`, hash(path)])),
  ...(audioPath ? { [`audioTrack:${videoProps.audioTrack}`]: hash(audioPath) } : {}),
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
    ...(requestedFormats.includes("reels") ? { reelsDynamics: { ...emptyCriterion } } : {}),
  },
  weakestArea: unchanged ? previous.weakestArea : null,
  revisionEvidence: unchanged ? previous.revisionEvidence : {
    issueFound: null,
    changeMade: null,
    before: revisionArtifact.before,
    after: revisionArtifact.after,
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
