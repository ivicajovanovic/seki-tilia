import { loadFont as loadLocalFont } from "@remotion/fonts";
import React from "react";
import {
  AbsoluteFill,
  Composition,
  Easing,
  Img,
  interpolate,
  staticFile,
  Still,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

type VideoProps = {
  eyebrow: string;
  headline: string;
  supportingText: string;
  offerLabel: string;
  cta: string;
  imageSrc?: string;
  locationLine?: string;
  designVariant?: "standard" | "product-offer";
};

const colors = {
  petrol: "#1C3B42",
  cream: "#F7F5EC",
  lime: "#B8E100",
  beige: "#B2A69A",
};

const fontFamily = "Manrope";
void loadLocalFont({
  display: "block",
  family: fontFamily,
  format: "woff2",
  url: staticFile("assets/manrope-latin-ext.woff2"),
  weight: "200 800",
});

const easeOut = Easing.bezier(0.16, 1, 0.3, 1);

const Reveal: React.FC<React.PropsWithChildren<{ from: number; distance?: number }>> = ({
  children,
  from,
  distance = 34,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = interpolate(frame, [from, from + fps * 0.55], [0, 1], {
    easing: easeOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        opacity: progress,
        translate: `0 ${interpolate(progress, [0, 1], [distance, 0])}px`,
      }}
    >
      {children}
    </div>
  );
};

const ProductVisual: React.FC<{ imageSrc?: string }> = ({ imageSrc }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const resolvedImageSrc = imageSrc?.startsWith("/") ? staticFile(imageSrc.slice(1)) : imageSrc;
  const scale = interpolate(frame, [fps * 2.5, fps * 4], [0.93, 1], {
    easing: easeOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        alignItems: "center",
        backgroundColor: colors.beige,
        borderRadius: 86,
        display: "flex",
        height: 565,
        justifyContent: "center",
        overflow: "hidden",
        position: "relative",
        width: "100%",
      }}
    >
      <div
        style={{
          backgroundColor: colors.lime,
          borderRadius: "50%",
          height: 420,
          opacity: 0.9,
          position: "absolute",
          rotate: "-18deg",
          right: -115,
          top: -120,
          width: 420,
        }}
      />
      {resolvedImageSrc ? (
        <Img
          src={resolvedImageSrc}
          style={{
            height: "86%",
            maxWidth: "82%",
            objectFit: "contain",
            position: "relative",
            scale,
          }}
        />
      ) : (
        <div
          style={{
            alignItems: "center",
            backgroundColor: colors.cream,
            borderRadius: 48,
            color: colors.petrol,
            display: "flex",
            fontSize: 42,
            fontWeight: 700,
            height: 270,
            justifyContent: "center",
            lineHeight: 1.2,
            padding: 36,
            position: "relative",
            scale,
            textAlign: "center",
            width: 340,
          }}
        >
          Fotografija proizvoda
        </div>
      )}
    </div>
  );
};

export const SekiTiliaPromo: React.FC<VideoProps> = ({
  eyebrow,
  headline,
  supportingText,
  offerLabel,
  cta,
  imageSrc,
  locationLine,
  designVariant,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (designVariant === "product-offer") {
    return (
      <SekiTiliaProductOffer
        eyebrow={eyebrow}
        headline={headline}
        supportingText={supportingText}
        offerLabel={offerLabel}
        cta={cta}
        imageSrc={imageSrc}
        locationLine={locationLine}
        animated
      />
    );
  }

  const closingOpacity = interpolate(frame, [fps * 8, fps * 8.5], [0, 1], {
    easing: easeOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const closingScale = interpolate(frame, [fps * 8, fps * 9], [0.96, 1], {
    easing: easeOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.cream,
        color: colors.petrol,
        fontFamily,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          backgroundColor: colors.lime,
          borderRadius: "50%",
          height: 680,
          opacity: 0.42,
          position: "absolute",
          right: -320,
          top: -220,
          width: 680,
        }}
      />
      <div
        style={{
          backgroundColor: colors.petrol,
          borderRadius: "50%",
          bottom: -300,
          height: 560,
          left: -250,
          opacity: 0.08,
          position: "absolute",
          width: 560,
        }}
      />

      <div
        style={{
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "space-between",
          padding: "110px 82px 100px",
          position: "relative",
        }}
      >
        <div style={{ alignItems: "center", display: "flex", justifyContent: "space-between" }}>
          <Reveal from={0} distance={-18}>
            <div
              style={{
                backgroundColor: colors.lime,
                borderRadius: 999,
                fontSize: 30,
                fontWeight: 800,
                letterSpacing: 1.4,
                padding: "16px 24px",
                textTransform: "uppercase",
              }}
            >
              {eyebrow}
            </div>
          </Reveal>
          <Img src={staticFile("assets/logo-mark.svg")} style={{ height: 92, width: 92 }} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 42 }}>
          <Reveal from={fps * 0.4}>
            <div style={{ fontSize: 92, fontWeight: 800, letterSpacing: -4, lineHeight: 1.02 }}>
              {headline}
            </div>
          </Reveal>
          <Reveal from={fps * 1.05}>
            <div style={{ fontSize: 46, fontWeight: 600, lineHeight: 1.26, maxWidth: 850 }}>
              {supportingText}
            </div>
          </Reveal>
        </div>

        <Reveal from={fps * 2.2} distance={50}>
          <ProductVisual imageSrc={imageSrc} />
        </Reveal>

        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <Reveal from={fps * 5.3}>
            <div
              style={{
                alignSelf: "flex-start",
                backgroundColor: colors.petrol,
                borderRadius: 32,
                color: colors.cream,
                fontSize: 46,
                fontWeight: 800,
                lineHeight: 1,
                padding: "26px 34px",
              }}
            >
              {offerLabel}
            </div>
          </Reveal>
          <Reveal from={fps * 5.8}>
            <div style={{ fontSize: 38, fontWeight: 700, lineHeight: 1.2 }}>{cta}</div>
          </Reveal>
        </div>

        <div
          style={{
            alignItems: "center",
            backgroundColor: colors.petrol,
            borderRadius: 42,
            bottom: 100,
            color: colors.cream,
            display: "flex",
            flexDirection: "column",
            gap: 20,
            justifyContent: "center",
            left: 82,
            opacity: closingOpacity,
            padding: "48px 42px",
            position: "absolute",
            right: 82,
            scale: closingScale,
            textAlign: "center",
          }}
        >
          <Img src={staticFile("assets/logo-mark.svg")} style={{ height: 112, width: 112 }} />
          <div style={{ fontSize: 64, fontWeight: 800, letterSpacing: -2 }}>AU Šeki-Tilia</div>
          <div style={{ fontSize: 34, fontWeight: 600 }}>{locationLine ?? "Vaša apoteka od poverenja"}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const SekiTiliaPost: React.FC<VideoProps> = ({
  eyebrow,
  headline,
  supportingText,
  offerLabel,
  cta,
  imageSrc,
  locationLine,
  designVariant,
}) => {
  const { height } = useVideoConfig();

  if (designVariant === "product-offer") {
    return (
      <SekiTiliaProductOffer
        eyebrow={eyebrow}
        headline={headline}
        supportingText={supportingText}
        offerLabel={offerLabel}
        cta={cta}
        imageSrc={imageSrc}
        locationLine={locationLine}
      />
    );
  }

  const isStory = height > 1500;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.cream,
        color: colors.petrol,
        fontFamily,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          backgroundColor: colors.lime,
          borderRadius: "50%",
          height: isStory ? 700 : 530,
          opacity: 0.45,
          position: "absolute",
          right: isStory ? -310 : -220,
          top: isStory ? -300 : -260,
          width: isStory ? 700 : 530,
        }}
      />
      <div
        style={{
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          gap: isStory ? 50 : 36,
          height: "100%",
          padding: isStory ? "105px 82px 90px" : "70px 72px 64px",
          position: "relative",
        }}
      >
        <div style={{ alignItems: "center", display: "flex", justifyContent: "space-between" }}>
          <div
            style={{
              backgroundColor: colors.lime,
              borderRadius: 999,
              fontSize: isStory ? 30 : 24,
              fontWeight: 800,
              letterSpacing: 1.1,
              padding: isStory ? "15px 23px" : "12px 18px",
              textTransform: "uppercase",
            }}
          >
            {eyebrow}
          </div>
          <Img src={staticFile("assets/logo-mark.svg")} style={{ height: isStory ? 92 : 76, width: isStory ? 92 : 76 }} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: isStory ? 28 : 18 }}>
          <div style={{ fontSize: isStory ? 84 : 66, fontWeight: 800, letterSpacing: -3, lineHeight: 1.03 }}>
            {headline}
          </div>
          <div style={{ fontSize: isStory ? 42 : 32, fontWeight: 600, lineHeight: 1.25 }}>{supportingText}</div>
        </div>

        <div style={{ flex: 1, minHeight: isStory ? 420 : 300 }}>
          <ProductVisual imageSrc={imageSrc} />
        </div>

        <div style={{ alignItems: "flex-start", display: "flex", flexDirection: "column", gap: isStory ? 20 : 14 }}>
          <div
            style={{
              backgroundColor: colors.petrol,
              borderRadius: 28,
              color: colors.cream,
              fontSize: isStory ? 40 : 30,
              fontWeight: 800,
              lineHeight: 1,
              padding: isStory ? "22px 28px" : "17px 22px",
            }}
          >
            {offerLabel}
          </div>
          <div style={{ fontSize: isStory ? 36 : 28, fontWeight: 700, lineHeight: 1.22 }}>{cta}</div>
          <div style={{ fontSize: isStory ? 28 : 22, fontWeight: 600, opacity: 0.78 }}>
            {locationLine ?? "AU Šeki-Tilia"}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

function SekiTiliaProductOffer({
  eyebrow,
  headline,
  supportingText,
  offerLabel,
  cta,
  imageSrc,
  locationLine,
  animated = false,
}: VideoProps & { animated?: boolean }) {
  const frame = useCurrentFrame();
  const { fps, height } = useVideoConfig();
  const isStory = height > 1500;
  const resolvedImageSrc = imageSrc?.startsWith("/") ? staticFile(imageSrc.slice(1)) : imageSrc;
  const textProgress = animated
    ? interpolate(frame, [0, fps * 0.55], [0, 1], {
        easing: easeOut,
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;
  const productProgress = animated
    ? interpolate(frame, [fps * 0.8, fps * 1.65], [0, 1], {
        easing: easeOut,
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;
  const footerProgress = animated
    ? interpolate(frame, [fps * 2.05, fps * 2.6], [0, 1], {
        easing: easeOut,
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;
  const closingOpacity = animated
    ? interpolate(frame, [fps * 8.4, fps * 8.9], [0, 1], {
        easing: easeOut,
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.cream,
        color: colors.petrol,
        fontFamily,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          backgroundColor: colors.petrol,
          borderRadius: isStory ? "96px 96px 0 0" : "72px 72px 0 0",
          bottom: 0,
          height: isStory ? "41%" : "37%",
          left: 0,
          position: "absolute",
          right: 0,
        }}
      />
      <div
        style={{
          backgroundColor: colors.lime,
          borderRadius: "50%",
          height: isStory ? 450 : 330,
          opacity: 0.9,
          position: "absolute",
          right: isStory ? -160 : -120,
          top: isStory ? -180 : -150,
          width: isStory ? 450 : 330,
        }}
      />
      <div
        style={{
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          gap: isStory ? 32 : 22,
          height: "100%",
          padding: isStory ? "94px 82px 82px" : "60px 72px 58px",
          position: "relative",
        }}
      >
        <div style={{ alignItems: "center", display: "flex", justifyContent: "space-between", opacity: textProgress }}>
          <div
            style={{
              color: colors.petrol,
              fontSize: isStory ? 30 : 23,
              fontWeight: 800,
              letterSpacing: isStory ? 3.4 : 2.6,
              textTransform: "uppercase",
            }}
          >
            {eyebrow}
          </div>
          <Img src={staticFile("assets/logo-mark.svg")} style={{ height: isStory ? 82 : 64, width: isStory ? 82 : 64 }} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: isStory ? 20 : 12, opacity: textProgress }}>
          <div style={{ fontSize: isStory ? 104 : 76, fontWeight: 800, letterSpacing: -4, lineHeight: 0.98 }}>
            {headline}
          </div>
          <div style={{ fontSize: isStory ? 40 : 30, fontWeight: 600, lineHeight: 1.22, maxWidth: "88%" }}>
            {supportingText}
          </div>
        </div>

        <div
          style={{
            alignItems: "center",
            backgroundColor: colors.beige,
            borderRadius: isStory ? 74 : 56,
            display: "flex",
            flex: 1,
            justifyContent: "center",
            minHeight: isStory ? 640 : 385,
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div
            style={{
              backgroundColor: colors.lime,
              borderRadius: "50%",
              height: isStory ? 460 : 350,
              position: "absolute",
              right: isStory ? -135 : -110,
              top: isStory ? -120 : -95,
              width: isStory ? 460 : 350,
            }}
          />
          {resolvedImageSrc ? (
            <Img
              src={resolvedImageSrc}
              style={{
                filter: "drop-shadow(0 26px 22px rgba(15, 21, 25, 0.20))",
                height: "93%",
                maxWidth: "88%",
                objectFit: "contain",
                opacity: productProgress,
                position: "relative",
                scale: interpolate(productProgress, [0, 1], [0.9, 1]),
                translate: `0 ${interpolate(productProgress, [0, 1], [48, 0])}px`,
              }}
            />
          ) : null}
        </div>

        <div
          style={{
            alignItems: "flex-start",
            color: colors.cream,
            display: "flex",
            flexDirection: "column",
            gap: isStory ? 18 : 12,
            opacity: footerProgress,
            padding: isStory ? "8px 8px 0" : "3px 6px 0",
          }}
        >
          <div
            style={{
              backgroundColor: colors.lime,
              borderRadius: 999,
              color: colors.petrol,
              fontSize: isStory ? 42 : 31,
              fontWeight: 800,
              letterSpacing: -1.2,
              lineHeight: 1,
              padding: isStory ? "22px 30px" : "16px 23px",
            }}
          >
            {offerLabel}
          </div>
          <div style={{ fontSize: isStory ? 36 : 27, fontWeight: 700, lineHeight: 1.18 }}>{cta}</div>
          <div style={{ fontSize: isStory ? 27 : 20, fontWeight: 600, opacity: 0.76 }}>{locationLine ?? "AU Šeki-Tilia"}</div>
        </div>
      </div>

      {animated ? (
        <div
          style={{
            alignItems: "center",
            backgroundColor: colors.petrol,
            color: colors.cream,
            display: "flex",
            flexDirection: "column",
            gap: 28,
            inset: 0,
            justifyContent: "center",
            opacity: closingOpacity,
            padding: 96,
            position: "absolute",
            textAlign: "center",
          }}
        >
          <Img src={staticFile("assets/logo-mark.svg")} style={{ height: 122, width: 122 }} />
          <div style={{ fontSize: 74, fontWeight: 800, letterSpacing: -3 }}>AU Šeki-Tilia</div>
          <div style={{ color: colors.lime, fontSize: 50, fontWeight: 800 }}>{offerLabel}</div>
          <div style={{ fontSize: 38, fontWeight: 600, lineHeight: 1.2 }}>{cta}</div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
}

export const MyComposition: React.FC = () => {
  return (
    <>
      <Composition
        id="SekiTiliaPromo"
        component={SekiTiliaPromo}
        durationInFrames={360}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          eyebrow: "Novitet u ponudi",
          headline: "Vaša dnevna rutina, uz pažljivo odabrane proizvode.",
          supportingText: "Uskoro stižu konkretne informacije i fotografije proizvoda.",
          offerLabel: "Saznajte više u apoteci",
          cta: "Posetite najbližu AU Šeki-Tilia apoteku.",
          locationLine: "Vaša apoteka od poverenja",
        }}
      />
      <Still
        id="SekiTiliaFeed"
        component={SekiTiliaPost}
        width={1080}
        height={1350}
        defaultProps={{
          eyebrow: "Novitet u ponudi",
          headline: "Pažljivo izabrano za vašu rutinu.",
          supportingText: "Uskoro stižu konkretne informacije i fotografije proizvoda.",
          offerLabel: "Saznajte više u apoteci",
          cta: "Posetite AU Šeki-Tilia.",
          locationLine: "Vaša apoteka od poverenja",
        }}
      />
      <Still
        id="SekiTiliaStory"
        component={SekiTiliaPost}
        width={1080}
        height={1920}
        defaultProps={{
          eyebrow: "Novitet u ponudi",
          headline: "Pažljivo izabrano za vašu rutinu.",
          supportingText: "Uskoro stižu konkretne informacije i fotografije proizvoda.",
          offerLabel: "Saznajte više u apoteci",
          cta: "Posetite AU Šeki-Tilia.",
          locationLine: "Vaša apoteka od poverenja",
        }}
      />
    </>
  );
};
