import Link from "next/link";
import cs from "@/texts/cs";

export default function PridatNaPlochuPage() {
  return (
    <div className="flex flex-col min-h-dvh max-w-[390px] mx-auto bg-paper text-ink font-sans px-4">
      <header className="pt-5 pb-2">
        <div className="flex items-center gap-1 font-display font-extrabold text-[22px] tracking-tight">
          <span>Fajfka</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E8590C" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 12.5l5 5L20 6" />
          </svg>
        </div>
      </header>

      <main className="flex-1 flex flex-col gap-6 pt-6">
        <div>
          <h1 className="font-display text-title m-0 mb-1">{cs.addToHome.title}</h1>
          <p className="text-body text-ink-muted">{cs.addToHome.subtitle}</p>
        </div>

        {/* Steps */}
        <ol className="flex flex-col gap-4">
          <Step number={1}>
            <span>{cs.addToHome.step1} </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm border border-line text-label">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13" />
              </svg>
              Sdílet
            </span>
            <span> {cs.addToHome.step1suffix}</span>
          </Step>
          <Step number={2}>{cs.addToHome.step2}</Step>
          <Step number={3}>{cs.addToHome.step3}</Step>
        </ol>

        {/* Illustration */}
        <div className="bg-surface-2 rounded-lg p-6 flex flex-col items-center gap-3">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#E8590C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="5" y="2" width="14" height="20" rx="2" />
            <path d="M12 18h.01" />
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v9" />
          </svg>
          <p className="text-label text-ink-muted text-center">Pak se Fajfka otevře bez lišty prohlížeče – jako normální appka.</p>
        </div>
      </main>

      <div className="py-6">
        <Link
          href="/"
          className="flex items-center justify-center w-full h-tap-primary rounded-md bg-ink text-on-ink font-semibold text-button no-underline"
        >
          {cs.addToHome.understood}
        </Link>
      </div>
    </div>
  );
}

function Step({ number, children }: { number: number; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3 min-h-tap-min">
      <span className="flex-none w-7 h-7 rounded-full bg-signal text-on-ink font-bold text-label flex items-center justify-center mt-0.5">
        {number}
      </span>
      <span className="text-body flex-1 flex flex-wrap items-center gap-1">{children}</span>
    </li>
  );
}
