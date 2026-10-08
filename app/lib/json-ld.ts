/**
 * JSON for a <script type="application/ld+json"> body. JSON.stringify leaves
 * "<" alone, so a "</script>" anywhere in the data (a review, an FAQ answer,
 * seo.json copy) would end the script tag early; < is the same
 * character to a JSON parser and inert to the HTML parser.
 */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
