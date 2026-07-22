import { existsSync, readdirSync, readFileSync } from "node:fs";
import { basename, join, resolve } from "node:path";

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
const requiredRenderKeys = ["feed", "story", "reels-intro", "reels-offer", "reels-closing"];

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
if (!supportedFamilies.has(videoProps?.designVariant)) {
  errors.push("video-props.json koristi nepodržanu designVariant vrednost.");
}
if (videoProps?.imageSrc?.trim() && !supportedImageBackgrounds.has(videoProps?.imageBackground)) {
  errors.push("video-props.json mora navesti imageBackground kao transparent ili opaque kada koristi sliku proizvoda.");
}

if (!caption) warnings.push("Caption još nije sačuvan u generated/caption.md ili final/caption.md.");
if (!review.includes("Status: SPREMNO ZA LJUDSKU PROVERU")) errors.push("review.md nema status SPREMNO ZA LJUDSKU PROVERU.");
if (!existsSync(visualDesignSkillPath)) errors.push("Nedostaje obavezni agent-skills-required/visual-design/SKILL.md.");
if (!review.includes("- [x] Vizuelni dizajn je izrađen i pregledan prema agent-skills-required/visual-design/SKILL.md.")) {
  errors.push("Nedostaje potvrda obavezne vizuelne provere prema agent-skills-required/visual-design/SKILL.md.");
}
if (!review.includes("- [x] Sadržajni ugao, najmanje dve dizajnerske intervencije i Reels ritam, kada postoji, stvarno se razlikuju od poslednje tri objave.")) {
  errors.push("Nedostaje potvrda stvarne varijacije sadržaja, dizajna i Reels ritma.");
}
if (!review.includes("- [x] Logo, glavna poruka, ponuda, proizvod i CTA, kada postoje, jasno su vidljivi i kontrastni u svakom formatu.")) {
  errors.push("Nedostaje potvrda provere vidljivosti i kontrasta obaveznih elemenata u svakom formatu.");
}
if (input?.postType !== "tekstualna-objava" && !review.includes("- [x] Korišćena je najmanje jedna semantička Lucide ikona na svakoj grafici i video kadru, osim kod čiste tekstualne objave.")) {
  errors.push("Nedostaje potvrda korišćenja semantičke Lucide ikone na grafici i video kadrovima.");
}
if (!review.includes("- [x] Pravougaoni paneli, kartice, footeri, proizvodne podloge, okviri i logo-kartica imaju oštre uglove. Zaobljenje je korišćeno samo za pill-dugme/ponudnu oznaku ili kružni dekorativni oblik.")) {
  errors.push("Nedostaje potvrda provere oštrih uglova pravougaonih elemenata.");
}
if (!review.includes("- [x] Transparentni PNG proizvoda, kada je korišćen, nema dodatni pravougaoni ram, karticu, okvir ni podlogu, a proizvod je dovoljno velik da nosi kadar bez suvišne praznine.")) {
  errors.push("Nedostaje potvrda provere tretmana transparentnog PNG proizvoda i njegove vizuelne skale.");
}
const requiresPremiumProductSceneReview = videoProps?.designVariant === "premium-product-stage" || videoProps?.imageBackground === "transparent";
if (requiresPremiumProductSceneReview && !review.includes("- [x] Produktna scena ima dominantan proizvod i namerni vizuelni kontekst, bez nedovršenog praznog prostora. Kada je proizvod transparentni PNG, nema dodatni pravougaoni ram, karticu, okvir ni podlogu.")) {
  errors.push("Nedostaje potvrda da produktna scena ima dominantan proizvod, namerni kontekst i ispravan tretman transparentnog PNG-a.");
}
if (videoProps?.designVariant === "premium-product-stage" && !videoProps?.imageSrc?.trim()) {
  errors.push("premium-product-stage zahteva imageSrc, jer proizvod mora biti glavni vizuelni element scene.");
}

if (!supportedFamilies.has(designDirection?.family)) errors.push("Nedostaje podržana dizajnerska familija u design-direction.json.");
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
if (!Array.isArray(designDirection?.validatedRenders) || requiredRenderKeys.some((key) => !designDirection.validatedRenders.some((render) => typeof render === "string" && render.includes(key)))) {
  errors.push("U design-direction.json nedostaju evidentirani Feed, Story i Reels ključni kadrovi pregleda.");
}

const rendererPath = resolve(repositoryRoot, "video-renderer/src/Composition.tsx");
const renderer = existsSync(rendererPath) ? readFileSync(rendererPath, "utf8") : "";
const rendererCssPath = resolve(repositoryRoot, "video-renderer/src/index.css");
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
if (!renderer.includes("MotionTreatmentLayer") || !renderer.includes("motionTreatment")) {
  errors.push("Renderer nema podržan motionTreatment za stvarnu varijaciju Reels ritma.");
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
