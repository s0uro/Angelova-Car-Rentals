// Turns what a visitor types in the phone box into one international number.
// Safe to import on client and server.

/** Countries whose national numbers keep their leading 0 after the code. */
const KEEPS_LEADING_ZERO = new Set(["+39"]); // Italy (and San Marino / Vatican)

/**
 * `dialCode` is the selected country ("+44"), `input` what was typed.
 * - "+357 99 123456" or "00357 99 123456" is already international: kept.
 * - "07700 900123" with +44 drops the trunk 0 -> "+447700900123".
 * Spacing and punctuation are left for the schema to strip.
 */
export function composePhone(dialCode: string, input: string): string {
  const typed = input.trim();
  if (!typed) return "";
  if (typed.startsWith("+")) return typed;
  if (typed.startsWith("00")) return `+${typed.slice(2)}`;
  const national = KEEPS_LEADING_ZERO.has(dialCode) ? typed : typed.replace(/^0/, "");
  return `${dialCode}${national}`;
}
