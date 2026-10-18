import {
  LETTERS,
  LETTERS_TRANSFORM,
  LOGO_LIME,
  LOGO_PURPLE,
  LOGO_VIEWBOX,
  X_MAIN,
  X_TIP,
} from "@/lib/logoPaths";

// HATIX wordmark. Letters follow the text colour (currentColor); the X is always brand colours.
export function Logo({ className, title = "HATIX" }: { className?: string; title?: string }) {
  return (
    <svg viewBox={LOGO_VIEWBOX} role="img" aria-label={title} className={className}>
      <g fill="currentColor" transform={LETTERS_TRANSFORM}>
        {LETTERS.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
      <g strokeLinejoin="round" strokeWidth="6">
        <path d={X_MAIN} fill={LOGO_PURPLE} stroke={LOGO_PURPLE} />
        <path d={X_TIP} fill={LOGO_LIME} stroke={LOGO_LIME} />
      </g>
    </svg>
  );
}
