/**
 * Basic IBAN validation (format check + mod-97 checksum).
 * Czech IBAN format: CZ + 2 check digits + 20 digits = 24 chars.
 */

export function validateIban(raw: string): boolean {
  const iban = raw.replace(/\s/g, "").toUpperCase();

  if (!/^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/.test(iban)) return false;

  // Move first 4 chars to end, replace letters with numbers
  const rearranged = iban.slice(4) + iban.slice(0, 4);
  const numeric = rearranged
    .split("")
    .map((c) => (c >= "A" ? String(c.charCodeAt(0) - 55) : c))
    .join("");

  // Mod 97 check
  let remainder = 0;
  for (const char of numeric) {
    remainder = (remainder * 10 + parseInt(char, 10)) % 97;
  }

  return remainder === 1;
}

/** Format IBAN with spaces every 4 chars for display */
export function formatIban(raw: string): string {
  return raw
    .replace(/\s/g, "")
    .toUpperCase()
    .replace(/(.{4})/g, "$1 ")
    .trim();
}
