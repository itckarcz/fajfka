"use server";

import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { lookupIco, isAresError } from "@/lib/ares";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

// ── Helpers ──────────────────────────────────────────────────────────

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

// ── Search customers ──────────────────────────────────────────────────

export async function searchCustomersAction(query: string) {
  const accountId = await requireAccountId();
  const q = query.trim();

  if (q === "") {
    return db.customer.findMany({
      where: { accountId },
      orderBy: [{ lastUsedAt: "desc" }, { createdAt: "desc" }],
      take: 50,
    });
  }

  return db.customer.findMany({
    where: {
      accountId,
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { ico: { contains: q } },
        { email: { contains: q, mode: "insensitive" } },
        { phone: { contains: q } },
      ],
    },
    orderBy: [{ lastUsedAt: "desc" }, { createdAt: "desc" }],
    take: 50,
  });
}

// ── Lookup ICO for new company customer ──────────────────────────────

export async function lookupCustomerIcoAction(formData: FormData) {
  await requireAccountId();
  const ico = String(formData.get("ico") ?? "").replace(/\s/g, "");

  const result = await lookupIco(ico);
  if (isAresError(result)) {
    if (result.kind === "invalid_ico") return { error: "IČO musí mít 8 číslic" } as const;
    if (result.kind === "not_found") return { error: "IČO nebylo nalezeno" } as const;
    return { aresUnavailable: true, ico } as const;
  }
  return { data: result } as const;
}

// ── Create customer ───────────────────────────────────────────────────

const PersonSchema = z.object({
  type: z.literal("PERSON"),
  name: z.string().min(1, "Zadejte jméno nebo e-mail"),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  street: z.string().optional(),
  city: z.string().optional(),
  zip: z.string().optional(),
});

const CompanySchema = z.object({
  type: z.literal("COMPANY"),
  name: z.string().min(1, "Zadejte název firmy"),
  ico: z.string().regex(/^\d{8}$/, "IČO musí mít 8 číslic"),
  dic: z.string().optional(),
  vatStatus: z.enum(["PAYER", "NON_PAYER"]).optional(),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  street: z.string().optional(),
  city: z.string().optional(),
  zip: z.string().optional(),
});

export async function createCustomerAction(formData: FormData) {
  const accountId = await requireAccountId();
  const type = formData.get("type") as string;

  if (type === "PERSON") {
    const parsed = PersonSchema.safeParse({
      type: "PERSON",
      name: formData.get("name"),
      email: formData.get("email") ?? "",
      phone: formData.get("phone") ?? "",
      street: formData.get("street") ?? "",
      city: formData.get("city") ?? "",
      zip: formData.get("zip") ?? "",
    });
    if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Chyba" } as const;

    const { name, email, phone, street, city, zip } = parsed.data;
    await db.customer.create({
      data: {
        accountId,
        type: "PERSON",
        name,
        email: email || null,
        phone: phone || null,
        street: street || null,
        city: city || null,
        zip: zip || null,
      },
    });
  } else {
    const parsed = CompanySchema.safeParse({
      type: "COMPANY",
      name: formData.get("name"),
      ico: formData.get("ico"),
      dic: formData.get("dic") ?? "",
      vatStatus: formData.get("vatStatus") ?? "NON_PAYER",
      email: formData.get("email") ?? "",
      phone: formData.get("phone") ?? "",
      street: formData.get("street") ?? "",
      city: formData.get("city") ?? "",
      zip: formData.get("zip") ?? "",
    });
    if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Chyba" } as const;

    const { name, ico, dic, vatStatus, email, phone, street, city, zip } = parsed.data;
    await db.customer.create({
      data: {
        accountId,
        type: "COMPANY",
        name,
        ico,
        dic: dic || null,
        vatStatus: vatStatus ?? "NON_PAYER",
        email: email || null,
        phone: phone || null,
        street: street || null,
        city: city || null,
        zip: zip || null,
      },
    });
  }

  revalidatePath("/zakaznici");
  redirect("/zakaznici");
}

// ── Update customer ───────────────────────────────────────────────────

export async function updateCustomerAction(id: string, formData: FormData) {
  const accountId = await requireAccountId();

  // Verify ownership
  const existing = await db.customer.findFirst({ where: { id, accountId } });
  if (!existing) return { error: "Zákazník nenalezen" } as const;

  await db.customer.update({
    where: { id },
    data: {
      name: String(formData.get("name") ?? existing.name),
      email: (formData.get("email") as string) || null,
      phone: (formData.get("phone") as string) || null,
      street: (formData.get("street") as string) || null,
      city: (formData.get("city") as string) || null,
      zip: (formData.get("zip") as string) || null,
      dic: (formData.get("dic") as string) || null,
      vatStatus:
        existing.type === "COMPANY"
          ? ((formData.get("vatStatus") as "PAYER" | "NON_PAYER") ?? existing.vatStatus ?? "NON_PAYER")
          : undefined,
    },
  });

  revalidatePath("/zakaznici");
  redirect(`/zakaznici/${id}`);
}
