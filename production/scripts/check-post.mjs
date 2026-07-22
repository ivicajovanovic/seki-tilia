import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { basename, extname, join, relative, resolve, sep } from "node:path";

const args = process.argv.slice(2);
const postArgumentIndex = args.indexOf("--post");
const postArgument = postArgumentIndex === -1 ? undefined : args[postArgumentIndex + 1];

if (!postArgument) {
  console.error("Koristi: node production/scripts/check-post.mjs --post productions/GGGG/MM/001-GGGG-MM-DD-naziv");
  process.exit(1);
}

const postDirectory = resolve(postArgument);
const repositoryRoot = resolve(postDirectory, "../../../../");
const errors = [];
const warnings = [];
const supportedFamilies = new Set(["product-atelier", "editorial-split", "minimal-offer", "product-card", "premium-product-stage", "offer-orbit", "type-stage", "gallery-shelf"]);
const supportedImageBackgrounds = new Set(["transparent", "opaque"]);
const supportedContentApproaches = new Set(["offer-first", "product-context", "routine-moment", "practical-guidance", "seasonal-context", "local-availability", "professional-prompt"]);
const supportedDesignInterventions = new Set(["reading-order", "product-placement", "offer-treatment", "scene-depth", "image-crop", "type-composition", "cta-footer", "icon-role", "motion-rhythm"]);
const supportedMotionTreatments = new Set(["staged-reveal", "offer-build", "detail-cutaway", "editorial-pan", "location-close"]);
const supportedProductShapes = new Set(["wide", "compact", "tall"]);
const supportedOfferKinds = new Set(["deadline", "price", "discount", "bundle", "gift", "none"]);
const approvedAssetStatuses = new Set(["approved", "approved-with-limitations"]);
const requiredAssetManualChecks = ["inspectedOnLightAndDark", "noCursorOrUiArtifacts", "cleanCutoutEdges", "packagingUndistorted", "productIdentityVerifiable"];
const requiredValidatedRenders = [
  "final/feed-1080x1350.png",
  "final/story-1080x1920.png",
  "generated/reels-intro.png",
  "generated/reels-offer.png",
  "generated/reels-closing.png",
];
const requiredQualityCriteria = ["compositionAndBalance", "hierarchyAndMobileImpact", "productIntegrationAndGrounding", "depthLightingAndFinish", "referenceLevelDistinctiveness", "formatAdaptation", "reelsDynamics"];
const imageExtensions = new Set([".png", ".jpg", ".jpeg", ".webp"]);
const hashFile = (path) => createHash("sha256").update(readFileSync(path)).digest("hex");
const inside = (root, path) => path === root || path.startsWith(`${root}${sep}`);
const probeMedia = (path) => {
  const result = spawnSync("ffprobe", ["-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height,nb_frames,duration:format=duration", "-of", "json", path], { encoding: "utf8" });
  if (result.status !== 0) return null;
  const parsed = JSON.parse(result.stdout);
  return { ...parsed.streams?.[0], formatDuration: parsed.format?.duration };
};
const inspectVisualMetadata = (path) => {
  const media = probeMedia(path);
  const width = Number(media?.width);
  const height = Number(media?.height);
  if (!width || !height) return null;
  const raw = spawnSync("ffmpeg", ["-v", "error", "-i", path, "-frames:v", "1", "-f", "rawvideo", "-pix_fmt", "rgba", "pipe:1"], {
    encoding: null,
    maxBuffer: width * height * 4 + 1024 * 1024,
  });
  if (raw.status !== 0 || raw.stdout.length < width * height * 4) return null;
  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;
  let transparentPixels = 0;
  for (let index = 0; index < width * height; index += 1) {
    const alpha = raw.stdout[index * 4 + 3];
    if (alpha === 0) transparentPixels += 1;
    if (alpha < 16) continue;
    const x = index % width;
    const y = Math.floor(index / width);
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  }
  const alphaBounds = maxX === -1 ? null : { x: minX, y: minY, width: maxX - minX + 1, height: maxY - minY + 1 };
  return {
    width,
    height,
    transparentRatio: transparentPixels / (width * height),
    alphaBounds,
    visiblePixelsTouchEdge: alphaBounds ? alphaBounds.x === 0 || alphaBounds.y === 0 || alphaBounds.x + alphaBounds.width === width || alphaBounds.y + alphaBounds.height === height : false,
  };
};
const shapeFromMetadata = (metadata) => {
  const width = metadata?.alphaBounds?.width ?? metadata?.width;
  const height = metadata?.alphaBounds?.height ?? metadata?.height;
  if (!width || !height) return null;
  const ratio = width / height;
  return ratio > 1.12 ? "wide" : ratio < 0.82 ? "tall" : "compact";
};
const validIsoDate = (value) => typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));

const readJson = (path, label) => {
  if (!existsSync(path)) {
    errors.push(`Nedostaje ${label}.`);
    return null;
  }
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    errors.push(`${label} nije validan JSON.`);
    return null;
  }
};

const input = readJson(resolve(postDirectory, "input.json"), "input.json");
const videoProps = readJson(resolve(postDirectory, "video-props.json"), "video-props.json");
const designDirection = readJson(resolve(postDirectory, "generated/design-direction.json"), "generated/design-direction.json");
const assetReview = readJson(resolve(postDirectory, "generated/asset-review.json"), "generated/asset-review.json");
const qualityReview = readJson(resolve(postDirectory, "generated/quality-review.json"), "generated/quality-review.json");
const reviewPath = resolve(postDirectory, "review.md");
const review = existsSync(reviewPath) ? readFileSync(reviewPath, "utf8") : "";
const visualDesignSkillPath = resolve(repositoryRoot, "agent-skills-required/visual-design/SKILL.md");
const captionPath = ["final/caption.md", "generated/caption.md"].map((file) => resolve(postDirectory, file)).find(existsSync);
const caption = captionPath ? readFileSync(captionPath, "utf8") : "";

const getDesignRecords = () => {
  const records = [];
  const history = readJson(resolve(repositoryRoot, "brand/design-history.json"), "brand/design-history.json");
  if (Array.isArray(history?.records)) records.push(...history.records);

  const productionsDirectory = resolve(repositoryRoot, "productions");
  if (!existsSync(productionsDirectory)) return records;
  for (const year of readdirSync(productionsDirectory, { withFileTypes: true })) {
    if (!year.isDirectory()) continue;
    const yearDirectory = join(productionsDirectory, year.name);
    for (const month of readdirSync(yearDirectory, { withFileTypes: true })) {
      if (!month.isDirectory()) continue;
      const monthDirectory = join(yearDirectory, month.name);
      for (const post of readdirSync(monthDirectory, { withFileTypes: true })) {
        if (!post.isDirectory() || post.name === basename(postDirectory)) continue;
        const directionPath = join(monthDirectory, post.name, "generated/design-direction.json");
        if (!existsSync(directionPath)) continue;
        try {
          const direction = JSON.parse(readFileSync(directionPath, "utf8"));
          const postInputPath = join(monthDirectory, post.name, "input.json");
          const postInput = existsSync(postInputPath) ? JSON.parse(readFileSync(postInputPath, "utf8")) : null;
          if (direction?.signature) records.push({
            id: post.name,
            signature: direction.signature,
            contentApproach: postInput?.contentApproach,
            designInterventionKey: Array.isArray(direction?.designInterventions) ? [...direction.designInterventions].sort().join("|") : null,
            motionTreatment: direction?.motionTreatment
          });
        } catch {
          warnings.push(`Preskočen je neispravan design-direction.json u paketu ${post.name}.`);
        }
      }
    }
  }
  return records;
};

if (input?.postType === null) errors.push("Nije odabran tip objave.");
if (input?.product === null && input?.postType !== "lokacija") warnings.push("Nije unet proizvod ili tema objave.");
if (!supportedContentApproaches.has(input?.contentApproach)) errors.push("input.json mora imati podržan contentApproach za svež sadržajni ugao.");
if (!input?.copyFreshnessNote?.trim()) errors.push("input.json nema copyFreshnessNote sa stvarnom razlikom u odnosu na poslednje tri objave.");
if (Array.isArray(input?.blockingMissingFacts) && input.blockingMissingFacts.length > 0) {
  errors.push(`Paket ima blokirajuće nedostajuće podatke: ${input.blockingMissingFacts.join(", ")}.`);
}
if (!Array.isArray(input?.blockingMissingFacts)) errors.push("input.json mora imati niz blockingMissingFacts.");
if (input?.postType === "akcija") {
  const offer = input?.confirmedOffer;
  if (!supportedOfferKinds.has(offer?.mechanic) || ["deadline", "none"].includes(offer?.mechanic) || !offer?.value?.trim() || !validIsoDate(offer?.validUntil) || !offer?.source?.trim()) {
    errors.push("Objava tipa akcija zahteva potvrđenu mehaniku, prikazivu vrednost, rok i izvor. Sam rok nije akcijska mehanika.");
  }
  if (offer?.value?.trim()) {
    const actionCopy = `${JSON.stringify(videoProps ?? {})} ${caption}`.toLocaleLowerCase("sr-Latn-RS");
    if (!actionCopy.includes(offer.value.trim().toLocaleLowerCase("sr-Latn-RS"))) errors.push("Potvrđena vrednost akcije mora biti prikazana u vizuelnim props-ima ili captionu.");
  }
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
if (!supportedFamilies.has(videoProps?.designVariant)) {
  errors.push("video-props.json koristi nepodržanu designVariant vrednost.");
}
if (videoProps?.imageSrc?.trim() && !supportedImageBackgrounds.has(videoProps?.imageBackground)) {
  errors.push("video-props.json mora navesti imageBackground kao transparent ili opaque kada koristi sliku proizvoda.");
}
if (videoProps?.imageSrc?.trim() && !supportedProductShapes.has(videoProps?.productShape)) {
  errors.push("video-props.json mora navesti productShape kao wide, compact ili tall kada koristi proizvod.");
}
if (!supportedOfferKinds.has(videoProps?.offerKind)) errors.push("video-props.json mora navesti podržan offerKind.");
if (input?.postType === "akcija" && ["deadline", "none"].includes(videoProps?.offerKind)) errors.push("Akcijska objava ne sme koristiti rok kao zamenu za konkretnu mehaniku ponude.");
if (input?.postType === "akcija" && input?.confirmedOffer?.mechanic && videoProps?.offerKind !== input.confirmedOffer.mechanic) errors.push("offerKind mora odgovarati potvrđenoj mehanici akcije.");

if (!caption) warnings.push("Caption još nije sačuvan u generated/caption.md ili final/caption.md.");
if (input?.status !== "spremno-za-ljudsku-proveru") errors.push("input.json status nije spremno-za-ljudsku-proveru.");
if (!review.includes("Status: SPREMNO ZA LJUDSKU PROVERU")) errors.push("review.md nema status SPREMNO ZA LJUDSKU PROVERU.");
if (!existsSync(visualDesignSkillPath)) errors.push("Nedostaje obavezni agent-skills-required/visual-design/SKILL.md.");
if (videoProps?.designVariant === "premium-product-stage" && !videoProps?.imageSrc?.trim()) {
  errors.push("premium-product-stage zahteva imageSrc, jer proizvod mora biti glavni vizuelni element scene.");
}

if (!supportedFamilies.has(designDirection?.family)) errors.push("Nedostaje podržana dizajnerska familija u design-direction.json.");
if (!designDirection?.authorId?.trim()) errors.push("design-direction.json mora imati authorId autora dizajna.");
if (!designDirection?.signature?.trim()) errors.push("Nedostaje design signature u design-direction.json.");
if (designDirection?.family && videoProps?.designVariant !== designDirection.family) {
  errors.push("designVariant i familija u design-direction.json se ne podudaraju.");
}
if (!Array.isArray(designDirection?.referenceFiles) || designDirection.referenceFiles.length < 1) {
  errors.push("Nedostaje referenca u design-direction.json.");
} else {
  const approvedReferenceFiles = new Set(["ref-premium-product-stage.png", "ref-product-stage-footer.png"]);
  for (const referenceFile of designDirection.referenceFiles) {
    const referencePath = typeof referenceFile === "string" && approvedReferenceFiles.has(referenceFile)
      ? resolve(repositoryRoot, "brand/design-references", referenceFile)
      : null;
    if (!referencePath) {
      errors.push(`Nedozvoljena dizajnerska referenca: ${referenceFile}. Dozvoljene su samo ref-premium-product-stage.png i ref-product-stage-footer.png.`);
    } else if (!existsSync(referencePath)) {
      errors.push(`Nepostojeća dizajnerska referenca: ${referenceFile}.`);
    }
  }
}
if (!Array.isArray(designDirection?.referenceTraits) || designDirection.referenceTraits.filter((trait) => typeof trait === "string" && trait.trim()).length < 2) {
  errors.push("Upiši najmanje dve konkretne dizajnerske osobine iz reference.");
}
if (!designDirection?.distinctFromRecent?.trim()) errors.push("Nedostaje objašnjenje razlike u odnosu na poslednje objave.");
const designInterventions = Array.isArray(designDirection?.designInterventions) ? designDirection.designInterventions : [];
const uniqueDesignInterventions = [...new Set(designInterventions)];
if (uniqueDesignInterventions.length < 2 || uniqueDesignInterventions.some((intervention) => !supportedDesignInterventions.has(intervention))) {
  errors.push("Upiši najmanje dve podržane designInterventions vrednosti za stvarnu dizajnersku promenu.");
}
if (!designDirection?.freshInterventionNote?.trim()) errors.push("Nedostaje freshInterventionNote sa konkretnom novom dizajnerskom odlukom.");
const requestedFormats = Array.isArray(input?.requestedFormats) ? input.requestedFormats : [];
for (const format of requestedFormats.filter((format) => ["feed", "story", "reels"].includes(format))) {
  if (!designDirection?.formatAdaptations?.[format]?.trim()) errors.push(`Nedostaje formatAdaptations.${format} za namernu adaptaciju formata.`);
}
const formatPlan = designDirection?.formatPlan;
if (!formatPlan?.feed?.readingOrder || !formatPlan?.feed?.productAnchor || !formatPlan?.feed?.layoutId) errors.push("formatPlan.feed mora imati readingOrder, productAnchor i layoutId.");
if (!formatPlan?.story?.readingOrder || !formatPlan?.story?.productAnchor || !formatPlan?.story?.layoutId) errors.push("formatPlan.story mora imati readingOrder, productAnchor i layoutId.");
if (formatPlan?.feed?.layoutId && formatPlan.feed.layoutId === formatPlan?.story?.layoutId) errors.push("Feed i Story moraju imati različite layoutId vrednosti.");
if (formatPlan?.feed?.readingOrder === formatPlan?.story?.readingOrder && formatPlan?.feed?.productAnchor === formatPlan?.story?.productAnchor) errors.push("Feed i Story moraju se razlikovati po redosledu čitanja ili poziciji proizvoda.");
if (requestedFormats.includes("reels")) {
  const shotPlan = formatPlan?.reels?.shotPlan;
  if (!formatPlan?.reels?.layoutId || !Array.isArray(shotPlan) || new Set(shotPlan).size < 3) errors.push("formatPlan.reels mora imati poseban layoutId i najmanje tri različite scene.");
}
if (designDirection?.family === "offer-orbit") {
  if (formatPlan?.feed?.layoutId !== "offer-orbit-feed-stage") errors.push("offer-orbit Feed mora koristiti stvarni layoutId offer-orbit-feed-stage.");
  if (formatPlan?.story?.layoutId !== "offer-orbit-story-stack") errors.push("offer-orbit Story mora koristiti stvarni layoutId offer-orbit-story-stack.");
  if (requestedFormats.includes("reels") && formatPlan?.reels?.layoutId !== "offer-orbit-three-scene-reel") errors.push("offer-orbit Reels mora koristiti stvarni layoutId offer-orbit-three-scene-reel.");
}
if (!designDirection?.familyFit?.rationale?.trim() || designDirection?.familyFit?.supportsOfferStrength !== true || designDirection?.familyFit?.supportsSceneDepth !== true) {
  errors.push("familyFit mora dokazati da izabrana familija podržava jačinu ponude i scensku dubinu; novina sama nije dovoljan razlog.");
}
if (videoProps?.imageSrc?.trim() && designDirection?.familyFit?.productShape !== videoProps?.productShape) errors.push("familyFit.productShape mora odgovarati video-props.json productShape vrednosti.");
if (requestedFormats.includes("reels") && !supportedMotionTreatments.has(designDirection?.motionTreatment)) {
  errors.push("Reels zahteva podržan motionTreatment koji se razlikuje od prethodnih Reels objava.");
}
if (requestedFormats.includes("reels") && videoProps?.motionTreatment !== designDirection?.motionTreatment) {
  errors.push("video-props.json motionTreatment mora da odgovara motionTreatment vrednosti iz design-direction.json.");
}
if (designDirection?.logoSurface !== "cream-card") errors.push("Originalni znak logoa sme biti samo na cream-card podlozi.");
if (designDirection?.typography?.family !== "AUSekiManrope") errors.push("Finalni renderer mora koristiti Manrope font bez zamene.");
if (!Array.isArray(designDirection?.typography?.weights) || designDirection.typography.weights.length < 1) {
  errors.push("Nedostaju korišćene težine fonta u design-direction.json.");
}

const recentRecords = getDesignRecords().filter((record) => record?.id !== basename(postDirectory)).sort((a, b) => String(a.id).localeCompare(String(b.id))).slice(-3);
if (designDirection?.signature && recentRecords.some((record) => record.signature === designDirection.signature)) {
  errors.push(`Design signature ponavlja jednu od poslednje tri objave: ${recentRecords.filter((record) => record.signature === designDirection.signature).map((record) => record.id).join(", ")}.`);
}
if (input?.contentApproach && recentRecords.some((record) => record.contentApproach === input.contentApproach)) {
  errors.push(`contentApproach ponavlja jednu od poslednje tri objave: ${recentRecords.filter((record) => record.contentApproach === input.contentApproach).map((record) => record.id).join(", ")}.`);
}
const designInterventionKey = [...uniqueDesignInterventions].sort().join("|");
if (designInterventionKey && recentRecords.some((record) => record.designInterventionKey === designInterventionKey)) {
  errors.push(`Kombinacija designInterventions ponavlja jednu od poslednje tri objave: ${recentRecords.filter((record) => record.designInterventionKey === designInterventionKey).map((record) => record.id).join(", ")}.`);
}
if (requestedFormats.includes("reels") && designDirection?.motionTreatment && recentRecords.some((record) => record.motionTreatment === designDirection.motionTreatment)) {
  errors.push(`motionTreatment ponavlja jednu od poslednje tri Reels objave: ${recentRecords.filter((record) => record.motionTreatment === designDirection.motionTreatment).map((record) => record.id).join(", ")}.`);
}

const finalDirectory = resolve(postDirectory, "final");
for (const file of ["feed-1080x1350.png", "story-1080x1920.png", "reels-1080x1920.mp4", "caption.md"]) {
  if (!existsSync(join(finalDirectory, file))) errors.push(`Nedostaje final/${file}.`);
}
if (!Array.isArray(designDirection?.validatedRenders) || requiredValidatedRenders.some((path) => !designDirection.validatedRenders.includes(path))) {
  errors.push("U design-direction.json nedostaju tačne putanje pregledanih Feed, Story i Reels ključnih kadrova.");
}
for (const relativePath of requiredValidatedRenders) {
  if (!existsSync(resolve(postDirectory, relativePath))) errors.push(`Evidentirani render ne postoji: ${relativePath}.`);
}

for (const [relativePath, expectedWidth, expectedHeight] of [
  ["final/feed-1080x1350.png", 1080, 1350],
  ["final/story-1080x1920.png", 1080, 1920],
  ["generated/reels-intro.png", 1080, 1920],
  ["generated/reels-offer.png", 1080, 1920],
  ["generated/reels-closing.png", 1080, 1920],
]) {
  const absolutePath = resolve(postDirectory, relativePath);
  const media = existsSync(absolutePath) ? probeMedia(absolutePath) : null;
  if (!media || Number(media.width) !== expectedWidth || Number(media.height) !== expectedHeight) errors.push(`${relativePath} mora imati dimenzije ${expectedWidth}x${expectedHeight}.`);
}
const reelsPath = resolve(postDirectory, "final/reels-1080x1920.mp4");
const reelsMedia = existsSync(reelsPath) ? probeMedia(reelsPath) : null;
const reelsDuration = Number(reelsMedia?.formatDuration ?? reelsMedia?.duration);
if (!reelsMedia || Number(reelsMedia.width) !== 1080 || Number(reelsMedia.height) !== 1920 || !Number.isFinite(reelsDuration) || reelsDuration < 11.5 || reelsDuration > 12.5) {
  errors.push("Finalni Reels mora biti 1080x1920 i trajati približno 12 sekundi.");
}

const sourceImageAssets = Array.isArray(input?.sourceAssets) ? input.sourceAssets.filter((path) => typeof path === "string" && imageExtensions.has(extname(path).toLowerCase())) : [];
const auditedAssets = Array.isArray(assetReview?.assets) ? assetReview.assets : [];
const imageSrc = videoProps?.imageSrc?.trim();
const heroAudits = auditedAssets.filter((asset) => asset?.usage === "hero-product");
let rendererAssetPath = null;
if (imageSrc) {
  if (sourceImageAssets.length === 0) errors.push("imageSrc zahteva najmanje jedan izvorni vizual u input.sourceAssets.");
  if (heroAudits.length !== 1) errors.push("Aktivni imageSrc mora biti vezan za tačno jedan asset-review zapis sa usage hero-product.");
  if (heroAudits.length === 1 && !sourceImageAssets.includes(heroAudits[0].sourcePath)) errors.push("hero-product audit mora biti vezan za vizual naveden u input.sourceAssets.");
  const match = imageSrc.match(/^\/jobs\/([^/]+)\/([a-zA-Z0-9._-]+)$/);
  if (!match || match[1] !== basename(postDirectory)) {
    errors.push("imageSrc mora imati bezbedan oblik /jobs/<id-paketa>/<fajl> bez podfoldera i traversal segmenata.");
  } else {
    const jobRoot = resolve(repositoryRoot, "video-renderer/public/jobs", match[1]);
    rendererAssetPath = resolve(jobRoot, match[2]);
    if (!inside(jobRoot, rendererAssetPath) || !existsSync(rendererAssetPath)) errors.push("Renderer asset ne postoji unutar tačnog jobs foldera paketa.");
  }
}
for (const sourceAsset of sourceImageAssets) {
  const sourcePath = resolve(postDirectory, sourceAsset);
  const sourceRoot = resolve(postDirectory, "source");
  const audit = auditedAssets.find((asset) => asset?.sourcePath === sourceAsset);
  if (!inside(sourceRoot, sourcePath) || !existsSync(sourcePath)) {
    errors.push(`Izvorni vizual ne postoji unutar source/: ${sourceAsset}.`);
    continue;
  }
  if (!audit) {
    errors.push(`Nedostaje asset-review zapis za ${sourceAsset}. Pokreni inspect-assets.mjs.`);
    continue;
  }
  if (audit.sourceHash !== hashFile(sourcePath)) errors.push(`Asset review hash više ne odgovara izvornom fajlu: ${sourceAsset}.`);
  if (!approvedAssetStatuses.has(audit.status)) errors.push(`Asset nije odobren za render: ${sourceAsset}.`);
  if (!audit.automatedChecks?.heroResolution) warnings.push(`Asset ${sourceAsset} zahteva povećanje od približno ${audit.automatedChecks?.maxUpscaleFactor ?? "nepoznatog"}x. Prilagodi kompoziciju i dokumentuj ograničenje; sama rezolucija nije blokada.`);
  if (audit.usage === "hero-product" && videoProps?.imageBackground === "transparent" && (!audit.automatedChecks?.transparencyAvailable || !audit.automatedChecks?.meaningfulTransparency)) errors.push(`Transparentni asset nema potvrđen alfa sadržaj: ${sourceAsset}.`);
  if (audit.usage === "hero-product" && videoProps?.imageBackground === "transparent" && !audit.automatedChecks?.visiblePixelsClearOfCanvasEdge) errors.push(`Vidljivi pikseli transparentnog asseta dodiruju ivicu platna: ${sourceAsset}.`);
  if (!audit.manualChecks || requiredAssetManualChecks.some((key) => audit.manualChecks[key] !== true)) errors.push(`Nisu završene sve kritične ručne provere asseta: ${sourceAsset}.`);
  if (audit.manualChecks?.labelLegibleAtRenderSize !== true) warnings.push(`Sitna etiketa na assetu možda nije potpuno čitljiva u renderu: ${sourceAsset}. To nije blokada ako su proizvod i ključna poruka pouzdano prepoznatljivi.`);
  if (!Array.isArray(audit.blockingDefects) || audit.blockingDefects.length > 0) errors.push(`Asset ima otvorene blokirajuće defekte: ${sourceAsset}.`);
  if (!Array.isArray(audit.qualityLimitations)) errors.push(`Asset mora imati niz qualityLimitations: ${sourceAsset}.`);
  if (Array.isArray(audit.qualityLimitations) && audit.qualityLimitations.length > 0 && audit.status !== "approved-with-limitations") errors.push(`Asset sa dokumentovanim ograničenjima mora imati status approved-with-limitations: ${sourceAsset}.`);
  if (!audit.preparedAssetPath || !audit.preparedAssetHash) {
    errors.push(`Asset nema odobrenu pripremljenu verziju: ${sourceAsset}.`);
  } else {
    const preparedRoot = resolve(postDirectory, "generated/assets");
    const preparedPath = resolve(postDirectory, audit.preparedAssetPath);
    if (!inside(preparedRoot, preparedPath) || !existsSync(preparedPath) || hashFile(preparedPath) !== audit.preparedAssetHash) errors.push(`Pripremljeni asset mora postojati u generated/assets/ i hash mora odgovarati: ${sourceAsset}.`);
    if (audit.usage === "hero-product") {
      if (!rendererAssetPath || !existsSync(rendererAssetPath) || hashFile(rendererAssetPath) !== audit.preparedAssetHash) errors.push(`Renderer ne koristi hashom odobrenu hero-product verziju asseta: ${sourceAsset}.`);
      const measuredMetadata = existsSync(preparedPath) ? inspectVisualMetadata(preparedPath) : null;
      const measuredShape = shapeFromMetadata(measuredMetadata);
      if (!measuredShape || videoProps?.productShape !== measuredShape || designDirection?.familyFit?.productShape !== measuredShape) errors.push(`productShape mora biti izveden iz stvarnih alfa/dimenzionih granica asseta: ${sourceAsset}.`);
      if (videoProps?.imageBackground === "transparent" && (!measuredMetadata || measuredMetadata.transparentRatio < 0.005 || measuredMetadata.visiblePixelsTouchEdge)) errors.push(`Renderer asset nije validan transparentni cutout: ${sourceAsset}.`);
      if (videoProps?.imageBackground === "opaque" && measuredMetadata?.transparentRatio >= 0.005) errors.push(`Asset sa stvarnom transparentnošću ne sme biti deklarisan kao opaque: ${sourceAsset}.`);
    }
  }
}

if (qualityReview?.status !== "meets-reference-bar") errors.push("quality-review.json nije dostigao status meets-reference-bar.");
for (const criterion of requiredQualityCriteria) {
  const entry = qualityReview?.criteria?.[criterion];
  if (!Number.isFinite(entry?.score) || entry.score < 4 || entry.score > 5 || !entry?.note?.trim() || entry.note.trim().length < 20) errors.push(`Kriterijum ${criterion} mora imati ocenu 4–5 i konkretan dokaz.`);
}
if (!qualityReview?.weakestArea?.trim()) errors.push("quality-review.json mora imenovati najslabiju preostalu oblast.");
if (!qualityReview?.revisionEvidence?.issueFound?.trim() || !qualityReview?.revisionEvidence?.changeMade?.trim()) errors.push("Mora biti dokumentovana najmanje jedna stvarna korekcija između drafta i finala.");
if (qualityReview?.revisionEvidence?.before !== "generated/feed-draft.png" || qualityReview?.revisionEvidence?.after !== "final/feed-1080x1350.png") errors.push("Dokaz revizije mora porediti generated/feed-draft.png sa final/feed-1080x1350.png.");
const beforePath = qualityReview?.revisionEvidence?.before ? resolve(postDirectory, qualityReview.revisionEvidence.before) : null;
const afterPath = qualityReview?.revisionEvidence?.after ? resolve(postDirectory, qualityReview.revisionEvidence.after) : null;
if (!beforePath || !afterPath || !inside(postDirectory, beforePath) || !inside(postDirectory, afterPath) || !existsSync(beforePath) || !existsSync(afterPath) || hashFile(beforePath) === hashFile(afterPath)) errors.push("Draft i final moraju postojati i imati različite hasheve kao dokaz iteracije.");
if (qualityReview?.independentReview?.performed !== true || qualityReview?.independentReview?.verdict !== "meets-reference-bar" || !qualityReview?.independentReview?.reviewerId?.trim() || qualityReview.independentReview.reviewerId === designDirection?.authorId || qualityReview?.independentReview?.rawArtifactOnly !== true || !qualityReview?.independentReview?.method?.trim() || !qualityReview?.independentReview?.notes?.trim()) errors.push("Nezavisni pregled mora imati drugog reviewerId autora, pregled sirovih artefakata i pozitivan referentni verdict.");
const rendererPath = resolve(repositoryRoot, "video-renderer/src/Composition.tsx");
const rendererCssPath = resolve(repositoryRoot, "video-renderer/src/index.css");
for (const [key, relativePath] of [
  ["feed", "final/feed-1080x1350.png"],
  ["story", "final/story-1080x1920.png"],
  ["reelsIntro", "generated/reels-intro.png"],
  ["reelsOffer", "generated/reels-offer.png"],
  ["reelsClosing", "generated/reels-closing.png"],
  ["reelsMp4", "final/reels-1080x1920.mp4"],
  ["feedDraft", "generated/feed-draft.png"],
  ["referenceComparison", "generated/reference-comparison.png"],
  ["formatComparison", "generated/format-comparison.png"],
  ["input", "input.json"],
  ["videoProps", "video-props.json"],
  ["designDirection", "generated/design-direction.json"],
  ["renderer", relative(repositoryRoot, rendererPath)],
  ["rendererCss", relative(repositoryRoot, rendererCssPath)],
  ["referencePremium", "brand/design-references/ref-premium-product-stage.png"],
  ["referenceFooter", "brand/design-references/ref-product-stage-footer.png"],
]) {
  const absolutePath = ["renderer", "rendererCss", "referencePremium", "referenceFooter"].includes(key) ? resolve(repositoryRoot, relativePath) : resolve(postDirectory, relativePath);
  if (!existsSync(absolutePath) || qualityReview?.renderHashes?.[key] !== hashFile(absolutePath)) errors.push(`quality-review hash nije aktuelan za ${relativePath}.`);
}

const renderer = existsSync(rendererPath) ? readFileSync(rendererPath, "utf8") : "";
const rendererCss = existsSync(rendererCssPath) ? readFileSync(rendererCssPath, "utf8") : "";
if (!renderer.includes("AUSekiManrope") || !rendererCss.includes("font-family: \"AUSekiManrope\"") || !rendererCss.includes("xn7gYHE41ni1AdIRggexSg.woff2") || !rendererCss.includes("manrope-latin-ext.woff2") || renderer.includes("Arial")) {
  errors.push("Renderer nema obavezno učitavanje punog Manrope fonta bez fallbacka.");
}
if (!renderer.includes("LogoOnCreamCard")) errors.push("Renderer nema obaveznu krem logo-karticu.");
if (!renderer.includes('from "lucide-react"') || !renderer.includes("<MapPin")) {
  errors.push("Renderer nema obaveznu Lucide ikonu za grafičke i video objave.");
}
if (!renderer.includes('const isTransparentProduct = imageBackground === "transparent";') || !renderer.includes('backgroundColor: isTransparentProduct ? "transparent"') || !renderer.includes('{!isTransparentProduct &&')) {
  errors.push("Renderer nema obavezan režim koji uklanja pravougaoni ram/podlogu oko transparentnog PNG proizvoda.");
}
const premiumProductStageStart = renderer.indexOf("const PremiumProductStage");
const premiumProductStageEnd = premiumProductStageStart === -1 ? -1 : renderer.indexOf("const SekiTiliaPost", premiumProductStageStart);
const premiumProductStageRenderer = premiumProductStageStart === -1 ? "" : renderer.slice(premiumProductStageStart, premiumProductStageEnd === -1 ? undefined : premiumProductStageEnd);
if (!renderer.includes('case "premium-product-stage": return <PremiumProductStage') || !premiumProductStageRenderer) {
  errors.push("Renderer nema podržanu premium-product-stage familiju.");
} else if (!premiumProductStageRenderer.includes('const isTransparentProduct = imageBackground === "transparent";') || !premiumProductStageRenderer.includes('backgroundColor: isTransparentProduct ? "transparent"') || !premiumProductStageRenderer.includes('overflow: isTransparentProduct ? "visible"')) {
  errors.push("premium-product-stage nema obavezan transparentni režim bez pravougaonog rama/podloge oko proizvoda.");
}
for (const family of ["offer-orbit", "type-stage", "gallery-shelf"]) {
  const componentName = family.split("-").map((part) => part[0].toUpperCase() + part.slice(1)).join("");
  if (!renderer.includes(`case "${family}": return <${componentName}`)) {
    errors.push(`Renderer nema podržanu familiju ${family}.`);
  }
}
if (!renderer.includes("<Sequence") || !renderer.includes("PromoHook") || !renderer.includes('data-qa="reels-hook"') || !renderer.includes('data-qa="reels-closing"') || !renderer.includes("motionTreatment")) {
  errors.push("Renderer nema stvarni višescenski Reels tok sa hook, hero i closing scenama.");
}
for (const qaRole of ["product-stage", "product", "podium", "contact-shadow", "headline", "cta-footer"]) {
  if (!renderer.includes(`data-qa="${qaRole}"`)) errors.push(`Renderer nema obaveznu QA ulogu ${qaRole}.`);
}
const roundedRectangleLines = renderer
  .split("\n")
  .filter((line) => /\b(?:borderRadius|border(?:Top|Bottom)(?:Left|Right)Radius)\s*:/.test(line))
  .filter((line) => !/borderRadius:\s*(?:999|[\"']50%[\"'])/.test(line));
if (roundedRectangleLines.length > 0) {
  errors.push("Renderer koristi nedozvoljeno zaobljenje pravougaonih elemenata. Dozvoljeni su samo pill-dugme/ponudna oznaka i čisti krugovi.");
}

const publishableTextToCheck = [JSON.stringify(videoProps ?? {}), caption].join(" ").toLocaleLowerCase("sr-Latn-RS");
const prohibitedPatterns = [
  { pattern: /\bantibiotik\w*/u, reason: "pominjanje antibiotika" },
  { pattern: /\blekov?i?\b/u, reason: "pominjanje leka" },
  { pattern: /\bleči\w*|\bizleči\w*/u, reason: "tvrdnja o lečenju" },
  { pattern: /\bgarantuje\w*|\btrenutno rešava\w*/u, reason: "obećanje rezultata" },
  { pattern: /\bbezbedno za svakoga\b/u, reason: "apsolutna bezbednosna tvrdnja" },
  { pattern: /—/u, reason: "upotreba em crte" },
];

for (const { pattern, reason } of prohibitedPatterns) {
  if (pattern.test(publishableTextToCheck)) errors.push(`Blokirano: ${reason}.`);
}

for (const warning of warnings) console.warn(`UPOZORENJE: ${warning}`);
for (const error of errors) console.error(`BLOKADA: ${error}`);

if (errors.length > 0) process.exit(1);
console.log("PROVERA PROŠLA: paket je spreman za ljudsku proveru i pregled finalnih fajlova.");
