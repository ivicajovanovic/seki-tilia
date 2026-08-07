import React from "react";
import { loadFont } from "@remotion/fonts";
import { Activity, CalendarDays, CheckCircle2, HeartHandshake, Info, MapPin, ShieldCheck, Sparkles } from "lucide-react";
import { Audio as RemotionAudio } from "@remotion/media";
import { AbsoluteFill, cancelRender, Composition, continueRender, delayRender, Easing, Img, interpolate, Sequence, spring, staticFile, Still, useCurrentFrame, useVideoConfig } from "remotion";
import colorPalette from "../../brand/color-palette.json";
import {ReelV2, ReelV2PropsSchema, reelV2DefaultProps} from "./ReelV2";

type DesignVariant = "product-atelier" | "editorial-split" | "minimal-offer" | "product-card" | "premium-product-stage" | "offer-orbit" | "type-stage" | "gallery-shelf";
type MotionTreatment = "staged-reveal" | "offer-build" | "detail-cutaway" | "editorial-pan" | "location-close";
type ProductShape = "wide" | "compact" | "tall" | "unknown";
type OfferKind = "deadline" | "price" | "discount" | "bundle" | "gift" | "none";
type FooterStyle = "brand-full" | "cta-only" | "minimal";
type PromoLayout = "auto" | "feed-left-product-right" | "story-top-product-center" | "product-dominant-sticker";

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
  /** Explicit promo stack. Legacy fields remain as fallbacks for older packages. */
  primaryMessage?: string;
  secondaryMessage?: string;
  supportMessage?: string;
  /** One or two label-derived product facts, never an inferred health benefit. */
  productDetailMessage?: string;
  /** Confirmed promotion deadline, rendered separately from product information. */
  deadlineMessage?: string;
  retailMessage?: string;
  brandSignature?: string;
  promoLayout?: PromoLayout;
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

const promoLightBackground = `linear-gradient(180deg, color-mix(in srgb, ${colors.cream} 80%, black) 0%, ${colors.cream} 52%, color-mix(in srgb, ${colors.cream} 75%, white) 100%)`;
const promoDarkBackground = `linear-gradient(180deg, color-mix(in srgb, ${colors.petrol} 80%, black) 0%, ${colors.petrol} 52%, color-mix(in srgb, ${colors.petrol} 75%, white) 100%)`;
const descenderSafeText: React.CSSProperties = { lineHeight: 1.02, paddingBottom: "0.12em" };

/** Shared, measurable rules for promotional Feed and Story layouts. */
const promoTokens = {
  spacing: { xs: 8, sm: 12, md: 16, lg: 24, xl: 32, xxl: 40, page: 56, section: 72 },
  feed: { textAxis: 52, textWidth: 480, productAxis: "74%", logoAxis: 1028, top: 312, heroBottom: 196, footer: 196 },
  story: { textAxis: 72, textWidth: 820, centeredTextAxis: 130, productAxis: "50%", logoAxis: 1008, safeTop: 112, safeBottom: 220, heroTop: 500, heroBottom: 1720, footer: 200 },
  copy: { eyebrow: 28, badge: 14, descriptor: 65, detail: 72, deadline: 32, footerPrimary: 40, footerSecondary: 55 },
} as const;

/** Explicit Reels choreography. Each beat has its own reading interval, never a simultaneous reveal. */
const reelsTiming = {
  hook: { identity: 8, offer: 34, product: 60, detail: 84, deadline: 104 },
  hero: { eyebrow: 0, offer: 18, headline: 36, detail: 54, deadline: 72, product: 90, footer: 112 },
  closing: { logo: 0, brand: 18, product: 38, title: 58, offer: 80, cta: 104 },
} as const;

const cut = (value: string | undefined, max: number) => (value ?? "").trim().slice(0, max);
const promoStack = (props: VideoProps) => ({
  // In a promotion the confirmed offer is always the primary message.
  primary: cut(props.primaryMessage || props.offerLabel, promoTokens.copy.badge),
  secondary: props.secondaryMessage?.trim() || props.headline,
  support: cut(props.supportMessage || props.supportingText, promoTokens.copy.descriptor),
  detail: cut(props.productDetailMessage || "", promoTokens.copy.detail),
  deadline: cut(props.deadlineMessage || "", promoTokens.copy.deadline),
  retail: cut(props.retailMessage || props.locationLine || props.cta, promoTokens.copy.footerSecondary),
  brand: props.brandSignature?.trim() || "AU Šeki-Tilia",
});

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
   PROMO MASTER TEMPLATES — separate 4:5 and 9:16 compositions
   ═══════════════════════════════════════════════════════════════════ */

const PromoBadge: React.FC<{ label: string; story: boolean }> = ({ label, story }) => (
  <div data-qa="promo-primary" style={{ alignItems: "center", backgroundColor: colors.lime, borderRadius: 999, boxSizing: "border-box", color: colors.petrol, display: "flex", fontSize: story ? 64 : 56, fontWeight: 800, height: story ? 104 : 92, justifyContent: "center", letterSpacing: -2.2, padding: "0 32px", textAlign: "center", width: story ? 520 : 430, whiteSpace: "nowrap" }}>
    {label}
  </div>
);

const PromoProductDetail: React.FC<{ detail: string; story: boolean }> = ({ detail, story }) => {
  if (!detail) return null;
  return (
    <div data-qa="promo-product-detail" style={{ alignItems: "flex-start", display: "flex", gap: story ? 14 : 11, maxWidth: story ? 720 : 440 }}>
      <Info color={colors.petrol} size={story ? 32 : 27} strokeWidth={2.4} />
      <div style={{ fontSize: story ? 31 : 27, fontWeight: 700, lineHeight: 1.12 }}>{detail}</div>
    </div>
  );
};

const PromoDeadline: React.FC<{ deadline: string; story: boolean }> = ({ deadline, story }) => {
  if (!deadline) return null;
  return (
    <div data-qa="promo-deadline" style={{ alignItems: "center", backgroundColor: colors.cream, border: `2px solid ${colors.petrol}`, borderRadius: 999, boxSizing: "border-box", display: "flex", gap: story ? 14 : 12, padding: story ? "14px 22px" : "12px 18px", width: "fit-content" }}>
      <CalendarDays color={colors.petrol} size={story ? 34 : 29} strokeWidth={2.25} />
      <div style={{ fontSize: story ? 32 : 28, fontWeight: 800, lineHeight: 1.08 }}>{deadline}</div>
    </div>
  );
};

const PromoSupportShape: React.FC<{ story: boolean }> = ({ story }) => (
  <div aria-hidden="true" data-qa="promo-support-shape" style={{ bottom: story ? 80 : 76, height: story ? 620 : 590, left: "50%", opacity: 0.72, position: "absolute", translate: "-50% 0", width: story ? 620 : 590, zIndex: 1 }}>
    <div style={{ background: `radial-gradient(circle at 40% 32%, ${colors.cream} 0%, ${colors.beige} 66%, ${colors.stageTaupe} 100%)`, borderRadius: "50%", height: "100%", width: "100%" }} />
    <div style={{ backgroundColor: colors.lime, height: story ? 7 : 6, left: "13%", opacity: 0.78, position: "absolute", top: "15%", width: story ? 180 : 140 }} />
  </div>
);

const PromoProductHero: React.FC<{ imageSrc?: string; imageBackground?: VideoProps["imageBackground"]; productShape?: ProductShape; story: boolean; animated?: boolean; dominant?: boolean; entranceDelay?: number }> = ({ imageSrc, imageBackground, productShape, story, animated = false, dominant = false, entranceDelay = 22 }) => {
  const frame = useCurrentFrame();
  const product = useSpringEntrance(animated, entranceDelay, { damping: 16, stiffness: 60, mass: 0.9 });
  const tall = productShape === "tall";
  const floatY = animated ? Math.sin(frame * 0.05) * 5 : 0;
  const breathScale = animated ? 1 + Math.sin(frame * 0.04) * 0.012 : 1;
  return (
    <div data-qa="product-stage" style={{ bottom: 0, insetInline: 0, position: "absolute", top: 0, zIndex: 4 }}>
      <div style={{ bottom: story ? 174 : 0, height: story ? (dominant ? 900 : 800) : (dominant ? 860 : 800), left: story ? promoTokens.story.productAxis : promoTokens.feed.productAxis, position: "absolute", translate: "-50% 0", width: story ? (dominant ? 820 : 780) : (dominant ? 720 : 640) }}>
        <PromoSupportShape story={story} />
        <CleanPodium story={story} width={story ? 680 : 540} bottom={story ? -330 : -96} treatment="hero" />
        <ProductImage imageSrc={imageSrc} style={{ bottom: story ? -50 : 84, height: imageBackground === "transparent" ? (tall ? (dominant ? "98%" : "91%") : (dominant ? "86%" : "82%")) : (dominant ? "80%" : "75%"), left: "50%", maxWidth: "90%", objectPosition: "center bottom", opacity: product, position: "absolute", scale: interpolate(product, [0, 1], [0.92, 1]) * breathScale, translate: `-50% ${interpolate(product, [0, 1], [44, 0], { extrapolateRight: "clamp" }) + floatY}px`, zIndex: 5 }} />
      </div>
    </div>
  );
};

const PromoFooter: React.FC<{ cta: string; retail: string; brand: string; story: boolean; opacity?: number }> = ({ cta, retail, brand, story, opacity = 1 }) => (
  <div data-qa="cta-footer" style={{ alignItems: "center", backgroundColor: colors.petrol, borderTop: `6px solid ${colors.lime}`, bottom: 0, boxSizing: "border-box", color: colors.cream, display: "grid", gridTemplateColumns: story ? "76px minmax(0, 1fr) 334px" : "64px minmax(0, 1fr) 290px", height: story ? promoTokens.story.footer : promoTokens.feed.footer, columnGap: story ? 20 : 18, left: 0, opacity, padding: story ? "26px 72px" : "24px 52px", position: "absolute", right: 0, zIndex: 20 }}>
    <MapPin color={colors.lime} size={story ? 44 : 38} strokeWidth={2.1} />
    <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0 }}>
      <div style={{ fontSize: story ? 38 : 32, fontWeight: 800, lineHeight: 1.08 }}>{cut(cta, promoTokens.copy.footerPrimary)}</div>
      <div style={{ fontSize: story ? 24 : 20, fontWeight: 600, lineHeight: 1.15, opacity: 0.82 }}>{retail}</div>
    </div>
    <div style={{ alignItems: "center", display: "flex", gap: 8, justifyContent: "flex-end", textAlign: "right" }}>
      <LogoMark background="dark" size={story ? 77 : 65} />
      <div style={{ fontSize: story ? 36 : 31, fontWeight: 800, lineHeight: 1.05 }}>{brand}</div>
    </div>
  </div>
);

const PromoFeed45: React.FC<VideoProps & { animated?: boolean }> = (props) => {
  const { primary, secondary, support, detail, deadline, retail, brand } = promoStack(props);
  const intro = useSpringEntrance(Boolean(props.animated), 0);
  const headline = useSpringEntrance(Boolean(props.animated), 8);
  return (
    <AbsoluteFill data-qa="promo-feed-template" style={{ background: promoLightBackground, color: colors.petrol, fontFamily: brandFontFamily, overflow: "hidden" }}>
      <div style={{ boxSizing: "border-box", height: promoTokens.feed.top, left: promoTokens.feed.textAxis, position: "absolute", top: 0, width: promoTokens.feed.textWidth, zIndex: 6 }}>
        <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: 2.4, marginTop: 48, opacity: intro, textTransform: "uppercase", whiteSpace: "nowrap" }}>{cut(props.eyebrow, promoTokens.copy.eyebrow)}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: promoTokens.spacing.lg, marginTop: 34, opacity: headline }}>
          <PromoBadge label={primary} story={false} />
          <div data-qa="headline" style={{ fontSize: 74, fontWeight: 800, letterSpacing: -3.8, lineHeight: 0.92, maxHeight: 220, overflow: "hidden", whiteSpace: "pre-line" }}>{secondary}</div>
          <PromoProductDetail detail={detail || support} story={false} />
          <PromoDeadline deadline={deadline} story={false} />
        </div>
      </div>
      <div style={{ bottom: promoTokens.feed.heroBottom, left: 0, position: "absolute", right: 0, top: promoTokens.feed.top, zIndex: 3 }}><PromoProductHero {...props} story={false} /></div>
      <PromoFooter brand={brand} cta={props.cta} retail={retail} story={false} />
    </AbsoluteFill>
  );
};

const PromoStory916: React.FC<VideoProps & { animated?: boolean }> = (props) => {
  const { primary, secondary, support, detail, deadline, retail, brand } = promoStack(props);
  const animated = Boolean(props.animated);
  const intro = useSpringEntrance(animated, reelsTiming.hero.eyebrow, { damping: 18, stiffness: 58, mass: 0.9 });
  const offer = useSpringEntrance(animated, reelsTiming.hero.offer, { damping: 18, stiffness: 56, mass: 0.9 });
  const headline = useSpringEntrance(animated, reelsTiming.hero.headline, { damping: 18, stiffness: 54, mass: 0.9 });
  const productDetail = useSpringEntrance(animated, reelsTiming.hero.detail, { damping: 18, stiffness: 52, mass: 0.9 });
  const deadlineEntrance = useSpringEntrance(animated, reelsTiming.hero.deadline, { damping: 18, stiffness: 50, mass: 0.9 });
  const footer = useSpringEntrance(animated, reelsTiming.hero.footer, { damping: 20, stiffness: 48, mass: 0.9 });
  return (
    <AbsoluteFill data-qa="promo-story-template" style={{ background: promoLightBackground, color: colors.petrol, fontFamily: brandFontFamily, overflow: "hidden" }}>
      <div style={{ boxSizing: "border-box", left: promoTokens.story.centeredTextAxis, position: "absolute", top: promoTokens.story.safeTop, width: promoTokens.story.textWidth, zIndex: 6 }}>
        <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: 3, opacity: intro, textAlign: "center", textTransform: "uppercase", whiteSpace: "nowrap" }}>{cut(props.eyebrow, promoTokens.copy.eyebrow)}</div>
        <div style={{ alignItems: "center", display: "flex", flexDirection: "column", gap: promoTokens.spacing.xl, marginTop: 38, textAlign: "center" }}>
          <div style={{ opacity: offer, translate: `0 ${interpolate(offer, [0, 1], [34, 0])}px` }}><PromoBadge label={primary} story /></div>
          <div data-qa="headline" style={{ fontSize: 103, fontWeight: 800, letterSpacing: -5, lineHeight: 0.9, maxHeight: 290, maxWidth: "92%", opacity: headline, overflow: "hidden", whiteSpace: "pre-line" }}>{secondary}</div>
          <div style={{ opacity: productDetail, translate: `0 ${interpolate(productDetail, [0, 1], [30, 0])}px` }}><PromoProductDetail detail={detail || support} story /></div>
          <div style={{ opacity: deadlineEntrance, translate: `0 ${interpolate(deadlineEntrance, [0, 1], [26, 0])}px` }}><PromoDeadline deadline={deadline} story /></div>
        </div>
      </div>
      <div style={{ bottom: 1920 - promoTokens.story.heroBottom, left: 0, position: "absolute", right: 0, top: promoTokens.story.heroTop, zIndex: 3 }}><PromoProductHero {...props} animated={animated} entranceDelay={reelsTiming.hero.product} story /></div>
      <PromoFooter brand={brand} cta={props.cta} opacity={footer} retail={retail} story />
    </AbsoluteFill>
  );
};

/** Product-first master: a compact offer sticker supports, never overlaps, the hero. */
const ProductDominantSticker: React.FC<VideoProps & { animated?: boolean }> = (props) => {
  const { height } = useVideoConfig();
  const story = height > 1500;
  const { primary, secondary, support, detail, deadline, retail, brand } = promoStack(props);
  const intro = useSpringEntrance(Boolean(props.animated), 0);
  const text = useSpringEntrance(Boolean(props.animated), 8);
  const stageTop = story ? 620 : 230;
  const stageBottom = story ? 472 : 230;
  return (
    <AbsoluteFill data-qa="product-dominant-sticker-template" style={{ background: promoLightBackground, color: colors.petrol, fontFamily: brandFontFamily, overflow: "hidden" }}>
      <div style={{ left: story ? promoTokens.story.textAxis : promoTokens.feed.textAxis, position: "absolute", top: story ? promoTokens.story.safeTop : 52, width: story ? promoTokens.story.textWidth : promoTokens.feed.textWidth, zIndex: 6 }}>
        <div style={{ fontSize: story ? 24 : 20, fontWeight: 800, letterSpacing: story ? 3 : 2.4, opacity: intro, textTransform: "uppercase", whiteSpace: "nowrap" }}>{cut(props.eyebrow, promoTokens.copy.eyebrow)}</div>
        <div style={{ marginTop: story ? 28 : 24, maxWidth: story ? 560 : 380, opacity: text }}>
          <div data-qa="headline" style={{ fontSize: story ? 70 : 50, fontWeight: 800, letterSpacing: story ? -3.7 : -2.6, lineHeight: 0.9, maxHeight: story ? 130 : 92, overflow: "hidden", whiteSpace: "pre-line" }}>{secondary}</div>
          <div style={{ fontSize: story ? 25 : 21, fontWeight: 600, lineHeight: 1.16, marginTop: 12, maxHeight: story ? 58 : 50, overflow: "hidden" }}>{detail || support}</div>
          <PromoDeadline deadline={deadline} story={story} />
        </div>
      </div>
      <div data-qa="sticker-product-stage" style={{ bottom: stageBottom, left: 0, position: "absolute", right: 0, top: stageTop, zIndex: 3 }}><PromoProductHero {...props} dominant story={story} /></div>
      <div data-qa="promo-sticker" style={{ left: story ? 92 : 446, position: "absolute", top: story ? 586 : 350, zIndex: 8 }}><PromoBadge label={primary} story={story} /></div>
      <PromoFooter brand={brand} cta={props.cta} retail={retail} story={story} />
    </AbsoluteFill>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   VARIANT ROUTER + VIDEO COMPOSITIONS
   ═══════════════════════════════════════════════════════════════════ */

const Variant: React.FC<VideoProps & { animated?: boolean }> = (props) => {
  const { height } = useVideoConfig();
  ensureBrandFont();
  // Promo layouts are explicit masters, never a stretched still.
  if (props.promoLayout === "auto") {
    return height > 1500 ? <PromoStory916 {...props} /> : <PromoFeed45 {...props} />;
  }
  if (props.promoLayout === "feed-left-product-right") return height > 1500 ? <PromoStory916 {...props} /> : <PromoFeed45 {...props} />;
  if (props.promoLayout === "story-top-product-center") return height > 1500 ? <PromoStory916 {...props} /> : <PromoFeed45 {...props} />;
  if (props.promoLayout === "product-dominant-sticker") {
    return <ProductDominantSticker {...props} />;
  }
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

const PromoHook: React.FC<VideoProps & { durationInFrames: number }> = ({ durationInFrames, eyebrow, headline, offerLabel, primaryMessage, secondaryMessage, productDetailMessage, deadlineMessage, imageSrc, locationLine, motionTreatment = "staged-reveal" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const hookDelay = motionTreatment === "detail-cutaway" ? 8 : reelsTiming.hook.identity;
  const hookSpring = spring({ frame: Math.max(0, frame - hookDelay), fps, config: { damping: 18, stiffness: 56, mass: 0.9 } });
  const offerSpring = spring({ frame: Math.max(0, frame - reelsTiming.hook.offer), fps, config: { damping: 18, stiffness: 54, mass: 0.9 } });
  const detailSpring = spring({ frame: Math.max(0, frame - reelsTiming.hook.detail), fps, config: { damping: 18, stiffness: 52, mass: 0.9 } });
  const deadlineSpring = spring({ frame: Math.max(0, frame - reelsTiming.hook.deadline), fps, config: { damping: 18, stiffness: 50, mass: 0.9 } });
  const productSpring = spring({ frame: Math.max(0, frame - reelsTiming.hook.product), fps, config: { damping: 16, stiffness: 54, mass: 0.9 } });
  const opacity = interpolate(frame, [0, fps * 0.4, Math.max(fps * 0.4, durationInFrames - 18), durationInFrames], [0, 1, 1, 0], { easing: easeOut, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const primary = primaryMessage?.trim() || offerLabel;
  const title = secondaryMessage?.trim() || headline;
  const lead = motionTreatment === "offer-build" ? title : motionTreatment === "location-close" ? (locationLine ?? "AU Šeki-Tilia apoteke") : eyebrow;
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
    <AbsoluteFill data-qa="reels-hook" style={{ background: isLocationClose ? promoLightBackground : promoDarkBackground, color: isLocationClose ? colors.petrol : colors.cream, fontFamily: brandFontFamily, opacity, overflow: "hidden", padding: "132px 84px" }}>
      {isDetailCutaway && <div aria-hidden="true" style={{ backgroundColor: colors.stageTaupe, height: "100%", position: "absolute", right: cutawayTravel - 30, top: 0, width: 330 }} />}
      {isEditorialPan && <div aria-hidden="true" style={{ border: `9px solid ${colors.lime}`, borderRadius: "50%", height: 760, position: "absolute", right: editorialTravel - 260, top: 370, width: 760 }} />}
      {isLocationClose && <div aria-hidden="true" style={{ background: `linear-gradient(145deg, ${colors.petrol} 0%, ${colors.aqua} 100%)`, borderRadius: "50%", height: 760, position: "absolute", right: -520, top: 420, width: 760 }} />}
      <div style={{ alignItems: "center", display: "flex", justifyContent: "space-between", position: "relative", zIndex: 2 }}>
        <div style={{ color: isLocationClose ? colors.petrol : colors.lime, fontSize: isOfferBuild ? 58 : 34, fontWeight: 800, letterSpacing: isOfferBuild ? -1.5 : 3.4, lineHeight: 1.05, maxWidth: isOfferBuild ? 620 : 760, opacity: hookSpring, translate: `0 ${interpolate(hookSpring, [0, 1], [30, 0])}px` }}>{lead}</div>
        <div style={{ opacity: hookSpring, translate: `0 ${interpolate(hookSpring, [0, 1], [24, 0])}px` }}><LogoMark background={isLocationClose ? "light" : "dark"} size={70} /></div>
      </div>
      <div style={{ ...descenderSafeText, bottom: isOfferBuild ? undefined : isLocationClose ? 560 : 480, color: isOfferBuild ? colors.lime : undefined, fontSize: isOfferBuild ? 112 : isDetailCutaway ? 112 : 126, fontWeight: 800, left: 84, letterSpacing: -7, maxWidth: isOfferBuild ? 520 : isDetailCutaway ? 680 : 850, opacity: offerSpring, position: "absolute", top: isOfferBuild ? 520 : undefined, translate: horizontalEntrance ? `${titleTranslate}px 0` : `0 ${interpolate(offerSpring, [0, 1], [42, 0])}px`, whiteSpace: "pre-line", zIndex: 2 }}>{isOfferBuild ? primary : title}</div>
      <div style={{ backgroundColor: isLocationClose ? colors.petrol : colors.lime, bottom: isOfferBuild ? undefined : isLocationClose ? 472 : 398, height: 8, left: 84, opacity: offerSpring, position: "absolute", scale: `${barPulse} 1`, top: isOfferBuild ? 690 : undefined, transformOrigin: "left center", width: interpolate(lineProgress, [0, 1], [0, isEditorialPan ? 520 : 360]), zIndex: 2 }} />
      {isOfferBuild && (
        <div data-qa="reels-product-detail" style={{ alignItems: "center", display: "flex", gap: 14, left: 84, maxWidth: 520, opacity: detailSpring, position: "absolute", top: 750, translate: `0 ${interpolate(detailSpring, [0, 1], [28, 0])}px`, zIndex: 2 }}>
          <Info color={colors.cream} size={32} strokeWidth={2.3} />
          <div style={{ fontSize: 34, fontWeight: 700, lineHeight: 1.12 }}>{cut(productDetailMessage, promoTokens.copy.detail)}</div>
        </div>
      )}
      {isOfferBuild && deadlineMessage?.trim() && (
        <div style={{ alignItems: "center", display: "flex", gap: 12, left: 84, opacity: deadlineSpring, position: "absolute", top: 890, translate: `0 ${interpolate(deadlineSpring, [0, 1], [24, 0])}px`, zIndex: 2 }}>
          <CalendarDays color={colors.cream} size={29} strokeWidth={2.25} />
          <div style={{ fontSize: 31, fontWeight: 800 }}>{cut(deadlineMessage, promoTokens.copy.deadline)}</div>
        </div>
      )}
      {isOfferBuild && imageSrc && (
        <div data-qa="reels-hook-product" style={{ bottom: 72, height: 920, opacity: productSpring, position: "absolute", right: 18, translate: `0 ${interpolate(productSpring, [0, 1], [96, 0])}px`, width: 520, zIndex: 2 }}>
          <ProductImage imageSrc={imageSrc} style={{ bottom: 0, height: "100%", maxWidth: "100%", objectPosition: "center bottom", position: "absolute", scale: interpolate(productSpring, [0, 1], [0.9, 1]) }} />
        </div>
      )}
    </AbsoluteFill>
  );
};

const Closing: React.FC<Pick<VideoProps, "cta" | "imageSrc" | "locationLine" | "offerLabel" | "productShape" | "primaryMessage" | "secondaryMessage" | "retailMessage" | "brandSignature">> = ({ offerLabel, primaryMessage, secondaryMessage, retailMessage, brandSignature, cta, imageSrc, locationLine }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const opacity = interpolate(frame, [0, fps * 0.35], [0, 1], { easing: easeOut, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const logoSpring = spring({ frame: Math.max(0, frame - reelsTiming.closing.logo), fps, config: { damping: 18, stiffness: 56, mass: 0.9 } });
  const productSpring = spring({ frame: Math.max(0, frame - reelsTiming.closing.product), fps, config: { damping: 16, stiffness: 54, mass: 0.9 } });
  const brandSpring = spring({ frame: Math.max(0, frame - reelsTiming.closing.brand), fps, config: { damping: 18, stiffness: 54, mass: 0.9 } });
  const titleSpring = spring({ frame: Math.max(0, frame - reelsTiming.closing.title), fps, config: { damping: 18, stiffness: 52, mass: 0.9 } });
  const offerSpring = spring({ frame: Math.max(0, frame - reelsTiming.closing.offer), fps, config: { damping: 18, stiffness: 50, mass: 0.9 } });
  const ctaSpring = spring({ frame: Math.max(0, frame - reelsTiming.closing.cta), fps, config: { damping: 20, stiffness: 46, mass: 0.9 } });

  // Continuous float and breath in Closing scene
  const floatY = Math.sin(frame * 0.05) * 6;
  const breathScale = 1 + Math.sin(frame * 0.04) * 0.015;
  const primary = primaryMessage?.trim() || offerLabel;
  const retail = retailMessage?.trim() || locationLine;
  const brand = brandSignature?.trim() || "AU Šeki-Tilia";
  const isDuplicateCta = cta.trim().toLowerCase() === primary.trim().toLowerCase();

  return (
    <AbsoluteFill data-qa="reels-closing" style={{ background: promoDarkBackground, color: colors.cream, fontFamily: brandFontFamily, opacity, overflow: "hidden", padding: "220px 88px 260px" }}>
      {imageSrc && (
        <div style={{ bottom: 150, height: 1050, position: "absolute", right: 0, width: 570, zIndex: 2 }}>
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
      <div data-qa="promo-closing-stack" style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 430, position: "relative", zIndex: 3 }}>
        <div style={{ opacity: logoSpring, translate: `0 ${interpolate(logoSpring, [0, 1], [20, 0])}px` }}>
          <LogoMark background="dark" size={154} />
        </div>
        <div style={{ fontSize: 68, fontWeight: 800, letterSpacing: -3, lineHeight: 0.96, opacity: brandSpring, translate: `0 ${interpolate(brandSpring, [0, 1], [30, 0])}px` }}>{brand}</div>
        <div style={{ fontSize: 46, fontWeight: 800, lineHeight: 1.06, opacity: titleSpring, translate: `0 ${interpolate(titleSpring, [0, 1], [30, 0])}px` }}>{cut(secondaryMessage, 44)}</div>
        <div data-qa="promo-primary" style={{ ...descenderSafeText, color: colors.lime, fontSize: 94, fontWeight: 800, letterSpacing: -4.8, maxHeight: 156, opacity: offerSpring, overflow: "hidden", translate: `0 ${interpolate(offerSpring, [0, 1], [30, 0])}px` }}>{cut(primary, promoTokens.copy.badge)}</div>
      </div>
      <div data-qa="promo-closing-cta" style={{ bottom: 150, display: "flex", flexDirection: "column", gap: 20, left: 88, maxWidth: 430, opacity: ctaSpring, position: "absolute", translate: `0 ${interpolate(ctaSpring, [0, 1], [26, 0])}px`, zIndex: 3 }}>
        {!isDuplicateCta && <div style={{ fontSize: 48, fontWeight: 700, lineHeight: 1.12 }}>{cut(cta, promoTokens.copy.footerPrimary)}</div>}
        <LocationMarker label={retail} size={38} />
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
  "staged-reveal": { hookDuration: 150, heroFrom: 138, heroDuration: 182, closingFrom: 320, closingDuration: 130 },
  "offer-build": { hookDuration: 150, heroFrom: 138, heroDuration: 182, closingFrom: 320, closingDuration: 130 },
  "detail-cutaway": { hookDuration: 150, heroFrom: 138, heroDuration: 182, closingFrom: 320, closingDuration: 130 },
  "editorial-pan": { hookDuration: 150, heroFrom: 138, heroDuration: 182, closingFrom: 320, closingDuration: 130 },
  "location-close": { hookDuration: 150, heroFrom: 138, heroDuration: 182, closingFrom: 320, closingDuration: 130 },
};

export const SekiTiliaPromo: React.FC<VideoProps> = (props) => {
  const plan = motionPlans[props.motionTreatment ?? "staged-reveal"];
  const rawTrack = props.audioTrack?.trim() || "paper-sun-parade.mp3";
  const audioSrc = rawTrack.startsWith("mp3/") ? rawTrack : `mp3/${rawTrack}`;
  // A Reels export always carries an audible licensed track. Clamp here as a final renderer-side guard.
  const volume = Math.min(1, Math.max(0.75, props.audioVolume ?? 0.9));

  return (
    <AbsoluteFill style={paletteStyle(props.colorScheme)}>
      <RemotionAudio loop src={staticFile(audioSrc)} volume={volume} />
      <Sequence durationInFrames={plan.hookDuration} premountFor={30}><PromoHook {...props} durationInFrames={plan.hookDuration} /></Sequence>
      <Sequence from={plan.heroFrom} durationInFrames={plan.heroDuration} premountFor={30}><HeroScene {...props} durationInFrames={plan.heroDuration} /></Sequence>
      <Sequence from={plan.closingFrom} durationInFrames={plan.closingDuration} premountFor={30}><Closing {...props} /></Sequence>
    </AbsoluteFill>
  );
};
export const SekiTiliaPost: React.FC<VideoProps> = (props) => <AbsoluteFill style={paletteStyle(props.colorScheme)}><Variant {...props} /></AbsoluteFill>;

export const MyComposition: React.FC = () => (
  <>
    <Composition id="SekiTiliaPromo" component={SekiTiliaPromo} durationInFrames={450} fps={30} width={1080} height={1920} defaultProps={{ eyebrow: "Novitet u ponudi", headline: "Pažljivo izabrano za vašu rutinu.", supportingText: "Uskoro stižu konkretne informacije i fotografije proizvoda.", offerLabel: "Saznajte više u apoteci", offerKind: "none", cta: "Posetite najbližu AU Šeki-Tilia apoteku.", locationLine: "AU Šeki-Tilia", productShape: "compact", designVariant: "product-atelier", motionTreatment: "staged-reveal", footerStyle: "brand-full", colorScheme: "calm-studio" }} />
    <Composition id="SekiTiliaReelV2" component={ReelV2} durationInFrames={240} fps={24} width={1080} height={1920} schema={ReelV2PropsSchema} defaultProps={reelV2DefaultProps} />
    <Still id="SekiTiliaFeed" component={SekiTiliaPost} width={1080} height={1350} defaultProps={{ eyebrow: "Novitet u ponudi", headline: "Pažljivo izabrano za vašu rutinu.", supportingText: "Uskoro stižu konkretne informacije i fotografije proizvoda.", offerLabel: "Saznajte više u apoteci", offerKind: "none", cta: "Posetite AU Šeki-Tilia.", locationLine: "AU Šeki-Tilia", productShape: "compact", designVariant: "product-atelier", footerStyle: "brand-full", colorScheme: "calm-studio" }} />
    <Still id="SekiTiliaStory" component={SekiTiliaPost} width={1080} height={1920} defaultProps={{ eyebrow: "Novitet u ponudi", headline: "Pažljivo izabrano za vašu rutinu.", supportingText: "Uskoro stižu konkretne informacije i fotografije proizvoda.", offerLabel: "Saznajte više u apoteci", offerKind: "none", cta: "Posetite AU Šeki-Tilia.", locationLine: "AU Šeki-Tilia", productShape: "compact", designVariant: "product-atelier", footerStyle: "brand-full", colorScheme: "calm-studio" }} />
  </>
);
