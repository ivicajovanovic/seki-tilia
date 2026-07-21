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

for (const directory of [postDirectory, join(postDirectory, "source"), join(postDirectory, "generated"), join(postDirectory, "final")]) {
  mkdirSync(directory, { recursive: true });
}

writeFileSync(join(postDirectory, "brief.md"), `# Izvorni brief\n\nNalepi ovde poruku, želje i napomene koje je klijent poslao.\n`);
writeFileSync(join(postDirectory, "input.json"), JSON.stringify({
  id,
  date,
  status: "brief-primljen",
  postType: null,
  product: null,
  clientFacts: [],
  claims: [],
  confirmedOffer: { price: null, discount: null, validUntil: null },
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
  cta: "",
  imageSrc: "",
  imageBackground: "unknown",
  locationLine: "AU Šeki-Tilia",
  designVariant: ""
}, null, 2) + "\n");
writeFileSync(join(postDirectory, "generated", "design-direction.json"), JSON.stringify({
  family: null,
  signature: null,
  referenceFiles: [],
  referenceTraits: [],
  distinctFromRecent: null,
  logoSurface: "cream-card",
  typography: { family: "AUSekiManrope", weights: [] },
  validatedRenders: []
}, null, 2) + "\n");
writeFileSync(join(postDirectory, "review.md"), "# Provera objave\n\nStatus: BLOKIRANO\n\n- [ ] Proizvod nije lek ni antibiotik / status je potvrđen.\n- [ ] Sve informacije o proizvodu potiču od klijenta, proizvođača ili stručne osobe.\n- [ ] Cena, popust i datum su potvrđeni ili nisu navedeni.\n- [ ] Lokacijski podaci su potvrđeni ili nisu navedeni.\n- [ ] Nema dijagnoze, terapijske preporuke ni obećanja rezultata.\n- [ ] Vizual ne predstavlja generisanu osobu kao stvarnog zaposlenog.\n- [ ] Vizuelni dizajn je izrađen i pregledan prema skills/visual-design/SKILL.md.\n- [ ] Logo, glavna poruka, ponuda, proizvod i CTA, kada postoje, jasno su vidljivi i kontrastni u svakom formatu.\n- [ ] Korišćena je najmanje jedna semantička Lucide ikona na svakoj grafici i video kadru, osim kod čiste tekstualne objave.\n- [ ] Pravougaoni paneli, kartice, footeri, proizvodne podloge, okviri i logo-kartica imaju oštre uglove. Zaobljenje je korišćeno samo za pill-dugme/ponudnu oznaku ili kružni dekorativni oblik.\n- [ ] Transparentni PNG proizvoda, kada je korišćen, nema dodatni pravougaoni ram, karticu, okvir ni podlogu, a proizvod je dovoljno velik da nosi kadar bez suvišne praznine.\n- [ ] Produktna scena ima dominantan proizvod i namerni vizuelni kontekst, bez nedovršenog praznog prostora. Kada je proizvod transparentni PNG, nema dodatni pravougaoni ram, karticu, okvir ni podlogu.\n- [ ] Tekst je jezički i vizuelno pregledan.\n\nNapomene i nedostajući podaci:\n");

console.log(`Kreiran paket objave: ${postDirectory}`);
