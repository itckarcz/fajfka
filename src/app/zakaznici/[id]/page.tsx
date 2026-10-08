import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import CustomerEditForm from "./CustomerEditForm";

export default async function ZakaznikDetailPage({
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

  const customer = await db.customer.findFirst({
    where: { id, accountId: user.accountId },
    select: {
      id: true,
      type: true,
      name: true,
      ico: true,
      dic: true,
      vatStatus: true,
      email: true,
      phone: true,
      street: true,
      city: true,
      zip: true,
    },
  });
  if (!customer) redirect("/zakaznici");

  return <CustomerEditForm customer={customer} />;
}
