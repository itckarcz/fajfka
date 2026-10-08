/**
 * Money utilities for Fajfka.
 * Rule: ALL monetary values are stored and passed as integers in haléře (hellers).
 * 1 Kč = 100 haléřů. Never use floats for money.
 */

/** Monetary amount in haléře (Czech hellers). Always an integer. */
export type Halere = number;

/**
 * Format haléře as Czech crowns for display.
 * Examples: 350000 → "3 500 Kč", 50 → "0,50 Kč", 0 → "0 Kč"
 */
export function formatCzk(hal: Halere): string {
  const kc = hal / 100;
  return new Intl.NumberFormat("cs-CZ", {
    style: "currency",
    currency: "CZK",
    minimumFractionDigits: kc === Math.floor(kc) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(kc)
    // Normalize Unicode spaces (NBSP U+00A0, narrow NBSP U+202F) to regular space
    .replace(/[\u00A0\u202F]/g, " ");
}

/**
 * Format haléře as a plain number string (no currency symbol).
 * Examples: 350000 → "3 500", 150 → "1,50"
 */
export function formatAmount(hal: Halere): string {
  const kc = hal / 100;
  return new Intl.NumberFormat("cs-CZ", {
    minimumFractionDigits: kc === Math.floor(kc) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(kc)
    .replace(/[\u00A0\u202F]/g, " ");
}

/**
 * Parse a user-entered string (in Kč, not haléře) into haléře.
 * Accepts Czech decimal comma or point. Ignores spaces and Kč symbol.
 * Returns null if the input is not a valid number.
 * Examples: "35" → 3500, "3 500" → 350000, "1,50" → 150, "1.5" → 150
 */
export function parseCzk(input: string): Halere | null {
  // Remove whitespace, Kč and non-numeric chars except comma/dot
  const cleaned = input.replace(/\s/g, "").replace(/Kč/gi, "").trim();
  if (cleaned === "") return null;

  // Replace Czech decimal comma with dot
  const normalized = cleaned.replace(",", ".");

  // Must be a valid positive number pattern
  if (!/^\d+(\.\d{0,2})?$/.test(normalized)) return null;

  const value = parseFloat(normalized);
  if (isNaN(value) || value < 0) return null;

  // Round to haléře (2 decimal places in Kč)
  return Math.round(value * 100);
}

/**
 * Round haléře amount to whole crowns (for cash payments).
 * Rounding: mathematical (half up).
 * Returns the rounded amount in haléře (always divisible by 100).
 */
export function roundToCrowns(hal: Halere): Halere {
  return Math.round(hal / 100) * 100;
}

/**
 * Calculate the rounding difference for cash payments.
 * Returns a signed haléře amount to add to reach the rounded total.
 * Example: total 3735 hal → rounded 3700 hal → rounding = -35 hal
 */
export function cashRounding(hal: Halere): Halere {
  return roundToCrowns(hal) - hal;
}

/**
 * Safely multiply a haléře unit price by a quantity in thousandths (quantityMilli).
 * quantityMilli: 1 unit = 1000, 0.5 unit = 500, 1.5 unit = 1500
 * Returns haléře, rounded to nearest haléř.
 */
export function multiplyHal(unitPriceHal: Halere, quantityMilli: number): Halere {
  return Math.round((unitPriceHal * quantityMilli) / 1000);
}
