import React from "react";
import { Activity, CheckCircle2, HeartHandshake, MapPin, ShieldCheck, Sparkles } from "lucide-react";
import { AbsoluteFill, cancelRender, Composition, continueRender, delayRender, Easing, Img, interpolate, Sequence, staticFile, Still, useCurrentFrame, useVideoConfig } from "remotion";

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
};

const colors = {
  petrol: "#1C3B42",
  cream: "#F7F5EC",
  lime: "#B8E100",
  beige: "#D8CFCAF0",
  stageTaupe: "#D0C5B9",
  podiumTop: "#E4DCD4",
  podiumFront: "#C4B8AB",
  charcoal: "#0F1519",
};

const brandFontFamily = "AUSekiManrope";
let fontRequested = false;

const ensureBrandFont = () => {
  if (fontRequested) return;
  fontRequested = true;
  const fontVerificationHandle = delayRender("Loading AU Šeki-Tilia Manrope font");
  void document.fonts.load(`800 76px "${brandFontFamily}"`).then(async () => {
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
      {/* A single cubic curve avoids a visible join or corner in the stage silhouette. */}
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

/** Clean 3D vector podium — a shared baseline for the product and its contact shadow */
const CleanPodium: React.FC<{ story: boolean; width?: number; bottom?: number; treatment?: "standard" | "hero" }> = ({ story, width: podiumW, bottom: podiumBottom, treatment = "standard" }) => {
  const pw = podiumW ?? (story ? 580 : 440);
  const pb = podiumBottom ?? (story ? 120 : 80);
  const isHero = treatment === "hero";
  const ph = isHero ? (story ? 240 : 180) : (story ? 90 : 64);
  const topH = isHero ? (story ? 135 : 100) : (story ? 110 : 78);

  return (
    <div data-qa="podium" style={{ bottom: pb, height: topH + ph, left: "50%", position: "absolute", translate: "-50% 0", width: pw, zIndex: 2 }}>
      {/* Podium Front Body */}
      <div style={{ backgroundColor: colors.podiumFront, bottom: 0, height: ph + (topH / 2), left: 0, position: "absolute", width: pw, zIndex: 2 }} />
      {/* Podium Top Ellipse */}
      <div style={{ backgroundColor: colors.podiumTop, borderRadius: "50%", height: topH, left: 0, position: "absolute", top: 0, width: pw, zIndex: 3 }} />
      {/* Contact shadow sits visibly on the top plane, directly beneath the product. */}
      <div data-qa="contact-shadow" style={{ backgroundColor: "rgba(15, 21, 25, 0.28)", borderRadius: "50%", bottom: ph + (topH * 0.24), filter: "blur(5px)", height: topH * 0.30, left: "50%", position: "absolute", translate: "-50% 0", width: pw * 0.66, zIndex: 4 }} />
      {/* Crisp Highlight Rim */}
      <div style={{ borderTop: "2px solid rgba(255, 255, 255, 0.45)", borderRadius: "50%", height: topH, left: 0, position: "absolute", top: 0, width: pw, zIndex: 5 }} />
    </div>
  );
};

/** Benefit Icons Row — Clean circular vector icons with text labels (supports 3-column grid or vertical list) */
const BenefitIconsRow: React.FC<{ benefits?: BenefitItem[]; layout?: "grid" | "list"; story: boolean }> = ({ benefits, layout = "grid", story }) => {
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
        {list.slice(0, 3).map((item, idx) => (
          <div key={idx} style={{ alignItems: "center", display: "flex", flexDirection: "column", gap: story ? 12 : 9, textAlign: "center" }}>
            <div style={{ alignItems: "center", backgroundColor: colors.cream, border: `1.5px solid ${colors.petrol}`, borderRadius: "50%", display: "flex", height: iconBoxSize, justifyContent: "center", width: iconBoxSize }}>
              {renderIcon(item.icon, iconSize)}
            </div>
            <div style={{ color: colors.petrol, fontSize: story ? 18 : 13, fontWeight: 800, letterSpacing: 0.2, lineHeight: 1.25, textTransform: "uppercase" }}>{item.label}</div>
          </div>
        ))}
      </div>
    );
  }

  const iconBoxSize = story ? 54 : 42;
  const iconSize = story ? 26 : 20;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: story ? 18 : 13, marginTop: story ? 24 : 16 }}>
      {list.map((item, idx) => (
        <div key={idx} style={{ alignItems: "center", display: "flex", gap: story ? 16 : 12 }}>
          <div style={{ alignItems: "center", backgroundColor: colors.cream, border: `2px solid ${colors.stageTaupe}`, borderRadius: "50%", display: "flex", height: iconBoxSize, justifyContent: "center", width: iconBoxSize }}>
            {renderIcon(item.icon, iconSize)}
          </div>
          <div style={{ color: colors.petrol, fontSize: story ? 26 : 19, fontWeight: 700, lineHeight: 1.2 }}>{item.label}</div>
        </div>
      ))}
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
              <LogoOnCreamCard size={story ? 58 : 46} />
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ fontSize: story ? 26 : 20, fontWeight: 800, letterSpacing: 0.5, lineHeight: 1.15 }}>AU Šeki-Tilia</div>
                <div style={{ fontSize: story ? 16 : 13, fontWeight: 500, letterSpacing: 1, opacity: 0.65, textTransform: "lowercase" }}>apoteka</div>
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

const LogoOnCreamCard: React.FC<{ size: number }> = ({ size }) => (
  <div
    style={{
      alignItems: "center",
      backgroundColor: colors.cream,
      display: "flex",
      height: size + 28,
      justifyContent: "center",
      padding: 14,
      width: size + 28,
    }}
  >
    <Img src={staticFile("assets/logo-mark.svg")} style={{ height: size, width: size }} />
  </div>
);

const useEntrance = (animated: boolean, fromSeconds: number, durationSeconds = 0.55) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return animated
    ? interpolate(frame, [fromSeconds * fps, (fromSeconds + durationSeconds) * fps], [0, 1], {
        easing: easeOut,
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;
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
  const { height } = useVideoConfig();
  const isStory = height > 1500;
  const intro = useEntrance(animated, 0);
  const product = useEntrance(animated, 0.65);
  const footer = useEntrance(animated, 1.45);
  const isTransparentProduct = imageBackground === "transparent";
  const isWideProduct = productShape === "wide";
  const padding = isStory ? 74 : 62;
  const stageHeight = isStory ? 1220 : 760;
  const podiumW = isStory ? 640 : 490;

  return (
    <AbsoluteFill style={{ backgroundColor: colors.cream, color: colors.petrol, fontFamily: brandFontFamily, overflow: "hidden" }}>
      {/* Clean stage background arch */}
      <CleanStageArch story={isStory} />

      <div style={{ boxSizing: "border-box", display: "flex", flexDirection: "column", height: "100%", padding: `${padding}px ${padding}px ${isStory ? 170 : 120}px`, position: "relative", zIndex: 3 }}>
        {/* Header: eyebrow + logo */}
        <div style={{ alignItems: "center", display: "flex", justifyContent: "space-between", opacity: intro }}>
          <div style={{ display: "flex", flexDirection: "column", gap: isStory ? 18 : 12 }}>
            <div style={{ fontSize: isStory ? 28 : 22, fontWeight: 800, letterSpacing: isStory ? 3.2 : 2.5, textTransform: "uppercase" }}>{eyebrow}</div>
            <div style={{ backgroundColor: colors.lime, height: isStory ? 5 : 4, width: isStory ? 260 : 190 }} />
          </div>
          <LogoOnCreamCard size={isStory ? 64 : 50} />
        </div>

        {/* Main content: typography & benefit icons left + clean product stage right */}
        <div style={{ display: "grid", flex: 1, gridTemplateColumns: isStory ? "48% 52%" : "49% 51%", minHeight: 0, paddingTop: isStory ? 48 : 30 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: isStory ? 28 : 18, justifyContent: "space-between", paddingBottom: isStory ? 28 : 18, paddingTop: isStory ? 36 : 18, position: "relative", zIndex: 4 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: isStory ? 26 : 16 }}>
              <div data-qa="headline" style={{ fontSize: isStory ? 148 : 110, fontWeight: 800, letterSpacing: isStory ? -7 : -5, lineHeight: 0.84, maxWidth: "100%", opacity: intro, whiteSpace: "pre-line" }}>{headline}</div>
              <OfferPill label={offerLabel} size={isStory ? 48 : 34} />
              <div style={{ fontSize: isStory ? 38 : 27, fontWeight: 600, lineHeight: 1.2, maxWidth: "78%", opacity: intro }}>{supportingText}</div>
            </div>
            {/* Clean 3-column benefit icons grid */}
            <div style={{ opacity: intro, width: "100%" }}>
              <BenefitIconsRow benefits={benefits} layout="grid" story={isStory} />
            </div>
          </div>

          {/* Product stage with clean 3D podium */}
          <div data-qa="product-stage" style={{ alignItems: "flex-end", display: "flex", height: stageHeight, justifyContent: "center", overflow: "visible", position: "relative" }}>
            {/* Clean 3D Vector Podium */}
            <CleanPodium story={isStory} width={podiumW} bottom={isStory ? -85 : -94} treatment="hero" />
            {/* Product Image */}
            <ProductImage
              imageSrc={imageSrc}
              style={{
                filter: "drop-shadow(0 22px 18px rgba(15, 21, 25, 0.24))",
                height: isTransparentProduct ? (isWideProduct ? (isStory ? "66%" : "70%") : (isStory ? "106%" : "110%")) : (isStory ? "78%" : "82%"),
                maxWidth: isTransparentProduct ? (isWideProduct ? "118%" : (isStory ? "138%" : "144%")) : "94%",
                objectPosition: "center bottom",
                opacity: product,
                position: "relative",
                scale: interpolate(product, [0, 1], [0.92, 1]),
                translate: `0 ${interpolate(product, [0, 1], [isStory ? 42 : 24, isStory ? -62 : -14], { extrapolateRight: "clamp" })}px`,
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

const EditorialSplit: React.FC<VideoProps & { animated?: boolean }> = ({ eyebrow, headline, supportingText, offerLabel, cta, imageSrc, imageBackground, locationLine, footerStyle = "brand-full", animated = false }) => {
  const { height } = useVideoConfig();
  const isStory = height > 1500;
  const intro = useEntrance(animated, 0);
  const product = useEntrance(animated, 0.75);
  const offer = useEntrance(animated, 1.45);
  const isTransparentProduct = imageBackground === "transparent";
  const badgeSize = isStory ? 240 : 180;

  return (
    <AbsoluteFill style={{ backgroundColor: colors.cream, color: colors.petrol, fontFamily: brandFontFamily, overflow: "hidden" }}>
      {/* Background arch */}
      <CleanStageArch story={isStory} />

      <div style={{ boxSizing: "border-box", display: "flex", flexDirection: "column", height: "100%", padding: `${isStory ? 74 : 62}px ${isStory ? 74 : 62}px ${isStory ? 170 : 120}px`, position: "relative", zIndex: 3 }}>
        {/* Header: eyebrow + logo */}
        <div style={{ alignItems: "center", display: "flex", justifyContent: "space-between", opacity: intro }}>
          <div style={{ display: "flex", flexDirection: "column", gap: isStory ? 14 : 9 }}>
            <div style={{ fontSize: isStory ? 27 : 21, fontWeight: 800, letterSpacing: isStory ? 3.2 : 2.5, textTransform: "uppercase" }}>{eyebrow}</div>
            <div style={{ backgroundColor: colors.lime, height: isStory ? 5 : 4, width: isStory ? 220 : 160 }} />
          </div>
          <LogoOnCreamCard size={isStory ? 62 : 48} />
        </div>

        {/* Main content grid */}
        <div style={{ display: "grid", flex: 1, gridTemplateColumns: isStory ? "52% 48%" : "54% 46%", minHeight: 0, paddingTop: isStory ? 48 : 30 }}>
          {/* Left column: giant title + subtext */}
          <div style={{ display: "flex", flexDirection: "column", gap: isStory ? 22 : 14, paddingTop: isStory ? 32 : 18, position: "relative", zIndex: 4 }}>
            <div style={{ fontSize: isStory ? 140 : 100, fontWeight: 800, letterSpacing: isStory ? -6 : -4, lineHeight: 0.88, opacity: intro, whiteSpace: "pre-line" }}>{headline}</div>
            <div style={{ fontSize: isStory ? 36 : 26, fontWeight: 600, lineHeight: 1.2, maxWidth: "90%", opacity: intro }}>{supportingText}</div>
          </div>

          {/* Right column: product box on clean podium + circular offer badge overlapping bottom-left */}
          <div style={{ alignItems: "flex-end", display: "flex", height: "100%", justifyContent: "center", position: "relative" }}>
            <CleanPodium story={isStory} width={isStory ? 460 : 340} bottom={isStory ? 80 : 40} />
            <ProductImage
              imageSrc={imageSrc}
              style={{
                filter: "drop-shadow(0 22px 18px rgba(15, 21, 25, 0.24))",
                height: isTransparentProduct ? (isStory ? "108%" : "112%") : (isStory ? "78%" : "82%"),
                maxWidth: isTransparentProduct ? (isStory ? "138%" : "144%") : "92%",
                objectPosition: "center bottom",
                opacity: product,
                position: "relative",
                scale: interpolate(product, [0, 1], [0.92, 1]),
                zIndex: 5,
              }}
            />
            {/* Circular Offer Badge overlapping bottom-left of product */}
            <div style={{ bottom: isStory ? 40 : 15, left: isStory ? -60 : -45, opacity: offer, position: "absolute", zIndex: 10 }}>
              <OfferBadge label={offerLabel} size={badgeSize} rotate={-10} />
            </div>
          </div>
        </div>
      </div>

      {/* Brand footer */}
      <BrandFooter cta={cta} footerStyle={footerStyle === "minimal" ? "minimal" : "brand-full"} locationLine={locationLine} story={isStory} opacity={offer} />
    </AbsoluteFill>
  );
};

const ProductAtelier: React.FC<VideoProps & { animated?: boolean }> = ({ eyebrow, headline, supportingText, cta, imageSrc, imageBackground, locationLine, footerStyle = "brand-full", animated = false }) => {
  const { height } = useVideoConfig();
  const isStory = height > 1500;
  const intro = useEntrance(animated, 0);
  const product = useEntrance(animated, 0.7);
  const footer = useEntrance(animated, 1.55);
  const isTransparentProduct = imageBackground === "transparent";

  return (
    <AbsoluteFill style={{ backgroundColor: colors.cream, color: colors.petrol, fontFamily: brandFontFamily, overflow: "hidden" }}>
      <CleanStageArch story={isStory} />
      <div style={{ boxSizing: "border-box", display: "flex", flexDirection: "column", gap: isStory ? 32 : 22, height: "100%", padding: isStory ? `94px 82px ${isStory ? 170 : 140}px` : `60px 72px 140px`, position: "relative", zIndex: 3 }}>
        <div style={{ alignItems: "center", display: "flex", justifyContent: "space-between", opacity: intro }}>
          <div style={{ display: "flex", flexDirection: "column", gap: isStory ? 12 : 8 }}>
            <div style={{ fontSize: isStory ? 30 : 23, fontWeight: 800, letterSpacing: isStory ? 3.4 : 2.6, textTransform: "uppercase" }}>{eyebrow}</div>
            <div style={{ backgroundColor: colors.lime, height: isStory ? 5 : 4, width: isStory ? 220 : 170 }} />
          </div>
          <LogoOnCreamCard size={isStory ? 68 : 54} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: isStory ? 20 : 12, opacity: intro }}>
          <div style={{ fontSize: isStory ? 104 : 76, fontWeight: 800, letterSpacing: -4, lineHeight: 0.98 }}>{headline}</div>
          <div style={{ fontSize: isStory ? 40 : 30, fontWeight: 600, lineHeight: 1.22, maxWidth: "88%" }}>{supportingText}</div>
        </div>
        <div style={{ alignItems: "center", display: "flex", flex: 1, justifyContent: "center", minHeight: isStory ? 640 : 385, overflow: isTransparentProduct ? "visible" : "hidden", position: "relative" }}>
          <CleanPodium story={isStory} width={isStory ? 520 : 360} bottom={isStory ? 40 : 20} />
          <ProductImage imageSrc={imageSrc} style={{ filter: "drop-shadow(0 24px 20px rgba(15, 21, 25, 0.22))", height: isTransparentProduct ? "128%" : "90%", maxWidth: isTransparentProduct ? "124%" : "88%", opacity: product, position: "relative", scale: interpolate(product, [0, 1], [0.91, 1]), zIndex: 5 }} />
        </div>
      </div>
      <BrandFooter cta={cta} footerStyle={footerStyle === "minimal" ? "minimal" : "brand-full"} locationLine={locationLine} story={isStory} opacity={footer} />
    </AbsoluteFill>
  );
};

const MinimalOffer: React.FC<VideoProps & { animated?: boolean }> = ({ eyebrow, headline, supportingText, offerLabel, cta, imageSrc, imageBackground, locationLine, footerStyle = "cta-only", animated = false }) => {
  const { height } = useVideoConfig();
  const isStory = height > 1500;
  const intro = useEntrance(animated, 0);
  const product = useEntrance(animated, 0.65);
  const footer = useEntrance(animated, 1.45);
  const isTransparentProduct = imageBackground === "transparent";
  return (
    <AbsoluteFill style={{ backgroundColor: colors.cream, color: colors.petrol, fontFamily: brandFontFamily, overflow: "hidden" }}>
      <div style={{ backgroundColor: colors.lime, height: isStory ? 42 : 32, left: 0, position: "absolute", right: 0, top: 0, zIndex: 10 }} />
      <div style={{ boxSizing: "border-box", display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between", padding: isStory ? `102px 82px ${isStory ? 170 : 140}px` : `72px 72px 140px`, position: "relative", zIndex: 3 }}>
        <div style={{ alignItems: "flex-start", display: "flex", justifyContent: "space-between", opacity: intro }}>
          <div style={{ display: "flex", flexDirection: "column", gap: isStory ? 24 : 16, maxWidth: "68%" }}>
            <div style={{ fontSize: isStory ? 28 : 22, fontWeight: 800, letterSpacing: isStory ? 3 : 2.3, textTransform: "uppercase" }}>{eyebrow}</div>
            <div style={{ fontSize: isStory ? 110 : 82, fontWeight: 800, letterSpacing: -5, lineHeight: 0.9 }}>{headline}</div>
          </div>
          <LogoOnCreamCard size={isStory ? 68 : 52} />
        </div>
        <div style={{ alignItems: "center", display: "flex", gap: isStory ? 34 : 24, justifyContent: "space-between", position: "relative" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: isStory ? 24 : 16, maxWidth: "48%", opacity: footer }}>
            <OfferPill label={offerLabel} size={isStory ? 44 : 32} />
            <div style={{ fontSize: isStory ? 34 : 25, fontWeight: 600, lineHeight: 1.17 }}>{supportingText}</div>
          </div>
          <div style={{ alignItems: "center", display: "flex", height: isTransparentProduct ? (isStory ? 760 : 540) : (isStory ? 680 : 450), justifyContent: "center", overflow: isTransparentProduct ? "visible" : "hidden", position: "relative", width: isTransparentProduct ? (isStory ? "68%" : "64%") : "48%" }}>
            <CleanPodium story={isStory} width={isStory ? 400 : 280} bottom={isStory ? 20 : 10} />
            <ProductImage imageSrc={imageSrc} style={{ filter: "drop-shadow(0 20px 18px rgba(15, 21, 25, 0.20))", height: isTransparentProduct ? "140%" : "78%", maxWidth: isTransparentProduct ? "128%" : "150%", opacity: product, position: "relative", scale: interpolate(product, [0, 1], [0.9, 1]), zIndex: 5 }} />
          </div>
        </div>
      </div>
      <BrandFooter cta={cta} footerStyle={footerStyle === "minimal" ? "minimal" : "cta-only"} locationLine={locationLine} story={isStory} opacity={footer} />
    </AbsoluteFill>
  );
};

const ProductCard: React.FC<VideoProps & { animated?: boolean }> = ({ eyebrow, headline, supportingText, offerLabel, cta, imageSrc, imageBackground, locationLine, animated = false }) => {
  const { height } = useVideoConfig();
  const isStory = height > 1500;
  const intro = useEntrance(animated, 0);
  const product = useEntrance(animated, 0.75);
  const footer = useEntrance(animated, 1.55);
  const isTransparentProduct = imageBackground === "transparent";
  return (
    <AbsoluteFill style={{ backgroundColor: colors.petrol, color: colors.cream, fontFamily: brandFontFamily, overflow: "hidden" }}>
      <div style={{ boxSizing: "border-box", display: "flex", flexDirection: "column", height: "100%", padding: isStory ? "92px 82px 76px" : "60px 72px 54px", position: "relative", zIndex: 3 }}>
        <div style={{ alignItems: "center", display: "flex", justifyContent: "space-between", opacity: intro }}>
          <div style={{ display: "flex", flexDirection: "column", gap: isStory ? 10 : 7 }}>
            <div style={{ fontSize: isStory ? 30 : 23, fontWeight: 800, letterSpacing: isStory ? 3.2 : 2.5, textTransform: "uppercase" }}>{eyebrow}</div>
            <div style={{ backgroundColor: colors.lime, height: isStory ? 4 : 3, width: isStory ? 200 : 155 }} />
          </div>
          <LogoOnCreamCard size={isStory ? 68 : 54} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: isStory ? 18 : 12, marginTop: isStory ? 60 : 42, opacity: intro }}>
          <div style={{ fontSize: isStory ? 100 : 74, fontWeight: 800, letterSpacing: -4, lineHeight: 0.95, maxWidth: "78%" }}>{headline}</div>
          <div style={{ fontSize: isStory ? 38 : 29, fontWeight: 600, lineHeight: 1.18, maxWidth: "78%" }}>{supportingText}</div>
        </div>
        <div style={{ alignItems: "center", display: "flex", flex: 1, justifyContent: "center", margin: isStory ? "54px 0 42px" : "36px 0 28px", minHeight: isStory ? 620 : 390, overflow: isTransparentProduct ? "visible" : "hidden", position: "relative" }}>
          <CleanPodium story={isStory} width={isStory ? 480 : 340} bottom={isStory ? 30 : 15} />
          <ProductImage imageSrc={imageSrc} style={{ filter: "drop-shadow(0 26px 22px rgba(0, 0, 0, 0.3))", height: isTransparentProduct ? "134%" : "80%", maxWidth: isTransparentProduct ? "125%" : "86%", opacity: product, position: "relative", scale: interpolate(product, [0, 1], [0.9, 1]), zIndex: 5 }} />
        </div>
        <div style={{ alignItems: "center", display: "flex", gap: isStory ? 30 : 22, justifyContent: "space-between", opacity: footer }}>
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

const OfferOrbit: React.FC<VideoProps & { animated?: boolean }> = (props) => <PremiumProductStage {...props} />;
const TypeStage: React.FC<VideoProps & { animated?: boolean }> = (props) => <ProductAtelier {...props} />;
const GalleryShelf: React.FC<VideoProps & { animated?: boolean }> = (props) => <EditorialSplit {...props} />;

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

const PromoHook: React.FC<VideoProps> = ({ eyebrow, headline, offerLabel, motionTreatment = "staged-reveal" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const opacity = interpolate(frame, [0, fps * 0.45, fps * 2.15, fps * 2.5], [0, 1, 1, 0], { easing: easeOut, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const lead = motionTreatment === "offer-build" ? offerLabel : motionTreatment === "location-close" ? "DOSTUPNO U APOTEKAMA" : eyebrow;
  const horizontalEntrance = motionTreatment === "editorial-pan" || motionTreatment === "detail-cutaway";
  const titleTranslate = interpolate(frame, [0, fps * 0.7], [70, 0], { easing: easeOut, extrapolateRight: "clamp" });
  return (
    <AbsoluteFill data-qa="reels-hook" style={{ backgroundColor: colors.petrol, color: colors.cream, fontFamily: brandFontFamily, opacity, overflow: "hidden", padding: "132px 84px" }}>
      <div style={{ alignItems: "center", display: "flex", justifyContent: "space-between", position: "relative", zIndex: 2 }}>
        <div style={{ color: colors.lime, fontSize: 34, fontWeight: 800, letterSpacing: 3.4 }}>{lead}</div>
        <LogoOnCreamCard size={70} />
      </div>
      <div style={{ bottom: 480, fontSize: 126, fontWeight: 800, left: 84, letterSpacing: -7, lineHeight: 0.88, maxWidth: 850, position: "absolute", translate: horizontalEntrance ? `${titleTranslate}px 0` : `0 ${titleTranslate}px`, whiteSpace: "pre-line", zIndex: 2 }}>{headline}</div>
      <div style={{ backgroundColor: colors.lime, bottom: 398, height: 8, left: 84, position: "absolute", width: interpolate(frame, [0, fps * 1.1], [0, 360], { easing: easeOut, extrapolateRight: "clamp" }), zIndex: 2 }} />
    </AbsoluteFill>
  );
};

const Closing: React.FC<Pick<VideoProps, "cta" | "imageSrc" | "locationLine" | "offerLabel" | "productShape">> = ({ offerLabel, cta, imageSrc, locationLine, productShape }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const opacity = interpolate(frame, [0, fps * 0.5], [0, 1], { easing: easeOut, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill data-qa="reels-closing" style={{ backgroundColor: colors.petrol, color: colors.cream, fontFamily: brandFontFamily, opacity, overflow: "hidden", padding: "120px 88px" }}>
      {imageSrc && <ProductImage imageSrc={imageSrc} style={{ bottom: productShape === "tall" ? 120 : 250, filter: "drop-shadow(0 24px 18px rgba(0, 0, 0, 0.3))", height: productShape === "tall" ? 720 : undefined, maxWidth: productShape === "tall" ? 460 : 620, position: "absolute", right: productShape === "tall" ? 12 : 18, width: productShape === "tall" ? undefined : 620, zIndex: 2 }} />}
      <div style={{ display: "flex", flexDirection: "column", gap: 34, maxWidth: 720, position: "relative", zIndex: 3 }}>
        <LogoOnCreamCard size={110} />
        <div style={{ fontSize: 78, fontWeight: 800, letterSpacing: -3 }}>AU Šeki-Tilia</div>
        <div style={{ color: colors.lime, fontSize: 52, fontWeight: 800 }}>{offerLabel}</div>
        <div style={{ fontSize: 48, fontWeight: 700, lineHeight: 1.14 }}>{cta}</div>
        <LocationMarker label={locationLine} size={34} />
      </div>
    </AbsoluteFill>
  );
};

const motionPlans: Record<MotionTreatment, { hookDuration: number; heroFrom: number; heroDuration: number; closingFrom: number; closingDuration: number }> = {
  "staged-reveal": { hookDuration: 84, heroFrom: 68, heroDuration: 222, closingFrom: 270, closingDuration: 90 },
  "offer-build": { hookDuration: 76, heroFrom: 60, heroDuration: 218, closingFrom: 258, closingDuration: 102 },
  "detail-cutaway": { hookDuration: 64, heroFrom: 52, heroDuration: 236, closingFrom: 268, closingDuration: 92 },
  "editorial-pan": { hookDuration: 90, heroFrom: 72, heroDuration: 204, closingFrom: 258, closingDuration: 102 },
  "location-close": { hookDuration: 60, heroFrom: 48, heroDuration: 210, closingFrom: 238, closingDuration: 122 },
};

export const SekiTiliaPromo: React.FC<VideoProps> = (props) => {
  const plan = motionPlans[props.motionTreatment ?? "staged-reveal"];
  return (
    <AbsoluteFill>
      <Sequence durationInFrames={plan.hookDuration} premountFor={30}><PromoHook {...props} /></Sequence>
      <Sequence from={plan.heroFrom} durationInFrames={plan.heroDuration} premountFor={30}><Variant {...props} animated /></Sequence>
      <Sequence from={plan.closingFrom} durationInFrames={plan.closingDuration} premountFor={30}><Closing {...props} /></Sequence>
    </AbsoluteFill>
  );
};
export const SekiTiliaPost: React.FC<VideoProps> = (props) => <Variant {...props} />;

export const MyComposition: React.FC = () => (
  <>
    <Composition id="SekiTiliaPromo" component={SekiTiliaPromo} durationInFrames={360} fps={30} width={1080} height={1920} defaultProps={{ eyebrow: "Novitet u ponudi", headline: "Pažljivo izabrano za vašu rutinu.", supportingText: "Uskoro stižu konkretne informacije i fotografije proizvoda.", offerLabel: "Saznajte više u apoteci", offerKind: "none", cta: "Posetite najbližu AU Šeki-Tilia apoteku.", locationLine: "AU Šeki-Tilia", productShape: "compact", designVariant: "product-atelier", motionTreatment: "staged-reveal", footerStyle: "brand-full" }} />
    <Still id="SekiTiliaFeed" component={SekiTiliaPost} width={1080} height={1350} defaultProps={{ eyebrow: "Novitet u ponudi", headline: "Pažljivo izabrano za vašu rutinu.", supportingText: "Uskoro stižu konkretne informacije i fotografije proizvoda.", offerLabel: "Saznajte više u apoteci", offerKind: "none", cta: "Posetite AU Šeki-Tilia.", locationLine: "AU Šeki-Tilia", productShape: "compact", designVariant: "product-atelier", footerStyle: "brand-full" }} />
    <Still id="SekiTiliaStory" component={SekiTiliaPost} width={1080} height={1920} defaultProps={{ eyebrow: "Novitet u ponudi", headline: "Pažljivo izabrano za vašu rutinu.", supportingText: "Uskoro stižu konkretne informacije i fotografije proizvoda.", offerLabel: "Saznajte više u apoteci", offerKind: "none", cta: "Posetite AU Šeki-Tilia.", locationLine: "AU Šeki-Tilia", productShape: "compact", designVariant: "product-atelier", footerStyle: "brand-full" }} />
  </>
);
