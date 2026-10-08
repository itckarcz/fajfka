import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import ItemEditForm from "./ItemEditForm";

export default async function CenikItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/prihlaseni");

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { accountId: true },
  });
  if (!user?.accountId) redirect("/nastaveni");

  const { id } = await params;

  const item = await db.item.findFirst({
    where: { id, accountId: user.accountId, archived: false },
    select: { id: true, name: true, unit: true, priceHal: true, vatRate: true },
  });
  if (!item) redirect("/vice/cennik");

  return <ItemEditForm item={item} />;
}
