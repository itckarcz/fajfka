"use client";

import { useState, useTransition } from "react";
import { lookupIcoAction, saveStep1Action, saveStep3Action } from "./actions";

type Step = 1 | 2 | 3;

interface CompanyData {
  ico: string;
  name: string;
  street: string;
  city: string;
  zip: string;
  dic: string;
  vatStatus: "PAYER" | "NON_PAYER";
}

const EMPTY_COMPANY: CompanyData = {
  ico: "", name: "", street: "", city: "", zip: "", dic: "", vatStatus: "NON_PAYER",
};

export default function OnboardingWizard() {
  const [step, setStep] = useState<Step>(1);
  const [company, setCompany] = useState<CompanyData>(EMPTY_COMPANY);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // ── Step 1: IČO lookup ──────────────────────────────────────────────
  function handleIcoSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await lookupIcoAction(fd);

      if ("error" in result) {
        setError(result.error ?? "Chyba");
        return;
      }

      if ("aresUnavailable" in result) {
        setCompany((prev) => ({ ...prev, ico: result.ico ?? "" }));
        setError("ARES není dostupný – zadej údaje ručně.");
        setStep(2);
        return;
      }

      setCompany({
        ico: result.data.ico,
        name: result.data.name,
        street: result.data.street,
        city: result.data.city,
        zip: result.data.zip,
        dic: result.data.dic ?? "",
        vatStatus: "NON_PAYER",
      });
      setStep(2);
    });
  }

  // ── Step 2: Confirm data + VAT status ──────────────────────────────
  function handleStep2Submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await saveStep1Action(fd);
      if ("error" in result) {
        setError(result.error ?? "Chyba");
        return;
      }
      setStep(3);
    });
  }

  // ── Step 3: IBAN + EET ───────────────────────────────────────────────
  function handleStep3Submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await saveStep3Action(fd);
      if (result && "error" in result) {
        setError(result.error ?? "Chyba");
      }
    });
  }

  return (
    <div className="flex flex-col min-h-dvh max-w-[390px] mx-auto bg-paper text-ink font-sans">
      {/* Header */}
      <header className="px-4 pt-5 pb-2 flex items-center gap-3">
        <div className="flex items-center gap-1 font-display font-extrabold text-[22px] tracking-tight">
          <span>Fajfka</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E8590C" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 12.5l5 5L20 6" />
          </svg>
        </div>
        <span className="text-label text-ink-muted">Nastavení · krok {step} ze 3</span>
      </header>

      {/* Progress bar */}
      <div className="h-1 bg-surface-2 mx-4 rounded-full overflow-hidden">
        <div
          className="h-full bg-signal transition-all duration-300"
          style={{ width: `${(step / 3) * 100}%` }}
        />
      </div>

      <main className="flex-1 overflow-y-auto px-4 pt-6">
        {error && (
          <div className="mb-4 p-3 rounded-md bg-overdue-soft text-overdue text-label">
            {error}
          </div>
        )}

        {/* ── STEP 1: ICO ── */}
        {step === 1 && (
          <form onSubmit={handleIcoSubmit} className="flex flex-col gap-6">
            <div>
              <h1 className="font-display text-title m-0 mb-1">Zadej IČO</h1>
              <p className="text-body text-ink-muted">Načteme tvoje údaje z ARESu automaticky.</p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="ico" className="text-label">IČO</label>
              <input
                id="ico"
                name="ico"
                type="text"
                inputMode="numeric"
                maxLength={8}
                placeholder="12345678"
                required
                className="w-full h-tap-min rounded-md border border-line bg-paper px-4 text-body text-ink placeholder:text-ink-muted focus:outline-none focus:border-ink tracking-widest"
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full h-tap-primary rounded-md bg-ink text-on-ink font-semibold text-button disabled:opacity-50"
            >
              {isPending ? "Hledám v ARESu…" : "Pokračovat"}
            </button>
          </form>
        )}

        {/* ── STEP 2: Confirm + VAT ── */}
        {step === 2 && (
          <form onSubmit={handleStep2Submit} className="flex flex-col gap-4">
            <div>
              <h1 className="font-display text-title m-0 mb-1">Zkontroluj údaje</h1>
              <p className="text-body text-ink-muted">Uprav, pokud se liší od skutečnosti.</p>
            </div>

            <input type="hidden" name="ico" value={company.ico} />

            <Field label="Název" name="name" value={company.name} onChange={(v) => setCompany((p) => ({ ...p, name: v }))} required />
            <Field label="Ulice" name="street" value={company.street} onChange={(v) => setCompany((p) => ({ ...p, street: v }))} />
            <div className="flex gap-3">
              <Field label="Město" name="city" value={company.city} onChange={(v) => setCompany((p) => ({ ...p, city: v }))} className="flex-1" />
              <Field label="PSČ" name="zip" value={company.zip} onChange={(v) => setCompany((p) => ({ ...p, zip: v }))} inputMode="numeric" className="w-28" />
            </div>
            <Field label="DIČ (volitelné)" name="dic" value={company.dic} onChange={(v) => setCompany((p) => ({ ...p, dic: v }))} placeholder="CZ12345678" />

            {/* VAT status */}
            <div className="flex flex-col gap-2 mt-2">
              <span className="text-label">Jsi plátce DPH?</span>
              <div className="flex gap-3">
                {(["NON_PAYER", "PAYER"] as const).map((val) => (
                  <label
                    key={val}
                    className={[
                      "flex-1 flex items-center justify-center h-tap-min rounded-md border cursor-pointer text-label font-semibold",
                      company.vatStatus === val
                        ? "border-ink bg-ink text-on-ink"
                        : "border-line bg-paper text-ink",
                    ].join(" ")}
                  >
                    <input
                      type="radio"
                      name="vatStatus"
                      value={val}
                      checked={company.vatStatus === val}
                      onChange={() => setCompany((p) => ({ ...p, vatStatus: val }))}
                      className="sr-only"
                    />
                    {val === "NON_PAYER" ? "Ne, nejsem" : "Ano, jsem"}
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-3 mt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-none h-tap-min px-4 rounded-md border border-line text-label font-semibold"
              >
                Zpět
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="flex-1 h-tap-primary rounded-md bg-ink text-on-ink font-semibold text-button disabled:opacity-50"
              >
                {isPending ? "Ukládám…" : "Pokračovat"}
              </button>
            </div>
          </form>
        )}

        {/* ── STEP 3: IBAN + EET ── */}
        {step === 3 && (
          <form onSubmit={handleStep3Submit} className="flex flex-col gap-4">
            <div>
              <h1 className="font-display text-title m-0 mb-1">Bankovní účet a EET</h1>
              <p className="text-body text-ink-muted">Zákazníci ti zaplatí přes QR kód na tvůj účet.</p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="iban" className="text-label">Číslo účtu (IBAN)</label>
              <input
                id="iban"
                name="iban"
                type="text"
                inputMode="numeric"
                placeholder="CZ65 0800 0000 1920 0014 5399"
                className="w-full h-tap-min rounded-md border border-line bg-paper px-4 text-body text-ink placeholder:text-ink-muted focus:outline-none focus:border-ink"
              />
            </div>

            {/* EET choice */}
            <div className="flex flex-col gap-2 mt-2">
              <span className="text-label">EET nastavení</span>
              <label className="flex items-start gap-3 p-4 rounded-md border border-line cursor-pointer has-[:checked]:border-ink has-[:checked]:bg-surface-2">
                <input type="radio" name="eetChoice" value="later" defaultChecked className="mt-0.5 accent-ink" />
                <div>
                  <div className="text-label font-semibold">Nastavím EET později</div>
                  <div className="text-caption text-ink-muted">Certifikát nahraju, až bude k dispozici (od 1. 11. 2026)</div>
                </div>
              </label>
              <label className="flex items-start gap-3 p-4 rounded-md border border-line cursor-pointer has-[:checked]:border-ink has-[:checked]:bg-surface-2">
                <input type="radio" name="eetChoice" value="off" className="mt-0.5 accent-ink" />
                <div>
                  <div className="text-label font-semibold">Mám EET OFF</div>
                  <div className="text-caption text-ink-muted">Paušální daň 1. pásmo – evidovat nemusím</div>
                </div>
              </label>
            </div>

            <div className="flex gap-3 mt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex-none h-tap-min px-4 rounded-md border border-line text-label font-semibold"
              >
                Zpět
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="flex-1 h-tap-primary rounded-md bg-ink text-on-ink font-semibold text-button disabled:opacity-50"
              >
                {isPending ? "Ukládám…" : "Hotovo, jdeme fakturovat"}
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}

// ── Helper: single form field ─────────────────────────────────────────
function Field({
  label, name, value, onChange, required, placeholder, inputMode, className,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  placeholder?: string;
  inputMode?: "numeric" | "text";
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className ?? ""}`}>
      <label htmlFor={name} className="text-label">{label}</label>
      <input
        id={name}
        name={name}
        type="text"
        inputMode={inputMode}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        className="w-full h-tap-min rounded-md border border-line bg-paper px-4 text-body text-ink placeholder:text-ink-muted focus:outline-none focus:border-ink"
      />
    </div>
  );
}
