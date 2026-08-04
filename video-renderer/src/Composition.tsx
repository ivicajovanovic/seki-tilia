import React from "react";
import { loadFont } from "@remotion/fonts";
import { Activity, CheckCircle2, HeartHandshake, MapPin, ShieldCheck, Sparkles } from "lucide-react";
import { Audio as RemotionAudio } from "@remotion/media";
import { AbsoluteFill, cancelRender, Composition, continueRender, delayRender, Easing, Img, interpolate, Sequence, spring, staticFile, Still, useCurrentFrame, useVideoConfig } from "remotion";
import colorPalette from "../../brand/color-palette.json";

type DesignVariant = "product-atelier" | "editorial-split" | "minimal-offer" | "product-card" | "premium-product-stage" | "offer-orbit" | "type-stage" | "gallery-shelf";
type MotionTreatment = "staged-reveal" | "offer-build" | "detail-cutaway" | "editorial-pan" | "location-close";
type ProductShape = "wide" | "compact" | "tall" | "unknown";
type OfferKind = "deadline" | "price" | "discount" | "bundle" | "gift" | "none";
type FooterStyle = "brand-full" | "cta-only" | "minimal";

type BenefitItem = {
  icon: "shield" | "activity" | "sparkles" | "heart" | "check";
  label: string;
};

type VideoProps = {
  eyebrow: string;
  headline: string;
  supportingText: string;
  offerLabel: string;
  cta: string;
  imageSrc?: string;
  imageBackground?: "transparent" | "opaque" | "unknown";
  productShape?: ProductShape;
  offerKind?: OfferKind;
  locationLine?: string;
  designVariant?: DesignVariant;
  motionTreatment?: MotionTreatment;
  footerStyle?: FooterStyle;
  benefits?: BenefitItem[];
  audioTrack?: string;
  audioVolume?: number;
  colorScheme?: string;
};

const colors = {
  petrol: "var(--palette-dark)",
  cream: "var(--palette-base)",
  lime: "var(--palette-accent)",
  beige: "var(--palette-surface)",
  stageTaupe: "var(--palette-stage)",
  podiumTop: "var(--palette-base)",
  podiumFront: "var(--palette-surface)",
  charcoal: "var(--palette-ink)",
  aqua: "var(--palette-secondary)",
};

const paletteColorMap = new Map(colorPalette.colors.map((color) => [color.id, color.hex]));
const rendererThemeMap = new Map(colorPalette.rendererThemes.map((theme) => [theme.id, theme]));
const paletteHex = (id: string) => paletteColorMap.get(id) ?? "#0F1519";
const paletteStyle = (schemeId = "calm-studio") => {
  const theme = rendererThemeMap.get(schemeId) ?? rendererThemeMap.get("calm-studio") ?? colorPalette.rendererThemes[0];
  return {
    "--palette-base": paletteHex(theme.background),
    "--palette-surface": paletteHex(theme.surface),
    "--palette-dark": paletteHex(theme.dark),
    "--palette-accent": paletteHex(theme.accent),
    "--palette-secondary": paletteHex(theme.secondary),
    "--palette-stage": paletteHex(theme.stage),
    "--palette-ink": paletteHex(theme.ink),
  } as React.CSSProperties;
};

const brandFontFamily = "AUSekiManrope";
let fontRequested = false;
const brandFontPromise = Promise.all([
  loadFont({
    display: "block",
    family: brandFontFamily,
    format: "woff2",
    unicodeRange: "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD",
    url: staticFile("assets/manrope-latin.woff2"),
    weight: "200 800",
  }),
  loadFont({
    display: "block",
    family: brandFontFamily,
    format: "woff2",
    unicodeRange: "U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF",
    url: staticFile("assets/manrope-latin-ext.woff2"),
    weight: "200 800",
  }),
]);

const ensureBrandFont = () => {
  if (fontRequested) return;
  fontRequested = true;
  const fontVerificationHandle = delayRender("Loading AU Šeki-Tilia Manrope font");
  void brandFontPromise.then(() => document.fonts.load(`800 76px "${brandFontFamily}"`)).then(async () => {
    if (!document.fonts.check(`800 76px "${brandFontFamily}"`)) {
      throw new Error("Manrope font nije dostupan renderer-u.");
    }
    await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
    continueRender(fontVerificationHandle);
  }).catch((error) => cancelRender(error));
};

const easeOut = Easing.bezier(0.16, 1, 0.3, 1);

/* ═══════════════════════════════════════════════════════════════════
   CLEAN GRAPHIC COMPONENTS — Crisp typography, vector stage & icons
   ═══════════════════════════════════════════════════════════════════ */

/** Clean architectural background arch — one continuous curve behind product stage */
const CleanStageArch: React.FC<{ story: boolean }> = ({ story }) => {
  const w = 1080;
  const h = story ? 1920 : 1350;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ height: "100%", left: 0, position: "absolute", top: 0, width: "100%", zIndex: 1 }} preserveAspectRatio="none">
      <path
        d={story
          ? `M${w * 0.39},0 C${w * 0.39},${h * 0.46} ${w * 0.58},${h * 0.72} ${w},${h * 0.78} L${w},0 Z`
          : `M${w * 0.39},0 C${w * 0.39},${h * 0.48} ${w * 0.58},${h * 0.76} ${w},${h * 0.80} L${w},0 Z`
        }
        fill={colors.stageTaupe}
      />
    </svg>
  );
};

/** Clean 3D vector podium — a shared baseline for the product, without shadows */
const CleanPodium: React.FC<{ story: boolean; width?: number; bottom?: number; treatment?: "standard" | "hero" }> = ({ story, width: podiumW, bottom: podiumBottom, treatment = "standard" }) => {
  const pw = podiumW ?? (story ? 540 : 440);
  const pb = podiumBottom ?? (story ? -160 : -130);
  const isHero = treatment === "hero";
  const ph = isHero ? (story ? 260 : 190) : (story ? 160 : 120);
  const topH = isHero ? (story ? 130 : 96) : (story ? 104 : 76);
  const frontExtension = story ? 500 : 400;

  return (
    <div data-qa="podium" style={{ bottom: pb, height: topH + ph, left: "50%", position: "absolute", translate: "-50% 0", width: pw, zIndex: 2 }}>
      <div style={{ background: `linear-gradient(104deg, ${colors.petrol} 0%, ${colors.podiumFront} 24%, ${colors.podiumTop} 52%, ${colors.stageTaupe} 76%, ${colors.petrol} 100%)`, bottom: -frontExtension, height: ph + (topH / 2) + frontExtension, left: 0, position: "absolute", width: pw, zIndex: 2 }} />
      <div style={{ background: `linear-gradient(114deg, ${colors.stageTaupe} 0%, ${colors.podiumFront} 25%, ${colors.podiumTop} 52%, ${colors.cream} 66%, ${colors.stageTaupe} 100%)`, borderRadius: "50%", height: topH, left: 0, position: "absolute", top: 0, width: pw, zIndex: 3 }} />
      <div style={{ borderTop: `3px solid ${colors.cream}`, borderRadius: "50%", height: topH, left: 0, opacity: 0.86, position: "absolute", top: 0, width: pw, zIndex: 5 }} />
      <div style={{ borderTop: `2px solid ${colors.petrol}`, borderRadius: "50%", height: topH * 0.66, left: pw * 0.10, opacity: 0.28, position: "absolute", top: topH * 0.19, width: pw * 0.80, zIndex: 4 }} />
    </div>
  );
};

/** Benefit Icons Row — Clean circular vector icons with text labels */
const BenefitIconsRow: React.FC<{ benefits?: BenefitItem[]; layout?: "grid" | "list"; story: boolean; animated?: boolean }> = ({ benefits, layout = "grid", story, animated = false }) => {
  const frame = useCurrentFrame();
  const list = benefits?.filter((item) => item.label.trim()) ?? [];
  if (list.length === 0) return null;
  const renderIcon = (type: BenefitItem["icon"], size: number) => {
    switch (type) {
      case "shield": return <ShieldCheck color={colors.petrol} size={size} strokeWidth={1.8} />;
      case "activity": return <Activity color={colors.petrol} size={size} strokeWidth={1.8} />;
      case "sparkles": return <Sparkles color={colors.petrol} size={size} strokeWidth={1.8} />;
      case "heart": return <HeartHandshake color={colors.petrol} size={size} strokeWidth={1.8} />;
      default: return <CheckCircle2 color={colors.petrol} size={size} strokeWidth={1.8} />;
    }
  };

  if (layout === "grid") {
    const iconBoxSize = story ? 76 : 58;
    const iconSize = story ? 34 : 26;
    return (
      <div style={{ display: "grid", gap: story ? 24 : 16, gridTemplateColumns: "repeat(3, 1fr)", marginTop: story ? 34 : 24, width: "100%" }}>
        {list.slice(0, 3).map((item, idx) => {
          const itemSpring = animated ? spring({ frame: Math.max(0, frame - (34 + idx * 8)), fps: 30, config: { damping: 14, stiffness: 90 } }) : 1;
          const floatY = animated ? Math.sin(frame * 0.06 + idx * 1.2) * 4 : 0;
          return (
            <div key={idx} style={{ alignItems: "center", display: "flex", flexDirection: "column", gap: story ? 12 : 9, opacity: itemSpring, textAlign: "center", translate: `0 ${interpolate(itemSpring, [0, 1], [20, 0])}px` }}>
              <div style={{ alignItems: "center", backgroundColor: colors.cream, border: `1.5px solid ${colors.petrol}`, borderRadius: "50%", display: "flex", height: iconBoxSize, justifyContent: "center", translate: `0 ${floatY}px`, width: iconBoxSize }}>
                {renderIcon(item.icon, iconSize)}
              </div>
              <div style={{ color: colors.petrol, fontSize: story ? 18 : 13, fontWeight: 800, letterSpacing: 0.2, lineHeight: 1.25, textTransform: "uppercase" }}>{item.label}</div>
            </div>
          );
        })}
      </div>
    );
  }

  const iconBoxSize = story ? 54 : 42;
  const iconSize = story ? 26 : 20;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: story ? 18 : 13, marginTop: story ? 24 : 16 }}>
      {list.map((item, idx) => {
        const itemSpring = animated ? spring({ frame: Math.max(0, frame - (34 + idx * 8)), fps: 30, config: { damping: 14, stiffness: 90 } }) : 1;
        const floatY = animated ? Math.sin(frame * 0.06 + idx * 1.2) * 4 : 0;
        return (
          <div key={idx} style={{ alignItems: "center", display: "flex", gap: story ? 16 : 12, opacity: itemSpring, translate: `0 ${interpolate(itemSpring, [0, 1], [20, 0])}px` }}>
            <div style={{ alignItems: "center", backgroundColor: colors.cream, border: `2px solid ${colors.stageTaupe}`, borderRadius: "50%", display: "flex", height: iconBoxSize, justifyContent: "center", translate: `0 ${floatY}px`, width: iconBoxSize }}>
              {renderIcon(item.icon, iconSize)}
            </div>
            <div style={{ color: colors.petrol, fontSize: story ? 26 : 19, fontWeight: 700, lineHeight: 1.2 }}>{item.label}</div>
          </div>
        );
      })}
    </div>
  );
};

/** Brand footer with full logo, Lucide location icon, CTA and crisp dot pattern */
const BrandFooter: React.FC<{
  cta: string;
  footerStyle?: FooterStyle;
  locationLine?: string;
  story: boolean;
  opacity?: number;
}> = ({ cta, footerStyle = "brand-full", locationLine, story, opacity = 1 }) => {
  if (footerStyle === "minimal") {
    return (
      <div data-qa="cta-footer" style={{ alignItems: "center", backgroundColor: colors.petrol, boxSizing: "border-box", color: colors.cream, display: "flex", fontFamily: brandFontFamily, justifyContent: "space-between", left: 0, minHeight: story ? 250 : 196, opacity, padding: story ? "46px 80px" : "38px 66px", position: "absolute", right: 0, bottom: 0, zIndex: 20 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: story ? 12 : 9 }}>
          <div style={{ fontSize: story ? 40 : 30, fontWeight: 800, lineHeight: 1.12 }}>{cta}</div>
          <LocationMarker label={locationLine} size={story ? 26 : 20} />
        </div>
        <div style={{ backgroundColor: colors.lime, height: story ? 4 : 3, width: story ? 150 : 110 }} />
      </div>
    );
  }
  const isCtaOnly = footerStyle === "cta-only";
  return (
    <div data-qa="cta-footer" style={{ backgroundColor: colors.petrol, bottom: 0, color: colors.cream, display: "flex", fontFamily: brandFontFamily, left: 0, opacity, position: "absolute", right: 0, zIndex: 20 }}>
      {/* Top lime line */}
      <div style={{ backgroundColor: colors.lime, height: story ? 5 : 4, left: 0, position: "absolute", right: 0, top: 0 }} />
      <div style={{ alignItems: "center", boxSizing: "border-box", display: "flex", justifyContent: "space-between", minHeight: story ? 280 : 220, padding: story ? "52px 80px 56px" : "44px 66px 48px", width: "100%" }}>
        {/* Left: location icon + CTA */}
        <div style={{ display: "flex", gap: story ? 22 : 16, alignItems: "center" }}>
          <div style={{ alignItems: "center", backgroundColor: colors.lime, borderRadius: "50%", display: "flex", height: story ? 72 : 56, justifyContent: "center", width: story ? 72 : 56 }}>
            <MapPin color={colors.petrol} size={story ? 36 : 29} strokeWidth={2.4} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: story ? 5 : 3 }}>
            <div style={{ fontSize: story ? 42 : 32, fontWeight: 800, lineHeight: 1.1 }}>{cta}</div>
            <div style={{ fontSize: story ? 25 : 19, fontWeight: 500, lineHeight: 1.2, opacity: 0.8 }}>{locationLine ?? "AU Šeki-Tilia apoteka"}</div>
          </div>
        </div>
        {/* Right: full logo or dot pattern */}
        {!isCtaOnly ? (
          <div style={{ alignItems: "center", display: "flex", gap: story ? 16 : 12 }}>
            <div style={{ backgroundColor: colors.lime, height: story ? 48 : 36, width: story ? 4 : 3 }} />
            <div style={{ alignItems: "center", display: "flex", gap: story ? 10 : 8 }}>
              <LogoMark background="dark" size={story ? 58 : 46} />
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ fontSize: story ? 36 : 28, fontWeight: 800, letterSpacing: 0.2, lineHeight: 1.08 }}>AU Šeki-Tilia</div>
                <div style={{ fontSize: story ? 18 : 15, fontWeight: 500, letterSpacing: 1, opacity: 0.65, textTransform: "lowercase" }}>apoteka</div>
              </div>
            </div>
          </div>
        ) : (
          <DotPattern story={story} />
        )}
      </div>
    </div>
  );
};

/** Crisp dot pattern grid */
const DotPattern: React.FC<{ story: boolean; cols?: number; rows?: number; color?: string }> = ({ story, cols = 4, rows = 3, color = colors.cream }) => (
  <div style={{ display: "grid", gap: story ? 12 : 9, gridTemplateColumns: `repeat(${cols}, 1fr)`, opacity: 0.35 }}>
    {Array.from({ length: cols * rows }, (_, i) => <div key={i} style={{ backgroundColor: color, borderRadius: "50%", height: story ? 8 : 6, width: story ? 8 : 6 }} />)}
  </div>
);

const LogoMark: React.FC<{ background?: "light" | "dark"; size: number }> = ({ background = "light", size }) => (
  <Img
    src={staticFile(background === "dark" ? "assets/logo-svetliji.svg" : "assets/logo-tamniji.svg")}
    style={{ height: size, width: size }}
  />
);

/** Physics-based spring entrance helper */
const useSpringEntrance = (animated: boolean, delayFrames: number, config = { damping: 14, stiffness: 85, mass: 0.8 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (!animated) return 1;
  if (frame >= delayFrames + 45) return 1;
  return spring({
    frame: Math.max(0, frame - delayFrames),
    fps,
    config,
  });
};

const ProductImage: React.FC<{ imageSrc?: string; style?: React.CSSProperties }> = ({ imageSrc, style }) => {
  const resolvedImageSrc = imageSrc?.startsWith("/") ? staticFile(imageSrc.slice(1)) : imageSrc;
  if (!resolvedImageSrc) return null;
  return <Img data-qa="product" src={resolvedImageSrc} style={{ objectFit: "contain", ...style }} />;
};

const OfferPill: React.FC<{ label: string; dark?: boolean; size: number }> = ({ label, dark = false, size }) => (
  <div
    style={{
      alignSelf: "flex-start",
      backgroundColor: dark ? colors.petrol : colors.lime,
      borderRadius: 999,
      color: dark ? colors.cream : colors.petrol,
      fontSize: size,
      fontWeight: 800,
      letterSpacing: -0.5,
      lineHeight: 1,
      padding: `${Math.round(size * 0.45)}px ${Math.round(size * 0.75)}px`,
    }}
  >
    {label}
  </div>
);

const OfferBadge: React.FC<{ label: string; rotate: number; size: number }> = ({ label, rotate, size }) => (
  <div
    style={{
      alignItems: "center",
      backgroundColor: colors.lime,
      borderRadius: "50%",
      color: colors.petrol,
      display: "flex",
      fontSize: Math.round(size * 0.2),
      fontWeight: 800,
      height: size,
      justifyContent: "center",
      lineHeight: 0.9,
      padding: Math.round(size * 0.12),
      rotate: `${rotate}deg`,
      textAlign: "center",
      width: size,
    }}
  >
    {label}
  </div>
);

const LocationMarker: React.FC<{ label?: string; onLight?: boolean; size: number; textAlign?: "left" | "right" }> = ({ label, onLight = false, size, textAlign = "left" }) => (
  <div style={{ alignItems: "center", display: "flex", gap: Math.max(7, Math.round(size * 0.42)), justifyContent: textAlign === "right" ? "flex-end" : "flex-start", opacity: 0.85, textAlign }}>
    <MapPin color={onLight ? colors.petrol : colors.lime} size={Math.round(size * 1.08)} strokeWidth={2.35} />
    <div style={{ fontSize: size, fontWeight: 600, lineHeight: 1.08 }}>{label ?? "AU Šeki-Tilia"}</div>
  </div>
);

/* ═══════════════════════════════════════════════════════════════════
   DESIGN FAMILIES
   ═══════════════════════════════════════════════════════════════════ */

const PremiumProductStage: React.FC<VideoProps & { animated?: boolean }> = ({ eyebrow, headline, supportingText, offerLabel, cta, imageSrc, imageBackground, productShape, locationLine, footerStyle = "brand-full", benefits, animated = false }) => {
  const frame = useCurrentFrame();
  const { height } = useVideoConfig();
  const isStory = height > 1500;
  const intro = useSpringEntrance(animated, 0, { damping: 16, stiffness: 90, mass: 0.8 });
  const headlineSpring = useSpringEntrance(animated, 6, { damping: 14, stiffness: 85, mass: 0.8 });
  const offerSpring = useSpringEntrance(animated, 14, { damping: 15, stiffness: 90, mass: 0.8 });
  const product = useSpringEntrance(animated, 22, { damping: 13, stiffness: 80, mass: 0.8 });
  const footer = useSpringEntrance(animated, 58, { damping: 18, stiffness: 70, mass: 0.8 });
  const isTransparentProduct = imageBackground === "transparent";
  const isWideProduct = productShape === "wide";
  const padding = isStory ? 74 : 62;
  const bottomPadding = isStory ? 310 : 240;
  const podiumW = isStory ? 540 : 440;
  const podiumBottom = isStory ? -160 : -130;
  const productBottom = isStory ? 145 : 94;

  // Continuous micro-motion for holding phase
  const floatY = animated ? Math.sin(frame * 0.05) * 6 : 0;
  const breathScale = animated ? 1 + Math.sin(frame * 0.04) * 0.015 : 1;

  return (
    <AbsoluteFill style={{ backgroundColor: colors.cream, color: colors.petrol, fontFamily: brandFontFamily, overflow: "hidden" }}>
      {/* Clean stage background arch */}
      <CleanStageArch story={isStory} />

      <div style={{ boxSizing: "border-box", display: "flex", flexDirection: "column", height: "100%", padding: `${padding}px ${padding}px ${bottomPadding}px`, position: "relative", zIndex: 3 }}>
        {/* Header: eyebrow + logo */}
        <div style={{ alignItems: "center", display: "flex", flexShrink: 0, justifyContent: "space-between", opacity: intro, position: "relative", zIndex: 8 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: isStory ? 18 : 12 }}>
            <div style={{ fontSize: isStory ? 28 : 22, fontWeight: 800, letterSpacing: isStory ? 3.2 : 2.5, textTransform: "uppercase" }}>{eyebrow}</div>
            <div style={{ backgroundColor: colors.lime, height: isStory ? 5 : 4, width: isStory ? 260 : 190 }} />
          </div>
          <LogoMark size={isStory ? 64 : 50} />
        </div>

        {/* Main content: typography & benefit icons left + clean product stage right */}
        <div style={{ display: "grid", flex: 1, gridTemplateColumns: isStory ? "50% 50%" : "49% 51%", minHeight: 0, paddingTop: isStory ? 36 : 24 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: isStory ? 20 : 14, justifyContent: "space-between", paddingBottom: isStory ? 12 : 8, paddingTop: isStory ? 24 : 12, position: "relative", zIndex: 6 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: isStory ? 20 : 14 }}>
              <div data-qa="headline" style={{ fontSize: isStory ? 104 : 92, fontWeight: 800, letterSpacing: isStory ? -5 : -4, lineHeight: 0.88, maxWidth: "100%", opacity: headlineSpring, translate: `0 ${interpolate(headlineSpring, [0, 1], [30, 0])}px`, whiteSpace: "pre-line" }}>{headline}</div>
              <div style={{ opacity: offerSpring, translate: `0 ${interpolate(offerSpring, [0, 1], [20, 0])}px` }}>
                <OfferPill label={offerLabel} size={isStory ? 42 : 32} />
              </div>
              <div style={{ fontSize: isStory ? 32 : 24, fontWeight: 600, lineHeight: 1.2, maxWidth: "90%", opacity: headlineSpring }}>{supportingText}</div>
            </div>
            {/* Staggered benefit icons pop-in & continuous micro-float */}
            <div style={{ width: "100%" }}>
              <BenefitIconsRow benefits={benefits} layout="grid" story={isStory} animated={animated} />
            </div>
          </div>

          {/* Product stage with clean 3D podium */}
          <div data-qa="product-stage" style={{ alignItems: "flex-end", display: "flex", height: "100%", justifyContent: "center", position: "relative", zIndex: 4 }}>
            <CleanPodium story={isStory} width={podiumW} bottom={podiumBottom} treatment="hero" />
            <ProductImage
              imageSrc={imageSrc}
              style={{
                bottom: productBottom,
                height: isTransparentProduct ? (isWideProduct ? "76%" : "84%") : "74%",
                maxWidth: "92%",
                objectPosition: "center bottom",
                opacity: product,
                position: "absolute",
                scale: interpolate(product, [0, 1], [0.92, 1]) * breathScale,
                translate: `0 ${interpolate(product, [0, 1], [50, 0], { extrapolateRight: "clamp" }) + floatY}px`,
                zIndex: 5,
              }}
            />
          </div>
        </div>
      </div>

      {/* Brand footer */}
      <BrandFooter cta={cta} footerStyle={footerStyle === "minimal" ? "minimal" : "brand-full"} locationLine={locationLine} story={isStory} opacity={footer} />
    </AbsoluteFill>
  );
};

const EditorialSplit: React.FC<VideoProps & { animated?: boolean }> = ({ eyebrow, headline, supportingText, offerKind, offerLabel, cta, imageSrc, imageBackground, locationLine, footerStyle = "brand-full", animated = false }) => {
  const { height } = useVideoConfig();
  const isStory = height > 1500;
  const intro = useSpringEntrance(animated, 0);
  const product = useSpringEntrance(animated, 12);
  const offer = useSpringEntrance(animated, 24);
  const isTransparentProduct = imageBackground === "transparent";
  const badgeSize = isStory ? 200 : 160;
  const hasOfferBadge = offerKind !== "none" && offerLabel.trim().length > 0;
  const bottomPadding = isStory ? 310 : 240;
  const podiumBottom = isStory ? -160 : -130;
  const productBottom = isStory ? 145 : 94;

  return (
    <AbsoluteFill style={{ backgroundColor: colors.cream, color: colors.petrol, fontFamily: brandFontFamily, overflow: "hidden" }}>
      <CleanStageArch story={isStory} />

      <div style={{ boxSizing: "border-box", display: "flex", flexDirection: "column", height: "100%", padding: `${isStory ? 74 : 62}px ${isStory ? 74 : 62}px ${bottomPadding}px`, position: "relative", zIndex: 3 }}>
        <div style={{ alignItems: "center", display: "flex", justifyContent: "space-between", opacity: intro }}>
          <div style={{ display: "flex", flexDirection: "column", gap: isStory ? 14 : 9 }}>
            <div style={{ fontSize: isStory ? 27 : 21, fontWeight: 800, letterSpacing: isStory ? 3.2 : 2.5, textTransform: "uppercase" }}>{eyebrow}</div>
            <div style={{ backgroundColor: colors.lime, height: isStory ? 5 : 4, width: isStory ? 220 : 160 }} />
          </div>
          <LogoMark size={isStory ? 62 : 48} />
        </div>

        <div style={{ display: "grid", flex: 1, gridTemplateColumns: isStory ? "50% 50%" : "48% 52%", minHeight: 0, paddingTop: isStory ? 48 : 50 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: isStory ? 22 : 14, minWidth: 0, paddingTop: isStory ? 24 : 16, position: "relative", zIndex: 4 }}>
            <div data-qa="headline" style={{ fontSize: isStory ? 104 : 80, fontWeight: 800, letterSpacing: isStory ? -5 : -3.5, lineHeight: 0.9, maxWidth: "100%", opacity: intro, whiteSpace: "pre-line" }}>{headline}</div>
            <div style={{ fontSize: isStory ? 32 : 24, fontWeight: 600, lineHeight: 1.2, maxWidth: "90%", opacity: intro }}>{supportingText}</div>
          </div>

          <div data-qa="product-stage" style={{ alignItems: "flex-end", display: "flex", height: "100%", justifyContent: "center", position: "relative" }}>
            <CleanPodium story={isStory} width={isStory ? 480 : 380} bottom={podiumBottom} />
            <ProductImage
              imageSrc={imageSrc}
              style={{
                bottom: productBottom,
                height: isTransparentProduct ? (isStory ? "82%" : "86%") : (isStory ? "74%" : "78%"),
                maxWidth: "92%",
                objectPosition: "center bottom",
                opacity: product,
                position: "absolute",
                scale: interpolate(product, [0, 1], [0.92, 1]),
                zIndex: 5,
              }}
            />
            {hasOfferBadge && (
              <div style={{ bottom: isStory ? 180 : 120, left: isStory ? 10 : 5, opacity: offer, position: "absolute", zIndex: 10 }}>
                <OfferBadge label={offerLabel} size={badgeSize} rotate={-10} />
              </div>
            )}
          </div>
        </div>
      </div>

      <BrandFooter cta={cta} footerStyle={footerStyle === "minimal" ? "minimal" : "brand-full"} locationLine={locationLine} story={isStory} opacity={offer} />
    </AbsoluteFill>
  );
};

const VerticalSpotlight: React.FC<{ story: boolean; variant: "atelier" | "type" }> = ({ story, variant }) => {
  const diameter = story ? (variant === "type" ? 770 : 690) : (variant === "type" ? 600 : 530);
  const offset = story ? (variant === "type" ? -130 : -92) : (variant === "type" ? -112 : -78);
  return (
    <div aria-hidden="true" style={{ bottom: story ? 235 : 165, height: diameter, position: "absolute", right: offset, width: diameter, zIndex: 1 }}>
      <div style={{ background: `radial-gradient(circle at 37% 30%, ${colors.cream} 0%, ${colors.beige} 54%, ${colors.stageTaupe} 100%)`, borderRadius: "50%", height: "100%", position: "absolute", width: "100%" }} />
      <div style={{ border: `${story ? 11 : 8}px solid ${colors.lime}`, borderRadius: "50%", height: "84%", position: "absolute", right: story ? -82 : -60, top: story ? -62 : -48, width: "84%" }} />
      <div style={{ border: `${story ? 3 : 2}px solid ${colors.petrol}`, borderRadius: "50%", height: "65%", left: story ? 72 : 54, opacity: 0.20, position: "absolute", top: story ? 102 : 76, width: "65%" }} />
      <div style={{ background: `linear-gradient(110deg, transparent 0%, ${colors.cream} 48%, transparent 100%)`, borderRadius: "50%", height: "26%", left: "15%", opacity: 0.68, position: "absolute", top: "12%", width: "68%" }} />
    </div>
  );
};

const ProductAtelier: React.FC<VideoProps & { animated?: boolean }> = ({ eyebrow, headline, supportingText, cta, imageSrc, imageBackground, productShape, locationLine, footerStyle = "brand-full", animated = false }) => {
  const frame = useCurrentFrame();
  const { height } = useVideoConfig();
  const isStory = height > 1500;
  const intro = useSpringEntrance(animated, 0);
  const headlineSpring = useSpringEntrance(animated, 6);
  const product = useSpringEntrance(animated, 20);
  const footer = useSpringEntrance(animated, 58);
  const isTransparentProduct = imageBackground === "transparent";
  const isTallProduct = productShape === "tall";
  const bottomPadding = isStory ? 310 : 240;
  const podiumBottom = isStory ? -160 : -130;
  const productBottom = isStory ? 145 : 94;

  const floatY = animated ? Math.sin(frame * 0.05) * 6 : 0;
  const breathScale = animated ? 1 + Math.sin(frame * 0.04) * 0.015 : 1;

  return (
    <AbsoluteFill style={{ backgroundColor: colors.cream, color: colors.petrol, fontFamily: brandFontFamily, overflow: "hidden" }}>
      <VerticalSpotlight story={isStory} variant="atelier" />
      <div style={{ boxSizing: "border-box", display: "flex", flexDirection: "column", height: "100%", padding: `${isStory ? 88 : 60}px ${isStory ? 78 : 68}px ${bottomPadding}px`, position: "relative", zIndex: 3 }}>
        <div style={{ alignItems: "center", display: "flex", justifyContent: "space-between", opacity: intro }}>
          <div style={{ display: "flex", flexDirection: "column", gap: isStory ? 12 : 8 }}>
            <div style={{ fontSize: isStory ? 30 : 23, fontWeight: 800, letterSpacing: isStory ? 3.4 : 2.6, textTransform: "uppercase" }}>{eyebrow}</div>
            <div style={{ backgroundColor: colors.lime, height: isStory ? 5 : 4, width: isStory ? 220 : 170 }} />
          </div>
          <LogoMark size={isStory ? 68 : 54} />
        </div>
        <div style={{ display: "grid", flex: 1, gridTemplateColumns: isStory ? "50% 50%" : "48% 52%", minHeight: 0, paddingTop: isStory ? 48 : 32 }}>
          <div style={{ alignSelf: "start", display: "flex", flexDirection: "column", gap: isStory ? 24 : 16, maxWidth: "100%", opacity: headlineSpring, paddingTop: isStory ? 24 : 16, position: "relative", translate: `0 ${interpolate(headlineSpring, [0, 1], [30, 0])}px`, zIndex: 5 }}>
            <div data-qa="headline" style={{ fontSize: isStory ? 100 : 82, fontWeight: 800, letterSpacing: isStory ? -5 : -3.7, lineHeight: 0.9, whiteSpace: "pre-line" }}>{headline}</div>
            <div style={{ fontSize: isStory ? 32 : 25, fontWeight: 600, lineHeight: 1.2, maxWidth: "88%" }}>{supportingText}</div>
            <LocationMarker label={locationLine} onLight size={isStory ? 25 : 18} />
          </div>
          <div data-qa="product-stage" style={{ alignItems: "flex-end", display: "flex", justifyContent: "center", minHeight: 0, position: "relative", zIndex: 6 }}>
            <CleanPodium story={isStory} width={isStory ? 520 : 420} bottom={podiumBottom} treatment="hero" />
            <ProductImage imageSrc={imageSrc} style={{ bottom: productBottom, height: isTransparentProduct ? (isTallProduct ? (isStory ? "88%" : "90%") : (isStory ? "82%" : "86%")) : (isStory ? "74%" : "78%"), maxWidth: "92%", objectPosition: "center bottom", opacity: product, position: "absolute", scale: interpolate(product, [0, 1], [0.91, 1]) * breathScale, translate: `0 ${interpolate(product, [0, 1], [40, 0], { extrapolateRight: "clamp" }) + floatY}px`, zIndex: 5 }} />
          </div>
        </div>
      </div>
      <BrandFooter cta={cta} footerStyle={footerStyle === "minimal" ? "minimal" : "brand-full"} locationLine={locationLine} story={isStory} opacity={footer} />
    </AbsoluteFill>
  );
};

const MinimalOffer: React.FC<VideoProps & { animated?: boolean }> = ({ eyebrow, headline, supportingText, offerLabel, cta, imageSrc, imageBackground, locationLine, footerStyle = "cta-only", animated = false }) => {
  const frame = useCurrentFrame();
  const { height } = useVideoConfig();
  const isStory = height > 1500;
  const intro = useSpringEntrance(animated, 0);
  const headlineSpring = useSpringEntrance(animated, 6);
  const offerSpring = useSpringEntrance(animated, 16);
  const product = useSpringEntrance(animated, 24);
  const footer = useSpringEntrance(animated, 58);
  const isTransparentProduct = imageBackground === "transparent";
  const bottomPadding = isStory ? 310 : 240;
  const podiumBottom = isStory ? -160 : -130;
  const productBottom = isStory ? 145 : 94;

  const floatY = animated ? Math.sin(frame * 0.05) * 6 : 0;
  const breathScale = animated ? 1 + Math.sin(frame * 0.04) * 0.015 : 1;

  return (
    <AbsoluteFill style={{ backgroundColor: colors.cream, color: colors.petrol, fontFamily: brandFontFamily, overflow: "hidden" }}>
      <div style={{ backgroundColor: colors.lime, height: isStory ? 42 : 32, left: 0, position: "absolute", right: 0, top: 0, zIndex: 10 }} />
      <div style={{ boxSizing: "border-box", display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between", padding: `${isStory ? 102 : 72}px ${isStory ? 82 : 72}px ${bottomPadding}px`, position: "relative", zIndex: 3 }}>
        <div style={{ alignItems: "flex-start", display: "flex", justifyContent: "space-between", opacity: intro }}>
          <div style={{ display: "flex", flexDirection: "column", gap: isStory ? 24 : 16, maxWidth: "68%" }}>
            <div style={{ fontSize: isStory ? 28 : 22, fontWeight: 800, letterSpacing: isStory ? 3 : 2.3, textTransform: "uppercase" }}>{eyebrow}</div>
            <div style={{ fontSize: isStory ? 100 : 82, fontWeight: 800, letterSpacing: -5, lineHeight: 0.9, opacity: headlineSpring, translate: `0 ${interpolate(headlineSpring, [0, 1], [30, 0])}px` }}>{headline}</div>
          </div>
          <LogoMark size={isStory ? 68 : 52} />
        </div>
        <div style={{ alignItems: "center", display: "flex", gap: isStory ? 34 : 24, justifyContent: "space-between", position: "relative" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: isStory ? 24 : 16, maxWidth: "48%", opacity: offerSpring, translate: `0 ${interpolate(offerSpring, [0, 1], [20, 0])}px` }}>
            <div>
              <OfferPill label={offerLabel} size={isStory ? 44 : 32} />
            </div>
            <div style={{ fontSize: isStory ? 34 : 25, fontWeight: 600, lineHeight: 1.17 }}>{supportingText}</div>
          </div>
          <div style={{ alignItems: "center", display: "flex", height: isStory ? 600 : 440, justifyContent: "center", position: "relative", width: "48%" }}>
            <CleanPodium story={isStory} width={isStory ? 400 : 320} bottom={podiumBottom} />
            <ProductImage imageSrc={imageSrc} style={{ bottom: productBottom, height: isTransparentProduct ? "84%" : "72%", maxWidth: "92%", opacity: product, position: "absolute", scale: interpolate(product, [0, 1], [0.9, 1]) * breathScale, translate: `0 ${interpolate(product, [0, 1], [40, 0]) + floatY}px`, zIndex: 5 }} />
          </div>
        </div>
      </div>
      <BrandFooter cta={cta} footerStyle={footerStyle === "minimal" ? "minimal" : "cta-only"} locationLine={locationLine} story={isStory} opacity={footer} />
    </AbsoluteFill>
  );
};

const ProductCard: React.FC<VideoProps & { animated?: boolean }> = ({ eyebrow, headline, supportingText, offerLabel, cta, imageSrc, imageBackground, locationLine, animated = false }) => {
  const frame = useCurrentFrame();
  const { height } = useVideoConfig();
  const isStory = height > 1500;
  const intro = useSpringEntrance(animated, 0);
  const headlineSpring = useSpringEntrance(animated, 6);
  const product = useSpringEntrance(animated, 20);
  const footer = useSpringEntrance(animated, 58);
  const isTransparentProduct = imageBackground === "transparent";
  const bottomPadding = isStory ? 310 : 240;
  const podiumBottom = isStory ? -160 : -130;
  const productBottom = isStory ? 145 : 94;

  const floatY = animated ? Math.sin(frame * 0.05) * 6 : 0;
  const breathScale = animated ? 1 + Math.sin(frame * 0.04) * 0.015 : 1;

  return (
    <AbsoluteFill style={{ backgroundColor: colors.petrol, color: colors.cream, fontFamily: brandFontFamily, overflow: "hidden" }}>
      <div style={{ boxSizing: "border-box", display: "flex", flexDirection: "column", height: "100%", padding: `${isStory ? 92 : 60}px ${isStory ? 82 : 72}px ${bottomPadding}px`, position: "relative", zIndex: 3 }}>
        <div style={{ alignItems: "center", display: "flex", justifyContent: "space-between", opacity: intro }}>
          <div style={{ display: "flex", flexDirection: "column", gap: isStory ? 10 : 7 }}>
            <div style={{ fontSize: isStory ? 30 : 23, fontWeight: 800, letterSpacing: isStory ? 3.2 : 2.5, textTransform: "uppercase" }}>{eyebrow}</div>
            <div style={{ backgroundColor: colors.lime, height: isStory ? 4 : 3, width: isStory ? 200 : 155 }} />
          </div>
          <LogoMark background="dark" size={isStory ? 68 : 54} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: isStory ? 18 : 12, marginTop: isStory ? 42 : 30, opacity: headlineSpring, translate: `0 ${interpolate(headlineSpring, [0, 1], [30, 0])}px` }}>
          <div style={{ fontSize: isStory ? 96 : 74, fontWeight: 800, letterSpacing: -4, lineHeight: 0.95, maxWidth: "78%" }}>{headline}</div>
          <div style={{ fontSize: isStory ? 34 : 26, fontWeight: 600, lineHeight: 1.18, maxWidth: "78%" }}>{supportingText}</div>
        </div>
        <div style={{ alignItems: "center", display: "flex", flex: 1, justifyContent: "center", margin: isStory ? "36px 0 28px" : "24px 0 18px", minHeight: 0, position: "relative" }}>
          <CleanPodium story={isStory} width={isStory ? 480 : 380} bottom={podiumBottom} />
          <ProductImage imageSrc={imageSrc} style={{ bottom: productBottom, height: isTransparentProduct ? "84%" : "74%", maxWidth: "92%", opacity: product, position: "absolute", scale: interpolate(product, [0, 1], [0.9, 1]) * breathScale, translate: `0 ${interpolate(product, [0, 1], [40, 0]) + floatY}px`, zIndex: 5 }} />
        </div>
        <div style={{ alignItems: "center", display: "flex", gap: isStory ? 30 : 22, justifyContent: "space-between", opacity: footer, translate: `0 ${interpolate(footer, [0, 1], [30, 0])}px` }}>
          <OfferPill label={offerLabel} size={isStory ? 40 : 30} />
          <div style={{ display: "flex", flexDirection: "column", gap: 6, maxWidth: "48%", textAlign: "right" }}>
            <div style={{ fontSize: isStory ? 31 : 23, fontWeight: 700, lineHeight: 1.14 }}>{cta}</div>
            <LocationMarker label={locationLine} size={isStory ? 23 : 17} textAlign="right" />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const GalleryShelf: React.FC<VideoProps & { animated?: boolean }> = ({ eyebrow, headline, supportingText, offerKind, offerLabel, cta, imageSrc, imageBackground, locationLine, footerStyle = "brand-full", animated = false }) => {
  const frame = useCurrentFrame();
  const { height } = useVideoConfig();
  const isStory = height > 1500;
  const intro = useSpringEntrance(animated, 0);
  const headlineSpring = useSpringEntrance(animated, 6);
  const product = useSpringEntrance(animated, 20);
  const footer = useSpringEntrance(animated, 58);
  const isTransparentProduct = imageBackground === "transparent";
  const hasOfferPill = offerKind !== "none" && offerLabel.trim().length > 0;
  const bottomPadding = isStory ? 310 : 240;
  const podiumBottom = isStory ? -160 : -130;
  const productBottom = isStory ? 145 : 94;

  const floatY = animated ? Math.sin(frame * 0.05) * 6 : 0;
  const breathScale = animated ? 1 + Math.sin(frame * 0.04) * 0.015 : 1;

  return (
    <AbsoluteFill style={{ backgroundColor: colors.cream, color: colors.petrol, fontFamily: brandFontFamily, overflow: "hidden" }}>
      <div style={{ backgroundColor: colors.petrol, height: isStory ? "43%" : "100%", position: "absolute", right: 0, top: 0, width: isStory ? "100%" : "39%", zIndex: 1 }} />
      <div style={{ backgroundColor: colors.stageTaupe, borderRadius: "50%", bottom: isStory ? 340 : 212, height: isStory ? 720 : 540, left: isStory ? "auto" : -150, position: "absolute", right: isStory ? -160 : "auto", width: isStory ? 720 : 540, zIndex: 2 }} />
      <div style={{ boxSizing: "border-box", display: "flex", flexDirection: "column", height: "100%", padding: `${isStory ? 72 : 62}px ${isStory ? 76 : 62}px ${bottomPadding}px`, position: "relative", zIndex: 4 }}>
        <div style={{ alignItems: "flex-start", color: isStory ? colors.cream : colors.petrol, display: "flex", flexShrink: 0, justifyContent: "space-between", opacity: intro, position: "relative", zIndex: 8 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: isStory ? 14 : 10, maxWidth: isStory ? "72%" : "58%" }}>
            <div style={{ fontSize: isStory ? 27 : 21, fontWeight: 800, letterSpacing: isStory ? 3.2 : 2.5, textTransform: "uppercase" }}>{eyebrow}</div>
            <div style={{ backgroundColor: colors.lime, height: isStory ? 5 : 4, width: isStory ? 220 : 160 }} />
          </div>
          <LogoMark background="dark" size={isStory ? 62 : 48} />
        </div>
        <div style={{ display: "grid", flex: 1, gridTemplateColumns: isStory ? "1fr" : "59% 41%", minHeight: 0, paddingTop: isStory ? 38 : 58 }}>
          <div style={{ color: colors.cream, maxWidth: isStory ? "74%" : "92%", minWidth: 0, opacity: headlineSpring, order: isStory ? 0 : 2, paddingTop: isStory ? 0 : 18, position: "relative", translate: `0 ${interpolate(headlineSpring, [0, 1], [30, 0])}px`, zIndex: 5 }}>
            <div style={{ alignItems: "flex-start", display: "flex", flexDirection: "column", gap: isStory ? 18 : 14, translate: isStory ? "0 0" : "72px 0" }}>
              <div data-qa="headline" style={{ fontSize: isStory ? 96 : 46, fontWeight: 800, letterSpacing: isStory ? -4 : -2.1, lineHeight: 0.92, maxWidth: "100%", whiteSpace: "pre-line" }}>{headline}</div>
              <div style={{ fontSize: isStory ? 30 : 25, fontWeight: 600, lineHeight: 1.18, maxWidth: isStory ? "88%" : "90%" }}>{supportingText}</div>
              {hasOfferPill && <OfferPill dark={!isStory} label={offerLabel} size={isStory ? 38 : 28} />}
            </div>
          </div>
          <div data-qa="product-stage" style={{ alignItems: "flex-end", display: "flex", justifyContent: "center", minHeight: 0, order: 1, position: "relative", zIndex: 6 }}>
            <CleanPodium story={isStory} width={isStory ? 520 : 400} bottom={podiumBottom} treatment="hero" />
            <ProductImage
              imageSrc={imageSrc}
              style={{
                bottom: productBottom,
                height: isTransparentProduct ? (isStory ? "84%" : "88%") : (isStory ? "74%" : "78%"),
                maxWidth: "92%",
                objectPosition: "center bottom",
                opacity: product,
                position: "absolute",
                scale: interpolate(product, [0, 1], [0.9, 1]) * breathScale,
                translate: `0 ${interpolate(product, [0, 1], [40, 0]) + floatY}px`,
                zIndex: 5,
              }}
            />
          </div>
        </div>
      </div>
      <BrandFooter cta={cta} footerStyle={footerStyle === "minimal" ? "minimal" : "brand-full"} locationLine={locationLine} story={isStory} opacity={footer} />
    </AbsoluteFill>
  );
};

const OfferOrbit: React.FC<VideoProps & { animated?: boolean }> = ({ eyebrow, headline, supportingText, offerLabel, cta, imageSrc, imageBackground, productShape = "unknown", locationLine, footerStyle = "brand-full", animated = false }) => {
  const frame = useCurrentFrame();
  const { height } = useVideoConfig();
  const isStory = height > 1500;
  const intro = useSpringEntrance(animated, 0, { damping: 17, stiffness: 86, mass: 0.8 });
  const headlineSpring = useSpringEntrance(animated, 9, { damping: 15, stiffness: 82, mass: 0.8 });
  const offerSpring = useSpringEntrance(animated, 19, { damping: 16, stiffness: 88, mass: 0.8 });
  const product = useSpringEntrance(animated, 29, { damping: 14, stiffness: 76, mass: 0.9 });
  const footer = useSpringEntrance(animated, 64, { damping: 18, stiffness: 70, mass: 0.8 });
  const isTransparentProduct = imageBackground === "transparent";
  const bottomPadding = isStory ? 310 : 240;
  const padding = isStory ? 76 : 62;
  const stageWidth = isStory ? 700 : 520;
  const podiumWidth = productShape === "wide" ? (isStory ? 660 : 500) : (isStory ? 500 : 390);
  const productHeight = productShape === "wide" ? (isStory ? "58%" : "64%") : productShape === "tall" ? (isStory ? "88%" : "90%") : (isStory ? "78%" : "84%");
  const floatY = animated ? Math.sin(frame * 0.045) * 7 : 0;
  const breathScale = animated ? 1 + Math.sin(frame * 0.035) * 0.012 : 1;
  const orbitRotation = animated ? frame * 0.12 : 0;
  const orbitPulse = animated ? 1 + Math.sin(frame * 0.04) * 0.018 : 1;

  return (
    <AbsoluteFill style={{ backgroundColor: colors.cream, color: colors.petrol, fontFamily: brandFontFamily, overflow: "hidden" }}>
      <div
        aria-hidden="true"
        style={{
          background: `linear-gradient(138deg, ${colors.petrol} 0%, ${colors.charcoal} 52%, ${colors.aqua} 100%)`,
          borderRadius: "50%",
          height: isStory ? 970 : 850,
          position: "absolute",
          right: isStory ? -300 : -270,
          scale: orbitPulse,
          top: isStory ? 610 : 205,
          width: isStory ? 970 : 850,
          zIndex: 1,
        }}
      />
      <div
        aria-hidden="true"
        style={{
          border: `${isStory ? 12 : 9}px solid ${colors.lime}`,
          borderRadius: "50%",
          height: isStory ? 790 : 680,
          position: "absolute",
          right: isStory ? -130 : -100,
          rotate: `${orbitRotation}deg`,
          top: isStory ? 690 : 280,
          width: isStory ? 790 : 680,
          zIndex: 2,
        }}
      >
        <div style={{ backgroundColor: colors.lime, borderRadius: "50%", height: isStory ? 34 : 26, left: "9%", position: "absolute", top: "7%", width: isStory ? 34 : 26 }} />
      </div>

      <div style={{ boxSizing: "border-box", display: "flex", flexDirection: "column", height: "100%", padding: `${padding}px ${padding}px ${bottomPadding}px`, position: "relative", zIndex: 4 }}>
        <div style={{ alignItems: "center", display: "flex", flexShrink: 0, justifyContent: "space-between", opacity: intro }}>
          <div style={{ display: "flex", flexDirection: "column", gap: isStory ? 14 : 10 }}>
            <div style={{ fontSize: isStory ? 28 : 22, fontWeight: 800, letterSpacing: isStory ? 3.2 : 2.5, textTransform: "uppercase" }}>{eyebrow}</div>
            <div style={{ backgroundColor: colors.lime, height: isStory ? 5 : 4, width: isStory ? 180 : 145 }} />
          </div>
          <LogoMark size={isStory ? 64 : 50} />
        </div>

        <div style={{ display: "grid", flex: 1, gridTemplateColumns: isStory ? "1fr" : "44% 56%", gridTemplateRows: isStory ? "41% 59%" : "1fr", minHeight: 0, paddingTop: isStory ? 42 : 34 }}>
          <div style={{ alignSelf: "start", display: "flex", flexDirection: "column", gap: isStory ? 22 : 16, maxWidth: isStory ? "78%" : "100%", opacity: headlineSpring, paddingTop: isStory ? 12 : 52, position: "relative", translate: `${interpolate(headlineSpring, [0, 1], [-34, 0], { extrapolateRight: "clamp" })}px 0`, zIndex: 7 }}>
            <div data-qa="headline" style={{ fontSize: isStory ? 102 : 84, fontWeight: 800, letterSpacing: isStory ? -5 : -3.8, lineHeight: 0.88, whiteSpace: "pre-line" }}>{headline}</div>
            <div style={{ fontSize: isStory ? 31 : 24, fontWeight: 600, lineHeight: 1.2, maxWidth: isStory ? "88%" : "92%" }}>{supportingText}</div>
            <div style={{ opacity: offerSpring, translate: `${interpolate(offerSpring, [0, 1], [-22, 0], { extrapolateRight: "clamp" })}px 0` }}>
              <OfferPill label={offerLabel} size={isStory ? 42 : 32} />
            </div>
          </div>

          <div data-qa="product-stage" style={{ alignItems: "flex-end", alignSelf: "stretch", display: "flex", justifyContent: "center", justifySelf: isStory ? "end" : "stretch", minHeight: 0, position: "relative", width: isStory ? stageWidth : "100%", zIndex: 6 }}>
            <CleanPodium story={isStory} width={podiumWidth} bottom={isStory ? -165 : -130} treatment="hero" />
            <ProductImage
              imageSrc={imageSrc}
              style={{
                bottom: isStory ? 140 : 94,
                height: isTransparentProduct ? productHeight : (isStory ? "70%" : "74%"),
                maxWidth: "92%",
                objectPosition: "center bottom",
                opacity: product,
                position: "absolute",
                scale: interpolate(product, [0, 1], [0.9, 1], { extrapolateRight: "clamp" }) * breathScale,
                translate: `${interpolate(product, [0, 1], [42, 0], { extrapolateRight: "clamp" })}px ${floatY}px`,
                zIndex: 7,
              }}
            />
          </div>
        </div>
      </div>

      <BrandFooter cta={cta} footerStyle={footerStyle === "minimal" ? "minimal" : "brand-full"} locationLine={locationLine} story={isStory} opacity={footer} />
    </AbsoluteFill>
  );
};

const TypeStage: React.FC<VideoProps & { animated?: boolean }> = ({ eyebrow, headline, supportingText, cta, imageSrc, imageBackground, productShape, locationLine, footerStyle = "brand-full", animated = false }) => {
  const frame = useCurrentFrame();
  const { height } = useVideoConfig();
  const isStory = height > 1500;
  const intro = useSpringEntrance(animated, 0);
  const headlineSpring = useSpringEntrance(animated, 6);
  const product = useSpringEntrance(animated, 20);
  const footer = useSpringEntrance(animated, 58);
  const isTransparentProduct = imageBackground === "transparent";
  const isTallProduct = productShape === "tall";
  const bottomPadding = isStory ? 310 : 240;
  const podiumBottom = isStory ? -160 : -130;
  const productBottom = isStory ? 145 : 94;

  const floatY = animated ? Math.sin(frame * 0.05) * 6 : 0;
  const breathScale = animated ? 1 + Math.sin(frame * 0.04) * 0.015 : 1;

  return (
    <AbsoluteFill style={{ backgroundColor: colors.cream, color: colors.petrol, fontFamily: brandFontFamily, overflow: "hidden" }}>
      <VerticalSpotlight story={isStory} variant="type" />
      <div style={{ boxSizing: "border-box", height: "100%", padding: `${isStory ? 88 : 60}px ${isStory ? 76 : 68}px ${bottomPadding}px`, position: "relative", zIndex: 3 }}>
        <div style={{ alignItems: "center", display: "flex", justifyContent: "space-between", opacity: intro }}>
          <div style={{ display: "flex", flexDirection: "column", gap: isStory ? 12 : 8 }}>
            <div style={{ fontSize: isStory ? 30 : 23, fontWeight: 800, letterSpacing: isStory ? 3.4 : 2.6, textTransform: "uppercase" }}>{eyebrow}</div>
            <div style={{ backgroundColor: colors.lime, height: isStory ? 5 : 4, width: isStory ? 220 : 170 }} />
          </div>
          <LogoMark size={isStory ? 68 : 54} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: isStory ? 20 : 14, left: isStory ? 76 : 68, maxWidth: isStory ? "54%" : "52%", opacity: headlineSpring, position: "absolute", top: isStory ? 240 : 180, translate: `0 ${interpolate(headlineSpring, [0, 1], [30, 0])}px`, zIndex: 7 }}>
          <div data-qa="headline" style={{ fontSize: isStory ? 110 : 90, fontWeight: 800, letterSpacing: isStory ? -5 : -4, lineHeight: 0.84, whiteSpace: "pre-line" }}>{headline}</div>
          <div style={{ fontSize: isStory ? 32 : 24, fontWeight: 600, lineHeight: 1.2, maxWidth: "90%" }}>{supportingText}</div>
        </div>
        <div data-qa="product-stage" style={{ alignItems: "flex-end", bottom: bottomPadding, display: "flex", height: isStory ? 850 : 600, justifyContent: "center", position: "absolute", right: isStory ? 10 : 10, width: isStory ? "46%" : "46%", zIndex: 6 }}>
          <CleanPodium story={isStory} width={isStory ? 480 : 400} bottom={podiumBottom} treatment="hero" />
          <ProductImage imageSrc={imageSrc} style={{ bottom: productBottom, height: isTransparentProduct ? (isTallProduct ? (isStory ? "86%" : "88%") : (isStory ? "80%" : "84%")) : (isStory ? "74%" : "78%"), maxWidth: "92%", objectPosition: "center bottom", opacity: product, position: "absolute", scale: interpolate(product, [0, 1], [0.9, 1]) * breathScale, translate: `0 ${interpolate(product, [0, 1], [50, 0], { extrapolateRight: "clamp" }) + floatY}px`, zIndex: 5 }} />
        </div>
      </div>
      <BrandFooter cta={cta} footerStyle={footerStyle === "minimal" ? "minimal" : "brand-full"} locationLine={locationLine} story={isStory} opacity={footer} />
    </AbsoluteFill>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   VARIANT ROUTER + VIDEO COMPOSITIONS
   ═══════════════════════════════════════════════════════════════════ */

const Variant: React.FC<VideoProps & { animated?: boolean }> = (props) => {
  ensureBrandFont();
  switch (props.designVariant ?? "product-atelier") {
    case "editorial-split": return <EditorialSplit {...props} />;
    case "minimal-offer": return <MinimalOffer {...props} />;
    case "product-card": return <ProductCard {...props} />;
    case "premium-product-stage": return <PremiumProductStage {...props} />;
    case "offer-orbit": return <OfferOrbit {...props} />;
    case "type-stage": return <TypeStage {...props} />;
    case "gallery-shelf": return <GalleryShelf {...props} />;
    default: return <ProductAtelier {...props} />;
  }
};

const PromoHook: React.FC<VideoProps & { durationInFrames: number }> = ({ durationInFrames, eyebrow, headline, offerLabel, locationLine, motionTreatment = "staged-reveal" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const hookDelay = motionTreatment === "detail-cutaway" ? 8 : 2;
  const hookSpring = frame >= hookDelay + 45 ? 1 : spring({ frame: Math.max(0, frame - hookDelay), fps, config: { damping: 14, stiffness: motionTreatment === "offer-build" ? 72 : 85 } });
  const opacity = interpolate(frame, [0, fps * 0.4, Math.max(fps * 0.4, durationInFrames - 18), durationInFrames], [0, 1, 1, 0], { easing: easeOut, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const lead = motionTreatment === "offer-build" ? offerLabel : motionTreatment === "location-close" ? (locationLine ?? "AU Šeki-Tilia apoteke") : eyebrow;
  const horizontalEntrance = motionTreatment === "editorial-pan" || motionTreatment === "detail-cutaway";
  const titleTranslate = interpolate(hookSpring, [0, 1], [50, 0]);
  const lineProgress = spring({ frame: Math.max(0, frame - 10), fps, config: { damping: 16, stiffness: 90 } });
  const isLocationClose = motionTreatment === "location-close";
  const isOfferBuild = motionTreatment === "offer-build";
  const isDetailCutaway = motionTreatment === "detail-cutaway";
  const isEditorialPan = motionTreatment === "editorial-pan";

  // Tekst ostaje stabilan nakon ulaska; samo dekorativna linija nastavlja mikro-pokret.
  const barPulse = 1 + Math.sin(frame * 0.08) * 0.03;
  const cutawayTravel = interpolate(frame, [0, 75], [0, -38], { extrapolateRight: "clamp" });
  const editorialTravel = interpolate(frame, [0, 75], [34, -22], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill data-qa="reels-hook" style={{ backgroundColor: isLocationClose ? colors.cream : colors.petrol, color: isLocationClose ? colors.petrol : colors.cream, fontFamily: brandFontFamily, opacity, overflow: "hidden", padding: "132px 84px" }}>
      {isOfferBuild && <div aria-hidden="true" style={{ backgroundColor: colors.lime, bottom: 0, height: "38%", left: 0, position: "absolute", right: 0 }} />}
      {isDetailCutaway && <div aria-hidden="true" style={{ backgroundColor: colors.stageTaupe, height: "100%", position: "absolute", right: cutawayTravel - 30, top: 0, width: 330 }} />}
      {isEditorialPan && <div aria-hidden="true" style={{ border: `9px solid ${colors.lime}`, borderRadius: "50%", height: 760, position: "absolute", right: editorialTravel - 260, top: 370, width: 760 }} />}
      {isLocationClose && <div aria-hidden="true" style={{ background: `linear-gradient(145deg, ${colors.petrol} 0%, ${colors.aqua} 100%)`, borderRadius: "50%", height: 760, position: "absolute", right: -520, top: 420, width: 760 }} />}
      <div style={{ alignItems: "center", display: "flex", justifyContent: "space-between", position: "relative", zIndex: 2 }}>
        <div style={{ color: isLocationClose ? colors.petrol : colors.lime, fontSize: isOfferBuild ? 50 : 34, fontWeight: 800, letterSpacing: isOfferBuild ? -1 : 3.4, maxWidth: 760 }}>{lead}</div>
        <LogoMark background={isLocationClose ? "light" : "dark"} size={70} />
      </div>
      <div style={{ bottom: isOfferBuild ? 790 : isLocationClose ? 560 : 480, fontSize: isOfferBuild ? 106 : isDetailCutaway ? 112 : 126, fontWeight: 800, left: 84, letterSpacing: -7, lineHeight: 0.88, maxWidth: isDetailCutaway ? 680 : 850, position: "absolute", translate: horizontalEntrance ? `${titleTranslate}px 0` : `0 ${titleTranslate}px`, whiteSpace: "pre-line", zIndex: 2 }}>{headline}</div>
      <div style={{ backgroundColor: isLocationClose ? colors.petrol : colors.lime, bottom: isOfferBuild ? 735 : isLocationClose ? 472 : 398, height: 8, left: 84, position: "absolute", scale: `${barPulse} 1`, transformOrigin: "left center", width: interpolate(lineProgress, [0, 1], [0, isEditorialPan ? 520 : 360]), zIndex: 2 }} />
    </AbsoluteFill>
  );
};

const Closing: React.FC<Pick<VideoProps, "cta" | "imageSrc" | "locationLine" | "motionTreatment" | "offerLabel" | "productShape">> = ({ offerLabel, cta, imageSrc, locationLine, motionTreatment = "staged-reveal" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const opacity = interpolate(frame, [0, fps * 0.35], [0, 1], { easing: easeOut, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const isLocationClose = motionTreatment === "location-close";
  const isOfferBuild = motionTreatment === "offer-build";
  const logoSpring = spring({ frame: Math.max(0, frame - (isLocationClose ? 10 : 2)), fps, config: { damping: 14, stiffness: 85 } });
  const productSpring = spring({ frame: Math.max(0, frame - (isOfferBuild ? 14 : 6)), fps, config: { damping: 14, stiffness: 80, mass: 0.8 } });
  const textDelay = isLocationClose ? 2 : 12;
  const textSpring = frame >= textDelay + 45 ? 1 : spring({ frame: Math.max(0, frame - textDelay), fps, config: { damping: 16, stiffness: 90 } });

  // Continuous float and breath in Closing scene
  const floatY = Math.sin(frame * 0.05) * 6;
  const breathScale = 1 + Math.sin(frame * 0.04) * 0.015;
  const isDuplicateCta = cta.trim().toLowerCase() === offerLabel.trim().toLowerCase();

  return (
    <AbsoluteFill data-qa="reels-closing" style={{ backgroundColor: colors.petrol, color: colors.cream, fontFamily: brandFontFamily, opacity, overflow: "hidden", padding: "120px 88px" }}>
      {imageSrc && (
        <div style={{ bottom: 100, height: 820, position: "absolute", right: 40, width: 440, zIndex: 2 }}>
          <ProductImage
            imageSrc={imageSrc}
            style={{
              bottom: 0,
              height: "100%",
              maxWidth: "100%",
              objectPosition: "center bottom",
              position: "absolute",
              scale: interpolate(productSpring, [0, 1], [0.92, 1]) * breathScale,
              translate: `${interpolate(productSpring, [0, 1], [40, 0])}px ${floatY}px`,
              zIndex: 5,
            }}
          />
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 34, maxWidth: 720, position: "relative", translate: `${interpolate(textSpring, [0, 1], [motionTreatment === "editorial-pan" ? -50 : 0, 0])}px ${interpolate(textSpring, [0, 1], [isLocationClose ? -20 : 30, 0])}px`, zIndex: 3 }}>
        <div style={{ opacity: logoSpring, translate: `0 ${interpolate(logoSpring, [0, 1], [20, 0])}px` }}>
          <LogoMark background="dark" size={110} />
        </div>
        <div style={{ fontSize: 94, fontWeight: 800, letterSpacing: -4 }}>AU Šeki-Tilia</div>
        <div style={{ color: colors.lime, fontSize: 52, fontWeight: 800 }}>{offerLabel}</div>
        {!isDuplicateCta && <div style={{ fontSize: 48, fontWeight: 700, lineHeight: 1.14 }}>{cta}</div>}
        <LocationMarker label={locationLine} size={34} />
      </div>
    </AbsoluteFill>
  );
};

const HeroScene: React.FC<VideoProps & { durationInFrames: number }> = ({ durationInFrames, ...props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const exitFrames = 18;
  const exitStart = Math.max(0, durationInFrames - exitFrames);
  const opacity = interpolate(
    frame,
    [0, fps * 0.3, exitStart, durationInFrames],
    [0, 1, 1, 0],
    { easing: easeOut, extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  return (
    <div style={{ height: "100%", opacity, position: "absolute", width: "100%" }}>
      <Variant {...props} animated />
    </div>
  );
};

const motionPlans: Record<MotionTreatment, { hookDuration: number; heroFrom: number; heroDuration: number; closingFrom: number; closingDuration: number }> = {
  "staged-reveal": { hookDuration: 60, heroFrom: 48, heroDuration: 222, closingFrom: 270, closingDuration: 90 },
  "offer-build": { hookDuration: 72, heroFrom: 58, heroDuration: 206, closingFrom: 264, closingDuration: 96 },
  "detail-cutaway": { hookDuration: 54, heroFrom: 42, heroDuration: 210, closingFrom: 252, closingDuration: 108 },
  "editorial-pan": { hookDuration: 68, heroFrom: 54, heroDuration: 224, closingFrom: 278, closingDuration: 82 },
  "location-close": { hookDuration: 48, heroFrom: 40, heroDuration: 194, closingFrom: 234, closingDuration: 126 },
};

export const SekiTiliaPromo: React.FC<VideoProps> = (props) => {
  const { fps } = useVideoConfig();
  const plan = motionPlans[props.motionTreatment ?? "staged-reveal"];
  const rawTrack = props.audioTrack?.trim() || "paper-sun-parade.mp3";
  const audioSrc = rawTrack.startsWith("mp3/") ? rawTrack : `mp3/${rawTrack}`;
  const volume = props.audioVolume ?? 0.9;

  return (
    <AbsoluteFill style={paletteStyle(props.colorScheme)}>
      <RemotionAudio src={staticFile(audioSrc)} trimBefore={30 * fps} volume={volume} />
      <Sequence durationInFrames={plan.hookDuration} premountFor={30}><PromoHook {...props} durationInFrames={plan.hookDuration} /></Sequence>
      <Sequence from={plan.heroFrom} durationInFrames={plan.heroDuration} premountFor={30}><HeroScene {...props} durationInFrames={plan.heroDuration} /></Sequence>
      <Sequence from={plan.closingFrom} durationInFrames={plan.closingDuration} premountFor={30}><Closing {...props} /></Sequence>
    </AbsoluteFill>
  );
};
export const SekiTiliaPost: React.FC<VideoProps> = (props) => <AbsoluteFill style={paletteStyle(props.colorScheme)}><Variant {...props} /></AbsoluteFill>;

export const MyComposition: React.FC = () => (
  <>
    <Composition id="SekiTiliaPromo" component={SekiTiliaPromo} durationInFrames={360} fps={30} width={1080} height={1920} defaultProps={{ eyebrow: "Novitet u ponudi", headline: "Pažljivo izabrano za vašu rutinu.", supportingText: "Uskoro stižu konkretne informacije i fotografije proizvoda.", offerLabel: "Saznajte više u apoteci", offerKind: "none", cta: "Posetite najbližu AU Šeki-Tilia apoteku.", locationLine: "AU Šeki-Tilia", productShape: "compact", designVariant: "product-atelier", motionTreatment: "staged-reveal", footerStyle: "brand-full", colorScheme: "calm-studio" }} />
    <Still id="SekiTiliaFeed" component={SekiTiliaPost} width={1080} height={1350} defaultProps={{ eyebrow: "Novitet u ponudi", headline: "Pažljivo izabrano za vašu rutinu.", supportingText: "Uskoro stižu konkretne informacije i fotografije proizvoda.", offerLabel: "Saznajte više u apoteci", offerKind: "none", cta: "Posetite AU Šeki-Tilia.", locationLine: "AU Šeki-Tilia", productShape: "compact", designVariant: "product-atelier", footerStyle: "brand-full", colorScheme: "calm-studio" }} />
    <Still id="SekiTiliaStory" component={SekiTiliaPost} width={1080} height={1920} defaultProps={{ eyebrow: "Novitet u ponudi", headline: "Pažljivo izabrano za vašu rutinu.", supportingText: "Uskoro stižu konkretne informacije i fotografije proizvoda.", offerLabel: "Saznajte više u apoteci", offerKind: "none", cta: "Posetite AU Šeki-Tilia.", locationLine: "AU Šeki-Tilia", productShape: "compact", designVariant: "product-atelier", footerStyle: "brand-full", colorScheme: "calm-studio" }} />
  </>
);
