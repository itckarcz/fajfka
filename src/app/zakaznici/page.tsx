import Link from "next/link";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import BottomNav from "@/components/BottomNav";
import cs from "@/texts/cs";

export default async function ZakazniciPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/prihlaseni");

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { accountId: true },
  });
  if (!user?.accountId) redirect("/nastaveni");

  const { q = "" } = await searchParams;

  const customers = await db.customer.findMany({
    where: {
      accountId: user.accountId,
      ...(q.trim()
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { ico: { contains: q } },
              { email: { contains: q, mode: "insensitive" } },
              { phone: { contains: q } },
            ],
          }
        : {}),
    },
    orderBy: [{ lastUsedAt: "desc" }, { createdAt: "desc" }],
    take: 50,
  });

  return (
    <div className="flex flex-col h-dvh max-w-[390px] mx-auto bg-paper text-ink font-sans">
      <header className="px-4 pt-5 pb-2 flex items-center justify-between">
        <h1 className="m-0 font-display text-title">{cs.customers.title}</h1>
        <Link
          href="/zakaznici/novy"
          className="flex items-center gap-1.5 h-tap-min px-4 rounded-md bg-ink text-on-ink text-label font-semibold no-underline"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Nový
        </Link>
      </header>

      {/* Search */}
      <div className="px-4 pb-3">
        <form method="GET">
          <input
            name="q"
            type="search"
            defaultValue={q}
            placeholder={cs.customers.searchPlaceholder}
            className="w-full h-tap-min rounded-md border border-line bg-paper px-4 text-body text-ink placeholder:text-ink-muted focus:outline-none focus:border-ink"
          />
        </form>
      </div>

      {/* List */}
      <main className="flex-1 overflow-y-auto px-4">
        {customers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-ink-muted">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
              <circle cx="9" cy="8" r="3.5" />
              <path d="M2.5 20c.8-3.5 3.4-5.5 6.5-5.5s5.7 2 6.5 5.5" />
            </svg>
            <p className="text-body">{q ? "Žádný zákazník nebyl nalezen" : cs.customers.empty}</p>
            <Link href="/zakaznici/novy" className="text-signal-strong text-label font-semibold underline">
              {cs.customers.newCustomer}
            </Link>
          </div>
        ) : (
          <ul className="list-none m-0 p-0">
            {customers.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/zakaznici/${c.id}`}
                  className="flex items-center justify-between min-h-tap-min py-3 border-b border-[#E3E5E8] no-underline text-ink"
                >
                  <div>
                    <div className="font-semibold text-body">{c.name}</div>
                    <div className="text-caption text-ink-muted">
                      {c.type === "COMPANY" && c.ico ? `IČO ${c.ico}` : c.email ?? c.phone ?? ""}
                    </div>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>

      <BottomNav active="/zakaznici" />
    </div>
  );
}
