import { describe, expect, it } from "vitest";
import { serializeJsonLd } from "@/app/lib/json-ld";

describe("serializeJsonLd", () => {
  it("cannot close the surrounding script tag", () => {
    const out = serializeJsonLd({ text: "</script><script>alert(1)</script>" });
    expect(out).not.toContain("</script>");
    expect(JSON.parse(out)).toEqual({ text: "</script><script>alert(1)</script>" });
  });
});
