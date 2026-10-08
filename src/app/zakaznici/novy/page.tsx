"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import cs from "@/texts/cs";
import {
  createCustomerAction,
  lookupCustomerIcoAction,
} from "@/app/zakaznici/actions";

type Tab = "PERSON" | "COMPANY";

export default function NovyZakaznikPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("PERSON");
  const [error, setError] = useState("");
  const [icoLoading, setIcoLoading] = useState(false);
  const [aresWarning, setAresWarning] = useState("");
  const [isPending, startTransition] = useTransition();

  // Company fields prefilled from ARES
  const [companyName, setCompanyName] = useState("");
  const [companyIco, setCompanyIco] = useState("");
  const [companyDic, setCompanyDic] = useState("");
  const [companyStreet, setCompanyStreet] = useState("");
  const [companyCity, setCompanyCity] = useState("");
  const [companyZip, setCompanyZip] = useState("");
  const [vatStatus, setVatStatus] = useState<"PAYER" | "NON_PAYER">("NON_PAYER");

  async function handleIcoLookup() {
    setError("");
    setAresWarning("");
    setIcoLoading(true);
    const fd = new FormData();
    fd.set("ico", companyIco);
    const result = await lookupCustomerIcoAction(fd);
    setIcoLoading(false);

    if ("error" in result) {
      setError(result.error ?? "Chyba");
      return;
    }
    if ("aresUnavailable" in result) {
      setAresWarning(cs.error.aresUnavailable);
      return;
    }
    const d = result.data;
    setCompanyName(d.name ?? "");
    setCompanyDic(d.dic ?? "");
    setCompanyStreet(d.street ?? "");
    setCompanyCity(d.city ?? "");
    setCompanyZip(d.zip ?? "");
    if (d.dic) setVatStatus("PAYER");
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await createCustomerAction(fd);
      if (result && "error" in result) {
        setError(result.error);
      } else {
        router.push("/zakaznici");
      }
    });
  }

  return (
    <div className="flex flex-col h-dvh max-w-[390px] mx-auto bg-paper text-ink font-sans">
      {/* Header */}
      <header className="px-4 pt-5 pb-2 flex items-center gap-3">
        <Link
          href="/zakaznici"
          className="flex items-center justify-center w-10 h-10 -ml-2 rounded-md text-ink-muted"
          aria-label="Zpět"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </Link>
        <h1 className="m-0 font-display text-title">{cs.customerForm.titleNew}</h1>
      </header>

      {/* Tabs */}
      <div className="px-4 pb-3 flex gap-2">
        {(["PERSON", "COMPANY"] as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => { setTab(t); setError(""); }}
            className={`flex-1 h-11 rounded-md text-label font-semibold border transition-colors ${
              tab === t
                ? "bg-ink text-on-ink border-ink"
                : "bg-paper text-ink border-line"
            }`}
          >
            {t === "PERSON" ? cs.customerForm.tabPerson : cs.customerForm.tabCompany}
          </button>
        ))}
      </div>

      {/* Form */}
      <main className="flex-1 overflow-y-auto px-4 pb-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input type="hidden" name="type" value={tab} />

          {tab === "PERSON" ? (
            <>
              <Field label={cs.customerForm.namePerson} required>
                <input
                  name="name"
                  type="text"
                  placeholder={cs.customerForm.namePlaceholderPerson}
                  autoComplete="name"
                  className={inputCls}
                  required
                />
              </Field>
              <Field label={cs.customerForm.email}>
                <input name="email" type="email" placeholder={cs.customerForm.emailPlaceholder} autoComplete="email" className={inputCls} />
              </Field>
              <Field label={cs.customerForm.phone}>
                <input name="phone" type="tel" placeholder={cs.customerForm.phonePlaceholder} autoComplete="tel" inputMode="tel" className={inputCls} />
              </Field>
              <AddressFields />
            </>
          ) : (
            <>
              {/* IČO lookup */}
              <Field label={cs.customerForm.ico} required>
                <div className="flex gap-2">
                  <input
                    name="ico"
                    type="text"
                    inputMode="numeric"
                    placeholder={cs.customerForm.icoPlaceholder}
                    maxLength={8}
                    value={companyIco}
                    onChange={(e) => setCompanyIco(e.target.value.replace(/\D/g, ""))}
                    className={`${inputCls} flex-1`}
                    required
                  />
                  <button
                    type="button"
                    onClick={handleIcoLookup}
                    disabled={icoLoading || companyIco.length !== 8}
                    className="h-tap-min px-4 rounded-md border border-line text-label font-semibold text-ink disabled:opacity-40"
                  >
                    {icoLoading ? "…" : "Načíst"}
                  </button>
                </div>
              </Field>
              {aresWarning && <p className="text-caption text-signal-warn -mt-2">{aresWarning}</p>}

              <Field label={cs.customerForm.nameCompany} required>
                <input
                  name="name"
                  type="text"
                  placeholder={cs.customerForm.namePlaceholderCompany}
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className={inputCls}
                  required
                />
              </Field>

              <Field label={cs.customerForm.dic}>
                <input
                  name="dic"
                  type="text"
                  placeholder={cs.customerForm.dicPlaceholder}
                  value={companyDic}
                  onChange={(e) => setCompanyDic(e.target.value)}
                  className={inputCls}
                />
              </Field>

              {/* VAT status */}
              <div className="flex gap-2">
                {(["NON_PAYER", "PAYER"] as const).map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setVatStatus(v)}
                    className={`flex-1 h-11 rounded-md text-label font-semibold border transition-colors ${
                      vatStatus === v
                        ? "bg-ink text-on-ink border-ink"
                        : "bg-paper text-ink border-line"
                    }`}
                  >
                    {v === "PAYER" ? cs.customerForm.vatPayer : cs.customerForm.vatNonPayer}
                  </button>
                ))}
              </div>
              <input type="hidden" name="vatStatus" value={vatStatus} />

              <Field label={cs.customerForm.email}>
                <input name="email" type="email" placeholder={cs.customerForm.emailPlaceholder} autoComplete="email" className={inputCls} />
              </Field>
              <Field label={cs.customerForm.phone}>
                <input name="phone" type="tel" placeholder={cs.customerForm.phonePlaceholder} autoComplete="tel" inputMode="tel" className={inputCls} />
              </Field>
              <AddressFields
                street={companyStreet}
                city={companyCity}
                zip={companyZip}
                onStreet={setCompanyStreet}
                onCity={setCompanyCity}
                onZip={setCompanyZip}
              />
            </>
          )}

          {error && (
            <p className="text-caption text-signal-strong font-semibold">{error}</p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full h-14 rounded-md bg-ink text-on-ink text-body font-semibold disabled:opacity-50 mt-2"
          >
            {isPending ? "Ukládám…" : cs.customerForm.save}
          </button>
        </form>
      </main>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

const inputCls =
  "w-full h-tap-min rounded-md border border-line bg-paper px-4 text-body text-ink placeholder:text-ink-muted focus:outline-none focus:border-ink";

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-label font-semibold text-ink">
        {label}
        {required && <span className="text-signal-strong ml-0.5">*</span>}
      </span>
      {children}
    </label>
  );
}

function AddressFields({
  street = "",
  city = "",
  zip = "",
  onStreet,
  onCity,
  onZip,
}: {
  street?: string;
  city?: string;
  zip?: string;
  onStreet?: (v: string) => void;
  onCity?: (v: string) => void;
  onZip?: (v: string) => void;
}) {
  return (
    <>
      <Field label={cs.customerForm.street}>
        <input
          name="street"
          type="text"
          placeholder={cs.customerForm.streetPlaceholder}
          value={street}
          onChange={(e) => onStreet?.(e.target.value)}
          className={inputCls}
          autoComplete="street-address"
        />
      </Field>
      <div className="flex gap-3">
        <Field label={cs.customerForm.city}>
          <input
            name="city"
            type="text"
            placeholder={cs.customerForm.cityPlaceholder}
            value={city}
            onChange={(e) => onCity?.(e.target.value)}
            className={inputCls}
            autoComplete="address-level2"
          />
        </Field>
        <div className="w-28 flex-shrink-0">
          <Field label={cs.customerForm.zip}>
            <input
              name="zip"
              type="text"
              inputMode="numeric"
              placeholder={cs.customerForm.zipPlaceholder}
              value={zip}
              onChange={(e) => onZip?.(e.target.value)}
              className={inputCls}
              autoComplete="postal-code"
            />
          </Field>
        </div>
      </div>
    </>
  );
}
