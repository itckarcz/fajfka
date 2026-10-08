import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import OnboardingWizard from "./OnboardingWizard";

export default async function NastaveniPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/prihlaseni");

  // If account already set up, skip onboarding
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { accountId: true },
  });
  if (user?.accountId) redirect("/");

  return <OnboardingWizard />;
}
