import BottomNav from "@/components/BottomNav";
import cs from "@/texts/cs";

export default function HomePage() {
  return (
    <div className="flex flex-col h-dvh max-w-[390px] mx-auto bg-paper text-ink font-sans">
      {/* Header */}
      <header className="flex items-center justify-between px-4 pt-5 pb-2">
        <div className="flex items-center gap-1 font-display font-extrabold text-[26px] tracking-tight">
          <span>{cs.app.name}</span>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#E8590C" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 12.5l5 5L20 6" />
          </svg>
        </div>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm bg-paid-soft text-paid text-label">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12.5l4.5 4.5L19 7" />
          </svg>
          {cs.home.eetConnected}
        </span>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto px-4 pt-2 flex flex-col gap-6">
        {/* Greeting */}
        <div>
          <p className="text-body text-ink-muted">{cs.home.greeting}</p>
          <h1 className="m-0 font-display text-title">—</h1>
        </div>

        {/* Monthly summary */}
        <section className="bg-surface-2 rounded-lg p-4 flex flex-col gap-3">
          <div className="text-label text-ink-muted">— · {cs.home.monthPaid}</div>
          <div className="font-display text-amount-xl tabular-nums">— Kč</div>
          <div className="flex gap-4 text-label">
            <span className="text-waiting">{cs.home.waiting} — × · — Kč</span>
            <span className="text-overdue">{cs.home.overdue} — ×</span>
          </div>
        </section>

        {/* New invoice button */}
        <a
          href="/faktura/nova"
          className="flex items-center justify-center gap-2.5 h-[64px] rounded-md bg-ink text-on-ink no-underline text-[19px] font-bold"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" aria-hidden="true">
            <path d="M12 5v14M5 12h14" />
          </svg>
          {cs.home.newInvoice}
        </a>

        {/* Recent invoices */}
        <section className="flex flex-col gap-1">
          <h2 className="m-0 mb-1 font-display text-heading">{cs.home.recentInvoices}</h2>
          <div className="flex items-center justify-between min-h-tap-min border-b border-[#E3E5E8]">
            <div>
              <div className="font-semibold">—</div>
              <div className="text-caption text-ink-muted">—</div>
            </div>
            <div className="text-right">
              <div className="font-bold tabular-nums">— Kč</div>
              <div className="text-caption font-semibold text-ink-muted">—</div>
            </div>
          </div>
        </section>
      </main>

      <BottomNav active="/" />
    </div>
  );
}
