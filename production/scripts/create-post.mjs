import { existsSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(scriptDirectory, "../..");
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
  postType: null,
  product: null,
  contentApproach: null,
  copyFreshnessNote: null,
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
  requestedFormats: ["feed", "story", "reels"],
  requiresProfessionalReview: true
}, null, 2) + "\n");
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
  motionTreatment: ""
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
  logoSurface: "cream-card",
  typography: { family: "AUSekiManrope", weights: [] },
  validatedRenders: []
}, null, 2) + "\n");
writeFileSync(join(postDirectory, "generated", "asset-review.json"), JSON.stringify({ version: 1, generatedAt: null, assets: [] }, null, 2) + "\n");
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
writeFileSync(join(postDirectory, "review.md"), "# Provera objave\n\nStatus: BLOKIRANO\n\nStrukturisani izvori istine za vizuelni prolaz su `generated/asset-review.json` i `generated/quality-review.json`. Ovaj dokument je ljudski sažetak i ne može samostalno otključati paket.\n\n- [ ] Proizvod nije lek ni antibiotik / status je potvrđen.\n- [ ] Sve informacije o proizvodu potiču od klijenta, proizvođača ili stručne osobe.\n- [ ] Mehanika akcije, vrednost, izvor i rok su potvrđeni kada je post tipa akcija.\n- [ ] Lokacijski podaci su potvrđeni ili nisu navedeni.\n- [ ] Nema dijagnoze, terapijske preporuke ni obećanja rezultata.\n- [ ] Vizual ne predstavlja generisanu osobu kao stvarnog zaposlenog.\n- [ ] Asset pregled je vezan hashom za korišćeni fajl i nema otvorene defekte.\n- [ ] Vizuelni kvalitet ima najmanje 4/5 po svakom kriterijumu u quality-review.json.\n- [ ] Dokumentovana je najmanje jedna stvarna revizija između drafta i finala.\n- [ ] Nezavisni vizuelni pregled potvrđuje da je dostignut prag referenci.\n- [ ] Tekst je jezički i vizuelno pregledan.\n\nNapomene i nedostajući podaci:\n");

console.log(`Kreiran paket objave: ${postDirectory}`);
