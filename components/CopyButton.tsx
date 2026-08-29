"use client";

import { useState } from "react";

export default function CopyButton({ text, label = "Copy summary" }: { text: string; label?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setDone(true);
          setTimeout(() => setDone(false), 1500);
        } catch {
          window.prompt("Copy this text:", text);
        }
      }}
      className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-800 hover:border-brand"
    >
      {done ? "Copied ✓" : label}
    </button>
  );
}
