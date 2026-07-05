import "server-only";

import { ImageResponse } from "next/og";

const WIDTH = 1160;
const RED = "#dc2626";

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

function ImageBox({ label, src }: { label: string; src: string }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: 360,
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
          width: 360,
          height: 620,
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
          src={src}
          alt={label}
          width={358}
          height={618}
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

  const height = 1050 + (description ? 160 : 0);

  const response = new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          backgroundColor: "#000000",
          padding: 40,
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
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 20,
            marginTop: 8,
          }}
        >
          <ImageBox label="Screenshot 1" src={screenshot1Url} />
          <ImageBox label="Screenshot 2" src={screenshot2Url} />
          {backupCodesUrl ? (
            <ImageBox label="Backup Codes" src={backupCodesUrl} />
          ) : null}
        </div>
      </div>
    ),
    { width: WIDTH, height }
  );

  return Buffer.from(await response.arrayBuffer());
}
