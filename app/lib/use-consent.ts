"use client";

import { useSyncExternalStore } from "react";

export type Consent = "accepted" | "declined" | null;

// Kept in memory only, on purpose: the notice comes back on every page load
// and refresh, on every browser and device, until the visitor chooses again.
// Client-side navigation between pages keeps the choice.
let current: Consent = null;

const listeners = new Set<() => void>();

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

function getSnapshot(): Consent {
  return current;
}

function getServerSnapshot(): Consent {
  return null;
}

/** Current cookie/analytics choice. `null` until the visitor decides. */
export function useConsent(): Consent {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function setConsent(value: "accepted" | "declined") {
  current = value;
  listeners.forEach((l) => l());
}
