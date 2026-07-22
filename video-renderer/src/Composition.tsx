import React from "react";
import { MapPin } from "lucide-react";
import { AbsoluteFill, cancelRender, Composition, continueRender, delayRender, Easing, Img, interpolate, staticFile, Still, useCurrentFrame, useVideoConfig } from "remotion";

type DesignVariant = "product-atelier" | "editorial-split" | "minimal-offer" | "product-card" | "premium-product-stage" | "offer-orbit" | "type-stage" | "gallery-shelf";
type MotionTreatment = "staged-reveal" | "offer-build" | "detail-cutaway" | "editorial-pan" | "location-close";

type VideoProps = {
  eyebrow: string;
  headline: string;
  supportingText: string;
  offerLabel: string;
  cta: string;
  imageSrc?: string;
  imageBackground?: "transparent" | "opaque" | "unknown";
  locationLine?: string;
  designVariant?: DesignVariant;
  motionTreatment?: MotionTreatment;
};

const colors = {
  petrol: "#1C3B42",
  cream: "#F7F5EC",
  lime: "#B8E100",
  beige: "#B2A69A",
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

const MotionTreatmentLayer: React.FC<{ children: React.ReactNode; treatment: MotionTreatment }> = ({ children, treatment }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = interpolate(frame, [0, fps * 2.4], [0, 1], { easing: easeOut, extrapolateRight: "clamp" });
  const scale = treatment === "offer-build" ? interpolate(progress, [0, 1], [0.965, 1]) : treatment === "detail-cutaway" ? interpolate(progress, [0, 1], [1.05, 1]) : 1;
  const translate = treatment === "editorial-pan" ? `${interpolate(progress, [0, 1], [-34, 0])}px 0` : treatment === "location-close" ? `0 ${interpolate(progress, [0, 1], [26, 0])}px` : "0 0";
  return <AbsoluteFill style={{ overflow: "hidden", scale, translate, transformOrigin: "center" }}>{children}</AbsoluteFill>;
};

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
  return <Img src={resolvedImageSrc} style={{ objectFit: "contain", ...style }} />;
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
      letterSpacing: -0.8,
      lineHeight: 1,
      padding: `${Math.round(size * 0.5)}px ${Math.round(size * 0.78)}px`,
    }}
  >
    {label}
  </div>
);

const LocationMarker: React.FC<{ label?: string; onLight?: boolean; size: number; textAlign?: "left" | "right" }> = ({ label, onLight = false, size, textAlign = "left" }) => (
  <div style={{ alignItems: "center", display: "flex", gap: Math.max(7, Math.round(size * 0.42)), justifyContent: textAlign === "right" ? "flex-end" : "flex-start", opacity: 0.8, textAlign }}>
    <MapPin color={onLight ? colors.petrol : colors.lime} size={Math.round(size * 1.08)} strokeWidth={2.35} />
    <div style={{ fontSize: size, fontWeight: 600, lineHeight: 1.08 }}>{label ?? "AU Šeki-Tilia"}</div>
  </div>
);

const ProductAtelier: React.FC<VideoProps & { animated?: boolean }> = ({ eyebrow, headline, supportingText, offerLabel, cta, imageSrc, imageBackground, locationLine, animated = false }) => {
  const { height } = useVideoConfig();
  const isStory = height > 1500;
  const intro = useEntrance(animated, 0);
  const product = useEntrance(animated, 0.7);
  const footer = useEntrance(animated, 1.55);
  const isTransparentProduct = imageBackground === "transparent";

  return (
    <AbsoluteFill style={{ backgroundColor: colors.cream, color: colors.petrol, fontFamily: brandFontFamily, overflow: "hidden" }}>
      <div style={{ backgroundColor: colors.petrol, bottom: 0, height: isStory ? "41%" : "37%", left: 0, position: "absolute", right: 0 }} />
      <div style={{ backgroundColor: colors.lime, borderRadius: "50%", height: isStory ? 360 : 290, opacity: 0.9, position: "absolute", right: isStory ? -165 : -130, top: isStory ? -190 : -160, width: isStory ? 360 : 290 }} />
      <div style={{ boxSizing: "border-box", display: "flex", flexDirection: "column", gap: isStory ? 32 : 22, height: "100%", padding: isStory ? "94px 82px 82px" : "60px 72px 58px", position: "relative" }}>
        <div style={{ alignItems: "center", display: "flex", justifyContent: "space-between", opacity: intro }}>
          <div style={{ fontSize: isStory ? 30 : 23, fontWeight: 800, letterSpacing: isStory ? 3.4 : 2.6, textTransform: "uppercase" }}>{eyebrow}</div>
          <LogoOnCreamCard size={isStory ? 68 : 54} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: isStory ? 20 : 12, opacity: intro }}>
          <div style={{ fontSize: isStory ? 104 : 76, fontWeight: 800, letterSpacing: -4, lineHeight: 0.98 }}>{headline}</div>
          <div style={{ fontSize: isStory ? 40 : 30, fontWeight: 600, lineHeight: 1.22, maxWidth: "88%" }}>{supportingText}</div>
        </div>
        <div style={{ alignItems: "center", backgroundColor: isTransparentProduct ? "transparent" : colors.beige, display: "flex", flex: 1, justifyContent: "center", minHeight: isStory ? 640 : 385, overflow: isTransparentProduct ? "visible" : "hidden", position: "relative" }}>
          <div style={{ backgroundColor: colors.lime, borderRadius: "50%", height: isStory ? 430 : 330, position: "absolute", right: isStory ? -130 : -110, top: isStory ? -110 : -92, width: isStory ? 430 : 330 }} />
          <ProductImage imageSrc={imageSrc} style={{ filter: "drop-shadow(0 26px 22px rgba(15, 21, 25, 0.20))", height: isTransparentProduct ? "132%" : "92%", maxWidth: isTransparentProduct ? "130%" : "88%", opacity: product, position: "relative", scale: interpolate(product, [0, 1], [0.91, 1]), translate: `0 ${interpolate(product, [0, 1], [44, 0])}px` }} />
        </div>
        <div style={{ color: colors.cream, display: "flex", flexDirection: "column", gap: isStory ? 18 : 12, opacity: footer, padding: isStory ? "8px 8px 0" : "3px 6px 0" }}>
          <OfferPill label={offerLabel} size={isStory ? 42 : 31} />
          <div style={{ fontSize: isStory ? 36 : 27, fontWeight: 700, lineHeight: 1.18 }}>{cta}</div>
          <LocationMarker label={locationLine} size={isStory ? 27 : 20} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

const EditorialSplit: React.FC<VideoProps & { animated?: boolean }> = ({ eyebrow, headline, supportingText, offerLabel, cta, imageSrc, imageBackground, locationLine, animated = false }) => {
  const { height } = useVideoConfig();
  const isStory = height > 1500;
  const intro = useEntrance(animated, 0);
  const product = useEntrance(animated, 0.75);
  const offer = useEntrance(animated, 1.6);
  const padding = isStory ? 78 : 60;
  const isTransparentProduct = imageBackground === "transparent";
  return (
    <AbsoluteFill style={{ backgroundColor: colors.petrol, color: colors.petrol, fontFamily: brandFontFamily, overflow: "hidden" }}>
      <div style={{ backgroundColor: colors.lime, borderRadius: "50%", bottom: isStory ? -240 : -180, height: isStory ? 520 : 410, position: "absolute", right: isStory ? -180 : -130, width: isStory ? 520 : 410 }} />
      <div style={{ backgroundColor: colors.cream, bottom: 0, left: 0, position: "absolute", top: 0, width: "57%" }} />
      <div style={{ boxSizing: "border-box", display: "grid", gridTemplateColumns: "57% 43%", height: "100%", padding: `${padding}px`, position: "relative" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", paddingRight: isStory ? 34 : 24 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: isStory ? 22 : 15, opacity: intro }}>
            <div style={{ alignItems: "center", display: "flex", justifyContent: "space-between" }}>
              <div style={{ fontSize: isStory ? 25 : 19, fontWeight: 800, letterSpacing: isStory ? 2.7 : 2, textTransform: "uppercase" }}>{eyebrow}</div>
              <LogoOnCreamCard size={isStory ? 52 : 42} />
            </div>
            <div style={{ fontSize: isStory ? 88 : 65, fontWeight: 800, letterSpacing: -4, lineHeight: 0.94 }}>{headline}</div>
            <div style={{ fontSize: isStory ? 34 : 25, fontWeight: 600, lineHeight: 1.18 }}>{supportingText}</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: isStory ? 18 : 12, opacity: offer }}>
            <OfferPill dark label={offerLabel} size={isStory ? 36 : 27} />
            <div style={{ fontSize: isStory ? 30 : 22, fontWeight: 700, lineHeight: 1.17 }}>{cta}</div>
            <LocationMarker label={locationLine} onLight size={isStory ? 23 : 17} />
          </div>
        </div>
        <div style={{ alignItems: "center", display: "flex", justifyContent: "center", overflow: isTransparentProduct ? "visible" : "hidden", paddingLeft: isStory ? 10 : 6 }}>
          <div style={{ alignItems: "center", backgroundColor: isTransparentProduct ? "transparent" : colors.beige, display: "flex", height: "78%", justifyContent: "center", overflow: isTransparentProduct ? "visible" : "hidden", position: "relative", width: "100%" }}>
            <div style={{ backgroundColor: colors.cream, borderRadius: "50%", height: isStory ? 300 : 220, left: isStory ? -125 : -90, opacity: 0.65, position: "absolute", top: isStory ? -95 : -70, width: isStory ? 300 : 220 }} />
            <ProductImage imageSrc={imageSrc} style={{ filter: "drop-shadow(0 26px 22px rgba(15, 21, 25, 0.22))", maxHeight: isTransparentProduct ? "124%" : "74%", maxWidth: isTransparentProduct ? "142%" : "92%", opacity: product, position: "relative", scale: interpolate(product, [0, 1], [0.9, 1]), translate: `0 ${interpolate(product, [0, 1], [54, 0])}px`, width: isTransparentProduct ? "142%" : "92%" }} />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const MinimalOffer: React.FC<VideoProps & { animated?: boolean }> = ({ eyebrow, headline, supportingText, offerLabel, cta, imageSrc, imageBackground, locationLine, animated = false }) => {
  const { height } = useVideoConfig();
  const isStory = height > 1500;
  const intro = useEntrance(animated, 0);
  const product = useEntrance(animated, 0.65);
  const footer = useEntrance(animated, 1.45);
  const isTransparentProduct = imageBackground === "transparent";
  return (
    <AbsoluteFill style={{ backgroundColor: colors.cream, color: colors.petrol, fontFamily: brandFontFamily, overflow: "hidden" }}>
      <div style={{ backgroundColor: colors.lime, height: isStory ? 42 : 32, left: 0, position: "absolute", right: 0, top: 0 }} />
      <div style={{ backgroundColor: colors.petrol, bottom: 0, height: isStory ? "29%" : "25%", left: 0, position: "absolute", right: 0 }} />
      <div style={{ boxSizing: "border-box", display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between", padding: isStory ? "102px 82px 72px" : "72px 72px 54px", position: "relative" }}>
        <div style={{ alignItems: "flex-start", display: "flex", justifyContent: "space-between", opacity: intro }}>
          <div style={{ display: "flex", flexDirection: "column", gap: isStory ? 24 : 16, maxWidth: "68%" }}>
            <div style={{ fontSize: isStory ? 28 : 22, fontWeight: 800, letterSpacing: isStory ? 3 : 2.3, textTransform: "uppercase" }}>{eyebrow}</div>
            <div style={{ fontSize: isStory ? 110 : 82, fontWeight: 800, letterSpacing: -5, lineHeight: 0.9 }}>{headline}</div>
          </div>
          <LogoOnCreamCard size={isStory ? 68 : 52} />
        </div>
        <div style={{ alignItems: "center", display: "flex", gap: isStory ? 34 : 24, justifyContent: "space-between", marginTop: isTransparentProduct ? (isStory ? -205 : -130) : 0, position: "relative", top: isTransparentProduct ? (isStory ? -90 : -58) : 0 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: isStory ? 24 : 16, maxWidth: "48%", opacity: footer }}>
            <OfferPill label={offerLabel} size={isStory ? 44 : 32} />
            <div style={{ fontSize: isStory ? 34 : 25, fontWeight: 600, lineHeight: 1.17 }}>{supportingText}</div>
          </div>
          <div style={{ alignItems: "center", backgroundColor: isTransparentProduct ? "transparent" : colors.beige, display: "flex", height: isTransparentProduct ? (isStory ? 960 : 680) : (isStory ? 680 : 450), justifyContent: "center", overflow: isTransparentProduct ? "visible" : "hidden", position: "relative", width: isTransparentProduct ? (isStory ? "68%" : "64%") : "48%" }}>
            <div style={{ backgroundColor: colors.lime, borderRadius: "50%", bottom: -70, height: isStory ? 260 : 190, position: "absolute", right: -80, width: isStory ? 260 : 190 }} />
            <ProductImage imageSrc={imageSrc} style={{ filter: "drop-shadow(0 20px 18px rgba(15, 21, 25, 0.20))", height: isTransparentProduct ? "174%" : "78%", maxWidth: isTransparentProduct ? "138%" : "150%", opacity: product, position: "relative", scale: interpolate(product, [0, 1], [0.9, 1]) }} />
          </div>
        </div>
        <div style={{ alignItems: "flex-start", color: colors.cream, display: "flex", flexDirection: "column", gap: isStory ? 14 : 9, opacity: footer }}>
          <div style={{ fontSize: isStory ? 36 : 27, fontWeight: 700, lineHeight: 1.16 }}>{cta}</div>
          <LocationMarker label={locationLine} size={isStory ? 25 : 19} />
        </div>
      </div>
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
      <div style={{ backgroundColor: colors.lime, borderRadius: "50%", height: isStory ? 460 : 340, left: isStory ? -200 : -150, opacity: 0.92, position: "absolute", top: isStory ? -220 : -170, width: isStory ? 460 : 340 }} />
      <div style={{ boxSizing: "border-box", display: "flex", flexDirection: "column", height: "100%", padding: isStory ? "92px 82px 76px" : "60px 72px 54px", position: "relative" }}>
        <div style={{ alignItems: "center", display: "flex", justifyContent: "space-between", opacity: intro }}>
          <div style={{ fontSize: isStory ? 30 : 23, fontWeight: 800, letterSpacing: isStory ? 3.2 : 2.5, textTransform: "uppercase" }}>{eyebrow}</div>
          <LogoOnCreamCard size={isStory ? 68 : 54} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: isStory ? 18 : 12, marginTop: isStory ? 60 : 42, opacity: intro }}>
          <div style={{ fontSize: isStory ? 100 : 74, fontWeight: 800, letterSpacing: -4, lineHeight: 0.95, maxWidth: "78%" }}>{headline}</div>
          <div style={{ fontSize: isStory ? 38 : 29, fontWeight: 600, lineHeight: 1.18, maxWidth: "78%" }}>{supportingText}</div>
        </div>
        <div style={{ alignItems: "center", backgroundColor: isTransparentProduct ? "transparent" : colors.cream, display: "flex", flex: 1, justifyContent: "center", margin: isStory ? "54px 0 42px" : "36px 0 28px", minHeight: isStory ? 620 : 390, overflow: isTransparentProduct ? "visible" : "hidden", position: "relative" }}>
          {!isTransparentProduct && <div style={{ backgroundColor: colors.lime, height: isStory ? 54 : 40, left: 0, position: "absolute", right: 0, top: 0 }} />}
          {!isTransparentProduct && <div style={{ border: `${isStory ? 3 : 2}px solid ${colors.beige}`, height: "78%", position: "absolute", width: "76%" }} />}
          {isTransparentProduct && <div style={{ backgroundColor: colors.lime, borderRadius: "50%", bottom: isStory ? -130 : -90, height: isStory ? 420 : 300, position: "absolute", right: isStory ? -120 : -90, width: isStory ? 420 : 300 }} />}
          <ProductImage imageSrc={imageSrc} style={{ filter: "drop-shadow(0 26px 22px rgba(15, 21, 25, 0.22))", height: isTransparentProduct ? "134%" : "80%", maxWidth: isTransparentProduct ? "125%" : "86%", opacity: product, position: "relative", scale: interpolate(product, [0, 1], [0.9, 1]), translate: `0 ${interpolate(product, [0, 1], [52, 0])}px` }} />
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

const PremiumProductStage: React.FC<VideoProps & { animated?: boolean }> = ({ eyebrow, headline, supportingText, offerLabel, cta, imageSrc, imageBackground, locationLine, animated = false }) => {
  const { height } = useVideoConfig();
  const isStory = height > 1500;
  const intro = useEntrance(animated, 0);
  const product = useEntrance(animated, 0.65);
  const footer = useEntrance(animated, 1.45);
  const isTransparentProduct = imageBackground === "transparent";
  const padding = isStory ? 78 : 68;
  const stageHeight = isStory ? 1160 : 710;

  return (
    <AbsoluteFill style={{ backgroundColor: colors.cream, color: colors.petrol, fontFamily: brandFontFamily, overflow: "hidden" }}>
      <div style={{ backgroundColor: colors.petrol, bottom: 0, height: isStory ? 364 : 248, left: 0, position: "absolute", right: 0 }} />
      <div style={{ boxSizing: "border-box", display: "flex", flexDirection: "column", height: "100%", padding: `${padding}px ${padding}px ${isStory ? 54 : 40}px`, position: "relative" }}>
        <div style={{ alignItems: "center", display: "flex", justifyContent: "space-between", opacity: intro }}>
          <div style={{ display: "flex", flexDirection: "column", gap: isStory ? 18 : 13 }}>
            <div style={{ fontSize: isStory ? 27 : 21, fontWeight: 800, letterSpacing: isStory ? 3 : 2.3, textTransform: "uppercase" }}>{eyebrow}</div>
            <div style={{ backgroundColor: colors.lime, height: isStory ? 5 : 4, width: isStory ? 260 : 198 }} />
          </div>
          <LogoOnCreamCard size={isStory ? 58 : 46} />
        </div>

        <div style={{ display: "grid", flex: 1, gridTemplateColumns: isStory ? "47% 53%" : "48% 52%", minHeight: 0, paddingTop: isStory ? 66 : 44 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: isStory ? 34 : 24, paddingTop: isStory ? 72 : 48, position: "relative", zIndex: 2 }}>
            <div style={{ fontSize: isStory ? 132 : 96, fontWeight: 800, letterSpacing: isStory ? -7 : -5, lineHeight: 0.86, maxWidth: "112%", opacity: intro }}>{headline}</div>
            <OfferPill label={offerLabel} size={isStory ? 45 : 32} />
            <div style={{ fontSize: isStory ? 37 : 27, fontWeight: 600, lineHeight: 1.18, maxWidth: isStory ? "88%" : "92%", opacity: intro }}>{supportingText}</div>
          </div>

          <div style={{ alignItems: "flex-end", display: "flex", height: stageHeight, justifyContent: "center", overflow: "visible", position: "relative" }}>
            <div style={{ backgroundColor: colors.beige, borderRadius: "50%", height: isStory ? 860 : 560, opacity: 0.72, position: "absolute", right: isStory ? -178 : -124, top: isStory ? 92 : 70, width: isStory ? 860 : 560 }} />
            <div style={{ backgroundColor: colors.lime, borderRadius: "50%", height: isStory ? 184 : 126, position: "absolute", right: isStory ? -12 : -18, top: isStory ? 104 : 62, width: isStory ? 184 : 126 }} />
            <div style={{ backgroundColor: "rgba(15, 21, 25, 0.18)", borderRadius: "50%", bottom: isStory ? 126 : 74, filter: "blur(6px)", height: isStory ? 58 : 40, position: "absolute", width: isStory ? 550 : 380 }} />
            <div style={{ backgroundColor: isTransparentProduct ? "transparent" : colors.beige, bottom: isStory ? 96 : 48, height: isStory ? 730 : 480, overflow: isTransparentProduct ? "visible" : "hidden", position: "absolute", width: isStory ? "92%" : "94%" }} />
            <ProductImage
              imageSrc={imageSrc}
              style={{
                filter: "drop-shadow(0 30px 22px rgba(15, 21, 25, 0.22))",
                height: isTransparentProduct ? (isStory ? "105%" : "108%") : (isStory ? "68%" : "72%"),
                maxWidth: isTransparentProduct ? (isStory ? "130%" : "136%") : "84%",
                objectPosition: "center bottom",
                opacity: product,
                position: "relative",
                scale: interpolate(product, [0, 1], [0.9, 1]),
                translate: `0 ${interpolate(product, [0, 1], [isStory ? 78 : 48, 0])}px`,
                zIndex: 1,
              }}
            />
          </div>
        </div>

        <div style={{ alignItems: "center", color: colors.cream, display: "flex", justifyContent: "space-between", minHeight: isStory ? 244 : 164, opacity: footer, paddingBottom: isStory ? 4 : 2, position: "relative" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: isStory ? 18 : 12, maxWidth: "72%" }}>
            <div style={{ fontSize: isStory ? 39 : 28, fontWeight: 800, letterSpacing: -1, lineHeight: 1.1 }}>{cta}</div>
            <div style={{ alignItems: "center", display: "flex", gap: isStory ? 14 : 10 }}>
              <div style={{ backgroundColor: colors.lime, height: isStory ? 4 : 3, width: isStory ? 78 : 58 }} />
              <LocationMarker label={locationLine} size={isStory ? 26 : 19} />
            </div>
          </div>
          <div style={{ display: "grid", gap: isStory ? 14 : 10, gridTemplateColumns: "repeat(4, 1fr)", opacity: 0.42 }}>
            {Array.from({ length: 12 }, (_, index) => <div key={index} style={{ backgroundColor: colors.cream, borderRadius: "50%", height: isStory ? 9 : 7, width: isStory ? 9 : 7 }} />)}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const OfferOrbit: React.FC<VideoProps & { animated?: boolean }> = ({ eyebrow, headline, supportingText, offerLabel, cta, imageSrc, imageBackground, locationLine, animated = false }) => {
  const { height } = useVideoConfig();
  const isStory = height > 1500;
  const intro = useEntrance(animated, 0);
  const product = useEntrance(animated, 0.55);
  const detail = useEntrance(animated, 1.25);
  const isTransparentProduct = imageBackground === "transparent";
  const padding = isStory ? 80 : 62;

  return (
    <AbsoluteFill style={{ backgroundColor: colors.cream, color: colors.cream, fontFamily: brandFontFamily, overflow: "hidden" }}>
      <div style={{ backgroundColor: colors.petrol, bottom: 0, left: 0, position: "absolute", top: 0, width: isStory ? "47%" : "49%" }} />
      <div style={{ backgroundColor: colors.beige, borderRadius: "50%", height: isStory ? 810 : 600, position: "absolute", right: isStory ? -260 : -210, top: isStory ? 320 : 240, width: isStory ? 810 : 600 }} />
      <div style={{ boxSizing: "border-box", display: "grid", gridTemplateColumns: isStory ? "47% 53%" : "49% 51%", height: "100%", padding, position: "relative" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", paddingRight: isStory ? 34 : 24 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: isStory ? 24 : 16, opacity: intro }}>
            <div style={{ fontSize: isStory ? 27 : 20, fontWeight: 800, letterSpacing: isStory ? 3.1 : 2.2, textTransform: "uppercase" }}>{eyebrow}</div>
            <div style={{ fontSize: isStory ? 92 : 66, fontWeight: 800, letterSpacing: -4, lineHeight: 0.91 }}>{headline}</div>
            <div style={{ color: colors.cream, fontSize: isStory ? 32 : 23, fontWeight: 600, lineHeight: 1.18, opacity: 0.92 }}>{supportingText}</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: isStory ? 18 : 12, opacity: detail }}>
            <OfferPill label={offerLabel} size={isStory ? 38 : 28} />
            <div style={{ fontSize: isStory ? 32 : 23, fontWeight: 700, lineHeight: 1.15 }}>{cta}</div>
            <LocationMarker label={locationLine} size={isStory ? 24 : 17} />
          </div>
        </div>
        <div style={{ alignItems: "center", display: "flex", flexDirection: "column", justifyContent: "space-between", paddingLeft: isStory ? 14 : 8 }}>
          <div style={{ alignSelf: "flex-end", opacity: intro }}><LogoOnCreamCard size={isStory ? 66 : 50} /></div>
          <div style={{ alignItems: "center", backgroundColor: isTransparentProduct ? "transparent" : colors.cream, display: "flex", flex: 1, justifyContent: "center", overflow: isTransparentProduct ? "visible" : "hidden", position: "relative", width: "100%" }}>
            <div style={{ border: `${isStory ? 42 : 30}px solid ${colors.lime}`, borderRadius: "50%", height: isStory ? 500 : 370, position: "absolute", right: isStory ? -80 : -58, top: isStory ? 150 : 96, width: isStory ? 500 : 370 }} />
            <div style={{ backgroundColor: colors.beige, borderRadius: "50%", bottom: isStory ? 118 : 88, height: isStory ? 120 : 88, position: "absolute", width: isStory ? 470 : 350 }} />
            <ProductImage imageSrc={imageSrc} style={{ filter: "drop-shadow(0 30px 25px rgba(15, 21, 25, 0.24))", height: isTransparentProduct ? "126%" : "78%", maxWidth: isTransparentProduct ? "132%" : "92%", opacity: product, position: "relative", scale: interpolate(product, [0, 1], [0.9, 1]), translate: `0 ${interpolate(product, [0, 1], [58, 0])}px` }} />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const TypeStage: React.FC<VideoProps & { animated?: boolean }> = ({ eyebrow, headline, supportingText, offerLabel, cta, imageSrc, imageBackground, locationLine, animated = false }) => {
  const { height } = useVideoConfig();
  const isStory = height > 1500;
  const intro = useEntrance(animated, 0);
  const product = useEntrance(animated, 0.7);
  const footer = useEntrance(animated, 1.45);
  const isTransparentProduct = imageBackground === "transparent";

  return (
    <AbsoluteFill style={{ backgroundColor: colors.cream, color: colors.petrol, fontFamily: brandFontFamily, overflow: "hidden" }}>
      <div style={{ backgroundColor: colors.petrol, bottom: 0, height: isStory ? "22%" : "20%", left: 0, position: "absolute", right: 0 }} />
      <div style={{ backgroundColor: colors.lime, borderRadius: "50%", height: isStory ? 280 : 210, left: isStory ? -115 : -80, position: "absolute", top: isStory ? -105 : -82, width: isStory ? 280 : 210 }} />
      <div style={{ boxSizing: "border-box", display: "flex", flexDirection: "column", height: "100%", padding: isStory ? "92px 82px 74px" : "62px 70px 54px", position: "relative" }}>
        <div style={{ alignItems: "flex-start", display: "flex", justifyContent: "space-between", opacity: intro }}>
          <div style={{ display: "flex", flexDirection: "column", gap: isStory ? 18 : 12, maxWidth: "78%" }}>
            <div style={{ fontSize: isStory ? 27 : 21, fontWeight: 800, letterSpacing: isStory ? 3.2 : 2.4, textTransform: "uppercase" }}>{eyebrow}</div>
            <div style={{ fontSize: isStory ? 114 : 84, fontWeight: 800, letterSpacing: -5, lineHeight: 0.88 }}>{headline}</div>
          </div>
          <LogoOnCreamCard size={isStory ? 66 : 50} />
        </div>
        <div style={{ display: "flex", flex: 1, flexDirection: "column", justifyContent: "center", minHeight: isStory ? 890 : 560, position: "relative" }}>
          <div style={{ fontSize: isStory ? 36 : 26, fontWeight: 600, lineHeight: 1.18, maxWidth: "58%", opacity: intro }}>{supportingText}</div>
          <div style={{ alignItems: "center", backgroundColor: isTransparentProduct ? "transparent" : colors.beige, bottom: isStory ? 8 : 0, display: "flex", height: isStory ? "67%" : "63%", justifyContent: "center", overflow: isTransparentProduct ? "visible" : "hidden", position: "absolute", right: 0, width: isStory ? "68%" : "64%" }}>
            <div style={{ backgroundColor: colors.cream, borderRadius: "50%", bottom: isStory ? -60 : -48, height: isStory ? 210 : 160, position: "absolute", width: isStory ? 540 : 400 }} />
            <ProductImage imageSrc={imageSrc} style={{ filter: "drop-shadow(0 30px 24px rgba(15, 21, 25, 0.22))", height: isTransparentProduct ? "142%" : "82%", maxWidth: isTransparentProduct ? "140%" : "92%", opacity: product, position: "relative", scale: interpolate(product, [0, 1], [0.9, 1]), translate: `0 ${interpolate(product, [0, 1], [62, 0])}px` }} />
          </div>
          <div style={{ alignSelf: "flex-start", marginTop: isStory ? 48 : 34, opacity: footer }}><OfferPill label={offerLabel} size={isStory ? 42 : 31} /></div>
        </div>
        <div style={{ alignItems: "center", color: colors.cream, display: "flex", justifyContent: "space-between", opacity: footer }}>
          <div style={{ fontSize: isStory ? 34 : 25, fontWeight: 700, lineHeight: 1.14, maxWidth: "64%" }}>{cta}</div>
          <LocationMarker label={locationLine} size={isStory ? 23 : 17} textAlign="right" />
        </div>
      </div>
    </AbsoluteFill>
  );
};

const GalleryShelf: React.FC<VideoProps & { animated?: boolean }> = ({ eyebrow, headline, supportingText, offerLabel, cta, imageSrc, imageBackground, locationLine, animated = false }) => {
  const { height } = useVideoConfig();
  const isStory = height > 1500;
  const intro = useEntrance(animated, 0);
  const product = useEntrance(animated, 0.6);
  const details = useEntrance(animated, 1.35);
  const isTransparentProduct = imageBackground === "transparent";
  const padding = isStory ? 82 : 64;

  return (
    <AbsoluteFill style={{ backgroundColor: colors.cream, color: colors.petrol, fontFamily: brandFontFamily, overflow: "hidden" }}>
      <div style={{ backgroundColor: colors.petrol, bottom: 0, position: "absolute", right: 0, top: 0, width: isStory ? "41%" : "42%" }} />
      <div style={{ backgroundColor: colors.beige, borderRadius: "50%", bottom: isStory ? 210 : 150, height: isStory ? 580 : 430, left: isStory ? -260 : -190, position: "absolute", width: isStory ? 580 : 430 }} />
      <div style={{ boxSizing: "border-box", display: "grid", gridTemplateColumns: isStory ? "59% 41%" : "58% 42%", height: "100%", padding, position: "relative" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", paddingRight: isStory ? 28 : 20 }}>
          <div style={{ alignItems: "center", display: "flex", justifyContent: "space-between", opacity: intro }}>
            <div style={{ fontSize: isStory ? 27 : 20, fontWeight: 800, letterSpacing: isStory ? 3.1 : 2.2, textTransform: "uppercase" }}>{eyebrow}</div>
            <LogoOnCreamCard size={isStory ? 56 : 44} />
          </div>
          <div style={{ alignItems: "center", backgroundColor: isTransparentProduct ? "transparent" : colors.beige, display: "flex", flex: 1, justifyContent: "center", margin: isStory ? "58px 0 44px" : "40px 0 32px", overflow: isTransparentProduct ? "visible" : "hidden", position: "relative" }}>
            <div style={{ backgroundColor: colors.beige, bottom: isStory ? "35%" : "31%", height: isStory ? 96 : 72, position: "absolute", width: "76%" }} />
            <ProductImage imageSrc={imageSrc} style={{ filter: "drop-shadow(0 28px 24px rgba(15, 21, 25, 0.25))", height: isTransparentProduct ? "154%" : "82%", maxWidth: isTransparentProduct ? "none" : "90%", opacity: product, position: "relative", scale: interpolate(product, [0, 1], [0.9, 1]), translate: `0 ${interpolate(product, [0, 1], [54, 0])}px`, width: isTransparentProduct ? "126%" : undefined }} />
          </div>
        </div>
        <div style={{ color: colors.cream, display: "flex", flexDirection: "column", justifyContent: "space-between", paddingLeft: isStory ? 28 : 20, paddingTop: isStory ? 142 : 98 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: isStory ? 22 : 15, opacity: intro }}>
            <div style={{ color: colors.lime, fontSize: isStory ? 84 : 62, fontWeight: 800, letterSpacing: -4, lineHeight: 0.91 }}>{headline}</div>
            <div style={{ fontSize: isStory ? 31 : 23, fontWeight: 600, lineHeight: 1.18 }}>{supportingText}</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: isStory ? 18 : 12, opacity: details }}>
            <OfferPill label={offerLabel} size={isStory ? 37 : 27} />
            <div style={{ fontSize: isStory ? 31 : 23, fontWeight: 700, lineHeight: 1.15 }}>{cta}</div>
            <LocationMarker label={locationLine} size={isStory ? 23 : 17} />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

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

const Closing: React.FC<Pick<VideoProps, "offerLabel" | "cta">> = ({ offerLabel, cta }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const opacity = interpolate(frame, [fps * 8.4, fps * 8.9], [0, 1], { easing: easeOut, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ alignItems: "center", backgroundColor: colors.petrol, color: colors.cream, display: "flex", flexDirection: "column", fontFamily: brandFontFamily, gap: 28, inset: 0, justifyContent: "center", opacity, padding: 96, position: "absolute", textAlign: "center", zIndex: 20 }}>
      <LogoOnCreamCard size={118} />
      <div style={{ fontSize: 74, fontWeight: 800, letterSpacing: -3 }}>AU Šeki-Tilia</div>
      <div style={{ color: colors.lime, fontSize: 50, fontWeight: 800 }}>{offerLabel}</div>
      <div style={{ alignItems: "center", display: "flex", fontSize: 38, fontWeight: 600, gap: 14, lineHeight: 1.2 }}><MapPin color={colors.lime} size={42} strokeWidth={2.35} />{cta}</div>
    </AbsoluteFill>
  );
};

export const SekiTiliaPromo: React.FC<VideoProps> = (props) => <AbsoluteFill><MotionTreatmentLayer treatment={props.motionTreatment ?? "staged-reveal"}><Variant {...props} animated /></MotionTreatmentLayer><Closing {...props} /></AbsoluteFill>;
export const SekiTiliaPost: React.FC<VideoProps> = (props) => <Variant {...props} />;

export const MyComposition: React.FC = () => (
  <>
    <Composition id="SekiTiliaPromo" component={SekiTiliaPromo} durationInFrames={360} fps={30} width={1080} height={1920} defaultProps={{ eyebrow: "Novitet u ponudi", headline: "Pažljivo izabrano za vašu rutinu.", supportingText: "Uskoro stižu konkretne informacije i fotografije proizvoda.", offerLabel: "Saznajte više u apoteci", cta: "Posetite najbližu AU Šeki-Tilia apoteku.", locationLine: "AU Šeki-Tilia", designVariant: "product-atelier", motionTreatment: "staged-reveal" }} />
    <Still id="SekiTiliaFeed" component={SekiTiliaPost} width={1080} height={1350} defaultProps={{ eyebrow: "Novitet u ponudi", headline: "Pažljivo izabrano za vašu rutinu.", supportingText: "Uskoro stižu konkretne informacije i fotografije proizvoda.", offerLabel: "Saznajte više u apoteci", cta: "Posetite AU Šeki-Tilia.", locationLine: "AU Šeki-Tilia", designVariant: "product-atelier" }} />
    <Still id="SekiTiliaStory" component={SekiTiliaPost} width={1080} height={1920} defaultProps={{ eyebrow: "Novitet u ponudi", headline: "Pažljivo izabrano za vašu rutinu.", supportingText: "Uskoro stižu konkretne informacije i fotografije proizvoda.", offerLabel: "Saznajte više u apoteci", cta: "Posetite AU Šeki-Tilia.", locationLine: "AU Šeki-Tilia", designVariant: "product-atelier" }} />
  </>
);
