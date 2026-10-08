"use server";

import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

async function requireAccountId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) redirect("/prihlaseni");
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { accountId: true },
  });
  if (!user?.accountId) redirect("/nastaveni");
  return user.accountId;
}

const UNITS = ["ks", "h", "m", "m2", "km", "paušál"] as const;

const ItemSchema = z.object({
  name: z.string().min(1, "Zadejte název položky"),
  unit: z.enum(UNITS, { message: "Neplatná jednotka" }),
  priceHal: z.coerce.number().int().min(0, "Cena nesmí být záporná"),
  vatRate: z.coerce.number().int().refine((v) => [0, 12, 21].includes(v), "Neplatná sazba DPH"),
});

export async function createItemAction(formData: FormData) {
  const accountId = await requireAccountId();

  const parsed = ItemSchema.safeParse({
    name: formData.get("name"),
    unit: formData.get("unit"),
    priceHal: formData.get("priceHal"),
    vatRate: formData.get("vatRate"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Chyba" } as const;

  // sortOrder = max + 1
  const maxItem = await db.item.findFirst({
    where: { accountId, archived: false },
    orderBy: { sortOrder: "desc" },
    select: { sortOrder: true },
  });

  await db.item.create({
    data: {
      accountId,
      ...parsed.data,
      sortOrder: (maxItem?.sortOrder ?? 0) + 1,
    },
  });

  revalidatePath("/vice/cennik");
  redirect("/vice/cennik");
}

export async function updateItemAction(id: string, formData: FormData) {
  const accountId = await requireAccountId();

  const existing = await db.item.findFirst({ where: { id, accountId } });
  if (!existing) return { error: "Položka nenalezena" } as const;

  const parsed = ItemSchema.safeParse({
    name: formData.get("name"),
    unit: formData.get("unit"),
    priceHal: formData.get("priceHal"),
    vatRate: formData.get("vatRate"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Chyba" } as const;

  await db.item.update({ where: { id }, data: parsed.data });

  revalidatePath("/vice/cennik");
  redirect("/vice/cennik");
}

export async function archiveItemAction(id: string) {
  const accountId = await requireAccountId();
  const existing = await db.item.findFirst({ where: { id, accountId } });
  if (!existing) return { error: "Položka nenalezena" } as const;

  await db.item.update({ where: { id }, data: { archived: true } });
  revalidatePath("/vice/cennik");
}

// ── Seed default pricelist items after onboarding ────────────────────

export { DEFAULT_ITEMS, seedDefaultItems as seedDefaultItemsAction } from "@/lib/seedItems";
