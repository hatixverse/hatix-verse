"use client";
import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { useMotionPref } from "@/components/providers/MotionPreference";

// Masked slide-up reveal, word by word, so lines wrap naturally at any width.
// Visibility is observed on the unclipped root: the translated words sit inside
// overflow-hidden masks, which IntersectionObserver treats as not intersecting.
export function SplitText({
  text,
  delay = 0,
  className,
}: {
  text: string;
  delay?: number;
  className?: string;
}) {
  const { reduced } = useMotionPref();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  return (
    <span ref={ref} className={className} aria-label={text}>
      {text.split(" ").map((w, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden pb-[0.08em] align-bottom">
          <motion.span
            className="inline-block"
            initial={reduced ? false : { y: "110%" }}
            animate={reduced || inView ? { y: 0 } : { y: "110%" }}
            transition={{ duration: 0.6, delay: delay + i * 0.04, ease: [0.22, 1, 0.36, 1] }}
          >
            {w}
            {" "}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
