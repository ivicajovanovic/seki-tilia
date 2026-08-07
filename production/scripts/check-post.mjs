import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { basename, extname, join, relative, resolve, sep } from "node:path";

const args = process.argv.slice(2);
const postArgumentIndex = args.indexOf("--post");
const postArgument = postArgumentIndex === -1 ? undefined : args[postArgumentIndex + 1];
const skipLocalProductionHistory = args.includes("--skip-local-production-history");

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
const supportedFormats = new Set(["feed", "story", "reels"]);
const supportedAudioTracks = new Set([
  "mp3/clear-path.mp3",
  "mp3/clear-path-ambient.mp3",
  "mp3/open-sky-drift.mp3",
  "mp3/open-sky-drift-chill.mp3",
  "mp3/paper-sun-parade.mp3",
  "mp3/paper-sun-parade-upbeat.mp3"
]);
const supportedProductShapes = new Set(["wide", "compact", "tall"]);
const supportedOfferKinds = new Set(["deadline", "price", "discount", "bundle", "gift", "none"]);
const supportedPromoLayouts = new Set(["auto", "feed-left-product-right", "story-top-product-center", "product-dominant-sticker"]);
const approvedAssetStatuses = new Set(["approved", "approved-with-limitations"]);
const requiredAssetManualChecks = ["inspectedOnLightAndDark", "noCursorOrUiArtifacts", "cleanCutoutEdges", "packagingUndistorted", "productIdentityVerifiable"];
const renderRequirements = {
  feed: [{ path: "final/feed-1080x1350.png", width: 1080, height: 1350, hashKey: "feed" }],
  story: [{ path: "final/story-1080x1920.png", width: 1080, height: 1920, hashKey: "story" }],
  reels: [
    { path: "generated/reels-intro.png", width: 1080, height: 1920, hashKey: "reelsIntro" },
    { path: "generated/reels-offer.png", width: 1080, height: 1920, hashKey: "reelsOffer" },
    { path: "generated/reels-closing.png", width: 1080, height: 1920, hashKey: "reelsClosing" },
  ],
};
const baseQualityCriteria = ["compositionAndBalance", "hierarchyAndMobileImpact", "productIntegrationAndGrounding", "depthLightingAndFinish", "referenceLevelDistinctiveness", "formatAdaptation"];
const imageExtensions = new Set([".png", ".jpg", ".jpeg", ".webp"]);
const hashFile = (path) => createHash("sha256").update(readFileSync(path)).digest("hex");
const inside = (root, path) => path === root || path.startsWith(`${root}${sep}`);
const probeMedia = (path) => {
  const result = spawnSync("ffprobe", ["-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height,nb_frames,duration:format=duration", "-of", "json", path], { encoding: "utf8" });
  if (result.status !== 0) return null;
  const parsed = JSON.parse(result.stdout);
  return { ...parsed.streams?.[0], formatDuration: parsed.format?.duration };
};
const hasAudioStream = (path) => {
  const result = spawnSync("ffprobe", ["-v", "error", "-select_streams", "a:0", "-show_entries", "stream=codec_type", "-of", "json", path], { encoding: "utf8" });
  if (result.status !== 0) return false;
  try {
    return JSON.parse(result.stdout)?.streams?.some((stream) => stream.codec_type === "audio") === true;
  } catch {
    return false;
  }
};
const probeAudioLevels = (path) => {
  const result = spawnSync("ffmpeg", ["-hide_banner", "-i", path, "-vn", "-af", "volumedetect", "-f", "null", "-"], { encoding: "utf8" });
  const output = `${result.stdout ?? ""}\n${result.stderr ?? ""}`;
  const meanMatch = output.match(/mean_volume:\s*(-?\d+(?:\.\d+)?)\s*dB/i);
  const maxMatch = output.match(/max_volume:\s*(-?\d+(?:\.\d+)?)\s*dB/i);
  return {
    meanVolume: meanMatch ? Number(meanMatch[1]) : null,
    maxVolume: maxMatch ? Number(maxMatch[1]) : null,
  };
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
const referenceManifestPath = resolve(repositoryRoot, "brand/design-references/references.json");
const referenceManifest = readJson(referenceManifestPath, "brand/design-references/references.json");
const approvedReferenceList = Array.isArray(referenceManifest?.approved) ? referenceManifest.approved : [];
const approvedReferenceFiles = new Set(approvedReferenceList);
const palettePath = resolve(repositoryRoot, "brand/color-palette.json");
const colorPalette = readJson(palettePath, "brand/color-palette.json");
const paletteColors = Array.isArray(colorPalette?.colors) ? colorPalette.colors : [];
const paletteIds = new Set(paletteColors.map((color) => color?.id).filter((id) => typeof id === "string"));
const paletteHexById = new Map(paletteColors.map((color) => [color?.id, color?.hex]));
const paletteSetList = Array.isArray(colorPalette?.paletteSets) ? colorPalette.paletteSets : [];
const paletteSets = new Map(paletteSetList.filter((set) => typeof set?.id === "string").map((set) => [set.id, new Set(Array.isArray(set.colors) ? set.colors : [])]));
const safeTextPairList = Array.isArray(colorPalette?.safeTextPairs) ? colorPalette.safeTextPairs : [];
const safeTextPairs = new Set(safeTextPairList.map((pair) => `${pair?.foreground}|${pair?.background}`));
const approvedLogoBackgrounds = new Set(Array.isArray(colorPalette?.approvedLogoBackgrounds) ? colorPalette.approvedLogoBackgrounds : []);
const logoVariantFiles = { "on-light": "logo-tamniji.svg", "on-dark": "logo-svetliji.svg" };
const approvedLogoPlacements = colorPalette?.approvedLogoPlacements && typeof colorPalette.approvedLogoPlacements === "object"
  ? colorPalette.approvedLogoPlacements
  : {};
const rendererThemeList = Array.isArray(colorPalette?.rendererThemes) ? colorPalette.rendererThemes : [];
const rendererThemes = new Map(rendererThemeList.filter((theme) => typeof theme?.id === "string").map((theme) => [theme.id, theme]));
const reviewPath = resolve(postDirectory, "review.md");
const review = existsSync(reviewPath) ? readFileSync(reviewPath, "utf8") : "";
const visualDesignSkillPath = resolve(repositoryRoot, "agent-skills-required/visual-design/SKILL.md");
const captionPath = ["final/caption.md", "generated/caption.md"].map((file) => resolve(postDirectory, file)).find(existsSync);
const caption = captionPath ? readFileSync(captionPath, "utf8") : "";

if (approvedReferenceFiles.size === 0) errors.push("references.json mora sadržati najmanje jednu odobrenu referencu.");
if (paletteIds.size < 2 || safeTextPairs.size === 0 || approvedLogoBackgrounds.size === 0 || Object.keys(approvedLogoPlacements).length === 0) errors.push("color-palette.json mora imati boje, bezbedne tekstualne parove i mapu odobrenih logo-varijanti i pozadina.");
if (paletteIds.size !== paletteColors.length || paletteColors.some((color) => typeof color?.id !== "string" || !/^#[0-9a-f]{6}$/i.test(color?.hex ?? ""))) errors.push("color-palette.json mora imati jedinstvene ID vrednosti i validne šestocifrene HEX kodove.");
const relativeLuminance = (hex) => {
  const channels = hex.slice(1).match(/../g).map((channel) => Number.parseInt(channel, 16) / 255).map((channel) => channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4);
  return (0.2126 * channels[0]) + (0.7152 * channels[1]) + (0.0722 * channels[2]);
};
const contrastRatio = (foreground, background) => {
  const foregroundLuminance = relativeLuminance(foreground);
  const backgroundLuminance = relativeLuminance(background);
  return (Math.max(foregroundLuminance, backgroundLuminance) + 0.05) / (Math.min(foregroundLuminance, backgroundLuminance) + 0.05);
};
for (const pair of safeTextPairList) {
  const foregroundHex = paletteHexById.get(pair?.foreground);
  const backgroundHex = paletteHexById.get(pair?.background);
  if (!/^#[0-9a-f]{6}$/i.test(foregroundHex ?? "") || !/^#[0-9a-f]{6}$/i.test(backgroundHex ?? "")) {
    errors.push(`safeTextPairs navodi nepostojeću boju: ${pair?.foreground}|${pair?.background}.`);
    continue;
  }
  const actualRatio = contrastRatio(foregroundHex, backgroundHex);
  if (actualRatio < Number(colorPalette?.contrastPolicy?.minimumTextRatio ?? 4.5) || Math.abs(actualRatio - Number(pair?.ratio)) > 0.06) {
    errors.push(`safeTextPairs odnos ${pair.foreground}|${pair.background} nema tačan bezbedan kontrast.`);
  }
}
if (paletteSets.size < 2 || paletteSets.size !== paletteSetList.length) errors.push("color-palette.json mora imati najmanje dva jedinstvena paletteSets seta.");
const paletteMembership = new Map();
for (const [setId, setColors] of paletteSets) {
  if (setColors.size === 0) errors.push(`paletteSets.${setId} mora sadržati najmanje jednu boju.`);
  for (const colorId of setColors) {
    if (!paletteIds.has(colorId)) errors.push(`paletteSets.${setId} navodi nepostojeću boju ${colorId}.`);
    const memberships = paletteMembership.get(colorId) ?? [];
    memberships.push(setId);
    paletteMembership.set(colorId, memberships);
  }
}
for (const colorId of paletteIds) {
  const memberships = paletteMembership.get(colorId) ?? [];
  if (memberships.length !== 1) errors.push(`Boja ${colorId} mora pripadati tačno jednom paletteSets setu.`);
}
for (const pair of safeTextPairList) {
  const foregroundSet = paletteMembership.get(pair?.foreground)?.[0];
  const backgroundSet = paletteMembership.get(pair?.background)?.[0];
  if (foregroundSet && backgroundSet && foregroundSet !== backgroundSet) errors.push(`safeTextPairs ne sme mešati setove: ${pair.foreground}|${pair.background}.`);
}
if (rendererThemes.size < 2 || rendererThemes.size !== rendererThemeList.length) errors.push("color-palette.json mora imati najmanje dve jedinstvene rendererThemes teme.");
for (const setId of paletteSets.keys()) {
  if (!rendererThemeList.some((theme) => theme?.colorSet === setId)) errors.push(`paletteSets.${setId} mora imati najmanje jednu rendererThemes temu.`);
}
for (const theme of rendererThemeList) {
  const themeSet = paletteSets.get(theme?.colorSet);
  if (!themeSet) errors.push(`rendererThemes.${theme?.id ?? "unknown"}.colorSet mora koristiti postojeći paletteSets set.`);
  for (const field of ["background", "surface", "dark", "accent", "secondary", "stage", "ink", "logoBackground"]) {
    if (!paletteIds.has(theme?.[field])) errors.push(`rendererThemes.${theme?.id ?? "unknown"}.${field} mora koristiti boju iz palete.`);
    else if (themeSet && !themeSet.has(theme[field])) errors.push(`rendererThemes.${theme?.id ?? "unknown"}.${field} meša boju van seta ${theme.colorSet}.`);
  }
  if (!logoVariantFiles[theme?.logoVariant]) errors.push(`rendererThemes.${theme?.id ?? "unknown"}.logoVariant mora biti on-light ili on-dark.`);
  if (!safeTextPairs.has(`${theme?.dark}|${theme?.background}`)) errors.push(`rendererThemes.${theme?.id ?? "unknown"} nema bezbedan odnos dark/background.`);
}
for (const logoFile of Object.values(logoVariantFiles)) {
  const placements = approvedLogoPlacements?.[logoFile];
  if (!Array.isArray(placements) || placements.length === 0 || placements.some((background) => !paletteIds.has(background))) errors.push(`color-palette.json nema validne approvedLogoPlacements vrednosti za ${logoFile}.`);
}
if (approvedReferenceFiles.size !== approvedReferenceList.length) errors.push("references.json ne sme sadržati duplirane identifikatore.");
for (const referenceFile of approvedReferenceFiles) {
  if (typeof referenceFile !== "string" || !/^[a-z0-9][a-z0-9-]*\.png$/.test(referenceFile)) {
    errors.push(`Neispravan identifikator u references.json: ${referenceFile}.`);
  } else if (!existsSync(resolve(repositoryRoot, "brand/design-references", referenceFile))) {
    errors.push(`Manifest navodi nepostojeću referencu: ${referenceFile}.`);
  }
}

const getDesignRecords = () => {
  const recordsById = new Map();
  const history = readJson(resolve(repositoryRoot, "brand/design-history.json"), "brand/design-history.json");
  if (Array.isArray(history?.records)) {
    for (const record of history.records) {
      if (record?.id && typeof record.id === "string") recordsById.set(record.id, record);
      else warnings.push("Preskočen je zapis bez stabilnog id u brand/design-history.json.");
    }
  }

  const productionsDirectory = resolve(repositoryRoot, "productions");
  if (skipLocalProductionHistory || !existsSync(productionsDirectory)) return [...recordsById.values()];
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
          if (postInput?.status === "spremno-za-ljudsku-proveru" && direction?.signature) recordsById.set(post.name, {
            id: post.name,
            signature: direction.signature,
            contentApproach: postInput?.contentApproach,
            designInterventionKey: Array.isArray(direction?.designInterventions) ? [...direction.designInterventions].sort().join("|") : null,
            motionTreatment: direction?.motionTreatment,
            colorSet: direction?.colorSet ?? rendererThemes.get(direction?.colorScheme)?.colorSet
          });
        } catch {
          warnings.push(`Preskočen je neispravan design-direction.json u paketu ${post.name}.`);
        }
      }
    }
  }
  return [...recordsById.values()];
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

const requestedFormats = Array.isArray(input?.requestedFormats) ? input.requestedFormats : [];
if (!Array.isArray(input?.requestedFormats) || requestedFormats.length === 0) {
  errors.push("input.requestedFormats mora biti neprazan niz traženih formata.");
} else {
  const invalidFormats = requestedFormats.filter((format) => typeof format !== "string" || !supportedFormats.has(format));
  if (invalidFormats.length > 0) errors.push(`input.requestedFormats sadrži nepodržane vrednosti: ${invalidFormats.join(", ")}.`);
  if (new Set(requestedFormats).size !== requestedFormats.length) errors.push("input.requestedFormats ne sme sadržati duplikate.");
  if (supportedFormats.size !== requestedFormats.length || [...supportedFormats].some((format) => !requestedFormats.includes(format))) {
    errors.push("Svaki paket mora sadržati sva tri formata: feed, story i reels.");
  }
}

for (const field of ["eyebrow", "headline", "supportingText", "offerLabel", "cta"]) {
  if (!videoProps?.[field]?.trim()) errors.push(`video-props.json: prazno polje ${field}.`);
}
const promoLimits = { eyebrow: 28, primaryMessage: 14, secondaryMessage: 65, supportMessage: 65, productDetailMessage: 72, deadlineMessage: 32, retailMessage: 55, cta: 40 };
for (const [field, max] of Object.entries(promoLimits)) {
  if (videoProps?.[field] && videoProps[field].trim().length > max) errors.push(`video-props.json: ${field} prelazi limit od ${max} karaktera za promo sistem.`);
}
if (videoProps?.promoLayout && !supportedPromoLayouts.has(videoProps.promoLayout)) errors.push("video-props.json koristi nepodržan promoLayout.");
if (input?.postType === "akcija") {
  for (const field of ["primaryMessage", "secondaryMessage", "productDetailMessage", "deadlineMessage", "retailMessage", "brandSignature"]) {
    if (!videoProps?.[field]?.trim()) errors.push(`Akcijska objava mora popuniti promo slot ${field}.`);
  }
  if (!videoProps?.promoLayout) errors.push("Akcijska objava mora koristiti eksplicitni promoLayout (preporučeno: auto).");
}
if (videoProps?.promoLayout === "product-dominant-sticker") {
  if (!videoProps?.imageSrc?.trim()) errors.push("product-dominant-sticker zahteva imageSrc, jer proizvod mora biti primarna vizuelna masa.");
  for (const field of ["primaryMessage", "secondaryMessage", "retailMessage", "brandSignature"]) {
    if (!videoProps?.[field]?.trim()) errors.push(`product-dominant-sticker mora popuniti promo slot ${field}.`);
  }
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
if (input?.workflow) {
  const workflowSteps = input.workflow.steps;
  for (const step of ["text-and-feed", "story", "video"]) {
    if (workflowSteps?.[step]?.status !== "approved" || !workflowSteps?.[step]?.report?.trim()) {
      errors.push(`Workflow korak ${step} nema evidentirano korisničko odobrenje i jednorečenični izveštaj.`);
    }
  }
  if (input.workflow.currentStep !== "completed" || workflowSteps?.finalization?.status !== "completed") {
    errors.push("Paket mora završiti četvrti workflow korak, kopiranje iz generated/ u final/, pre pre-flight provere.");
  }
}
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
  for (const referenceFile of designDirection.referenceFiles) {
    const referencePath = typeof referenceFile === "string" && approvedReferenceFiles.has(referenceFile)
      ? resolve(repositoryRoot, "brand/design-references", referenceFile)
      : null;
    if (!referencePath) {
      errors.push(`Nedozvoljena dizajnerska referenca: ${referenceFile}. Dozvoljene su vrednosti iz brand/design-references/references.json.`);
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
for (const format of requestedFormats.filter((format) => supportedFormats.has(format))) {
  if (!designDirection?.formatAdaptations?.[format]?.trim()) errors.push(`Nedostaje formatAdaptations.${format} za namernu adaptaciju formata.`);
}
const formatPlan = designDirection?.formatPlan;
if (requestedFormats.includes("feed") && (!formatPlan?.feed?.readingOrder || !formatPlan?.feed?.productAnchor || !formatPlan?.feed?.layoutId)) errors.push("formatPlan.feed mora imati readingOrder, productAnchor i layoutId kada je Feed tražen.");
if (requestedFormats.includes("story") && (!formatPlan?.story?.readingOrder || !formatPlan?.story?.productAnchor || !formatPlan?.story?.layoutId)) errors.push("formatPlan.story mora imati readingOrder, productAnchor i layoutId kada je Story tražen.");
if (requestedFormats.includes("feed") && requestedFormats.includes("story")) {
  if (formatPlan?.feed?.layoutId && formatPlan.feed.layoutId === formatPlan?.story?.layoutId) errors.push("Feed i Story moraju imati različite layoutId vrednosti.");
  if (formatPlan?.feed?.readingOrder === formatPlan?.story?.readingOrder && formatPlan?.feed?.productAnchor === formatPlan?.story?.productAnchor) errors.push("Feed i Story moraju se razlikovati po redosledu čitanja ili poziciji proizvoda.");
}
if (requestedFormats.includes("reels")) {
  const shotPlan = formatPlan?.reels?.shotPlan;
  if (!formatPlan?.reels?.layoutId || !Array.isArray(shotPlan) || new Set(shotPlan).size < 3) errors.push("formatPlan.reels mora imati poseban layoutId i najmanje tri različite scene.");
}
if (videoProps?.promoLayout === "product-dominant-sticker") {
  if (requestedFormats.includes("feed") && formatPlan?.feed?.layoutId !== "product-dominant-sticker-feed") errors.push("product-dominant-sticker Feed mora koristiti layoutId product-dominant-sticker-feed.");
  if (requestedFormats.includes("story") && formatPlan?.story?.layoutId !== "product-dominant-sticker-story") errors.push("product-dominant-sticker Story mora koristiti layoutId product-dominant-sticker-story.");
  if (requestedFormats.includes("reels") && formatPlan?.reels?.layoutId !== "product-dominant-sticker-reel") errors.push("product-dominant-sticker Reels mora koristiti layoutId product-dominant-sticker-reel.");
}
if (designDirection?.family === "offer-orbit") {
  if (requestedFormats.includes("feed") && formatPlan?.feed?.layoutId !== "offer-orbit-feed-stage") errors.push("offer-orbit Feed mora koristiti stvarni layoutId offer-orbit-feed-stage.");
  if (requestedFormats.includes("story") && formatPlan?.story?.layoutId !== "offer-orbit-story-stack") errors.push("offer-orbit Story mora koristiti stvarni layoutId offer-orbit-story-stack.");
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
if (requestedFormats.includes("reels")) {
  if (!videoProps?.audioTrack?.trim() || !supportedAudioTracks.has(videoProps.audioTrack.trim())) {
    errors.push("video-props.json mora navesti važeći audioTrack iz public/mp3/ za Reels video.");
  } else if (!existsSync(resolve(repositoryRoot, "video-renderer/public", videoProps.audioTrack.trim()))) {
    errors.push(`Izabrani audioTrack ne postoji u video-renderer/public/${videoProps.audioTrack.trim()}.`);
  }
  if (!Number.isFinite(videoProps?.audioVolume) || videoProps.audioVolume < 0.75 || videoProps.audioVolume > 1) errors.push("video-props.json audioVolume mora biti broj između 0.75 i 1 kako bi muzika bila jasno čujna.");
}
if (designDirection?.logoSurface !== "none") errors.push("Originalni znak logoa se koristi bez pravougaone podloge.");
if (designDirection?.palettePlan === undefined) {
  errors.push("design-direction.json mora imati palettePlan.");
} else {
  const palettePlan = designDirection.palettePlan;
  for (const field of ["background", "surface", "textForeground", "textBackground", "accent", "logoBackground"]) {
    if (!paletteIds.has(palettePlan?.[field])) errors.push(`palettePlan.${field} mora koristiti identifikator iz brand/color-palette.json.`);
  }
  if (!palettePlan?.rationale?.trim()) errors.push("palettePlan.rationale mora objasniti izbor boja prema zadatku.");
  if (palettePlan?.textForeground && palettePlan?.textBackground && !safeTextPairs.has(`${palettePlan.textForeground}|${palettePlan.textBackground}`)) {
    errors.push("palettePlan tekstualni par nije dozvoljen: koristi safeTextPairs sa dovoljnim kontrastom.");
  }
  if (palettePlan?.logoBackground && !approvedLogoBackgrounds.has(palettePlan.logoBackground)) errors.push("palettePlan.logoBackground nije bezbedna kontrolisana podloga za originalni logo.");
  const logoVariant = designDirection?.logoVariant;
  const logoFile = logoVariantFiles[logoVariant];
  const allowedBackgrounds = logoFile && Array.isArray(approvedLogoPlacements?.[logoFile]) ? approvedLogoPlacements[logoFile] : [];
  if (!logoFile) errors.push("design-direction.json logoVariant mora biti on-light ili on-dark.");
  else if (!allowedBackgrounds.includes(palettePlan?.logoBackground)) errors.push(`Logo varijanta ${logoVariant} (${logoFile}) nije odobrena za palettePlan.logoBackground ${palettePlan?.logoBackground}.`);

  const colorScheme = designDirection?.colorScheme;
  const rendererTheme = rendererThemes.get(colorScheme);
  if (!rendererTheme) errors.push("design-direction.json colorScheme mora koristiti temu iz color-palette.json rendererThemes.");
  if (videoProps?.colorScheme !== colorScheme) errors.push("video-props.json colorScheme mora odgovarati design-direction.json colorScheme vrednosti.");
  if (rendererTheme) {
    if (designDirection?.colorSet !== rendererTheme.colorSet || videoProps?.colorSet !== rendererTheme.colorSet) {
      errors.push(`colorSet u video-props.json i design-direction.json mora odgovarati temi ${colorScheme}: ${rendererTheme.colorSet}.`);
    }
    const selectedSet = paletteSets.get(rendererTheme.colorSet);
    for (const field of ["background", "surface", "textForeground", "textBackground", "accent", "logoBackground"]) {
      if (selectedSet && !selectedSet.has(palettePlan?.[field])) errors.push(`palettePlan.${field} meša boju van izabranog seta ${rendererTheme.colorSet}.`);
    }
    const expectedPalettePlan = {
      background: rendererTheme.background,
      surface: rendererTheme.surface,
      textForeground: rendererTheme.dark,
      textBackground: rendererTheme.background,
      accent: rendererTheme.accent,
      logoBackground: rendererTheme.logoBackground,
    };
    for (const [field, expected] of Object.entries(expectedPalettePlan)) {
      if (palettePlan?.[field] !== expected) errors.push(`palettePlan.${field} mora odgovarati izabranoj colorScheme temi ${colorScheme}: ${expected}.`);
    }
    if (designDirection?.logoVariant !== rendererTheme.logoVariant) errors.push(`logoVariant mora odgovarati colorScheme temi ${colorScheme}: ${rendererTheme.logoVariant}.`);
  }
}
if (designDirection?.typography?.family !== "AUSekiManrope") errors.push("Finalni renderer mora koristiti Manrope font bez zamene.");
if (!Array.isArray(designDirection?.typography?.weights) || designDirection.typography.weights.length < 1) {
  errors.push("Nedostaju korišćene težine fonta u design-direction.json.");
}

const recentRecords = getDesignRecords().filter((record) => record?.id !== basename(postDirectory)).sort((a, b) => String(a.id).localeCompare(String(b.id))).slice(-3);
const latestColorRecord = recentRecords.at(-1);
if (designDirection?.colorSet && latestColorRecord?.colorSet === designDirection.colorSet) {
  errors.push(`colorSet mora da se smenjuje između objava; prethodna objava ${latestColorRecord.id} već koristi set ${designDirection.colorSet}.`);
}
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
const requestedFinalFiles = [
  ...(requestedFormats.includes("feed") ? ["feed-1080x1350.png"] : []),
  ...(requestedFormats.includes("story") ? ["story-1080x1920.png"] : []),
  ...(requestedFormats.includes("reels") ? ["reels-1080x1920.mp4"] : []),
  "caption.md",
];
for (const file of requestedFinalFiles) {
  if (!existsSync(join(finalDirectory, file))) errors.push(`Nedostaje final/${file}.`);
}
const requiredValidatedRenders = requestedFormats.flatMap((format) => renderRequirements[format] ?? []).map((entry) => entry.path);
if (!Array.isArray(designDirection?.validatedRenders) || requiredValidatedRenders.some((path) => !designDirection.validatedRenders.includes(path))) {
  errors.push("U design-direction.json nedostaju tačne putanje pregledanih rendera za sve tražene formate.");
}
for (const relativePath of requiredValidatedRenders) {
  if (!existsSync(resolve(postDirectory, relativePath))) errors.push(`Evidentirani render ne postoji: ${relativePath}.`);
}

for (const { path: relativePath, width: expectedWidth, height: expectedHeight } of requestedFormats.flatMap((format) => renderRequirements[format] ?? [])) {
  const absolutePath = resolve(postDirectory, relativePath);
  const media = existsSync(absolutePath) ? probeMedia(absolutePath) : null;
  if (!media || Number(media.width) !== expectedWidth || Number(media.height) !== expectedHeight) errors.push(`${relativePath} mora imati dimenzije ${expectedWidth}x${expectedHeight}.`);
}
if (requestedFormats.includes("reels")) {
  const reelsPath = resolve(postDirectory, "final/reels-1080x1920.mp4");
  const reelsMedia = existsSync(reelsPath) ? probeMedia(reelsPath) : null;
  const reelsDuration = Number(reelsMedia?.formatDuration ?? reelsMedia?.duration);
  if (!reelsMedia || Number(reelsMedia.width) !== 1080 || Number(reelsMedia.height) !== 1920 || !Number.isFinite(reelsDuration) || reelsDuration < 11.5 || reelsDuration > 12.5) {
    errors.push("Finalni Reels mora biti 1080x1920 i trajati približno 12 sekundi.");
  } else if (!hasAudioStream(reelsPath)) {
    errors.push("Finalni Reels mora sadržati audio stream.");
  } else {
    const audioLevels = probeAudioLevels(reelsPath);
    if (!Number.isFinite(audioLevels.meanVolume) || !Number.isFinite(audioLevels.maxVolume) || audioLevels.meanVolume < -20 || audioLevels.maxVolume < -10) {
      errors.push("Finalni Reels ima audio stream, ali muzička podloga nije dovoljno čujna (minimum: mean -20 dB i peak -10 dB).");
    }
  }
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
const requiredQualityCriteria = [...baseQualityCriteria, ...(requestedFormats.includes("reels") ? ["reelsDynamics"] : [])];
for (const criterion of requiredQualityCriteria) {
  const entry = qualityReview?.criteria?.[criterion];
  if (!Number.isFinite(entry?.score) || entry.score < 4 || entry.score > 5 || !entry?.note?.trim() || entry.note.trim().length < 20) errors.push(`Kriterijum ${criterion} mora imati ocenu 4–5 i konkretan dokaz.`);
}
if (!qualityReview?.weakestArea?.trim()) errors.push("quality-review.json mora imenovati najslabiju preostalu oblast.");
if (!qualityReview?.revisionEvidence?.issueFound?.trim() || !qualityReview?.revisionEvidence?.changeMade?.trim()) errors.push("Mora biti dokumentovana najmanje jedna stvarna korekcija između drafta i finala.");
const expectedRevision = requestedFormats.includes("feed")
  ? { before: "generated/feed-draft.png", after: "final/feed-1080x1350.png", hashKey: "feedDraft" }
  : requestedFormats.includes("story")
    ? { before: "generated/story-draft.png", after: "final/story-1080x1920.png", hashKey: "storyDraft" }
    : { before: "generated/reels-intro-draft.png", after: "generated/reels-intro.png", hashKey: "reelsIntroDraft" };
if (qualityReview?.revisionEvidence?.before !== expectedRevision.before || qualityReview?.revisionEvidence?.after !== expectedRevision.after) errors.push(`Dokaz revizije mora porediti ${expectedRevision.before} sa ${expectedRevision.after}.`);
const beforePath = qualityReview?.revisionEvidence?.before ? resolve(postDirectory, qualityReview.revisionEvidence.before) : null;
const afterPath = qualityReview?.revisionEvidence?.after ? resolve(postDirectory, qualityReview.revisionEvidence.after) : null;
if (!beforePath || !afterPath || !inside(postDirectory, beforePath) || !inside(postDirectory, afterPath) || !existsSync(beforePath) || !existsSync(afterPath) || hashFile(beforePath) === hashFile(afterPath)) errors.push("Draft i final moraju postojati i imati različite hasheve kao dokaz iteracije.");
if (qualityReview?.independentReview?.performed !== true || qualityReview?.independentReview?.verdict !== "meets-reference-bar" || !qualityReview?.independentReview?.reviewerId?.trim() || qualityReview.independentReview.reviewerId === designDirection?.authorId || qualityReview?.independentReview?.rawArtifactOnly !== true || !qualityReview?.independentReview?.method?.trim() || !qualityReview?.independentReview?.notes?.trim()) errors.push("Nezavisni pregled mora imati drugog reviewerId autora, pregled sirovih artefakata i pozitivan referentni verdict.");
const rendererPath = resolve(repositoryRoot, "video-renderer/src/Composition.tsx");
const rendererCssPath = resolve(repositoryRoot, "video-renderer/src/index.css");
for (const [key, relativePath] of [
  ...requestedFormats.flatMap((format) => (renderRequirements[format] ?? []).map((entry) => [entry.hashKey, entry.path])),
  ...(requestedFormats.includes("reels") ? [["reelsMp4", "final/reels-1080x1920.mp4"]] : []),
  [expectedRevision.hashKey, expectedRevision.before],
  ["referenceComparison", "generated/reference-comparison.png"],
  ["formatComparison", "generated/format-comparison.png"],
  ["input", "input.json"],
  ["videoProps", "video-props.json"],
  ["designDirection", "generated/design-direction.json"],
]) {
  const absolutePath = resolve(postDirectory, relativePath);
  if (!existsSync(absolutePath) || qualityReview?.renderHashes?.[key] !== hashFile(absolutePath)) errors.push(`quality-review hash nije aktuelan za ${relativePath}.`);
}
const localFontDirectory = resolve(repositoryRoot, "video-renderer/public/assets");
const localFontPaths = existsSync(localFontDirectory)
  ? readdirSync(localFontDirectory, { withFileTypes: true })
    .filter((entry) => entry.isFile() && /\.(?:woff2?|ttf|otf)$/i.test(entry.name))
    .map((entry) => resolve(localFontDirectory, entry.name))
    .sort()
  : [];
for (const logoFile of Object.values(logoVariantFiles)) {
  const canonicalLogoPath = resolve(repositoryRoot, "logos", logoFile);
  const rendererLogoPath = resolve(repositoryRoot, "video-renderer/public/assets", logoFile);
  if (!existsSync(canonicalLogoPath) || !existsSync(rendererLogoPath) || hashFile(canonicalLogoPath) !== hashFile(rendererLogoPath)) {
    errors.push(`Rendererova kopija ${logoFile} mora biti identična kanonskom fajlu iz logos/.`);
  }
}
const systemHashPaths = [
  ["renderer", rendererPath],
  ["rendererCss", rendererCssPath],
  ["referenceManifest", referenceManifestPath],
  ["brandConfig", resolve(repositoryRoot, "brand/brand-config.json")],
  ["colorPalette", palettePath],
  ["rendererPackage", resolve(repositoryRoot, "video-renderer/package.json")],
  ["rendererPackageLock", resolve(repositoryRoot, "video-renderer/package-lock.json")],
  ["logoCanonical:logo-tamniji.svg", resolve(repositoryRoot, "logos/logo-tamniji.svg")],
  ["logoCanonical:logo-svetliji.svg", resolve(repositoryRoot, "logos/logo-svetliji.svg")],
  ["logoRenderer:logo-tamniji.svg", resolve(repositoryRoot, "video-renderer/public/assets/logo-tamniji.svg")],
  ["logoRenderer:logo-svetliji.svg", resolve(repositoryRoot, "video-renderer/public/assets/logo-svetliji.svg")],
  ...localFontPaths.map((path) => [`font:${relative(repositoryRoot, path)}`, path]),
  ...(requestedFormats.includes("reels") && supportedAudioTracks.has(videoProps?.audioTrack?.trim())
    ? [[`audioTrack:${videoProps.audioTrack.trim()}`, resolve(repositoryRoot, "video-renderer/public", videoProps.audioTrack.trim())]]
    : []),
];
for (const [key, absolutePath] of [
  ...systemHashPaths,
  ...[...approvedReferenceFiles].filter((file) => typeof file === "string").map((file) => [`reference:${file}`, resolve(repositoryRoot, "brand/design-references", file)]),
]) {
  if (!existsSync(absolutePath) || qualityReview?.renderHashes?.[key] !== hashFile(absolutePath)) errors.push(`quality-review hash nije aktuelan za ${relative(repositoryRoot, absolutePath)}.`);
}

const renderer = existsSync(rendererPath) ? readFileSync(rendererPath, "utf8") : "";
const rendererCss = existsSync(rendererCssPath) ? readFileSync(rendererCssPath, "utf8") : "";
if (!renderer.includes("AUSekiManrope") || !renderer.includes("loadFont") || !renderer.includes('staticFile("assets/manrope-latin.woff2")') || !renderer.includes('staticFile("assets/manrope-latin-ext.woff2")') || renderer.includes("Arial")) {
  errors.push("Renderer nema obavezno učitavanje punog Manrope fonta bez fallbacka.");
}
if (!renderer.includes("LogoMark")) errors.push("Renderer nema obavezni originalni znak logoa.");
if (!renderer.includes('from "lucide-react"') || !renderer.includes("<MapPin")) {
  errors.push("Renderer nema obaveznu Lucide ikonu za grafičke i video objave.");
}
if (!renderer.includes('const isTransparentProduct = imageBackground === "transparent";') || !renderer.includes('data-qa="product-stage"') || !renderer.includes('data-qa="product"')) {
  errors.push("Renderer nema obavezan režim koji uklanja pravougaoni ram/podlogu oko transparentnog PNG proizvoda.");
}
if (!renderer.includes("bottomPadding") || !renderer.includes("overflow: \"hidden\"")) {
  errors.push("Renderer mora osigurati dno kontejnera tako da futer ne prekriva ikone ili tekst, i da slika proizvoda ne prelazi preko teksta.");
}
const premiumProductStageStart = renderer.indexOf("const PremiumProductStage");
const premiumProductStageEnd = premiumProductStageStart === -1 ? -1 : renderer.indexOf("const SekiTiliaPost", premiumProductStageStart);
const premiumProductStageRenderer = premiumProductStageStart === -1 ? "" : renderer.slice(premiumProductStageStart, premiumProductStageEnd === -1 ? undefined : premiumProductStageEnd);
if (!renderer.includes('case "premium-product-stage": return <PremiumProductStage') || !premiumProductStageRenderer) {
  errors.push("Renderer nema podržanu premium-product-stage familiju.");
} else if (!premiumProductStageRenderer.includes('const isTransparentProduct = imageBackground === "transparent";') || !premiumProductStageRenderer.includes('data-qa="product-stage"')) {
  errors.push("premium-product-stage nema obavezan transparentni režim bez pravougaonog rama/podloge oko proizvoda.");
}
for (const family of ["offer-orbit", "type-stage", "gallery-shelf"]) {
  const componentName = family.split("-").map((part) => part[0].toUpperCase() + part.slice(1)).join("");
  if (!renderer.includes(`case "${family}": return <${componentName}`)) {
    errors.push(`Renderer nema podržanu familiju ${family}.`);
  }
}
if (!renderer.includes("<Sequence") || !renderer.includes("PromoHook") || !renderer.includes('data-qa="reels-hook"') || !renderer.includes('data-qa="reels-closing"') || !renderer.includes("motionTreatment") || !renderer.includes("HeroScene") || !renderer.includes("const reelsTiming") || !renderer.includes("reelsTiming.hook") || !renderer.includes("reelsTiming.hero") || !renderer.includes("reelsTiming.closing")) {
  errors.push("Renderer nema stvarni višescenski Reels tok sa čisim HeroScene tranzicijama (bez preklapanja u 8. i 9. sekundi).");
}
if (!renderer.includes('from "@remotion/media"') || !renderer.includes("<RemotionAudio loop") || !renderer.includes("volume={volume}") || renderer.includes("trimBefore=") || renderer.includes("pillPulse") || renderer.includes("limePulse") || renderer.includes("scale: bgScale")) {
  errors.push("Renderer mora koristiti čujnu MP3 podlogu i stabilan tekst bez pulsiranja nakon ulazne animacije.");
}
if (/\b(?:drop-shadow|box-shadow|shadow|blur)\b/i.test(renderer)) errors.push("Renderer ne sme koristiti senke ili blur.");
for (const qaRole of ["product-stage", "product", "podium", "headline", "cta-footer"]) {
  if (!renderer.includes(`data-qa="${qaRole}"`)) errors.push(`Renderer nema obaveznu QA ulogu ${qaRole}.`);
}
for (const promoAnchor of ["promo-feed-template", "promo-story-template", "promo-primary", "promo-product-detail", "promo-deadline", "promo-support-shape"]) {
  if (!renderer.includes(`data-qa="${promoAnchor}"`)) errors.push(`Renderer nema promo sistemsku komponentu ${promoAnchor}.`);
}
if (!renderer.includes("const promoTokens") || !renderer.includes("promoLightBackground") || !renderer.includes("promoDarkBackground") || !renderer.includes("color-mix(in srgb") || !renderer.includes("PromoFeed45") || !renderer.includes("PromoStory916") || renderer.includes("footerTop") || !renderer.includes("borderTop: `6px solid ${colors.lime}`") || !renderer.includes('data-qa="reels-product-detail"') || !renderer.includes('props.promoLayout === "feed-left-product-right"') || !renderer.includes('height > 1500 ? <PromoStory916') || !renderer.includes('data-qa="product-dominant-sticker-template"') || !renderer.includes('data-qa="sticker-product-stage"') || !renderer.includes('data-qa="promo-sticker"') || !renderer.includes("return <ProductDominantSticker")) {
  errors.push("Renderer nema kompletne promo mastere sa gradijentom aktivnog tona, većim rokom, svetlozelenom footer linijom, footerom vezanim za dno, sigurnim vertikalnim rutiranjem i product-dominant-sticker varijantom.");
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
