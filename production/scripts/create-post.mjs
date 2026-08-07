import { randomInt } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(scriptDirectory, "../..");
const colorPalette = JSON.parse(readFileSync(join(repositoryRoot, "brand/color-palette.json"), "utf8"));
const rendererThemes = Array.isArray(colorPalette?.rendererThemes) ? colorPalette.rendererThemes : [];
const paletteSets = Array.isArray(colorPalette?.paletteSets) ? colorPalette.paletteSets : [];
const paletteSetIds = paletteSets.map((set) => set?.id).filter((id) => typeof id === "string");
const rendererThemeMap = new Map(rendererThemes.map((theme) => [theme.id, theme]));
if (rendererThemes.length === 0 || paletteSetIds.length < 2 || rendererThemes.some((theme) => !paletteSetIds.includes(theme?.colorSet)) || paletteSetIds.some((setId) => !rendererThemes.some((theme) => theme.colorSet === setId))) {
  console.error("brand/color-palette.json mora sadržati najmanje dva paletteSets seta i rendererThemes teme vezane za njih.");
  process.exit(1);
}
const args = process.argv.slice(2);
const valueFor = (name) => {
  const index = args.indexOf(name);
  return index === -1 ? undefined : args[index + 1];
};

const slug = valueFor("--slug");
const date = valueFor("--date") ?? new Date().toISOString().slice(0, 10);
const dryRun = args.includes("--dry-run");

if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
  console.error('Koristi: node production/scripts/create-post.mjs --slug "kratak-naziv" [--date GGGG-MM-DD]');
  process.exit(1);
}

if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
  console.error("Datum mora biti u formatu GGGG-MM-DD.");
  process.exit(1);
}

const [year, month] = date.split("-");
const monthDirectory = join(repositoryRoot, "productions", year, month);
const existingEntries = existsSync(monthDirectory) ? readdirSync(monthDirectory, { withFileTypes: true }) : [];
const sequence = existingEntries
  .filter((entry) => entry.isDirectory() && /^\d{3}-/.test(entry.name))
  .length + 1;
const id = `${String(sequence).padStart(3, "0")}-${date}-${slug}`;
const postDirectory = join(monthDirectory, id);

if (dryRun) {
  console.log(`Bio bi kreiran paket objave: ${postDirectory}`);
  process.exit(0);
}

mkdirSync(monthDirectory, { recursive: true });

if (existsSync(postDirectory)) {
  console.error(`Folder već postoji: ${postDirectory}`);
  process.exit(1);
}

for (const directory of [postDirectory, join(postDirectory, "source"), join(postDirectory, "generated"), join(postDirectory, "generated", "assets"), join(postDirectory, "final")]) {
  mkdirSync(directory, { recursive: true });
}

writeFileSync(join(postDirectory, "brief.md"), `# Izvorni brief\n\nNalepi ovde poruku, želje i napomene koje je klijent poslao.\n`);
writeFileSync(join(postDirectory, "input.json"), JSON.stringify({
  id,
  date,
  status: "brief-primljen",
  workflow: {
    currentStep: "text-and-feed",
    steps: {
      "text-and-feed": { status: "pending", report: null, approvedAt: null },
      story: { status: "pending", report: null, approvedAt: null },
      video: { status: "pending", report: null, approvedAt: null },
      finalization: { status: "pending", finalizedAt: null }
    }
  },
  postType: null,
  product: null,
  contentApproach: null,
  copyFreshnessNote: null,
  captionMode: "universal",
  requestedVideoStyle: null,
  clientFacts: [],
  claims: [],
  confirmedOffer: {
    mechanic: null,
    value: null,
    regularPrice: null,
    promoPrice: null,
    validFrom: null,
    validUntil: null,
    source: null
  },
  blockingMissingFacts: [],
  locationId: null,
  sourceAssets: [],
  requestedFormats: ["feed", "story", "reels"]
}, null, 2) + "\n");
const availableAudioTracks = [
  "mp3/clear-path.mp3",
  "mp3/clear-path-ambient.mp3",
  "mp3/open-sky-drift.mp3",
  "mp3/open-sky-drift-chill.mp3",
  "mp3/paper-sun-parade.mp3",
  "mp3/paper-sun-parade-upbeat.mp3"
];
const selectedAudioTrack = availableAudioTracks[randomInt(availableAudioTracks.length)];
const readyColorRecords = [];
const productionsDirectory = join(repositoryRoot, "productions");
if (existsSync(productionsDirectory)) {
  for (const yearEntry of readdirSync(productionsDirectory, { withFileTypes: true })) {
    if (!yearEntry.isDirectory()) continue;
    const yearDirectory = join(productionsDirectory, yearEntry.name);
    for (const monthEntry of readdirSync(yearDirectory, { withFileTypes: true })) {
      if (!monthEntry.isDirectory()) continue;
      const existingMonthDirectory = join(yearDirectory, monthEntry.name);
      for (const postEntry of readdirSync(existingMonthDirectory, { withFileTypes: true })) {
        if (!postEntry.isDirectory()) continue;
        const existingPostDirectory = join(existingMonthDirectory, postEntry.name);
        const inputPath = join(existingPostDirectory, "input.json");
        const directionPath = join(existingPostDirectory, "generated/design-direction.json");
        if (!existsSync(inputPath) || !existsSync(directionPath)) continue;
        try {
          const existingInput = JSON.parse(readFileSync(inputPath, "utf8"));
          const existingDirection = JSON.parse(readFileSync(directionPath, "utf8"));
          if (existingInput?.status !== "spremno-za-ljudsku-proveru") continue;
          const themeSet = rendererThemeMap.get(existingDirection?.colorScheme)?.colorSet;
          const planColors = Object.values(existingDirection?.palettePlan ?? {});
          const inferredSet = paletteSets.find((set) => planColors.some((color) => set.colors.includes(color)))?.id;
          const colorSet = paletteSetIds.includes(existingDirection?.colorSet)
            ? existingDirection.colorSet
            : paletteSetIds.includes(themeSet)
              ? themeSet
              : inferredSet;
          if (colorSet) readyColorRecords.push({ colorSet, id: postEntry.name });
        } catch {
          // Neispravan ili nedovršen lokalni paket ne utiče na sledeći izbor boja.
        }
      }
    }
  }
}
const lastColorSet = readyColorRecords.sort((a, b) => a.id.localeCompare(b.id)).at(-1)?.colorSet;
const selectedColorSet = lastColorSet && paletteSetIds.includes(lastColorSet)
  ? paletteSetIds[(paletteSetIds.indexOf(lastColorSet) + 1) % paletteSetIds.length]
  : paletteSetIds[randomInt(paletteSetIds.length)];
const eligibleThemes = rendererThemes.filter((theme) => theme.colorSet === selectedColorSet);
const selectedColorTheme = eligibleThemes[randomInt(eligibleThemes.length)];

writeFileSync(join(postDirectory, "video-props.json"), JSON.stringify({
  eyebrow: "",
  headline: "",
  supportingText: "",
  offerLabel: "",
  offerKind: "none",
  cta: "",
  imageSrc: "",
  imageBackground: "unknown",
  productShape: "unknown",
  locationLine: "AU Šeki-Tilia",
  designVariant: "",
  motionTreatment: "",
  audioTrack: selectedAudioTrack,
  audioVolume: 0.9,
  videoTemplate: "reel-v1",
  colorSet: selectedColorSet,
  colorScheme: selectedColorTheme.id,
  primaryMessage: "",
  secondaryMessage: "",
  supportMessage: "",
  retailMessage: "",
  brandSignature: "AU Šeki-Tilia",
  promoLayout: "auto"
}, null, 2) + "\n");
writeFileSync(join(postDirectory, "generated", "design-direction.json"), JSON.stringify({
  family: null,
  authorId: null,
  signature: null,
  referenceFiles: [],
  referenceTraits: [],
  distinctFromRecent: null,
  designInterventions: [],
  freshInterventionNote: null,
  motionTreatment: null,
  videoTemplate: "reel-v1",
  colorSet: selectedColorSet,
  colorScheme: selectedColorTheme.id,
  formatAdaptations: { feed: null, story: null, reels: null },
  formatPlan: {
    feed: { readingOrder: null, productAnchor: null, layoutId: null },
    story: { readingOrder: null, productAnchor: null, layoutId: null },
    reels: { shotPlan: [], layoutId: null }
  },
  familyFit: {
    productShape: null,
    supportsOfferStrength: false,
    supportsSceneDepth: false,
    rationale: null
  },
  logoSurface: "none",
  logoVariant: selectedColorTheme.logoVariant,
  palettePlan: {
    background: selectedColorTheme.background,
    surface: selectedColorTheme.surface,
    textForeground: selectedColorTheme.dark,
    textBackground: selectedColorTheme.background,
    accent: selectedColorTheme.accent,
    logoBackground: selectedColorTheme.logoBackground,
    rationale: null
  },
  typography: { family: "AUSekiManrope", weights: [] },
  validatedRenders: []
}, null, 2) + "\n");
writeFileSync(join(postDirectory, "generated", "asset-review.json"), JSON.stringify({ version: 1, generatedAt: null, assets: [] }, null, 2) + "\n");
writeFileSync(join(postDirectory, "generated", "copy-review.json"), JSON.stringify({
  version: 1,
  status: "pending",
  captionMode: "universal",
  primaryAction: null,
  confirmedValue: null,
  valueAddedBeyondVisual: null,
  factualChecks: { product: false, offer: false, deadline: false, availability: false },
  languageReview: { serbianLatin: false, naturalTone: false, noUnsupportedClaims: false, noGenericPhrases: false }
}, null, 2) + "\n");
writeFileSync(join(postDirectory, "generated", "quality-review.json"), JSON.stringify({
  version: 1,
  status: "pending",
  evidence: { referenceComparison: null, formatComparison: null },
  renderHashes: {},
  criteria: {},
  weakestArea: null,
  revisionEvidence: { issueFound: null, changeMade: null, before: null, after: null },
  independentReview: { performed: false, reviewerId: null, method: null, rawArtifactOnly: false, verdict: null, notes: null }
}, null, 2) + "\n");
writeFileSync(join(postDirectory, "review.md"), "# Provera objave\n\nStatus: BLOKIRANO\n\nStrukturisani izvori istine za vizuelni prolaz su `generated/asset-review.json` i `generated/quality-review.json`. Ovaj dokument je ljudski sažetak i ne može samostalno otključati paket.\n\n- [ ] Proizvod nije lek ni antibiotik / status je potvrđen.\n- [ ] Sve informacije o proizvodu potiču od klijenta, proizvođača ili stručne osobe.\n- [ ] Mehanika akcije, vrednost, izvor i rok su potvrđeni kada je post tipa akcija.\n- [ ] Lokacijski podaci su potvrđeni ili nisu navedeni.\n- [ ] Nema dijagnoze, terapijske preporuke ni obećanja rezultata.\n- [ ] Vizual ne predstavlja generisanu osobu kao stvarnog zaposlenog.\n- [ ] Asset pregled je vezan hashom za korišćeni fajl, nema `blockingDefects`, a sva prihvatljiva ograničenja su evidentirana u `qualityLimitations`.\n- [ ] Vizuelni kvalitet ima najmanje 4/5 po svakom kriterijumu u quality-review.json.\n- [ ] Dokumentovana je najmanje jedna stvarna revizija između drafta i finala.\n- [ ] Nezavisni vizuelni pregled potvrđuje da je dostignut prag referenci.\n- [ ] Tekst je jezički i vizuelno pregledan.\n\nNapomene i nedostajući podaci:\n");

console.log(`Kreiran paket objave: ${postDirectory}`);
