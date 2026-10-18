// Abstract line illustrations, drawn with theme tokens so they work on light and dark.
const stroke = "var(--color-line)";
const ink = "var(--color-muted)";
const acc = "var(--color-accent)";

export function ProductArt({ kind }: { kind: "agents" | "network" }) {
  return (
    <svg viewBox="0 0 480 220" role="img" aria-label="" aria-hidden className="h-full w-full">
      <defs>
        <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="1.5" cy="1.5" r="1" fill={stroke} />
        </pattern>
      </defs>
      <rect width="480" height="220" fill="url(#dots)" />
      {kind === "agents" ? (
        <g fill="none" strokeWidth="1.5">
          <rect
            x="60"
            y="40"
            width="190"
            height="44"
            rx="22"
            fill="var(--color-void)"
            stroke={ink}
          />
          <rect x="95" y="62" width="0" height="0" />
          <line x1="86" y1="62" x2="180" y2="62" stroke={ink} strokeLinecap="round" />
          <rect x="230" y="104" width="190" height="44" rx="22" fill={acc} stroke={acc} />
          <line x1="256" y1="126" x2="360" y2="126" stroke="#fff" strokeLinecap="round" />
          <rect
            x="60"
            y="168"
            width="150"
            height="34"
            rx="17"
            fill="var(--color-void)"
            stroke={ink}
          />
          <line x1="84" y1="185" x2="160" y2="185" stroke={ink} strokeLinecap="round" />
          <path d="M250 62h60q30 0 30 30v12" stroke={acc} strokeDasharray="4 5" />
          <path d="M230 126h-40q-30 0-30 30v12" stroke={acc} strokeDasharray="4 5" />
          <circle cx="400" cy="62" r="6" fill="var(--color-spark)" stroke="none" />
        </g>
      ) : (
        <g strokeWidth="1.5">
          {[
            [90, 50],
            [390, 55],
            [75, 170],
            [400, 165],
            [240, 28],
            [240, 195],
          ].map(([x, y], i) => (
            <line key={i} x1="240" y1="110" x2={x} y2={y} stroke={ink} strokeDasharray="3 5" />
          ))}
          {[
            [90, 50],
            [390, 55],
            [75, 170],
            [400, 165],
            [240, 28],
            [240, 195],
          ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="11" fill="var(--color-void)" stroke={ink} />
          ))}
          <circle cx="240" cy="110" r="34" fill="none" stroke={acc} opacity="0.4" />
          <circle cx="240" cy="110" r="22" fill={acc} />
          <circle cx="390" cy="55" r="4" fill="var(--color-spark)" />
        </g>
      )}
    </svg>
  );
}

export function PillarArt({ index }: { index: number }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.5 } as const;
  return (
    <svg viewBox="0 0 120 120" aria-hidden className="text-line size-full">
      {index === 0 && (
        <g {...common}>
          <circle cx="60" cy="60" r="14" />
          {[
            [20, 25],
            [100, 30],
            [25, 98],
            [98, 95],
          ].map(([x, y], i) => (
            <g key={i}>
              <line x1="60" y1="60" x2={x} y2={y} />
              <circle cx={x} cy={y} r="7" />
            </g>
          ))}
        </g>
      )}
      {index === 1 && (
        <g {...common}>
          <path d="M60 14 108 40 60 66 12 40Z" />
          <path d="M12 60 60 86 108 60" />
          <path d="M12 80 60 106 108 80" />
        </g>
      )}
      {index === 2 && (
        <g {...common}>
          <path d="M46 14h28M52 14v32L24 98a8 8 0 0 0 7 12h58a8 8 0 0 0 7-12L68 46V14" />
          <path d="M36 80h48" />
          <circle cx="56" cy="92" r="3" />
          <circle cx="70" cy="86" r="2" />
        </g>
      )}
    </svg>
  );
}
