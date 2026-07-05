import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

import { formatMoney } from "@/lib/utils";

const RED = "#dc2626";
const WIDTH = 1040;

let logosPromise: Promise<{ store: string; owner: string }> | null = null;

function loadLogos() {
  if (!logosPromise) {
    logosPromise = Promise.all([
      readFile(path.join(process.cwd(), "public/images/exotic-store-logo.jpeg")),
      readFile(path.join(process.cwd(), "public/images/dino-bhai-logo.jpeg")),
    ]).then(([store, owner]) => ({
      store: `data:image/jpeg;base64,${store.toString("base64")}`,
      owner: `data:image/jpeg;base64,${owner.toString("base64")}`,
    }));
  }
  return logosPromise;
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
      <div style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
        <span style={{ fontSize: 15, fontWeight: 700, color: RED }}>
          {label}:
        </span>
        <span style={{ fontSize: 17, color: "#f4f4f5" }}>{value}</span>
      </div>
      <div style={{ display: "flex", height: 1, background: "#3f1518", marginTop: 10 }} />
    </div>
  );
}

function GuaranteeRow({
  label,
  value,
  highlight,
  big,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  big?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        width: "100%",
        padding: "12px 0",
        borderBottom: "1px solid #2a0a0c",
      }}
    >
      <span style={{ fontSize: 14, fontWeight: 600, color: "#a1a1aa" }}>
        {label}
      </span>
      <span
        style={{
          fontSize: big ? 22 : 16,
          fontWeight: 700,
          color: highlight ? RED : "#fafafa",
        }}
      >
        {value}
      </span>
    </div>
  );
}

function ContactItem({
  initial,
  label,
  value,
}: {
  initial: string;
  label: string;
  value: string;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 0 }}>
      <div
        style={{
          display: "flex",
          flexShrink: 0,
          alignItems: "center",
          justifyContent: "center",
          width: 30,
          height: 30,
          borderRadius: 999,
          border: `1px solid ${RED}`,
          fontSize: 13,
          fontWeight: 700,
          color: RED,
        }}
      >
        {initial}
      </div>
      <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: 1,
            color: RED,
            textTransform: "uppercase",
          }}
        >
          {label}
        </span>
        <span style={{ fontSize: 11, color: "#f4f4f5" }}>{value}</span>
      </div>
    </div>
  );
}

export async function renderReceiptImage(params: {
  invoiceNo: string;
  characterId: string;
  buyerName: string;
  buyerEmail: string;
  buyerNumber: string;
  price: string;
  priceCurrency: "USDT" | "PKR";
  guaranteeDays: number;
  soldAt: Date;
}) {
  const {
    invoiceNo,
    characterId,
    buyerName,
    buyerEmail,
    buyerNumber,
    price,
    priceCurrency,
    guaranteeDays,
    soldAt,
  } = params;

  const logos = await loadLogos();

  const guaranteeEnds = new Date(
    soldAt.getTime() + guaranteeDays * 24 * 60 * 60 * 1000
  );
  const formatDate = (d: Date) =>
    d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

  const response = new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          backgroundColor: "#000000",
          padding: "40px 48px",
        }}
      >
        {/* Logos — each wrapped in a tightly-cropped window so the large
            black padding baked into the source art doesn't force a big gap
            between the two logos. */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <div style={{ display: "flex", width: 320, height: 172, overflow: "hidden" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logos.store}
              alt="Exotic Store"
              width={320}
              height={320}
              style={{ objectFit: "contain", marginTop: -78 }}
            />
          </div>
          <div style={{ display: "flex", width: 240, height: 76, overflow: "hidden", marginTop: 6 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logos.owner}
              alt="By Dino Bhai"
              width={240}
              height={160}
              style={{ objectFit: "contain", marginTop: -40 }}
            />
          </div>
        </div>

        {/* Body */}
        <div style={{ display: "flex", gap: 32, flex: 1 }}>
          <div style={{ display: "flex", flexDirection: "column", flex: 1, gap: 18 }}>
            <Field label="Invoice No" value={invoiceNo} />
            <Field label="Date" value={formatDate(soldAt)} />
            <Field label="Buyer Name" value={buyerName} />
            <Field label="Contact" value={buyerNumber} />
            <Field label="Email" value={buyerEmail} />
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: 340,
              border: `1px solid ${RED}`,
              borderRadius: 8,
              height: "fit-content",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: RED,
                color: "white",
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: 1,
                lineHeight: 1,
                height: 40,
                padding: "0 16px",
                textTransform: "uppercase",
              }}
            >
              Account &amp; Guarantee
            </div>
            <div style={{ display: "flex", flexDirection: "column", padding: "4px 16px 12px" }}>
              <GuaranteeRow label="CHARACTER ID" value={characterId} />
              <GuaranteeRow label="GUARANTEE" value={`${guaranteeDays} Days`} />
              <GuaranteeRow label="START DATE" value={formatDate(soldAt)} />
              <GuaranteeRow label="GUARANTEE ENDS" value={formatDate(guaranteeEnds)} highlight />
              <GuaranteeRow label="PRICE" value={formatMoney(price, priceCurrency)} big />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: "flex", flexDirection: "column", marginTop: 24 }}>
          <div style={{ display: "flex", height: 1, background: "#3f1518", marginBottom: 20 }} />
          <div style={{ display: "flex", flexWrap: "nowrap", gap: 10 }}>
            <ContactItem initial="A" label="Admin" value="Dino Bhai" />
            <ContactItem initial="W" label="WhatsApp" value="+92 322 3105132" />
            <ContactItem initial="@" label="WhatsApp User" value="@dinobhai" />
            <ContactItem initial="E" label="Email" value="dinoxexoticstore@gmail.com" />
            <ContactItem initial="T" label="Telegram" value="@dinobhaii" />
          </div>
        </div>
      </div>
    ),
    { width: WIDTH, height: 880 }
  );

  return Buffer.from(await response.arrayBuffer());
}
