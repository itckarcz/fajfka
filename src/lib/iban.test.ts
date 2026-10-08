import { describe, expect, it } from "vitest";
import { validateIban, formatIban } from "./iban";

describe("validateIban", () => {
  it("validates correct Czech IBANs", () => {
    expect(validateIban("CZ6508000000192000145399")).toBe(true);
    expect(validateIban("CZ65 0800 0000 1920 0014 5399")).toBe(true); // with spaces
    expect(validateIban("cz6508000000192000145399")).toBe(true); // lowercase
  });

  it("rejects invalid IBANs", () => {
    expect(validateIban("CZ6508000000192000145300")).toBe(false); // wrong checksum
    expect(validateIban("CZ123")).toBe(false); // too short
    expect(validateIban("")).toBe(false);
    expect(validateIban("12345678901234567890")).toBe(false); // no country code
  });

  it("validates German IBAN (international)", () => {
    expect(validateIban("DE89370400440532013000")).toBe(true);
  });
});

describe("formatIban", () => {
  it("formats IBAN with spaces every 4 chars", () => {
    expect(formatIban("CZ6508000000192000145399")).toBe("CZ65 0800 0000 1920 0014 5399");
  });

  it("normalizes to uppercase", () => {
    expect(formatIban("cz6508000000192000145399")).toBe("CZ65 0800 0000 1920 0014 5399");
  });

  it("removes extra spaces before formatting", () => {
    expect(formatIban("CZ65 0800  0000 1920")).toBe("CZ65 0800 0000 1920");
  });
});
