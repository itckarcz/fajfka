import Link from "next/link";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import cs from "@/texts/cs";
import { formatCzk } from "@/lib/money";
import ArchiveButton from "./ArchiveButton";

export default async function CenikPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/prihlaseni");

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { accountId: true },
  });
  if (!user?.accountId) redirect("/nastaveni");

  const items = await db.item.findMany({
    where: { accountId: user.accountId, archived: false },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="flex flex-col h-dvh max-w-[390px] mx-auto bg-paper text-ink font-sans">
      {/* Header */}
      <header className="px-4 pt-5 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/vice"
            className="flex items-center justify-center w-10 h-10 -ml-2 rounded-md text-ink-muted"
            aria-label="Zpět"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </Link>
          <h1 className="m-0 font-display text-title">{cs.pricelist.title}</h1>
        </div>
        <Link
          href="/vice/cennik/nova"
          className="flex items-center gap-1.5 h-tap-min px-4 rounded-md bg-ink text-on-ink text-label font-semibold no-underline"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Nová
        </Link>
      </header>

      {/* List */}
      <main className="flex-1 overflow-y-auto px-4">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-ink-muted">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M3 9h18M9 21V9" />
            </svg>
            <p className="text-body">{cs.pricelist.empty}</p>
            <Link href="/vice/cennik/nova" className="text-signal-strong text-label font-semibold underline">
              {cs.pricelist.newItem}
            </Link>
          </div>
        ) : (
          <ul className="list-none m-0 p-0">
            {items.map((item) => (
              <li key={item.id}>
                <div className="flex items-center justify-between min-h-tap-min py-3 border-b border-[#E3E5E8]">
                  <Link
                    href={`/vice/cennik/${item.id}`}
                    className="flex-1 min-w-0 no-underline text-ink"
                  >
                    <div className="font-semibold text-body">{item.name}</div>
                    <div className="text-caption text-ink-muted">
                      {formatCzk(item.priceHal)} / {item.unit}
                      {item.vatRate > 0 ? ` · DPH ${item.vatRate} %` : " · bez DPH"}
                    </div>
                  </Link>
                  <ArchiveButton id={item.id} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
