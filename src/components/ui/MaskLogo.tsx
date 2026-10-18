// Single-colour logo drawn from a transparent PNG: it takes the surrounding text colour,
// so it is white on dark bands and black on light ones.
export function MaskLogo({
  src,
  ratio,
  label,
  className,
}: {
  src: string;
  ratio: number;
  label: string;
  className?: string;
}) {
  return (
    <span
      role="img"
      aria-label={label}
      className={`inline-block bg-current ${className ?? ""}`}
      style={{
        aspectRatio: ratio,
        WebkitMaskImage: `url(${src})`,
        maskImage: `url(${src})`,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskPosition: "center",
        maskPosition: "center",
      }}
    />
  );
}
