import { ImageResponse } from "next/og";

export const alt = "Apollo Dental Sahakarnagar — Expert Dental Care in Bangalore";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "linear-gradient(135deg,#0d5a75 0%,#0d3546 60%,#082230 100%)", color: "white", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", background: "#f47320", borderRadius: 999, padding: "10px 24px", fontSize: 24, fontWeight: 700 }}>The Apollo Hospitals Group</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 84, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2 }}>Apollo Dental</div>
          <div style={{ fontSize: 84, fontWeight: 800, lineHeight: 1.05, color: "#ffa865", letterSpacing: -2 }}>Sahakarnagar</div>
          <div style={{ fontSize: 32, marginTop: 24, color: "#d5eef5" }}>Implants · Root Canal · Braces · Aligners · Cosmetic · Kids Dentistry</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 28, color: "#aedcea" }}>
          <span>Bengaluru – 560092 · Open 7 days</span>
          <span style={{ color: "white", fontWeight: 700 }}>+91 98450 55386</span>
        </div>
      </div>
    ),
    size
  );
}
