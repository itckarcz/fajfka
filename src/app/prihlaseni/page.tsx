import { signIn } from "@/auth";

const isDev = process.env.NODE_ENV === "development";

export default function PrihlaseniPage() {
  return (
    <div className="flex flex-col h-dvh max-w-[390px] mx-auto bg-paper text-ink font-sans select-none">

      {/* ── Brand ─────────────────────────────────────────────── */}
      <div className="flex flex-col items-center justify-center flex-1 px-6 gap-8">

        {/* Logo mark */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-2xl bg-ink flex items-center justify-center shadow-sm">
            <svg
              width="32" height="32" viewBox="0 0 24 24"
              fill="none" stroke="#E8590C" strokeWidth="3"
              strokeLinecap="round" strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M4 12.5l5 5L20 6" />
            </svg>
          </div>
          <span className="font-display font-extrabold text-[28px] tracking-tight leading-none">
            Fajfka
          </span>
        </div>

        {/* Value prop */}
        <div className="text-center">
          <p className="font-display font-bold text-[22px] leading-snug m-0">
            Faktura a EET<br />za 30 sekund
          </p>
          <p className="text-body text-ink-muted mt-2">
            Přihlas se a začni fakturovat.
          </p>
        </div>

        {/* Form */}
        <form
          action={async (formData: FormData) => {
            "use server";
            await signIn("resend", formData);
          }}
          className="w-full flex flex-col gap-3"
        >
          <label className="flex flex-col gap-1.5">
            <span className="text-label font-semibold">E-mail</span>
            <input
              name="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              required
              placeholder="vas@email.cz"
              className="w-full h-tap-min rounded-xl border border-line bg-paper px-4 text-body placeholder:text-ink-muted focus:outline-none focus:border-ink transition-colors"
            />
          </label>

          <button
            type="submit"
            className="w-full h-tap-primary rounded-xl bg-ink text-on-ink font-semibold text-body"
          >
            Poslat přihlašovací odkaz
          </button>

          <p className="text-caption text-ink-muted text-center pt-1">
            Žádné heslo — jeden klik a jsi uvnitř.
          </p>
        </form>

      </div>

      {/* ── Footer ────────────────────────────────────────────── */}
      <div className="px-6 pb-6 flex flex-col gap-3">

        <p className="text-caption text-ink-muted text-center">
          Připraveno na EET&nbsp;2.0 od&nbsp;1.&nbsp;1.&nbsp;2027
        </p>

        {/* Dev-only login */}
        {isDev && (
          <div className="rounded-xl border border-dashed border-[#C8CBD0] bg-[#F5F6F8] p-4 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold tracking-widest uppercase bg-[#E3E5E8] text-ink-muted rounded px-1.5 py-0.5 leading-4">
                DEV
              </span>
              <span className="text-caption text-ink-muted font-mono">dev@fajfka.test</span>
            </div>
            <a
              href="/api/dev-login"
              className="flex items-center justify-center h-11 rounded-lg border border-[#C8CBD0] bg-paper text-label font-semibold text-ink no-underline"
            >
              Přihlásit jako testér
            </a>
          </div>
        )}
      </div>

    </div>
  );
}
