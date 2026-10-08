import { db } from "@/lib/db";

export const DEFAULT_ITEMS = [
  { name: "Hodina práce", unit: "h", priceHal: 80000, vatRate: 21, sortOrder: 1 },
  { name: "Výjezd", unit: "ks", priceHal: 50000, vatRate: 21, sortOrder: 2 },
  { name: "Doprava", unit: "km", priceHal: 700, vatRate: 21, sortOrder: 3 },
  { name: "Materiál", unit: "ks", priceHal: 0, vatRate: 21, sortOrder: 4 },
] as const;

export async function seedDefaultItems(accountId: string) {
  const existing = await db.item.count({ where: { accountId } });
  if (existing > 0) return;
  await db.item.createMany({
    data: DEFAULT_ITEMS.map((item) => ({ ...item, accountId })),
  });
}
