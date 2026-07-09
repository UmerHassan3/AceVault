import "server-only";

import { ImageResponse } from "next/og";

const WIDTH = 1160;
const PADDING = 40;
const IMAGE_ROW_GAP = 20;
const IMAGE_BOX_HEIGHT = 400;
const RED = "#dc2626";

// Bypass ImageKit's account-level auto-optimization (it can silently
// downgrade delivered images to a lossier format) so embedded screenshots
// render at their original quality inside the generated PNG.
function fullQuality(url: string) {
  return `${url}${url.includes("?") ? "&" : "?"}tr=orig-true`;
}

function Row({
  label,
  value,
  width,
}: {
  label: string;
  value: string;
  width: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width,
        padding: "18px 24px",
        backgroundColor: "#18181b",
        borderRadius: 12,
        border: "1px solid #3f1518",
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: 1,
          color: RED,
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 24,
          color: "#fafafa",
          marginTop: 6,
          fontFamily: "monospace",
          wordBreak: "break-all",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function ImageBox({
  label,
  src,
  width,
}: {
  label: string;
  src: string;
  width: number;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width,
        gap: 10,
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: 1,
          color: RED,
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>
      <div
        style={{
          display: "flex",
          width,
          height: IMAGE_BOX_HEIGHT,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#000000",
          borderRadius: 12,
          border: "1px solid #3f1518",
          overflow: "hidden",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={fullQuality(src)}
          alt={label}
          width={width - 2}
          height={IMAGE_BOX_HEIGHT - 2}
          style={{ objectFit: "contain" }}
        />
      </div>
    </div>
  );
}

export async function renderCredentialsImage(params: {
  characterId: string;
  description?: string | null;
  email: string;
  number: string;
  password: string;
  screenshot1Url: string;
  screenshot2Url: string;
  backupCodesUrl?: string | null;
}) {
  const {
    characterId,
    description,
    email,
    number,
    password,
    screenshot1Url,
    screenshot2Url,
    backupCodesUrl,
  } = params;

  const images = [
    { label: "Screenshot 1", src: screenshot1Url },
    { label: "Screenshot 2", src: screenshot2Url },
    ...(backupCodesUrl ? [{ label: "Backup Codes", src: backupCodesUrl }] : []),
  ];
  // Always lay images out on a single row, sizing each box to fit — avoids
  // an unplanned flex-wrap onto a second row that the fixed canvas height
  // below can't account for.
  const availableWidth = WIDTH - PADDING * 2;
  const imageBoxWidth =
    (availableWidth - IMAGE_ROW_GAP * (images.length - 1)) / images.length;

  const height = 830 + (description ? 160 : 0);

  const response = new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          backgroundColor: "#000000",
          padding: PADDING,
          gap: 20,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: 1,
              color: RED,
              textTransform: "uppercase",
            }}
          >
            Full Account Details
          </div>
          <div style={{ display: "flex", fontSize: 34, color: "#fafafa" }}>
            {characterId}
          </div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
          <Row label="Email" value={email} width="calc(50% - 8px)" />
          <Row label="Number" value={number} width="calc(50% - 8px)" />
          <Row label="In-Game Password" value={password} width="100%" />
        </div>

        {description ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              padding: "18px 24px",
              backgroundColor: "#18181b",
              borderRadius: 12,
              border: "1px solid #3f1518",
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: 1,
                color: RED,
                textTransform: "uppercase",
              }}
            >
              Description
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 18,
                color: "#e4e4e7",
                marginTop: 8,
                lineHeight: 1.4,
                whiteSpace: "pre-wrap",
              }}
            >
              {description}
            </div>
          </div>
        ) : null}

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: IMAGE_ROW_GAP,
            marginTop: 8,
          }}
        >
          {images.map((image) => (
            <ImageBox
              key={image.label}
              label={image.label}
              src={image.src}
              width={imageBoxWidth}
            />
          ))}
        </div>
      </div>
    ),
    { width: WIDTH, height }
  );

  return Buffer.from(await response.arrayBuffer());
}
