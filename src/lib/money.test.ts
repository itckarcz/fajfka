import { describe, expect, it } from "vitest";
import {
  formatCzk,
  formatAmount,
  parseCzk,
  roundToCrowns,
  cashRounding,
  multiplyHal,
} from "./money";

describe("formatCzk", () => {
  it("formats whole crowns without decimals", () => {
    expect(formatCzk(350000)).toBe("3 500 Kč");
    expect(formatCzk(100)).toBe("1 Kč");
    expect(formatCzk(0)).toBe("0 Kč");
  });

  it("formats haléře with 2 decimal places", () => {
    expect(formatCzk(50)).toBe("0,50 Kč");
    expect(formatCzk(150)).toBe("1,50 Kč");
    expect(formatCzk(1)).toBe("0,01 Kč");
  });

  it("formats large amounts", () => {
    expect(formatCzk(1000000)).toBe("10 000 Kč");
    expect(formatCzk(10000000)).toBe("100 000 Kč");
  });

  it("handles negative values (storno)", () => {
    expect(formatCzk(-350000)).toBe("-3 500 Kč");
  });
});

describe("formatAmount", () => {
  it("formats without currency symbol", () => {
    expect(formatAmount(350000)).toBe("3 500");
    expect(formatAmount(150)).toBe("1,50");
    expect(formatAmount(0)).toBe("0");
  });
});

describe("parseCzk", () => {
  it("parses whole crown amounts", () => {
    expect(parseCzk("35")).toBe(3500);
    expect(parseCzk("3500")).toBe(350000);
  });

  it("parses amounts with spaces (thousands separator)", () => {
    expect(parseCzk("3 500")).toBe(350000);
    expect(parseCzk("10 000")).toBe(1000000);
  });

  it("parses amounts with decimal comma", () => {
    expect(parseCzk("1,50")).toBe(150);
    expect(parseCzk("0,50")).toBe(50);
    expect(parseCzk("3500,99")).toBe(350099);
  });

  it("parses amounts with decimal point", () => {
    expect(parseCzk("1.5")).toBe(150);
    expect(parseCzk("1.50")).toBe(150);
  });

  it("parses with Kč suffix", () => {
    expect(parseCzk("3 500 Kč")).toBe(350000);
    expect(parseCzk("35kč")).toBe(3500);
  });

  it("returns null for invalid input", () => {
    expect(parseCzk("")).toBeNull();
    expect(parseCzk("abc")).toBeNull();
    expect(parseCzk("1.2.3")).toBeNull();
    expect(parseCzk("-5")).toBeNull();
  });

  it("returns null for empty string", () => {
    expect(parseCzk("   ")).toBeNull();
  });
});

describe("roundToCrowns", () => {
  it("rounds to nearest crown (math rounding)", () => {
    expect(roundToCrowns(3750)).toBe(3800); // 37.50 → 38 Kč
    expect(roundToCrowns(3749)).toBe(3700); // 37.49 → 37 Kč
    expect(roundToCrowns(3700)).toBe(3700); // already whole
    expect(roundToCrowns(3735)).toBe(3700); // 37.35 → 37 Kč
    expect(roundToCrowns(350)).toBe(400);   // 3.50 → 4 Kč (half up)
  });

  it("rounds zero correctly", () => {
    expect(roundToCrowns(0)).toBe(0);
  });

  it("rounds negative values (storno)", () => {
    expect(roundToCrowns(-3735)).toBe(-3700);
  });
});

describe("cashRounding", () => {
  it("returns rounding difference", () => {
    expect(cashRounding(3735)).toBe(-35);  // 37.35 → 37.00, diff = -0.35
    expect(cashRounding(3750)).toBe(50);   // 37.50 → 38.00, diff = +0.50
    expect(cashRounding(3700)).toBe(0);    // already whole
  });
});

describe("multiplyHal", () => {
  it("multiplies unit price by whole quantity", () => {
    expect(multiplyHal(50000, 1000)).toBe(50000); // 500 Kč × 1 = 500 Kč
    expect(multiplyHal(50000, 2000)).toBe(100000); // 500 Kč × 2 = 1000 Kč
  });

  it("multiplies by fractional quantity (1.5 hours)", () => {
    expect(multiplyHal(50000, 1500)).toBe(75000); // 500 Kč × 1.5 = 750 Kč
    expect(multiplyHal(50000, 500)).toBe(25000);  // 500 Kč × 0.5 = 250 Kč
  });

  it("handles small unit prices and fractions", () => {
    expect(multiplyHal(100, 1500)).toBe(150); // 1 Kč × 1.5 = 1.50 Kč
  });
});
