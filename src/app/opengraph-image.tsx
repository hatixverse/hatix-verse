import { ImageResponse } from "next/og";
import { hero } from "@/content/site";
import {
  LETTERS,
  LETTERS_TRANSFORM,
  LOGO_LIME,
  LOGO_PURPLE,
  LOGO_VIEWBOX,
  X_MAIN,
  X_TIP,
} from "@/lib/logoPaths";

export const alt = "HATIX — AI agency and product company";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: "#07080C",
        color: "#EDEEF2",
      }}
    >
      <svg width="260" height="81" viewBox={LOGO_VIEWBOX}>
        <g fill="#EDEEF2" transform={LETTERS_TRANSFORM}>
          {LETTERS.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>
        <path fill={LOGO_PURPLE} d={X_MAIN} />
        <path fill={LOGO_LIME} d={X_TIP} />
      </svg>
      <div
        style={{
          display: "flex",
          fontSize: 68,
          fontWeight: 700,
          lineHeight: 1.05,
          letterSpacing: -2,
          maxWidth: 1000,
        }}
      >
        {hero.headline}
      </div>
      <div
        style={{ display: "flex", justifyContent: "space-between", fontSize: 26, color: "#8A90A0" }}
      >
        <span>Our products · Build with HATIX Catalyst</span>
        <span style={{ color: "#9A82FF" }}>Start a conversation</span>
      </div>
    </div>,
    size,
  );
}
