"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { ecosystem } from "@/content/site";
import { cn } from "@/lib/cn";

const glass =
  "rounded-xl border border-white/10 bg-surface-1/80 px-3.5 py-2.5 text-xs shadow-[0_18px_40px_-18px_rgba(0,0,0,0.8)] backdrop-blur-md";

const DROPS = [
  [-70, -90],
  [-46, -120],
  [-20, -140],
  [10, -150],
  [36, -128],
  [62, -104],
  [84, -76],
  [-88, -58],
];

export function DunkScene({ run, still }: { run: boolean; still: boolean }) {
  const d = ecosystem.dunk;
  const [hits, setHits] = useState(still ? 3 : 0);
  const [dunked, setDunked] = useState(still);
  const [ball, setBall] = useState(0);
  const [flash, setFlash] = useState(0);
  const [popup, setPopup] = useState("");
  const hitsRef = useRef(0);
  const busy = useRef(false);
  const lastUser = useRef(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const later = useCallback((fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms));
  }, []);

  const throwBall = useCallback(
    (label: string) => {
      if (busy.current || still) return;
      busy.current = true;
      setBall((k) => k + 1);
      setPopup("");
      later(() => {
        hitsRef.current += 1;
        setHits(hitsRef.current);
        setFlash((f) => f + 1);
        setPopup(label);
        if (hitsRef.current >= 3) {
          setDunked(true);
          later(() => {
            hitsRef.current = 0;
            setHits(0);
            setDunked(false);
            setPopup("");
            busy.current = false;
          }, 4200);
        } else {
          busy.current = false;
        }
      }, 650);
    },
    [later, still],
  );

  // It plays itself until you pick up a ball.
  useEffect(() => {
    if (!run || still) return;
    const t = setInterval(() => {
      if (Date.now() - lastUser.current < 8000) return;
      throwBall(d.evidence[hitsRef.current % d.evidence.length]);
    }, 2300);
    return () => clearInterval(t);
  }, [run, still, throwBall, d.evidence]);

  useEffect(() => {
    const ts = timers.current;
    return () => ts.forEach(clearTimeout);
  }, []);

  const smug = Math.max(0, 100 - hits * 34);
  const line = dunked ? d.down : d.roasts[Math.min(hits, d.roasts.length - 1)];
  const worried = hits >= 2 && !dunked;

  return (
    <div className="relative h-[510px] w-[380px]" style={{ transformStyle: "preserve-3d" }}>
      <div
        className="absolute inset-x-0 top-[34px]"
        style={{ transform: "rotateY(-8deg)", transformStyle: "preserve-3d" }}
      >
        <svg
          viewBox="0 0 360 380"
          className="w-full overflow-visible"
          role="img"
          aria-label="A heckler on a dunk tank seat, waiting to be hit by evidence"
        >
          <defs>
            <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#8f73ff" stopOpacity="0.85" />
              <stop offset="1" stopColor="var(--color-accent)" stopOpacity="0.95" />
            </linearGradient>
            <clipPath id="tankClip">
              <rect x="80" y="236" width="200" height="122" rx="8" />
            </clipPath>
          </defs>

          {/* carnival awning */}
          {Array.from({ length: 8 }, (_, i) => (
            <g key={i}>
              <rect
                x={50 + i * 32.5}
                y="20"
                width="32.5"
                height="36"
                fill={i % 2 ? "#f6f7fa" : "var(--color-accent)"}
              />
              <circle
                cx={66.25 + i * 32.5}
                cy="56"
                r="16.25"
                fill={i % 2 ? "#f6f7fa" : "var(--color-accent)"}
              />
            </g>
          ))}
          <rect x="50" y="14" width="260" height="10" rx="4" fill="var(--color-lime)" />
          <rect x="56" y="72" width="8" height="170" fill="#3b4254" />
          <rect x="296" y="72" width="8" height="170" fill="#3b4254" />

          {/* tank */}
          <rect
            x="76"
            y="232"
            width="208"
            height="130"
            rx="10"
            fill="#0b0d13"
            stroke="rgba(255,255,255,0.18)"
          />

          {/* the heckler */}
          <g
            style={{
              transform: `translate(170px, ${dunked ? 214 + 150 : 214}px)`,
              transition: dunked
                ? "transform 0.75s cubic-bezier(0.5, 0, 0.9, 0.4) 0.25s"
                : "transform 0.6s ease-out",
            }}
          >
            <rect x="-20" y="-8" width="58" height="12" rx="6" fill="#232838" />
            <rect x="34" y="-10" width="12" height="16" rx="4" fill="#0b0d13" />
            <rect x="-20" y="-52" width="40" height="48" rx="9" fill="#2c3243" />
            <path d="M-7 -52 L0 -38 L7 -52Z" fill="#f6f7fa" />
            <path d="M0 -46 L-3 -36 L0 -28 L3 -36Z" fill="var(--color-lime)" />
            <line
              x1="16"
              y1="-38"
              x2="31"
              y2="-58"
              stroke="#efd2b6"
              strokeWidth="7"
              strokeLinecap="round"
            />
            <rect x="28" y="-70" width="7" height="13" rx="3" fill="#9aa0b0" />
            <circle cx="0" cy="-70" r="18" fill="#efd2b6" />
            <path
              d="M-18 -72 Q-18 -92 0 -92 Q18 -92 18 -72 Q10 -82 0 -80 Q-10 -82 -18 -72Z"
              fill="#1b1f2b"
            />
            <circle cx="-6" cy="-70" r={worried || dunked ? 2.8 : 1.8} fill="#1b1f2b" />
            <circle cx="6" cy="-70" r={worried || dunked ? 2.8 : 1.8} fill="#1b1f2b" />
            <line
              x1="-10"
              y1={worried ? -79 : -76}
              x2="-3"
              y2="-76"
              stroke="#1b1f2b"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            <line
              x1="3"
              y1="-76"
              x2="10"
              y2={worried ? -79 : -76}
              stroke="#1b1f2b"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            {worried || dunked ? (
              <path
                d="M-6 -59 Q-3 -62 0 -59 Q3 -56 6 -59"
                fill="none"
                stroke="#1b1f2b"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            ) : (
              <line
                x1="-5"
                y1="-60"
                x2="5"
                y2="-60"
                stroke="#1b1f2b"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            )}
          </g>

          {/* the seat: it drops when the target is hit */}
          <g
            style={{
              transformOrigin: "244px 219px",
              transform: dunked ? "rotate(80deg)" : "rotate(0deg)",
              transition: dunked
                ? "transform 0.45s cubic-bezier(0.5, 0, 1, 0.5) 0.1s"
                : "transform 0.7s ease-out",
            }}
          >
            <rect x="100" y="214" width="144" height="10" rx="3" fill="#4a5266" />
            <rect x="232" y="206" width="14" height="26" rx="3" fill="#3b4254" />
          </g>

          {/* water, drawn in front so the heckler sinks into it */}
          <g clipPath="url(#tankClip)">
            <rect x="80" y="262" width="200" height="100" fill="url(#water)" opacity="0.88" />
            <g className="wave">
              <path
                d="M80 262 q15 -9 30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 V272 H80Z"
                fill="#b9a6ff"
                opacity="0.45"
              />
            </g>
            <g className="wave-slow">
              <path
                d="M70 268 q15 -7 30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 V280 H70Z"
                fill="#ffffff"
                opacity="0.14"
              />
            </g>
          </g>
          <rect
            x="76"
            y="232"
            width="208"
            height="130"
            rx="10"
            fill="none"
            stroke="rgba(255,255,255,0.28)"
          />
          <rect x="88" y="240" width="8" height="112" rx="4" fill="rgba(255,255,255,0.12)" />

          {/* splash */}
          {dunked &&
            !still &&
            DROPS.map(([dx, dy], i) => (
              <circle
                key={i}
                cx="170"
                cy="262"
                r={3 + (i % 3)}
                fill="#b9a6ff"
                className="drop"
                style={{
                  ["--dx" as string]: `${dx}px`,
                  ["--dy" as string]: `${dy}px`,
                  animationDelay: `${0.55 + i * 0.03}s`,
                }}
              />
            ))}

          {/* target */}
          <line x1="304" y1="150" x2="296" y2="150" stroke="#3b4254" strokeWidth="6" />
          <line
            x1="322"
            y1="176"
            x2="322"
            y2="236"
            stroke="#3b4254"
            strokeWidth="4"
            strokeDasharray="4 4"
          />
          <g key={flash} className={flash ? "target-hit" : ""}>
            <circle cx="322" cy="150" r="26" fill="#f6f7fa" />
            <circle cx="322" cy="150" r="20" fill="var(--color-accent)" />
            <circle cx="322" cy="150" r="13" fill="#f6f7fa" />
            <circle cx="322" cy="150" r="6" fill="var(--color-lime)" />
          </g>
        </svg>

        {/* thrown evidence */}
        {ball > 0 && !still && (
          <span
            key={ball}
            aria-hidden
            className="ball bg-lime size-3.5 rounded-full shadow-[0_0_14px_var(--color-lime)]"
          />
        )}

        {/* what you just proved */}
        {popup && !dunked && (
          <span
            key={`${flash}-${popup}`}
            className="text-lime absolute top-[100px] right-[-6px] text-[11px] font-semibold whitespace-nowrap drop-shadow"
            style={{ transform: "translateZ(60px)" }}
          >
            HIT · {popup}
          </span>
        )}
      </div>

      {/* the heckler speaks */}
      <div
        className="absolute top-[-18px] left-[-8px] z-10 max-w-[236px]"
        style={{ transform: "translateZ(90px)" }}
        aria-live="polite"
      >
        <p
          key={line}
          className="rounded-2xl rounded-bl-sm bg-white px-3.5 py-2.5 text-[13px] leading-snug font-medium text-[#111823] shadow-[0_18px_40px_-16px_rgba(0,0,0,0.7)]"
        >
          {line}
        </p>
      </div>

      {/* smugness meter */}
      <div
        className="absolute top-[40px] right-0 sm:right-[-56px]"
        style={{ transform: "translateZ(130px)" }}
      >
        <div className={cn(glass, "float3d w-[150px]")}>
          <p className="label !text-faint !text-[10px]">{d.meter}</p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
            <div
              className="bg-lime h-full rounded-full transition-[width] duration-700 ease-out"
              style={{ width: `${smug}%` }}
            />
          </div>
          <p className="mt-1.5 font-mono text-sm">{smug}%</p>
        </div>
      </div>

      {/* report card */}
      <div
        className="pointer-events-none absolute top-[26%] left-1/2 w-[236px] transition-[opacity,transform] duration-500"
        style={{
          opacity: dunked ? 1 : 0,
          transform: `translateX(-50%) translateZ(150px) rotate(${dunked ? -3 : -10}deg) scale(${dunked ? 1 : 0.85})`,
        }}
      >
        <div className="relative rounded-xl border border-white/15 bg-[#fffdf5] p-4 text-[#111823] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.8)]">
          <p className="font-mono text-[10px] tracking-[0.18em] uppercase">{d.card.title}</p>
          <ul className="mt-2 space-y-1 text-[13px]">
            {d.card.rows.map(([k, v]) => (
              <li
                key={k}
                className="flex justify-between border-b border-dashed border-black/15 pb-1"
              >
                <span>{k}</span>
                <span className="font-semibold">{v}</span>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-[12px] italic">“{d.card.remark}”</p>
          {dunked && (
            <span className="stamp-in border-accent text-accent absolute right-2 bottom-2 rounded border-2 px-2 py-0.5 text-[11px] font-bold tracking-widest">
              {d.card.stamp}
            </span>
          )}
        </div>
      </div>

      {/* ammunition */}
      <div className="absolute inset-x-0 bottom-0">
        <p className="label !text-[10px]">{d.hint}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {d.evidence.map((e) => (
            <button
              key={e}
              type="button"
              disabled={dunked}
              onClick={() => {
                lastUser.current = Date.now();
                throwBall(e);
              }}
              className="bg-surface-1/80 text-text hover:bg-lime rounded-full border border-white/15 px-3 py-1.5 text-[11px] transition-colors hover:text-[#111823] disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-white"
            >
              {e}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
