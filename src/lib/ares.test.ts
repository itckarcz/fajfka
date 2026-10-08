import { describe, expect, it } from "vitest";
import { isAresError, lookupIco } from "./ares";

describe("lookupIco – validation", () => {
  it("returns invalid_ico for non-8-digit input", async () => {
    expect(await lookupIco("123")).toEqual({ kind: "invalid_ico" });
    expect(await lookupIco("1234567a")).toEqual({ kind: "invalid_ico" });
    expect(await lookupIco("")).toEqual({ kind: "invalid_ico" });
    expect(await lookupIco("123456789")).toEqual({ kind: "invalid_ico" }); // 9 digits
  });

  it("strips spaces before validating", async () => {
    // "12 345678" → "12345678" – still 8 digits → should attempt lookup (not invalid_ico)
    const result = await lookupIco("12 345 678");
    // Either unavailable (network) or not_found, but NOT invalid_ico
    expect((result as { kind: string }).kind).not.toBe("invalid_ico");
  });
});

describe("isAresError", () => {
  it("identifies error objects", () => {
    expect(isAresError({ kind: "not_found" })).toBe(true);
    expect(isAresError({ kind: "unavailable" })).toBe(true);
    expect(isAresError({ kind: "invalid_ico" })).toBe(true);
  });

  it("identifies success objects", () => {
    expect(
      isAresError({ ico: "12345678", name: "Test", street: "", city: "", zip: "", dic: null })
    ).toBe(false);
  });
});
