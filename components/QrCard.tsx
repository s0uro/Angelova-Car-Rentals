import Image from "next/image";
import QRCode from "qrcode";

import { dancingScript } from "@/app/lib/fonts";
import { siteConfig } from "@/app/lib/site-config";

/* Server component: the QR matrix is computed at render time and emitted as an
   inline SVG path, so the card ships no client JS and prints crisply. Error
   correction is "H" (~30% recoverable) so the centre logo can safely cover
   part of the code. */

function qrPathData(value: string): { d: string; size: number } {
  const { modules } = QRCode.create(value, { errorCorrectionLevel: "H" });
  const size = modules.size;
  let d = "";
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (modules.get(row, col)) d += `M${col} ${row}h1v1h-1z`;
    }
  }
  return { d, size };
}

const corner =
  "pointer-events-none absolute h-10 w-10 border-black";

export default function QrCard({
  value = siteConfig.url,
  className = "",
}: {
  /** Text encoded in the QR code. Defaults to the site URL. */
  value?: string;
  className?: string;
}) {
  const { d, size } = qrPathData(value);

  return (
    <div className={`relative inline-block ${className}`}>
      {/* L-shaped viewfinder corners framing the card */}
      <span aria-hidden className={`${corner} -left-3 -top-3 rounded-tl-xl border-l-[6px] border-t-[6px]`} />
      <span aria-hidden className={`${corner} -right-3 -top-3 rounded-tr-xl border-r-[6px] border-t-[6px]`} />
      <span aria-hidden className={`${corner} -bottom-3 -left-3 rounded-bl-xl border-b-[6px] border-l-[6px]`} />
      <span aria-hidden className={`${corner} -bottom-3 -right-3 rounded-br-xl border-b-[6px] border-r-[6px]`} />

      <div className="rounded-[24px] bg-white p-8 shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
        <div className="relative rounded-[16px] border-2 border-black bg-white p-3.5">
          <svg
            viewBox={`0 0 ${size} ${size}`}
            className="block h-52 w-52"
            role="img"
            aria-label={`QR code for ${value}`}
            shapeRendering="crispEdges"
          >
            <path d={d} fill="#000000" />
          </svg>
          {/* Centre logo on a white backing so the code stays scannable */}
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-1">
            <Image
              src="/logo-icon.png"
              alt=""
              width={56}
              height={56}
              className="block"
            />
          </span>
        </div>

        <div className="mt-2 flex justify-center pl-6">
          <span className="relative">
            {/* Curved arrow from beneath the "S" up to the QR box's bottom-left corner */}
            <svg
              aria-hidden="true"
              viewBox="0 0 72 72"
              className="absolute -left-16 -top-9 h-[4.5rem] w-[4.5rem] text-black"
              fill="none"
              stroke="currentColor"
              strokeWidth={3.4}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M66 64C42 68 12 56 13 16" />
              <path d="M5 28 13 12l14 10" />
            </svg>
            <span
              className={`${dancingScript.className} text-4xl font-semibold text-black`}
            >
              Scan me!
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
