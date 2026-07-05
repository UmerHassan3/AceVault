import "server-only";

import { ImageResponse } from "next/og";

import { formatMoney } from "@/lib/utils";

const WIDTH = 1000;
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
        width: 296,
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
          width: 296,
          height: 500,
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
          width={294}
          height={498}
          style={{ objectFit: "contain" }}
        />
      </div>
    </div>
  );
}

export async function renderCredentialsImage(params: {
  characterId: string;
  boughtFrom: string;
  boughtPrice: string;
  boughtCurrency: "USDT" | "PKR";
  guaranteeDays: number;
  email: string;
  number: string;
  password: string;
  screenshot1Url: string;
  screenshot2Url: string;
  backupCodesUrl?: string | null;
}) {
  const {
    characterId,
    boughtFrom,
    boughtPrice,
    boughtCurrency,
    guaranteeDays,
    email,
    number,
    password,
    screenshot1Url,
    screenshot2Url,
    backupCodesUrl,
  } = params;

  const rowWidth = `calc(50% - 8px)`;
  const imageCount = backupCodesUrl ? 3 : 2;
  const height = 700 + (imageCount > 0 ? 560 : 0);

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
          <Row label="Bought From" value={boughtFrom} width={rowWidth} />
          <Row
            label="Bought Price"
            value={formatMoney(boughtPrice, boughtCurrency)}
            width={rowWidth}
          />
          <Row
            label="Guarantee Days"
            value={`${guaranteeDays} days`}
            width={rowWidth}
          />
          <Row label="Email" value={email} width={rowWidth} />
          <Row label="Number" value={number} width={rowWidth} />
          <Row label="In-Game Password" value={password} width={rowWidth} />
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 20, marginTop: 8 }}>
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
