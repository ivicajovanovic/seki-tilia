import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, extname, join, relative, resolve, sep } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(scriptDirectory, "../..");
const args = process.argv.slice(2);
const valueFor = (name) => {
  const index = args.indexOf(name);
  return index === -1 ? undefined : args[index + 1];
};
const postArgument = valueFor("--post");

if (!postArgument) {
  console.error("Koristi: node production/scripts/inspect-assets.mjs --post productions/GGGG/MM/001-GGGG-MM-DD-naziv");
  process.exit(1);
}

const postDirectory = resolve(postArgument);
const inputPath = join(postDirectory, "input.json");
const reviewPath = join(postDirectory, "generated", "asset-review.json");
const sourceRoot = join(postDirectory, "source");

if (!existsSync(inputPath)) {
  console.error(`Nedostaje input.json: ${inputPath}`);
  process.exit(1);
}

const input = JSON.parse(readFileSync(inputPath, "utf8"));
const existing = existsSync(reviewPath) ? JSON.parse(readFileSync(reviewPath, "utf8")) : { version: 1, assets: [] };
const existingBySource = new Map((existing.assets ?? []).map((asset) => [asset.sourcePath, asset]));
const imageExtensions = new Set([".png", ".jpg", ".jpeg", ".webp"]);

const hashFile = (path) => createHash("sha256").update(readFileSync(path)).digest("hex");
const inside = (root, path) => path === root || path.startsWith(`${root}${sep}`);
const inspect = (path) => {
  const probe = spawnSync("ffprobe", [
    "-v", "error",
    "-select_streams", "v:0",
    "-show_entries", "stream=width,height,pix_fmt",
    "-of", "json",
    path,
  ], { encoding: "utf8" });
  if (probe.status !== 0) throw new Error(probe.stderr.trim() || `ffprobe nije uspeo za ${path}`);
  const stream = JSON.parse(probe.stdout).streams?.[0];
  if (!stream?.width || !stream?.height) throw new Error(`Nije moguće očitati dimenzije: ${path}`);
  const raw = spawnSync("ffmpeg", ["-v", "error", "-i", path, "-frames:v", "1", "-f", "rawvideo", "-pix_fmt", "rgba", "pipe:1"], {
    encoding: null,
    maxBuffer: stream.width * stream.height * 4 + 1024 * 1024,
  });
  if (raw.status !== 0) throw new Error(raw.stderr?.toString().trim() || `ffmpeg nije dekodirao ${path}`);
  let minX = stream.width;
  let minY = stream.height;
  let maxX = -1;
  let maxY = -1;
  let transparentPixels = 0;
  let partialAlphaPixels = 0;
  for (let index = 0; index < stream.width * stream.height; index += 1) {
    const alpha = raw.stdout[index * 4 + 3];
    if (alpha === 0) transparentPixels += 1;
    else if (alpha < 255) partialAlphaPixels += 1;
    if (alpha < 16) continue;
    const x = index % stream.width;
    const y = Math.floor(index / stream.width);
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  }
  const alphaBounds = maxX === -1 ? null : { x: minX, y: minY, width: maxX - minX + 1, height: maxY - minY + 1 };
  const pixelCount = stream.width * stream.height;
  return {
    width: stream.width,
    height: stream.height,
    pixelFormat: stream.pix_fmt ?? "unknown",
    hasAlpha: /(?:rgba|yuva|gbrap|ya)/.test(stream.pix_fmt ?? ""),
    transparentRatio: transparentPixels / pixelCount,
    partialAlphaPixels,
    alphaBounds,
    visiblePixelsTouchEdge: alphaBounds ? alphaBounds.x === 0 || alphaBounds.y === 0 || alphaBounds.x + alphaBounds.width === stream.width || alphaBounds.y + alphaBounds.height === stream.height : false,
  };
};

const createPreview = (sourcePath, previewPath) => {
  const filter = [
    "[2:v]split=2[a][b]",
    "[a]scale=720:820:force_original_aspect_ratio=decrease[assetLight]",
    "[b]scale=720:820:force_original_aspect_ratio=decrease[assetDark]",
    "[0:v][assetLight]overlay=(W-w)/2:(H-h)/2[left]",
    "[1:v][assetDark]overlay=(W-w)/2:(H-h)/2[right]",
    "[left][right]hstack=inputs=2[out]",
  ].join(";");
  const render = spawnSync("ffmpeg", [
    "-y",
    "-f", "lavfi", "-i", "color=c=0xF7F5EC:s=800x900",
    "-f", "lavfi", "-i", "color=c=0x1C3B42:s=800x900",
    "-i", sourcePath,
    "-filter_complex", filter,
    "-map", "[out]",
    "-frames:v", "1",
    previewPath,
  ], { encoding: "utf8" });
  if (render.status !== 0) throw new Error(render.stderr.trim() || `ffmpeg nije napravio pregled za ${sourcePath}`);
};

const assets = [];
for (const sourceAsset of input.sourceAssets ?? []) {
  if (typeof sourceAsset !== "string" || !imageExtensions.has(extname(sourceAsset).toLowerCase())) continue;
  const sourcePath = resolve(postDirectory, sourceAsset);
  if (!inside(sourceRoot, sourcePath) || !existsSync(sourcePath)) {
    console.error(`Izvorni vizual mora postojati unutar source/: ${sourceAsset}`);
    process.exit(1);
  }

  const sourceHash = hashFile(sourcePath);
  const metadata = inspect(sourcePath);
  const previous = existingBySource.get(sourceAsset);
  const unchanged = previous?.sourceHash === sourceHash;
  const safeStem = basename(sourceAsset, extname(sourceAsset)).replace(/[^a-zA-Z0-9-]+/g, "-").toLowerCase();
  const previewRelativePath = `generated/asset-inspection-${safeStem}.png`;
  const previewPath = join(postDirectory, previewRelativePath);
  createPreview(sourcePath, previewPath);

  const preparedAssetPath = unchanged ? previous?.preparedAssetPath ?? null : null;
  const preparedAbsolutePath = preparedAssetPath ? resolve(postDirectory, preparedAssetPath) : null;
  const preparedMetadata = preparedAbsolutePath && existsSync(preparedAbsolutePath) ? inspect(preparedAbsolutePath) : null;
  const preparedHash = preparedAbsolutePath && existsSync(preparedAbsolutePath) ? hashFile(preparedAbsolutePath) : null;
  const reviewUnchanged = unchanged && previous?.preparedAssetPath === preparedAssetPath && previous?.preparedAssetHash === preparedHash;
  const evaluated = preparedMetadata ?? metadata;
  const effectiveWidth = evaluated.alphaBounds?.width ?? evaluated.width;
  const effectiveHeight = evaluated.alphaBounds?.height ?? evaluated.height;
  const plannedHeroSize = effectiveWidth / effectiveHeight > 1.12 ? { width: 820, height: 660 } : effectiveWidth / effectiveHeight < 0.82 ? { width: 600, height: 980 } : { width: 760, height: 760 };
  const maxUpscaleFactor = Math.max(plannedHeroSize.width / effectiveWidth, plannedHeroSize.height / effectiveHeight);

  assets.push({
    sourcePath: relative(postDirectory, sourcePath),
    usage: reviewUnchanged ? previous?.usage ?? "hero-product" : "hero-product",
    sourceHash,
    sourceMetadata: metadata,
    previewPath: previewRelativePath,
    preparedAssetPath,
    preparedAssetHash: preparedHash,
    preparedMetadata,
    automatedChecks: {
      heroResolution: maxUpscaleFactor <= 1.15,
      maxUpscaleFactor: Number(maxUpscaleFactor.toFixed(3)),
      plannedHeroSize,
      transparencyAvailable: evaluated.hasAlpha,
      meaningfulTransparency: evaluated.hasAlpha && evaluated.transparentRatio >= 0.005,
      visiblePixelsClearOfCanvasEdge: !evaluated.visiblePixelsTouchEdge,
    },
    manualChecks: reviewUnchanged ? previous?.manualChecks ?? {
      inspectedOnLightAndDark: false,
      noCursorOrUiArtifacts: false,
      cleanCutoutEdges: false,
      packagingUndistorted: false,
      labelLegibleAtRenderSize: false,
    } : {
      inspectedOnLightAndDark: false,
      noCursorOrUiArtifacts: false,
      cleanCutoutEdges: false,
      packagingUndistorted: false,
      labelLegibleAtRenderSize: false,
    },
    visibleDefects: reviewUnchanged ? previous?.visibleDefects ?? [] : [],
    corrections: reviewUnchanged ? previous?.corrections ?? [] : [],
    status: reviewUnchanged ? previous?.status ?? "pending" : "pending",
  });
}

writeFileSync(reviewPath, `${JSON.stringify({ version: 1, generatedAt: new Date().toISOString(), assets }, null, 2)}\n`);
console.log(`Sačuvan asset pregled: ${relative(repositoryRoot, reviewPath)}`);
if (assets.some((asset) => !asset.automatedChecks.heroResolution)) {
  console.log("BLOKADA: najmanje jedan produktni vizual zahteva više od 15% povećanja u najvećem planiranom hero prikazu.");
}
console.log("Otvori svaki asset-inspection PNG, popuni manualChecks, visibleDefects, corrections, preparedAssetPath i status, zatim ponovo pokreni skriptu.");
