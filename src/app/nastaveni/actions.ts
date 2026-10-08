"use server";

import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { lookupIco, isAresError } from "@/lib/ares";
import { validateIban } from "@/lib/iban";
import { redirect } from "next/navigation";
import { seedDefaultItemsAction } from "@/app/vice/cennik/actions";

// --- Step 1: ICO lookup ---

const IcoSchema = z.object({
  ico: z.string().regex(/^\d{8}$/, "IČO musí mít 8 číslic"),
});

export async function lookupIcoAction(formData: FormData) {
  const parsed = IcoSchema.safeParse({ ico: formData.get("ico") });
  if (!parsed.success) {
    return { error: "IČO musí mít 8 číslic" } as const;
  }

  const result = await lookupIco(parsed.data.ico);

  if (isAresError(result)) {
    if (result.kind === "not_found") {
      return { error: "IČO nebylo nalezeno v ARESu" } as const;
    }
    // ARES unavailable – return empty so user can fill manually
    return {
      aresUnavailable: true,
      ico: parsed.data.ico,
    } as const;
  }

  return { data: result } as const;
}

// --- Step 2: Save company info + VAT status ---

const Step1Schema = z.object({
  ico: z.string().min(1),
  name: z.string().min(1, "Zadejte název"),
  street: z.string().optional(),
  city: z.string().optional(),
  zip: z.string().optional(),
  dic: z.string().optional(),
  vatStatus: z.enum(["PAYER", "NON_PAYER"]),
});

export async function saveStep1Action(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) redirect("/prihlaseni");

  const parsed = Step1Schema.safeParse({
    ico: formData.get("ico"),
    name: formData.get("name"),
    street: formData.get("street") ?? "",
    city: formData.get("city") ?? "",
    zip: formData.get("zip") ?? "",
    dic: formData.get("dic") ?? "",
    vatStatus: formData.get("vatStatus"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Chyba validace" } as const;
  }

  const { ico, name, street, city, zip, dic, vatStatus } = parsed.data;

  // Upsert Account and link to User
  const account = await db.account.upsert({
    where: { ico },
    update: { name, street, city, zip, dic: dic || null, vatStatus },
    create: { ico, name, street, city, zip, dic: dic || null, vatStatus },
  });

  await db.user.update({
    where: { id: session.user.id },
    data: { accountId: account.id },
  });

  return { ok: true } as const;
}

// --- Step 3: Save IBAN + EET choice ---

const Step3Schema = z.object({
  iban: z.string().optional(),
  eetChoice: z.enum(["later", "off"]),
});

export async function saveStep3Action(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) redirect("/prihlaseni");

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { accountId: true },
  });
  if (!user?.accountId) return { error: "Nejprve dokonči předchozí kroky" } as const;

  const parsed = Step3Schema.safeParse({
    iban: formData.get("iban"),
    eetChoice: formData.get("eetChoice"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Chyba validace" } as const;
  }

  const { iban, eetChoice } = parsed.data;

  // Validate IBAN if provided
  if (iban && iban.trim() !== "") {
    if (!validateIban(iban)) {
      return { error: "IBAN není platný" } as const;
    }
  }

  await db.account.update({
    where: { id: user.accountId },
    data: {
      iban: iban ? iban.replace(/\s/g, "").toUpperCase() : null,
      eetMode: eetChoice === "off" ? "OFF" : "NOT_SET",
    },
  });

  // Seed default pricelist items for new account
  await seedDefaultItemsAction(user.accountId);

  redirect("/");
}
