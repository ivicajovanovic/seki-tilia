import React from "react";
import { AbsoluteFill, cancelRender, Composition, continueRender, delayRender, Easing, Img, interpolate, staticFile, Still, useCurrentFrame, useVideoConfig } from "remotion";

type DesignVariant = "product-atelier" | "editorial-split" | "minimal-offer" | "product-card";

type VideoProps = {
  eyebrow: string;
  headline: string;
  supportingText: string;
  offerLabel: string;
  cta: string;
  imageSrc?: string;
  locationLine?: string;
  designVariant?: DesignVariant;
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

const LogoOnCreamCard: React.FC<{ size: number }> = ({ size }) => (
  <div
    style={{
      alignItems: "center",
      backgroundColor: colors.cream,
      borderRadius: Math.round(size * 0.28),
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

const ProductAtelier: React.FC<VideoProps & { animated?: boolean }> = ({ eyebrow, headline, supportingText, offerLabel, cta, imageSrc, locationLine, animated = false }) => {
  const { height } = useVideoConfig();
  const isStory = height > 1500;
  const intro = useEntrance(animated, 0);
  const product = useEntrance(animated, 0.7);
  const footer = useEntrance(animated, 1.55);

  return (
    <AbsoluteFill style={{ backgroundColor: colors.cream, color: colors.petrol, fontFamily: brandFontFamily, overflow: "hidden" }}>
      <div style={{ backgroundColor: colors.petrol, borderRadius: isStory ? "96px 96px 0 0" : "72px 72px 0 0", bottom: 0, height: isStory ? "41%" : "37%", left: 0, position: "absolute", right: 0 }} />
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
        <div style={{ alignItems: "center", backgroundColor: colors.beige, borderRadius: isStory ? 74 : 56, display: "flex", flex: 1, justifyContent: "center", minHeight: isStory ? 640 : 385, overflow: "hidden", position: "relative" }}>
          <div style={{ backgroundColor: colors.lime, borderRadius: "50%", height: isStory ? 430 : 330, position: "absolute", right: isStory ? -130 : -110, top: isStory ? -110 : -92, width: isStory ? 430 : 330 }} />
          <ProductImage imageSrc={imageSrc} style={{ filter: "drop-shadow(0 26px 22px rgba(15, 21, 25, 0.20))", height: "92%", maxWidth: "88%", opacity: product, position: "relative", scale: interpolate(product, [0, 1], [0.91, 1]), translate: `0 ${interpolate(product, [0, 1], [44, 0])}px` }} />
        </div>
        <div style={{ color: colors.cream, display: "flex", flexDirection: "column", gap: isStory ? 18 : 12, opacity: footer, padding: isStory ? "8px 8px 0" : "3px 6px 0" }}>
          <OfferPill label={offerLabel} size={isStory ? 42 : 31} />
          <div style={{ fontSize: isStory ? 36 : 27, fontWeight: 700, lineHeight: 1.18 }}>{cta}</div>
          <div style={{ fontSize: isStory ? 27 : 20, fontWeight: 600, opacity: 0.76 }}>{locationLine ?? "AU Šeki-Tilia"}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const EditorialSplit: React.FC<VideoProps & { animated?: boolean }> = ({ eyebrow, headline, supportingText, offerLabel, cta, imageSrc, locationLine, animated = false }) => {
  const { height } = useVideoConfig();
  const isStory = height > 1500;
  const intro = useEntrance(animated, 0);
  const product = useEntrance(animated, 0.75);
  const offer = useEntrance(animated, 1.6);
  const padding = isStory ? 78 : 60;
  return (
    <AbsoluteFill style={{ backgroundColor: colors.petrol, color: colors.petrol, fontFamily: brandFontFamily, overflow: "hidden" }}>
      <div style={{ backgroundColor: colors.lime, borderRadius: "50%", bottom: isStory ? -240 : -180, height: isStory ? 520 : 410, position: "absolute", right: isStory ? -180 : -130, width: isStory ? 520 : 410 }} />
      <div style={{ backgroundColor: colors.cream, borderBottomRightRadius: isStory ? 160 : 118, borderTopRightRadius: isStory ? 160 : 118, bottom: 0, left: 0, position: "absolute", top: 0, width: "57%" }} />
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
            <div style={{ fontSize: isStory ? 23 : 17, fontWeight: 600, opacity: 0.72 }}>{locationLine ?? "AU Šeki-Tilia"}</div>
          </div>
        </div>
        <div style={{ alignItems: "center", display: "flex", justifyContent: "center", overflow: "hidden", paddingLeft: isStory ? 10 : 6 }}>
          <div style={{ alignItems: "center", backgroundColor: colors.beige, borderRadius: isStory ? "160px 0 160px 160px" : "118px 0 118px 118px", display: "flex", height: "78%", justifyContent: "center", overflow: "hidden", position: "relative", width: "100%" }}>
            <div style={{ backgroundColor: colors.cream, borderRadius: "50%", height: isStory ? 300 : 220, left: isStory ? -125 : -90, opacity: 0.65, position: "absolute", top: isStory ? -95 : -70, width: isStory ? 300 : 220 }} />
            <ProductImage imageSrc={imageSrc} style={{ filter: "drop-shadow(0 26px 22px rgba(15, 21, 25, 0.22))", maxHeight: "74%", maxWidth: "92%", opacity: product, position: "relative", scale: interpolate(product, [0, 1], [0.9, 1]), translate: `0 ${interpolate(product, [0, 1], [54, 0])}px`, width: "92%" }} />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const MinimalOffer: React.FC<VideoProps & { animated?: boolean }> = ({ eyebrow, headline, supportingText, offerLabel, cta, imageSrc, locationLine, animated = false }) => {
  const { height } = useVideoConfig();
  const isStory = height > 1500;
  const intro = useEntrance(animated, 0);
  const product = useEntrance(animated, 0.65);
  const footer = useEntrance(animated, 1.45);
  return (
    <AbsoluteFill style={{ backgroundColor: colors.cream, color: colors.petrol, fontFamily: brandFontFamily, overflow: "hidden" }}>
      <div style={{ backgroundColor: colors.lime, height: isStory ? 42 : 32, left: 0, position: "absolute", right: 0, top: 0 }} />
      <div style={{ backgroundColor: colors.petrol, borderRadius: isStory ? "88px 88px 0 0" : "66px 66px 0 0", bottom: 0, height: isStory ? "29%" : "25%", left: 0, position: "absolute", right: 0 }} />
      <div style={{ boxSizing: "border-box", display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between", padding: isStory ? "102px 82px 72px" : "72px 72px 54px", position: "relative" }}>
        <div style={{ alignItems: "flex-start", display: "flex", justifyContent: "space-between", opacity: intro }}>
          <div style={{ display: "flex", flexDirection: "column", gap: isStory ? 24 : 16, maxWidth: "68%" }}>
            <div style={{ fontSize: isStory ? 28 : 22, fontWeight: 800, letterSpacing: isStory ? 3 : 2.3, textTransform: "uppercase" }}>{eyebrow}</div>
            <div style={{ fontSize: isStory ? 110 : 82, fontWeight: 800, letterSpacing: -5, lineHeight: 0.9 }}>{headline}</div>
          </div>
          <LogoOnCreamCard size={isStory ? 68 : 52} />
        </div>
        <div style={{ alignItems: "center", display: "flex", gap: isStory ? 34 : 24, justifyContent: "space-between" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: isStory ? 24 : 16, maxWidth: "48%", opacity: footer }}>
            <OfferPill label={offerLabel} size={isStory ? 44 : 32} />
            <div style={{ fontSize: isStory ? 34 : 25, fontWeight: 600, lineHeight: 1.17 }}>{supportingText}</div>
          </div>
          <div style={{ alignItems: "center", backgroundColor: colors.beige, borderRadius: isStory ? 88 : 64, display: "flex", height: isStory ? 580 : 390, justifyContent: "center", overflow: "hidden", position: "relative", width: "48%" }}>
            <div style={{ backgroundColor: colors.lime, borderRadius: "50%", bottom: -70, height: isStory ? 260 : 190, position: "absolute", right: -80, width: isStory ? 260 : 190 }} />
            <ProductImage imageSrc={imageSrc} style={{ filter: "drop-shadow(0 20px 18px rgba(15, 21, 25, 0.20))", height: "78%", maxWidth: "150%", opacity: product, position: "relative", scale: interpolate(product, [0, 1], [0.9, 1]) }} />
          </div>
        </div>
        <div style={{ alignItems: "flex-start", color: colors.cream, display: "flex", flexDirection: "column", gap: isStory ? 14 : 9, opacity: footer }}>
          <div style={{ fontSize: isStory ? 36 : 27, fontWeight: 700, lineHeight: 1.16 }}>{cta}</div>
          <div style={{ fontSize: isStory ? 25 : 19, fontWeight: 600, opacity: 0.76 }}>{locationLine ?? "AU Šeki-Tilia"}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const ProductCard: React.FC<VideoProps & { animated?: boolean }> = ({ eyebrow, headline, supportingText, offerLabel, cta, imageSrc, locationLine, animated = false }) => {
  const { height } = useVideoConfig();
  const isStory = height > 1500;
  const intro = useEntrance(animated, 0);
  const product = useEntrance(animated, 0.75);
  const footer = useEntrance(animated, 1.55);
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
        <div style={{ alignItems: "center", backgroundColor: colors.cream, borderRadius: isStory ? 86 : 62, display: "flex", flex: 1, justifyContent: "center", margin: isStory ? "54px 0 42px" : "36px 0 28px", minHeight: isStory ? 620 : 390, overflow: "hidden", position: "relative" }}>
          <div style={{ backgroundColor: colors.lime, height: isStory ? 54 : 40, left: 0, position: "absolute", right: 0, top: 0 }} />
          <div style={{ border: `${isStory ? 3 : 2}px solid ${colors.beige}`, borderRadius: isStory ? 70 : 52, height: "78%", position: "absolute", width: "76%" }} />
          <ProductImage imageSrc={imageSrc} style={{ filter: "drop-shadow(0 26px 22px rgba(15, 21, 25, 0.22))", height: "80%", maxWidth: "86%", opacity: product, position: "relative", scale: interpolate(product, [0, 1], [0.9, 1]), translate: `0 ${interpolate(product, [0, 1], [52, 0])}px` }} />
        </div>
        <div style={{ alignItems: "center", display: "flex", gap: isStory ? 30 : 22, justifyContent: "space-between", opacity: footer }}>
          <OfferPill label={offerLabel} size={isStory ? 40 : 30} />
          <div style={{ display: "flex", flexDirection: "column", gap: 6, maxWidth: "48%", textAlign: "right" }}>
            <div style={{ fontSize: isStory ? 31 : 23, fontWeight: 700, lineHeight: 1.14 }}>{cta}</div>
            <div style={{ fontSize: isStory ? 23 : 17, fontWeight: 600, opacity: 0.74 }}>{locationLine ?? "AU Šeki-Tilia"}</div>
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
    default: return <ProductAtelier {...props} />;
  }
};

const Closing: React.FC<Pick<VideoProps, "offerLabel" | "cta">> = ({ offerLabel, cta }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const opacity = interpolate(frame, [fps * 8.4, fps * 8.9], [0, 1], { easing: easeOut, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ alignItems: "center", backgroundColor: colors.petrol, color: colors.cream, display: "flex", flexDirection: "column", fontFamily: brandFontFamily, gap: 28, inset: 0, justifyContent: "center", opacity, padding: 96, position: "absolute", textAlign: "center" }}>
      <LogoOnCreamCard size={118} />
      <div style={{ fontSize: 74, fontWeight: 800, letterSpacing: -3 }}>AU Šeki-Tilia</div>
      <div style={{ color: colors.lime, fontSize: 50, fontWeight: 800 }}>{offerLabel}</div>
      <div style={{ fontSize: 38, fontWeight: 600, lineHeight: 1.2 }}>{cta}</div>
    </AbsoluteFill>
  );
};

export const SekiTiliaPromo: React.FC<VideoProps> = (props) => <AbsoluteFill><Variant {...props} animated /><Closing {...props} /></AbsoluteFill>;
export const SekiTiliaPost: React.FC<VideoProps> = (props) => <Variant {...props} />;

export const MyComposition: React.FC = () => (
  <>
    <Composition id="SekiTiliaPromo" component={SekiTiliaPromo} durationInFrames={360} fps={30} width={1080} height={1920} defaultProps={{ eyebrow: "Novitet u ponudi", headline: "Pažljivo izabrano za vašu rutinu.", supportingText: "Uskoro stižu konkretne informacije i fotografije proizvoda.", offerLabel: "Saznajte više u apoteci", cta: "Posetite najbližu AU Šeki-Tilia apoteku.", locationLine: "AU Šeki-Tilia", designVariant: "product-atelier" }} />
    <Still id="SekiTiliaFeed" component={SekiTiliaPost} width={1080} height={1350} defaultProps={{ eyebrow: "Novitet u ponudi", headline: "Pažljivo izabrano za vašu rutinu.", supportingText: "Uskoro stižu konkretne informacije i fotografije proizvoda.", offerLabel: "Saznajte više u apoteci", cta: "Posetite AU Šeki-Tilia.", locationLine: "AU Šeki-Tilia", designVariant: "product-atelier" }} />
    <Still id="SekiTiliaStory" component={SekiTiliaPost} width={1080} height={1920} defaultProps={{ eyebrow: "Novitet u ponudi", headline: "Pažljivo izabrano za vašu rutinu.", supportingText: "Uskoro stižu konkretne informacije i fotografije proizvoda.", offerLabel: "Saznajte više u apoteci", cta: "Posetite AU Šeki-Tilia.", locationLine: "AU Šeki-Tilia", designVariant: "product-atelier" }} />
  </>
);
