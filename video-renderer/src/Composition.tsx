import { fontFamily, loadFont } from "@remotion/google-fonts/Manrope";
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
};

const colors = {
  petrol: "#1C3B42",
  cream: "#F7F5EC",
  lime: "#B8E100",
  beige: "#B2A69A",
};

loadFont("normal", { weights: ["400", "600", "700", "800"], subsets: ["latin-ext", "cyrillic"] });

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
      {imageSrc ? (
        <Img
          src={imageSrc}
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
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
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
}) => {
  const { height } = useVideoConfig();
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
