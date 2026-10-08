export default function OvereniPage() {
  return (
    <div className="flex flex-col min-h-dvh max-w-[390px] mx-auto bg-paper text-ink font-sans px-4 items-center justify-center text-center gap-6">
      {/* Email icon */}
      <div className="w-16 h-16 rounded-lg bg-signal-soft flex items-center justify-center">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#E8590C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
      </div>

      <div>
        <h1 className="font-display text-title m-0 mb-2">Zkontroluj e-mail</h1>
        <p className="text-body text-ink-muted">
          Poslali jsme ti přihlašovací odkaz. Platí 24 hodin.
        </p>
      </div>

      <p className="text-caption text-ink-muted">
        E-mail nedorazil? Zkontroluj spam nebo se{" "}
        <a href="/prihlaseni" className="text-signal-strong underline">
          zkus znovu
        </a>
        .
      </p>
    </div>
  );
}
