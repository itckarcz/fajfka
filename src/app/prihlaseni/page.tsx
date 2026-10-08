import { signIn } from "@/auth";

const isDev = process.env.NODE_ENV === "development";

export default function PrihlaseniPage() {
  return (
    <div className="flex flex-col h-dvh max-w-[390px] mx-auto bg-paper text-ink font-sans">

      {/* ── Top brand block ──────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-end pb-10 px-6">

        {/* Icon */}
        <div className="mb-5 w-20 h-20 rounded-3xl bg-ink flex items-center justify-center">
          <svg
            width="40" height="40" viewBox="0 0 24 24"
            fill="none" stroke="#E8590C"
            strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"
          >
            <path d="M4 12.5l5 5L20 6" />
          </svg>
        </div>

        {/* Brand */}
        <h1 className="font-display font-extrabold text-[40px] tracking-tight leading-none m-0 mb-3">
          Fajfka
        </h1>

        {/* Tagline */}
        <p className="text-[17px] text-ink-muted text-center leading-snug">
          Faktura a EET za&nbsp;30&nbsp;sekund.<br />
          Pro řemeslníky v&nbsp;terénu.
        </p>
      </div>

      {/* ── Form block ───────────────────────────────────────── */}
      <div className="flex flex-col px-6 gap-3 pb-4">
        <form
          action={async (fd: FormData) => {
            "use server";
            await signIn("resend", fd);
          }}
          className="flex flex-col gap-3"
        >
          <div className="relative">
            <input
              name="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              required
              placeholder="Tvůj e-mail"
              className="w-full h-14 rounded-2xl border-2 border-line bg-paper px-5 text-[17px] text-ink placeholder:text-ink-muted focus:outline-none focus:border-ink transition-colors"
            />
          </div>
          <button
            type="submit"
            className="w-full h-14 rounded-2xl bg-ink text-on-ink font-semibold text-[17px]"
          >
            Poslat přihlašovací odkaz
          </button>
        </form>

        <p className="text-[13px] text-ink-muted text-center">
          Žádné heslo — jeden klik a jsi uvnitř.
        </p>
      </div>

      {/* ── Footer ───────────────────────────────────────────── */}
      <div className="px-6 pb-8 flex flex-col gap-3">
        <p className="text-[12px] text-ink-muted text-center">
          Připraveno na EET&nbsp;2.0 od&nbsp;1.&nbsp;1.&nbsp;2027
        </p>

        {isDev && (
          <div className="rounded-2xl border-2 border-dashed border-[#C8CBD0] bg-[#F5F6F8] px-4 py-4 flex flex-col gap-3">
            <p className="text-[11px] font-bold tracking-widest uppercase text-ink-muted text-center">
              Vývojové prostředí
            </p>
            <a
              href="/api/dev-login"
              className="flex items-center justify-center gap-2 h-12 rounded-xl border-2 border-[#C8CBD0] bg-paper text-[15px] font-semibold text-ink no-underline"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              Přihlásit jako testér
            </a>
            <p className="text-[11px] text-ink-muted text-center font-mono">dev@fajfka.test</p>
          </div>
        )}
      </div>

    </div>
  );
}
