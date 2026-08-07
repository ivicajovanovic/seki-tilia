import React from "react";
import {loadFont} from "@remotion/fonts";
import {Audio as RemotionAudio} from "@remotion/media";
import {MapPin} from "lucide-react";
import {z} from "zod";
import {
  AbsoluteFill,
  cancelRender,
  continueRender,
  delayRender,
  Easing,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import colorPalette from "../../brand/color-palette.json";

const reelV2ContentSchema = z.object({
  brandLabel: z.string().min(1).max(42),
  kicker: z.string().min(1).max(44),
  title: z.string().min(1).max(42),
  subtitle: z.string().max(48).default(""),
  infoLabel: z.string().min(1).max(24),
  infoLines: z.array(z.string().min(1).max(38)).min(1).max(2),
  listLabel: z.string().min(1).max(24),
  listItems: z.array(z.string().min(1).max(42)).min(1).max(4),
  contactLabel: z.string().min(1).max(32),
  contactLines: z.array(z.string().min(1).max(46)).min(1).max(3),
  imageFit: z.enum(["contain", "cover"]).default("contain"),
});

export const ReelV2PropsSchema = z.object({
  videoTemplate: z.literal("reel-v2"),
  reelV2: reelV2ContentSchema,
  imageSrc: z.string().default(""),
  logoSrc: z.string().default("assets/logo-tamniji.svg"),
  audioTrack: z.string().default("mp3/paper-sun-parade.mp3"),
  audioVolume: z.number().min(0.75).max(1).default(0.9),
  colorScheme: z.string().default("calm-studio"),
});

export type ReelV2Props = z.infer<typeof ReelV2PropsSchema>;

export const reelV2DefaultProps: ReelV2Props = {
  videoTemplate: "reel-v2",
  reelV2: {
    brandLabel: "AU Šeki-Tilia",
    kicker: "Aktuelna ponuda",
    title: "Naslov iz korisničkog briefa",
    subtitle: "Potvrđena pomoćna informacija",
    infoLabel: "Informacija",
    infoLines: ["Potvrđeni detalj", "Potvrđeni rok ili uslov"],
    listLabel: "Detalji",
    listItems: ["Prva potvrđena stavka", "Druga potvrđena stavka", "Treća potvrđena stavka"],
    contactLabel: "SLEDEĆI KORAK",
    contactLines: ["CTA iz korisničkog briefa", "Potvrđena dostupnost ili lokacija"],
    imageFit: "contain",
  },
  imageSrc: "",
  logoSrc: "assets/logo-tamniji.svg",
  audioTrack: "mp3/paper-sun-parade.mp3",
  audioVolume: 0.9,
  colorScheme: "calm-studio",
};

const fontFamily = "AUSekiManrope";
const latinUnicodeRange = "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD";
const latinExtUnicodeRange = "U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF";
let fontRequested = false;
const fontPromise = Promise.all([
  loadFont({display: "block", family: fontFamily, format: "woff2", unicodeRange: latinUnicodeRange, url: staticFile("assets/manrope-latin.woff2"), weight: "200 800"}),
  loadFont({display: "block", family: fontFamily, format: "woff2", unicodeRange: latinExtUnicodeRange, url: staticFile("assets/manrope-latin-ext.woff2"), weight: "200 800"}),
]);

const ensureFont = () => {
  if (fontRequested) return;
  fontRequested = true;
  const handle = delayRender("Loading Reel V2 Manrope font");
  void fontPromise.then(() => Promise.all([
    document.fonts.load(`600 48px "${fontFamily}"`),
    document.fonts.load(`700 48px "${fontFamily}"`),
    document.fonts.load(`800 112px "${fontFamily}"`),
  ])).then(async () => {
    if (![600, 700, 800].every((weight) => document.fonts.check(`${weight} 112px "${fontFamily}"`))) throw new Error("Manrope font nije dostupan za reel-v2.");
    await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
    continueRender(handle);
  }).catch((error) => cancelRender(error));
};

const paletteColorMap = new Map(colorPalette.colors.map((color) => [color.id, color.hex]));
const themeMap = new Map(colorPalette.rendererThemes.map((theme) => [theme.id, theme]));
const resolvePalette = (schemeId: string) => {
  const theme = themeMap.get(schemeId) ?? themeMap.get("calm-studio") ?? colorPalette.rendererThemes[0];
  const hex = (id: string) => paletteColorMap.get(id) ?? "#0F1519";
  return {background: hex(theme.background), surface: hex(theme.surface), text: hex(theme.dark), accent: hex(theme.accent), secondary: hex(theme.secondary)};
};

const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
const clamp = {extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const};
const descenderSafeText: React.CSSProperties = {lineHeight: 1.02, paddingBottom: "0.12em"};

const MotionReveal: React.FC<{children: React.ReactNode; start: number; end: number; distance?: number; qa?: string}> = ({children, start, end, distance = 54, qa}) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [start, end], [0, 1], {...clamp, easing: easeOut});
  const translateY = Math.round(interpolate(progress, [0, 1], [distance, 0]));
  const settled = frame >= end;
  return (
    <div data-qa={qa} style={settled ? {position: "relative"} : {opacity: progress, position: "relative", translate: `0 ${translateY}px`}}>
      <div style={{position: "relative"}}>{children}</div>
    </div>
  );
};

const StaticPaper: React.FC<{surface: string; secondary: string}> = ({surface, secondary}) => (
  <svg aria-hidden viewBox="0 0 1080 1920" preserveAspectRatio="none" style={{height: "100%", inset: 0, opacity: 0.2, position: "absolute", width: "100%"}}>
    <path d="M0 50 260 0 430 180 160 310 0 240Z" fill={surface} />
    <path d="M430 0 760 45 690 310 380 240Z" fill={secondary} opacity="0.45" />
    <path d="M750 180 1080 20 1080 420 820 510 650 330Z" fill={surface} opacity="0.55" />
    <path d="M0 480 260 320 520 490 390 720 0 760Z" fill={secondary} opacity="0.36" />
    <path d="M640 560 920 400 1080 610 1080 920 770 870Z" fill={surface} opacity="0.65" />
    <path d="M0 990 270 820 510 1080 350 1320 0 1260Z" fill={surface} opacity="0.5" />
    <path d="M580 1040 880 870 1080 1080 1010 1440 690 1380Z" fill={secondary} opacity="0.3" />
    <path d="M0 1500 270 1280 570 1530 420 1920 0 1920Z" fill={secondary} opacity="0.35" />
    <path d="M650 1480 950 1320 1080 1510 1080 1920 710 1920Z" fill={surface} opacity="0.55" />
  </svg>
);

const assetSource = (src: string) => /^https?:\/\//.test(src) ? src : staticFile(src.replace(/^\//, ""));

const OpeningCard: React.FC<ReelV2Props & {palette: ReturnType<typeof resolvePalette>}> = ({reelV2, imageSrc, logoSrc, palette}) => {
  const frame = useCurrentFrame();
  const exit = interpolate(frame, [2, 32], [0, 1], {...clamp, easing: Easing.bezier(0.12, 0.82, 0.18, 1)});
  return (
    <AbsoluteFill data-qa="reel-v2-opening-card" style={{backgroundColor: palette.background, color: palette.text, overflow: "hidden", translate: `${interpolate(exit, [0, 1], [0, 1180])}px 0`, zIndex: 20}}>
      <StaticPaper secondary={palette.secondary} surface={palette.surface} />
      <div style={{left: 72, position: "absolute", top: 72, width: 570}}>
        <Img src={assetSource(logoSrc)} style={{height: 86, objectFit: "contain", objectPosition: "left center", width: 270}} />
        <div style={{fontSize: 102, fontWeight: 800, letterSpacing: -5, lineHeight: 0.92, marginTop: 70}}>{reelV2.title}</div>
        <div style={{backgroundColor: palette.accent, fontSize: 48, fontWeight: 800, lineHeight: 1.05, marginTop: 56, padding: "26px 30px", width: 500}}>{reelV2.infoLines.join("\n")}</div>
      </div>
      {imageSrc && <Img src={assetSource(imageSrc)} style={{bottom: 0, height: 1040, objectFit: reelV2.imageFit, objectPosition: "right bottom", position: "absolute", right: 0, width: 620}} />}
      {[0, 1, 2].map((index) => <div aria-hidden key={index} style={{backgroundColor: palette.background, height: "100%", left: interpolate(exit, [0, 1], [-180 - (index * 46), 1080 - (index * 46)]), opacity: 0.22 - (index * 0.05), position: "absolute", top: 0, width: 42}} />)}
    </AbsoluteFill>
  );
};

export const ReelV2: React.FC<ReelV2Props> = (props) => {
  ensureFont();
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {reelV2, imageSrc, logoSrc, audioTrack, audioVolume, colorScheme} = props;
  const palette = resolvePalette(colorScheme);
  const imageEntrance = interpolate(frame, [10, 34], [0, 1], {...clamp, easing: easeOut});
  const panelEntrance = interpolate(frame, [98, 122], [0, 1], {...clamp, easing: easeOut});
  const pinEntrance = spring({frame: Math.max(0, frame - 192), fps, config: {damping: 14, stiffness: 108, mass: 0.9}});
  const volume = Math.min(1, Math.max(0.75, audioVolume));
  const titleFontSize = reelV2.title.length <= 22 ? 118 : reelV2.title.length <= 32 ? 98 : 84;
  const kickerFontSize = reelV2.kicker.length <= 22 ? 42 : reelV2.kicker.length <= 32 ? 35 : 31;

  return (
    <AbsoluteFill data-qa="reel-v2-template" style={{backgroundColor: palette.background, color: palette.text, fontFamily, overflow: "hidden"}}>
      <RemotionAudio loop src={staticFile(audioTrack)} volume={volume} />
      <StaticPaper secondary={palette.secondary} surface={palette.surface} />

      <MotionReveal end={31} start={16}>
        <Img data-qa="reel-v2-logo" src={assetSource(logoSrc)} style={{height: 84, objectFit: "contain", objectPosition: "right center", position: "absolute", right: 66, top: 62, width: 260, zIndex: 8}} />
      </MotionReveal>

      {imageSrc && (
        <div data-qa="reel-v2-image-zone" style={{bottom: 42, height: 1760, overflow: "hidden", position: "absolute", right: 0, width: 510, zIndex: 2}}>
          <Img data-qa="reel-v2-image" src={assetSource(imageSrc)} style={{height: "100%", objectFit: reelV2.imageFit, objectPosition: "right bottom", opacity: imageEntrance, scale: interpolate(imageEntrance, [0, 1], [1.12, 1.18]), transformOrigin: "right bottom", translate: `${interpolate(imageEntrance, [0, 1], [30, 0])}px 0`, width: "100%"}} />
        </div>
      )}

      <div style={{left: 76, position: "absolute", top: 74, width: 500, zIndex: 5}}>
        <MotionReveal end={27} start={10}>
          <div style={{fontSize: 58, fontWeight: 800, letterSpacing: -1.8, lineHeight: 1.02, textTransform: "uppercase"}}>{reelV2.brandLabel}</div>
        </MotionReveal>
        <div style={{marginTop: 64}}>
          <MotionReveal end={50} start={40}><div style={{fontSize: kickerFontSize, fontWeight: 600, lineHeight: 1.08}}>{reelV2.kicker}</div></MotionReveal>
          <MotionReveal end={63} qa="reel-v2-headline" start={52}><div style={{...descenderSafeText, fontSize: titleFontSize, fontWeight: 800, letterSpacing: -5.5, marginTop: 22, maxHeight: 306, overflow: "hidden"}}>{reelV2.title}</div></MotionReveal>
          {reelV2.subtitle && <MotionReveal end={72} start={62}><div style={{fontSize: 48, fontWeight: 700, lineHeight: 1.04, marginTop: 26}}>{reelV2.subtitle}</div></MotionReveal>}
        </div>
      </div>

      <div data-qa="reel-v2-info-panel" style={{backgroundColor: palette.accent, boxSizing: "border-box", height: 252, left: 74, overflow: "hidden", padding: "28px 30px", position: "absolute", top: 676, translate: `${interpolate(panelEntrance, [0, 1], [-670, 0])}px 0`, width: 520, zIndex: 6}}>
        <MotionReveal end={106} start={100}><div style={{fontSize: 40, fontWeight: 800, lineHeight: 1}}>{reelV2.infoLabel}</div></MotionReveal>
        {reelV2.infoLines.map((line, index) => <MotionReveal end={114 + (index * 4)} key={`${line}-${index}`} start={101 + (index * 3)}><div style={{fontSize: 46, fontWeight: 700, lineHeight: 1.08, marginTop: index === 0 ? 14 : 6}}>{line}</div></MotionReveal>)}
      </div>

      <div data-qa="reel-v2-list" style={{left: 78, position: "absolute", top: 970, width: 520, zIndex: 5}}>
        <MotionReveal end={148} start={140}><div style={{fontSize: 42, fontWeight: 800, lineHeight: 1, textTransform: "uppercase"}}>{reelV2.listLabel}</div></MotionReveal>
        <div style={{display: "flex", flexDirection: "column", gap: 16, marginTop: 28}}>
          {reelV2.listItems.map((item, index) => {
            const starts = [141, 143, 148, 154];
            const ends = [151, 157, 164, 170];
            return <MotionReveal end={ends[index]} key={`${item}-${index}`} start={starts[index]}><div style={{alignItems: "flex-start", display: "flex", fontSize: 36, fontWeight: 600, gap: 20, lineHeight: 1.12}}><span style={{backgroundColor: palette.accent, flex: "0 0 auto", height: 18, marginTop: 10, width: 18}} />{item}</div></MotionReveal>;
          })}
        </div>
      </div>

      <div data-qa="reel-v2-contact" style={{bottom: 74, left: 78, position: "absolute", width: 500, zIndex: 6}}>
        <div style={{height: 188, position: "relative"}}>
          <MapPin color={palette.accent} fill="none" size={158} strokeWidth={2.6} style={{bottom: 4, left: 92, position: "absolute", scale: pinEntrance}} />
        </div>
        <MotionReveal end={200} start={186}>
          <div style={{fontSize: 38, fontWeight: 800, lineHeight: 1, marginBottom: 20, textTransform: "uppercase"}}>{reelV2.contactLabel}</div>
        </MotionReveal>
        {reelV2.contactLines.map((line, index) => <MotionReveal end={202 + (index * 4)} key={`${line}-${index}`} start={189 + (index * 3)}><div style={{alignItems: "center", display: "flex", fontSize: 32, fontWeight: 600, gap: 14, lineHeight: 1.16, marginTop: 9}}><MapPin color={palette.accent} size={32} strokeWidth={2.4} />{line}</div></MotionReveal>)}
      </div>

      <OpeningCard {...props} palette={palette} />
    </AbsoluteFill>
  );
};
