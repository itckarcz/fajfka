/**
 * ARES REST API – lookup Czech company by IČO (business ID).
 * Docs: https://ares.gov.cz/ekonomicke-subjekty-v-be/rest/ekonomicke-subjekty/{ico}
 */

export interface AresResult {
  ico: string;
  name: string;
  street: string;
  city: string;
  zip: string;
  dic: string | null;
}

export type AresError =
  | { kind: "not_found" }
  | { kind: "invalid_ico" }
  | { kind: "unavailable" };

export async function lookupIco(
  ico: string
): Promise<AresResult | AresError> {
  const cleaned = ico.replace(/\s/g, "");

  if (!/^\d{8}$/.test(cleaned)) {
    return { kind: "invalid_ico" };
  }

  try {
    const res = await fetch(
      `https://ares.gov.cz/ekonomicke-subjekty-v-be/rest/ekonomicke-subjekty/${cleaned}`,
      {
        headers: { Accept: "application/json" },
        // 5 second timeout
        signal: AbortSignal.timeout(5000),
        next: { revalidate: 0 },
      }
    );

    if (res.status === 404) return { kind: "not_found" };
    if (!res.ok) return { kind: "unavailable" };

    const data = await res.json();

    const address = data.sidlo ?? {};
    const street = [address.nazevUlice, address.cisloDomovni, address.cisloOrientacni]
      .filter(Boolean)
      .join(" ");

    return {
      ico: cleaned,
      name: data.obchodniJmeno ?? data.jmeno ?? "",
      street: street || "",
      city: address.nazevObce ?? "",
      zip: address.psc ? String(address.psc) : "",
      dic: data.dic ?? null,
    };
  } catch (err) {
    if (err instanceof Error && err.name === "TimeoutError") {
      return { kind: "unavailable" };
    }
    return { kind: "unavailable" };
  }
}

export function isAresError(
  result: AresResult | AresError
): result is AresError {
  return "kind" in result;
}
