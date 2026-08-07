import {existsSync, mkdirSync, readFileSync} from "node:fs";
import {dirname, join, resolve} from "node:path";
import {fileURLToPath} from "node:url";
import {spawnSync} from "node:child_process";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(scriptDirectory, "../..");
const args = process.argv.slice(2);
const postIndex = args.indexOf("--post");
const postArgument = postIndex === -1 ? undefined : args[postIndex + 1];

if (!postArgument) {
  console.error("Koristi: node production/scripts/render-reels.mjs --post productions/GGGG/MM/001-GGGG-MM-DD-naziv");
  process.exit(1);
}

const postDirectory = resolve(postArgument);
const propsPath = join(postDirectory, "video-props.json");
if (!existsSync(propsPath)) {
  console.error(`Nedostaje video-props.json u ${postDirectory}.`);
  process.exit(1);
}

const props = JSON.parse(readFileSync(propsPath, "utf8"));
const explicitReelV2 = props.videoTemplate === "reel-v2";
const composition = explicitReelV2 ? "SekiTiliaReelV2" : "SekiTiliaPromo";
const evidenceFrames = explicitReelV2 ? [32, 128, 220] : [126, 280, 444];
const rendererDirectory = join(repositoryRoot, "video-renderer");
const generatedDirectory = join(postDirectory, "generated");
mkdirSync(generatedDirectory, {recursive: true});

const run = (commandArgs) => {
  const result = spawnSync("npx", commandArgs, {cwd: rendererDirectory, encoding: "utf8", stdio: "inherit"});
  if (result.status !== 0) process.exit(result.status ?? 1);
};

run(["remotion", "render", composition, join(generatedDirectory, "reels-1080x1920.mp4"), `--props=${propsPath}`]);
for (const [index, name] of ["reels-intro.png", "reels-offer.png", "reels-closing.png"].entries()) {
  run(["remotion", "still", composition, join(generatedDirectory, name), `--frame=${evidenceFrames[index]}`, `--props=${propsPath}`]);
}

console.log(`Renderovan ${composition}: generated/reels-1080x1920.mp4 i tri dokazna kadra.`);
