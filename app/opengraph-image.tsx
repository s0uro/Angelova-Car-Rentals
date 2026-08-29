import { ImageResponse } from "next/og";
import { siteConfig } from "@/app/lib/site-config";
import { fleet } from "@/app/lib/fleet-data";
import { fromPrice } from "@/app/lib/taxi-data";

export const alt = `${siteConfig.name} — car rental & taxi in Paphos`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  const minDaily = Math.min(...fleet.map((c) => c.rates.oneDay).filter((n) => n > 0));
  const airport = fromPrice("pafos-airport");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          background: "#0a0a0a",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex" }}>
          <div
            style={{
              display: "flex",
              background: "#c8a008",
              color: "black",
              padding: "14px 36px",
              fontSize: 40,
              fontWeight: 700,
              transform: "skewX(-20deg)",
            }}
          >
            <span style={{ display: "flex", transform: "skewX(20deg)" }}>{siteConfig.shortName}</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", fontSize: 76, fontWeight: 700, lineHeight: 1.05 }}>
            Car rental &amp; taxi in Paphos
          </div>
          <div style={{ display: "flex", fontSize: 34, color: "#cbd5e1" }}>
            {`Cars from €${minDaily}/day · Airport transfers from €${airport} · English & Russian spoken`}
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 30, color: "#c8a008" }}>
          <span style={{ display: "flex" }}>{siteConfig.phone}</span>
          <span style={{ display: "flex" }}>{siteConfig.hours}</span>
        </div>
      </div>
    ),
    size
  );
}
