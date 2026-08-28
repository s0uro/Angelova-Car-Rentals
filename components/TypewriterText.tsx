"use client";

import { useEffect, useState } from "react";
import styles from "@/components/TypewriterText.module.css";

/**
 * Types `text` out after hydration. The full text is in the server HTML (so
 * search engines and the LCP metric see it immediately); the animated layer
 * is purely visual. Skipped entirely with prefers-reduced-motion.
 */
export default function TypewriterText({
  text,
  className,
  speed = 45,
}: {
  text: string;
  className?: string;
  speed?: number;
}) {
  // null = not hydrated yet -> render the full text.
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // First tick starts the animation (count 0 -> shows nothing), then types.
    let c = -1;
    const id = setInterval(() => {
      c += 1;
      setCount(Math.min(c, text.length));
      if (c >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);

  const shown = count === null ? text : text.slice(0, count);
  const typing = count !== null && count < text.length;

  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {shown}
        {typing && <span className={styles.caret} />}
      </span>
    </span>
  );
}
