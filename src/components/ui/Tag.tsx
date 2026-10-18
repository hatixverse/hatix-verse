import { cn } from "@/lib/cn";
export function Tag({
  children,
  tone = "default",
}: {
  children: React.ReactNode;
  tone?: "default" | "accent" | "lime";
}) {
  return (
    <span
      className={cn(
        "label rounded-full border px-2.5 py-1 text-[11px]",
        tone === "accent"
          ? "border-accent/50 text-accent-hi"
          : tone === "lime"
            ? "border-lime/60 text-lime"
            : "border-line",
      )}
    >
      {children}
    </span>
  );
}
