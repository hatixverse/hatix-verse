import { cn } from "@/lib/cn";
export function Section({
  id,
  label,
  className,
  tint,
  children,
}: {
  id?: string;
  label?: string;
  className?: string;
  tint?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      aria-label={label}
      className={cn("section-pad scroll-mt-16", tint && "bg-surface-1", className)}
    >
      <div className="wrap">{children}</div>
    </section>
  );
}
