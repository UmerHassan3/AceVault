import "server-only";

import { ImageResponse } from "next/og";

const WIDTH = 900;

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        padding: "20px 28px",
        backgroundColor: "#18181b",
        borderRadius: 12,
      }}
    >
      <div style={{ display: "flex", fontSize: 20, color: "#a1a1aa" }}>
        {label}
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 30,
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

export async function renderCredentialsImage(params: {
  characterId: string;
  email: string;
  password: string;
  backupCodesUrl?: string | null;
}) {
  const { characterId, email, password, backupCodesUrl } = params;
  const height = backupCodesUrl ? 1100 : 460;

  const response = new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          backgroundColor: "#09090b",
          padding: 40,
          gap: 20,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginBottom: 10,
          }}
        >
          <div style={{ display: "flex", fontSize: 22, color: "#71717a" }}>
            Account Credentials
          </div>
          <div style={{ display: "flex", fontSize: 34, color: "#fafafa" }}>
            {characterId}
          </div>
        </div>

        <Row label="Email" value={email} />
        <Row label="In-Game Password" value={password} />

        {backupCodesUrl ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              padding: "20px 28px",
              backgroundColor: "#18181b",
              borderRadius: 12,
            }}
          >
            <div style={{ display: "flex", fontSize: 20, color: "#a1a1aa" }}>
              Backup Codes
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={backupCodesUrl}
              alt="Backup codes"
              width={WIDTH - 136}
              style={{ marginTop: 12, borderRadius: 8 }}
            />
          </div>
        ) : null}
      </div>
    ),
    { width: WIDTH, height }
  );

  return Buffer.from(await response.arrayBuffer());
}
