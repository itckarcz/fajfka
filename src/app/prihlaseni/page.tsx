import { signIn } from "@/auth";

const isDev = process.env.NODE_ENV === "development";

export default function PrihlaseniPage() {
  return (
    <div className="flex flex-col min-h-dvh max-w-[390px] mx-auto bg-paper text-ink font-sans">

      {/* ── Hero ──────────────────────────────────────────────── */}
      <div className="flex flex-col items-center px-6 pt-[13vh] pb-8 text-center">

        {/* Logo */}
        <div className="flex items-center gap-1.5 font-display font-extrabold text-[36px] tracking-tight leading-none mb-6">
          <span>Fajfka</span>
          <svg
            width="30" height="30" viewBox="0 0 24 24"
            fill="none" stroke="#E8590C" strokeWidth="3.5"
            strokeLinecap="round" strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M4 12.5l5 5L20 6" />
          </svg>
        </div>

        {/* Value prop */}
        <h1 className="font-display text-[26px] font-extrabold leading-tight m-0">
          Faktura a EET<br />za 30 sekund
        </h1>
        <p className="text-body text-ink-muted mt-2 leading-snug">
          Pro řemeslníky, kteří mají lepší<br />
          věci na práci než papírování.
        </p>
      </div>

      {/* ── Form ──────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col px-6 gap-4">
        <form
          action={async (formData: FormData) => {
            "use server";
            await signIn("resend", formData);
          }}
          className="flex flex-col gap-3"
        >
          <label className="flex flex-col gap-1.5">
            <span className="text-label font-semibold text-ink">Tvůj e-mail</span>
            <input
              name="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              required
              placeholder="vas@email.cz"
              className="w-full h-tap-min rounded-md border border-line bg-paper px-4 text-body text-ink placeholder:text-ink-muted focus:outline-none focus:border-ink"
            />
          </label>

          <button
            type="submit"
            className="w-full h-tap-primary rounded-md bg-ink text-on-ink font-semibold text-body"
          >
            Poslat přihlašovací odkaz
          </button>
        </form>

        <p className="text-caption text-ink-muted text-center">
          Žádné heslo — jeden klik a jsi uvnitř.
        </p>
      </main>

      {/* ── Footer ────────────────────────────────────────────── */}
      <footer className="px-6 pb-6 flex flex-col gap-3">
        <p className="text-caption text-ink-muted text-center">
          Připraveno na EET 2.0 od&nbsp;1.&nbsp;1.&nbsp;2027
        </p>

        {/* Dev-only login section */}
        {isDev && (
          <div className="rounded-xl border border-dashed border-[#D1D5DB] bg-[#F5F6F8] px-4 py-4 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="inline-block text-[10px] font-bold tracking-widest uppercase bg-[#E3E5E8] text-ink-muted rounded px-1.5 py-0.5">
                DEV
              </span>
              <span className="text-caption text-ink-muted">Vývojové prostředí</span>
            </div>
            <div className="flex items-center gap-2 text-caption text-ink-muted">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span className="font-mono text-[13px]">dev@fajfka.test</span>
            </div>
            <a
              href="/api/dev-login"
              className="flex items-center justify-center h-11 rounded-md border border-[#D1D5DB] bg-paper text-label font-semibold text-ink no-underline hover:bg-[#F0F1F3] transition-colors"
            >
              Přihlásit jako testér
            </a>
          </div>
        )}
      </footer>

    </div>
  );
}
