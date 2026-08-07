import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFileSync, spawnSync } from "node:child_process";
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { basename, join, relative, resolve } from "node:path";
import test, { after } from "node:test";

const repositoryRoot = resolve(import.meta.dirname, "../..");
const fixtureRoot = join(repositoryRoot, "productions-test");
const mediaCache = join(fixtureRoot, "media-cache");
const checkerPath = join(repositoryRoot, "production/scripts/check-post.mjs");
const hashFile = (path) => createHash("sha256").update(readFileSync(path)).digest("hex");
const referenceManifestPath = join(repositoryRoot, "brand/design-references/references.json");
const approvedReferenceFiles = JSON.parse(readFileSync(referenceManifestPath, "utf8")).approved;
const createdJobRoots = [];
let mediaReady = false;

after(() => {
  rmSync(fixtureRoot, { recursive: true, force: true });
  for (const path of createdJobRoots) rmSync(path, { recursive: true, force: true });
});

const run = (command, args) => {
  const result = spawnSync(command, args, { encoding: "utf8" });
  if (result.status !== 0) throw new Error(result.stderr || result.stdout || `Komanda nije uspela: ${command}`);
};

const ensureMediaCache = () => {
  if (mediaReady) return;
  mkdirSync(mediaCache, { recursive: true });
  const images = [
    ["feed.png", "1080x1350", "0xF7F5EC"],
    ["draft.png", "1080x1350", "0xDDD5C8"],
    ["story.png", "1080x1920", "0x1C3B42"],
    ["intro.png", "1080x1920", "0xB8E600"],
    ["offer.png", "1080x1920", "0xF7F5EC"],
    ["closing.png", "1080x1920", "0x1C3B42"],
    ["reference-comparison.png", "1296x540", "0xF7F5EC"],
    ["format-comparison.png", "1350x480", "0x0F1519"],
  ];
  for (const [name, size, color] of images) {
    const path = join(mediaCache, name);
    try {
      readFileSync(path);
    } catch {
      run("ffmpeg", ["-v", "error", "-y", "-f", "lavfi", "-i", `color=c=${color}:s=${size}`, "-frames:v", "1", "-update", "1", path]);
    }
  }
  const videoPath = join(mediaCache, "reels.mp4");
  run("ffmpeg", ["-v", "error", "-y", "-f", "lavfi", "-i", "color=c=0x1C3B42:s=1080x1920:r=30:d=12", "-f", "lavfi", "-i", "sine=frequency=440:duration=12,volume=4", "-c:v", "libx264", "-c:a", "aac", "-pix_fmt", "yuv420p", "-shortest", videoPath]);
  mediaReady = true;
};

const writeJson = (path, value) => writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);

const makeFixture = () => {
  ensureMediaCache();
  const temporaryRoot = mkdtempSync(join(fixtureRoot, "case-"));
  const id = basename(temporaryRoot);
  const postDirectory = join(fixtureRoot, "2026", "07", id);
  const generated = join(postDirectory, "generated");
  const final = join(postDirectory, "final");
  mkdirSync(generated, { recursive: true });
  mkdirSync(final, { recursive: true });

  const input = {
    id,
    status: "spremno-za-ljudsku-proveru",
    postType: "novitet",
    product: "Test tema",
    contentApproach: "local-availability",
    copyFreshnessNote: "Testira neutralan ugao dostupnosti, različit od poslednje tri objave.",
    clientFacts: [],
    claims: [],
    confirmedOffer: { mechanic: null, value: null, regularPrice: null, promoPrice: null, validFrom: null, validUntil: null, source: null },
    blockingMissingFacts: [],
    sourceAssets: [],
    requestedFormats: ["feed", "story", "reels"],
  };
  const videoProps = {
    eyebrow: "Test",
    headline: "Test objava",
    supportingText: "Test tekst",
    offerLabel: "Saznajte više",
    offerKind: "none",
    cta: "Posetite apoteku",
    imageSrc: "",
    imageBackground: "opaque",
    productShape: "compact",
    locationLine: "AU Šeki-Tilia",
    designVariant: "offer-orbit",
    motionTreatment: "offer-build",
    audioTrack: "mp3/paper-sun-parade.mp3",
    audioVolume: 0.8,
    colorSet: "legacy",
    colorScheme: "calm-studio",
  };
  const direction = {
    family: "offer-orbit",
    authorId: "design-agent-primary",
    signature: `offer-orbit|test-${id}|editorial-empty-stage|petrol-footer`,
    referenceFiles: ["ref-editorial-offer-stage.png"],
    referenceTraits: ["Asimetrična hijerarhija sa jasnim CTA završetkom.", "Kontrolisana scenska dubina i snažan mobilni fokus."],
    distinctFromRecent: "Test koristi tipografski fokus bez produktnog kolaža.",
    designInterventions: ["reading-order", "icon-role"],
    freshInterventionNote: "Menja redosled čitanja i funkciju lokacijske ikone u završetku.",
    motionTreatment: "offer-build",
    colorSet: "legacy",
    colorScheme: "calm-studio",
    formatAdaptations: { feed: "Bočna Feed kompozicija.", story: "Vertikalni Story stack.", reels: "Trodelni Reels tok." },
    formatPlan: {
      feed: { readingOrder: "headline-cta", productAnchor: "right-stage", layoutId: "offer-orbit-feed-stage" },
      story: { readingOrder: "headline-footer", productAnchor: "center-stage", layoutId: "offer-orbit-story-stack" },
      reels: { shotPlan: ["typographic-hook", "detail-stage", "branded-close"], layoutId: "offer-orbit-three-scene-reel" },
    },
    familyFit: { productShape: null, supportsOfferStrength: true, supportsSceneDepth: true, rationale: "Familija podržava jasnu poruku i kontrolisanu scensku dubinu." },
    logoSurface: "none",
    logoVariant: "on-dark",
    palettePlan: {
      background: "icy-tundra",
      surface: "deer-run",
      textForeground: "royal-neptune",
      textBackground: "icy-tundra",
      accent: "livid-lime",
      logoBackground: "royal-neptune",
      rationale: "Svetla informativna scena koristi petrol tekst, limeta akcenat i tamnu kontrolisanu podlogu za originalni logo.",
    },
    typography: { family: "AUSekiManrope", weights: [600, 800] },
    validatedRenders: [
      "final/feed-1080x1350.png",
      "final/story-1080x1920.png",
      "generated/reels-intro.png",
      "generated/reels-offer.png",
      "generated/reels-closing.png",
    ],
  };

  writeJson(join(postDirectory, "input.json"), input);
  writeJson(join(postDirectory, "video-props.json"), videoProps);
  writeJson(join(generated, "design-direction.json"), direction);
  writeJson(join(generated, "asset-review.json"), { version: 1, assets: [] });
  writeFileSync(join(postDirectory, "review.md"), "# Provera\n\nStatus: SPREMNO ZA LJUDSKU PROVERU\n");
  writeFileSync(join(final, "caption.md"), "Test caption za ručnu proveru.\n");

  for (const [source, target] of [
    ["feed.png", join(final, "feed-1080x1350.png")],
    ["draft.png", join(generated, "feed-draft.png")],
    ["story.png", join(final, "story-1080x1920.png")],
    ["intro.png", join(generated, "reels-intro.png")],
    ["offer.png", join(generated, "reels-offer.png")],
    ["closing.png", join(generated, "reels-closing.png")],
    ["reference-comparison.png", join(generated, "reference-comparison.png")],
    ["format-comparison.png", join(generated, "format-comparison.png")],
    ["reels.mp4", join(final, "reels-1080x1920.mp4")],
  ]) copyFileSync(join(mediaCache, source), target);

  const paths = {
    feed: join(final, "feed-1080x1350.png"),
    story: join(final, "story-1080x1920.png"),
    reelsIntro: join(generated, "reels-intro.png"),
    reelsOffer: join(generated, "reels-offer.png"),
    reelsClosing: join(generated, "reels-closing.png"),
    reelsMp4: join(final, "reels-1080x1920.mp4"),
    feedDraft: join(generated, "feed-draft.png"),
    referenceComparison: join(generated, "reference-comparison.png"),
    formatComparison: join(generated, "format-comparison.png"),
    input: join(postDirectory, "input.json"),
    videoProps: join(postDirectory, "video-props.json"),
    designDirection: join(generated, "design-direction.json"),
    renderer: join(repositoryRoot, "video-renderer/src/Composition.tsx"),
    rendererCss: join(repositoryRoot, "video-renderer/src/index.css"),
    referenceManifest: referenceManifestPath,
    brandConfig: join(repositoryRoot, "brand/brand-config.json"),
    colorPalette: join(repositoryRoot, "brand/color-palette.json"),
    rendererPackage: join(repositoryRoot, "video-renderer/package.json"),
    rendererPackageLock: join(repositoryRoot, "video-renderer/package-lock.json"),
    "logoCanonical:logo-tamniji.svg": join(repositoryRoot, "logos/logo-tamniji.svg"),
    "logoCanonical:logo-svetliji.svg": join(repositoryRoot, "logos/logo-svetliji.svg"),
    "logoRenderer:logo-tamniji.svg": join(repositoryRoot, "video-renderer/public/assets/logo-tamniji.svg"),
    "logoRenderer:logo-svetliji.svg": join(repositoryRoot, "video-renderer/public/assets/logo-svetliji.svg"),
    ...Object.fromEntries(readdirSync(join(repositoryRoot, "video-renderer/public/assets"), { withFileTypes: true })
      .filter((entry) => entry.isFile() && /\.(?:woff2?|ttf|otf)$/i.test(entry.name))
      .map((entry) => {
        const path = join(repositoryRoot, "video-renderer/public/assets", entry.name);
        return [`font:${relative(repositoryRoot, path)}`, path];
      })),
    [`audioTrack:${videoProps.audioTrack}`]: join(repositoryRoot, "video-renderer/public", videoProps.audioTrack),
    ...Object.fromEntries(approvedReferenceFiles.map((file) => [`reference:${file}`, join(repositoryRoot, "brand/design-references", file)])),
  };
  const note = "Sirovi render potvrđuje kriterijum kroz jasno vidljivu i proverljivu razliku.";
  writeJson(join(generated, "quality-review.json"), {
    version: 1,
    status: "meets-reference-bar",
    evidence: { referenceComparison: "generated/reference-comparison.png", formatComparison: "generated/format-comparison.png" },
    renderHashes: Object.fromEntries(Object.entries(paths).map(([key, path]) => [key, hashFile(path)])),
    criteria: Object.fromEntries(["compositionAndBalance", "hierarchyAndMobileImpact", "productIntegrationAndGrounding", "depthLightingAndFinish", "referenceLevelDistinctiveness", "formatAdaptation", "reelsDynamics"].map((key) => [key, { score: 4, note }])),
    weakestArea: "Dubina scene je namerno svedena, ali ostaje jasna na svim formatima.",
    revisionEvidence: { issueFound: "Prvi Feed draft nije imao dovoljno jasan tonski kontrast.", changeMade: "Finalni Feed dobio je jasniju svetlu osnovu.", before: "generated/feed-draft.png", after: "final/feed-1080x1350.png" },
    independentReview: { performed: true, reviewerId: "visual-review-agent-independent", method: "Direktan pregled svih sirovih PNG i MP4 artefakata.", rawArtifactOnly: true, verdict: "meets-reference-bar", notes: "Pregledani su Feed, Story, tri Reels kadra i finalni MP4 naspram sve četiri reference." },
  });

  return { postDirectory, input, videoProps, direction, generated, final, qualityReviewPath: join(generated, "quality-review.json") };
};

const refreshLockedInputHashes = (fixture) => {
  const review = JSON.parse(readFileSync(fixture.qualityReviewPath, "utf8"));
  review.renderHashes.input = hashFile(join(fixture.postDirectory, "input.json"));
  review.renderHashes.videoProps = hashFile(join(fixture.postDirectory, "video-props.json"));
  review.renderHashes.designDirection = hashFile(join(fixture.generated, "design-direction.json"));
  writeJson(fixture.qualityReviewPath, review);
};

const addLimitedResolutionAsset = (fixture) => {
  const sourceDirectory = join(fixture.postDirectory, "source");
  const preparedDirectory = join(fixture.generated, "assets");
  const jobRoot = join(repositoryRoot, "video-renderer/public/jobs", basename(fixture.postDirectory));
  const sourcePath = join(sourceDirectory, "product.png");
  const preparedPath = join(preparedDirectory, "product.png");
  const jobPath = join(jobRoot, "product.png");
  mkdirSync(sourceDirectory, { recursive: true });
  mkdirSync(preparedDirectory, { recursive: true });
  mkdirSync(jobRoot, { recursive: true });
  createdJobRoots.push(jobRoot);
  run("ffmpeg", ["-v", "error", "-y", "-f", "lavfi", "-i", "color=c=black@0.0:s=400x300,format=rgba,drawbox=x=20:y=20:w=360:h=260:color=orange@1:t=fill", "-frames:v", "1", "-update", "1", sourcePath]);
  copyFileSync(sourcePath, preparedPath);
  copyFileSync(preparedPath, jobPath);

  fixture.input.sourceAssets = ["source/product.png"];
  fixture.videoProps.imageSrc = `/jobs/${basename(fixture.postDirectory)}/product.png`;
  fixture.videoProps.imageBackground = "transparent";
  fixture.videoProps.productShape = "wide";
  fixture.direction.familyFit.productShape = "wide";
  writeJson(join(fixture.postDirectory, "input.json"), fixture.input);
  writeJson(join(fixture.postDirectory, "video-props.json"), fixture.videoProps);
  writeJson(join(fixture.generated, "design-direction.json"), fixture.direction);
  writeJson(join(fixture.generated, "asset-review.json"), {
    version: 1,
    assets: [{
      sourcePath: "source/product.png",
      usage: "hero-product",
      sourceHash: hashFile(sourcePath),
      sourceMetadata: { width: 400, height: 300, alphaBounds: { x: 20, y: 20, width: 360, height: 260 } },
      preparedAssetPath: "generated/assets/product.png",
      preparedAssetHash: hashFile(preparedPath),
      preparedMetadata: { width: 400, height: 300, alphaBounds: { x: 20, y: 20, width: 360, height: 260 } },
      automatedChecks: { heroResolution: false, maxUpscaleFactor: 2.3, resolutionAssessment: "constrained", transparencyAvailable: true, meaningfulTransparency: true, visiblePixelsClearOfCanvasEdge: true },
      manualChecks: { inspectedOnLightAndDark: true, noCursorOrUiArtifacts: true, cleanCutoutEdges: true, packagingUndistorted: true, productIdentityVerifiable: true, labelLegibleAtRenderSize: false },
      blockingDefects: [],
      qualityLimitations: ["Klijentov izvor je niže rezolucije i sitan tekst nije potpuno čitljiv."],
      corrections: ["Kompozicija ograničava uvećanje i gradi dominaciju kontrastom."],
      status: "approved-with-limitations",
    }],
  });
  refreshLockedInputHashes(fixture);
};

const runChecker = (postDirectory) => execFileSync(process.execPath, [checkerPath, "--post", postDirectory, "--skip-local-production-history"], { cwd: repositoryRoot, encoding: "utf8", stdio: "pipe" });
const runBlocked = (postDirectory) => {
  try {
    runChecker(postDirectory);
    assert.fail("Očekivana je blokada.");
  } catch (error) {
    return `${error.stdout ?? ""}${error.stderr ?? ""}`;
  }
};

test("potpuno validan golden paket prolazi", () => {
  const fixture = makeFixture();
  assert.match(runChecker(fixture.postDirectory), /PROVERA PROŠLA/);
});

test("visual review zaključava manifest i sve četiri reference", () => {
  const fixture = makeFixture();
  assert.equal(approvedReferenceFiles.length, 4);
  execFileSync(process.execPath, [join(repositoryRoot, "production/scripts/prepare-visual-review.mjs"), "--post", fixture.postDirectory], { cwd: repositoryRoot, encoding: "utf8", stdio: "pipe" });
  const review = JSON.parse(readFileSync(fixture.qualityReviewPath, "utf8"));
  assert.equal(review.renderHashes.referenceManifest, hashFile(referenceManifestPath));
  assert.equal(review.renderHashes.brandConfig, hashFile(join(repositoryRoot, "brand/brand-config.json")));
  assert.equal(review.renderHashes.colorPalette, hashFile(join(repositoryRoot, "brand/color-palette.json")));
  assert.equal(review.renderHashes.rendererPackageLock, hashFile(join(repositoryRoot, "video-renderer/package-lock.json")));
  assert.equal(review.renderHashes["logoCanonical:logo-tamniji.svg"], hashFile(join(repositoryRoot, "logos/logo-tamniji.svg")));
  assert.equal(review.renderHashes["logoRenderer:logo-svetliji.svg"], hashFile(join(repositoryRoot, "video-renderer/public/assets/logo-svetliji.svg")));
  assert.equal(review.renderHashes[`audioTrack:${fixture.videoProps.audioTrack}`], hashFile(join(repositoryRoot, "video-renderer/public", fixture.videoProps.audioTrack)));
  assert.ok(Object.keys(review.renderHashes).some((key) => key.startsWith("font:video-renderer/public/assets/")));
  for (const file of approvedReferenceFiles) assert.equal(review.renderHashes[`reference:${file}`], hashFile(join(repositoryRoot, "brand/design-references", file)));
});

test("staro generičko ime reference nije dozvoljeno", () => {
  const fixture = makeFixture();
  fixture.direction.referenceFiles = ["primer3.png"];
  writeJson(join(fixture.generated, "design-direction.json"), fixture.direction);
  assert.match(runBlocked(fixture.postDirectory), /Nedozvoljena dizajnerska referenca: primer3\.png/);
});

test("slabija rezolucija sa dokumentovanim ograničenjem nije blokada", () => {
  const fixture = makeFixture();
  addLimitedResolutionAsset(fixture);
  assert.match(runChecker(fixture.postDirectory), /PROVERA PROŠLA/);
});

test("akcija bez potvrđene mehanike ne prolazi", () => {
  const fixture = makeFixture();
  fixture.input.postType = "akcija";
  writeJson(join(fixture.postDirectory, "input.json"), fixture.input);
  assert.match(runBlocked(fixture.postDirectory), /zahteva potvrđenu mehaniku/);
});

test("čekiran review ne može da nadjača blokiran quality review", () => {
  const fixture = makeFixture();
  const path = join(fixture.generated, "quality-review.json");
  const review = JSON.parse(readFileSync(path, "utf8"));
  review.status = "blocked";
  writeJson(path, review);
  assert.match(runBlocked(fixture.postDirectory), /nije dostigao status meets-reference-bar/);
});

test("isti autor i reviewer ne predstavljaju nezavisan pregled", () => {
  const fixture = makeFixture();
  const path = join(fixture.generated, "quality-review.json");
  const review = JSON.parse(readFileSync(path, "utf8"));
  review.independentReview.reviewerId = fixture.direction.authorId;
  writeJson(path, review);
  assert.match(runBlocked(fixture.postDirectory), /drugog reviewerId autora/);
});

test("izmena propsa posle pregleda poništava odobrenje", () => {
  const fixture = makeFixture();
  fixture.videoProps.headline = "Naknadno promenjen naslov";
  writeJson(join(fixture.postDirectory, "video-props.json"), fixture.videoProps);
  assert.match(runBlocked(fixture.postDirectory), /quality-review hash nije aktuelan za video-props\.json/);
});

test("pogrešne dimenzije finalnog rendera ne prolaze", () => {
  const fixture = makeFixture();
  run("ffmpeg", ["-v", "error", "-y", "-f", "lavfi", "-i", "color=c=red:s=540x675", "-frames:v", "1", "-update", "1", join(fixture.final, "feed-1080x1350.png")]);
  assert.match(runBlocked(fixture.postDirectory), /mora imati dimenzije 1080x1350/);
});

test("imageSrc bez izvornog i auditovanog asseta ne prolazi", () => {
  const fixture = makeFixture();
  fixture.videoProps.imageSrc = `/jobs/${basename(fixture.postDirectory)}/product.png`;
  writeJson(join(fixture.postDirectory, "video-props.json"), fixture.videoProps);
  assert.match(runBlocked(fixture.postDirectory), /imageSrc zahteva najmanje jedan izvorni vizual/);
});

test("Feed i Story sa istim layout fingerprintom ne prolaze", () => {
  const fixture = makeFixture();
  fixture.direction.formatPlan.story = { ...fixture.direction.formatPlan.feed };
  writeJson(join(fixture.generated, "design-direction.json"), fixture.direction);
  const output = runBlocked(fixture.postDirectory);
  assert.match(output, /različite layoutId vrednosti/);
  assert.match(output, /razlikovati po redosledu čitanja ili poziciji proizvoda/);
});

test("svaki paket zahteva Feed, Story i Reels", () => {
  const fixture = makeFixture();
  fixture.input.requestedFormats = ["feed"];
  fixture.direction.validatedRenders = ["final/feed-1080x1350.png"];
  writeJson(join(fixture.postDirectory, "input.json"), fixture.input);
  writeJson(join(fixture.generated, "design-direction.json"), fixture.direction);
  for (const path of [
    join(fixture.final, "story-1080x1920.png"),
    join(fixture.final, "reels-1080x1920.mp4"),
    join(fixture.generated, "reels-intro.png"),
    join(fixture.generated, "reels-offer.png"),
    join(fixture.generated, "reels-closing.png"),
  ]) rmSync(path);
  refreshLockedInputHashes(fixture);
  assert.match(runBlocked(fixture.postDirectory), /sva tri formata: feed, story i reels/);
});

test("requestedFormats mora biti neprazan niz podržanih jedinstvenih vrednosti", () => {
  const fixture = makeFixture();
  fixture.input.requestedFormats = ["feed", "feed", "carousel"];
  writeJson(join(fixture.postDirectory, "input.json"), fixture.input);
  const output = runBlocked(fixture.postDirectory);
  assert.match(output, /nepodržane vrednosti: carousel/);
  assert.match(output, /ne sme sadržati duplikate/);
});

test("Reels zahteva postojeću dozvoljenu numeru i audioVolume u opsegu", () => {
  const fixture = makeFixture();
  fixture.videoProps.audioTrack = "mp3/nepostojeca.mp3";
  fixture.videoProps.audioVolume = 1.5;
  writeJson(join(fixture.postDirectory, "video-props.json"), fixture.videoProps);
  const output = runBlocked(fixture.postDirectory);
  assert.match(output, /važeći audioTrack/);
  assert.match(output, /audioVolume mora biti broj između 0.75 i 1/);
});

test("Reels bez stvarnog audio streama ne prolazi", () => {
  const fixture = makeFixture();
  run("ffmpeg", ["-v", "error", "-y", "-f", "lavfi", "-i", "color=c=0x1C3B42:s=1080x1920:r=30:d=12", "-c:v", "libx264", "-pix_fmt", "yuv420p", join(fixture.final, "reels-1080x1920.mp4")]);
  assert.match(runBlocked(fixture.postDirectory), /mora sadržati audio stream/);
});

test("Reels sa praktično nečujnom muzikom ne prolazi", () => {
  const fixture = makeFixture();
  run("ffmpeg", ["-v", "error", "-y", "-f", "lavfi", "-i", "color=c=0x1C3B42:s=1080x1920:r=30:d=12", "-f", "lavfi", "-i", "sine=frequency=440:duration=12,volume=0.01", "-c:v", "libx264", "-c:a", "aac", "-pix_fmt", "yuv420p", "-shortest", join(fixture.final, "reels-1080x1920.mp4")]);
  assert.match(runBlocked(fixture.postDirectory), /muzička podloga nije dovoljno čujna/);
});

test("renderer drži tekst stabilnim i koristi čujni MP3 segment", () => {
  const renderer = readFileSync(join(repositoryRoot, "video-renderer/src/Composition.tsx"), "utf8");
  assert.match(renderer, /from "@remotion\/media"/);
  assert.match(renderer, /<RemotionAudio loop src=\{staticFile\(audioSrc\)\} volume=\{volume\} \/>/);
  assert.match(renderer, /frame >= delayFrames \+ 45/);
  assert.doesNotMatch(renderer, /pillPulse|limePulse|scale: bgScale/);
  const heroStart = renderer.indexOf("const HeroScene");
  const heroEnd = renderer.indexOf("const motionPlans", heroStart);
  assert.doesNotMatch(renderer.slice(heroStart, heroEnd), /translateX|translateY|const scale/);
});

test("logoVariant mora odgovarati neposrednoj logo pozadini", () => {
  const fixture = makeFixture();
  fixture.direction.logoVariant = "on-light";
  writeJson(join(fixture.generated, "design-direction.json"), fixture.direction);
  assert.match(runBlocked(fixture.postDirectory), /nije odobrena za palettePlan\.logoBackground royal-neptune/);
});

test("colorScheme mora biti identičan u props i design-direction", () => {
  const fixture = makeFixture();
  fixture.videoProps.colorScheme = "matcha-abyssal";
  writeJson(join(fixture.postDirectory, "video-props.json"), fixture.videoProps);
  assert.match(runBlocked(fixture.postDirectory), /colorScheme mora odgovarati/);
});

test("palettePlan ne sme mešati originalni i novi trobojni set", () => {
  const fixture = makeFixture();
  fixture.direction.palettePlan.surface = "matcha";
  writeJson(join(fixture.generated, "design-direction.json"), fixture.direction);
  assert.match(runBlocked(fixture.postDirectory), /meša boju van izabranog seta legacy/);
});

test("colorSet mora odgovarati izabranoj renderer temi", () => {
  const fixture = makeFixture();
  fixture.direction.colorSet = "alternative";
  fixture.videoProps.colorSet = "alternative";
  writeJson(join(fixture.generated, "design-direction.json"), fixture.direction);
  writeJson(join(fixture.postDirectory, "video-props.json"), fixture.videoProps);
  assert.match(runBlocked(fixture.postDirectory), /mora odgovarati temi calm-studio: legacy/);
});

test("create-post nasumično bira dozvoljenu muziku i colorScheme", () => {
  const slug = `audio-rotation-${process.pid}`;
  const date = "2099-12-31";
  const monthDirectory = join(repositoryRoot, "productions", "2099", "12");
  execFileSync(process.execPath, [join(repositoryRoot, "production/scripts/create-post.mjs"), "--slug", slug, "--date", date], { cwd: repositoryRoot, stdio: "pipe" });
  const createdName = readdirSync(monthDirectory).find((name) => name.endsWith(`-${slug}`));
  assert.ok(createdName);
  const postDirectory = join(monthDirectory, createdName);
  const props = JSON.parse(readFileSync(join(postDirectory, "video-props.json"), "utf8"));
  const tracks = ["mp3/clear-path.mp3", "mp3/clear-path-ambient.mp3", "mp3/open-sky-drift.mp3", "mp3/open-sky-drift-chill.mp3", "mp3/paper-sun-parade.mp3", "mp3/paper-sun-parade-upbeat.mp3"];
  const direction = JSON.parse(readFileSync(join(postDirectory, "generated/design-direction.json"), "utf8"));
  const palette = JSON.parse(readFileSync(join(repositoryRoot, "brand/color-palette.json"), "utf8"));
  assert.ok(tracks.includes(props.audioTrack));
  assert.equal(props.audioVolume, 0.9);
  assert.ok(palette.rendererThemes.some((theme) => theme.id === props.colorScheme));
  const selectedTheme = palette.rendererThemes.find((theme) => theme.id === props.colorScheme);
  const selectedSet = palette.paletteSets.find((set) => set.id === props.colorSet);
  assert.equal(direction.colorSet, props.colorSet);
  assert.equal(selectedTheme.colorSet, props.colorSet);
  assert.ok([selectedTheme.background, selectedTheme.surface, selectedTheme.dark, selectedTheme.accent, selectedTheme.secondary, selectedTheme.stage, selectedTheme.ink, selectedTheme.logoBackground].every((color) => selectedSet.colors.includes(color)));
  assert.equal(direction.colorScheme, props.colorScheme);
  assert.equal(direction.palettePlan.rationale, null);
  assert.equal(JSON.parse(readFileSync(join(postDirectory, "input.json"), "utf8")).requiresProfessionalReview, undefined);
  const firstInputPath = join(postDirectory, "input.json");
  const firstInput = JSON.parse(readFileSync(firstInputPath, "utf8"));
  firstInput.status = "spremno-za-ljudsku-proveru";
  writeJson(firstInputPath, firstInput);

  const nextSlug = `color-alternation-${process.pid}`;
  execFileSync(process.execPath, [join(repositoryRoot, "production/scripts/create-post.mjs"), "--slug", nextSlug, "--date", date], { cwd: repositoryRoot, stdio: "pipe" });
  const nextName = readdirSync(monthDirectory).find((name) => name.endsWith(`-${nextSlug}`));
  assert.ok(nextName);
  const nextPostDirectory = join(monthDirectory, nextName);
  const nextProps = JSON.parse(readFileSync(join(nextPostDirectory, "video-props.json"), "utf8"));
  assert.notEqual(nextProps.colorSet, props.colorSet);
  rmSync(postDirectory, { recursive: true });
  rmSync(nextPostDirectory, { recursive: true });
});
