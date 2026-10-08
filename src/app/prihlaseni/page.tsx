import { signIn } from "@/auth";
import cs from "@/texts/cs";

export default function PrihlaseniPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  return (
    <div className="flex flex-col min-h-dvh max-w-[390px] mx-auto bg-paper text-ink font-sans px-4">
      {/* Logo */}
      <header className="flex items-center justify-center pt-16 pb-8">
        <div className="flex items-center gap-1 font-display font-extrabold text-[32px] tracking-tight">
          <span>Fajfka</span>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#E8590C" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 12.5l5 5L20 6" />
          </svg>
        </div>
      </header>

      <main className="flex flex-col gap-6 flex-1">
        <div className="text-center">
          <h1 className="font-display text-title m-0">Faktura a EET za 30 sekund</h1>
          <p className="text-body text-ink-muted mt-2">Zadej svůj e-mail a pošleme ti přihlašovací odkaz.</p>
        </div>

        <form
          action={async (formData: FormData) => {
            "use server";
            await signIn("resend", formData);
          }}
          className="flex flex-col gap-3"
        >
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-label text-ink">
              {cs.invoicePayment.emailLabel}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="vas@email.cz"
              className="w-full h-tap-min rounded-md border border-line bg-paper px-4 text-body text-ink placeholder:text-ink-muted focus:outline-none focus:border-ink"
            />
          </div>

          <button
            type="submit"
            className="w-full h-tap-primary rounded-md bg-ink text-on-ink font-semibold text-button"
          >
            Poslat přihlašovací odkaz
          </button>
        </form>

        <p className="text-caption text-ink-muted text-center">
          Žádné heslo. Jeden klik a jsi uvnitř.
        </p>
      </main>

      <footer className="py-8 text-center">
        <p className="text-caption text-ink-muted">
          Připraveno na EET 2.0 od 1. 1. 2027
        </p>
      </footer>
    </div>
  );
}
