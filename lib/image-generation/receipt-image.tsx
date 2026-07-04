import "server-only";

import { ImageResponse } from "next/og";

import { formatMoney } from "@/lib/utils";

function Line({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        width: "100%",
        padding: "16px 0",
        borderBottom: "1px solid #27272a",
      }}
    >
      <div style={{ display: "flex", fontSize: 22, color: "#a1a1aa" }}>
        {label}
      </div>
      <div style={{ display: "flex", fontSize: 22, color: "#fafafa" }}>
        {value}
      </div>
    </div>
  );
}

export async function renderReceiptImage(params: {
  buyerName: string;
  buyerEmail: string;
  buyerNumber: string;
  price: string;
  priceCurrency: "USDT" | "PKR";
  guaranteeDays: number;
  soldAt: Date;
}) {
  const { buyerName, buyerEmail, buyerNumber, price, priceCurrency, guaranteeDays, soldAt } =
    params;

  const response = new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          backgroundColor: "#09090b",
          padding: 48,
        }}
      >
        <div style={{ display: "flex", fontSize: 20, color: "#71717a" }}>
          Sale Receipt
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 36,
            color: "#fafafa",
            marginTop: 6,
            marginBottom: 20,
          }}
        >
          {buyerName}
        </div>

        <Line label="Buyer Email" value={buyerEmail} />
        <Line label="Buyer Number" value={buyerNumber} />
        <Line label="Price" value={formatMoney(price, priceCurrency)} />
        <Line label="Guarantee Days" value={`${guaranteeDays} days`} />
        <Line
          label="Sold At"
          value={soldAt.toLocaleString("en-US", {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        />
      </div>
    ),
    { width: 900, height: 620 }
  );

  return Buffer.from(await response.arrayBuffer());
}
