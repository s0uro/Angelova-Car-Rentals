"use client";

import { useSyncExternalStore } from "react";

const KEY = "angelova.cookie-consent";

export type Consent = "accepted" | "declined" | null;

const listeners = new Set<() => void>();

function subscribe(cb: () => void) {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}

function getSnapshot(): Consent {
  try {
    const v = localStorage.getItem(KEY);
    if (v?.startsWith("accepted")) return "accepted";
    if (v?.startsWith("declined")) return "declined";
    return null;
  } catch {
    return null;
  }
}

function getServerSnapshot(): Consent {
  return null;
}

/** Current cookie/analytics choice. `null` until the visitor decides. */
export function useConsent(): Consent {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function setConsent(value: "accepted" | "declined") {
  try {
    localStorage.setItem(KEY, `${value}:${new Date().toISOString()}`);
  } catch {
    /* storage blocked — the choice just won't persist */
  }
  listeners.forEach((l) => l());
}
