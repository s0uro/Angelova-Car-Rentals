"use client";

import { useEffect, useState } from "react";
import styles from "@/components/TypewriterText.module.css";

export default function TypewriterText({
  text,
  className,
  speed = 45,
}: {
  text: string;
  className?: string;
  speed?: number;
}) {
  const [count, setCount] = useState(0);
  const [prevText, setPrevText] = useState(text);
  if (text !== prevText) {
    setPrevText(text);
    setCount(0);
  }

  useEffect(() => {
    const id = setInterval(() => {
      setCount((c) => {
        const next = c + 1;
        if (next >= text.length) clearInterval(id);
        return Math.min(next, text.length);
      });
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);

  return (
    <span className={className} aria-label={text}>
      <span aria-hidden="true">
        {text.slice(0, count)}
        {count < text.length && <span className={styles.caret} />}
      </span>
    </span>
  );
}
