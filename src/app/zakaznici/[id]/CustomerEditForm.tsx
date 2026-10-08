"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import cs from "@/texts/cs";
import { updateCustomerAction } from "@/app/zakaznici/actions";

export type CustomerData = {
  id: string;
  type: string;
  name: string;
  ico: string | null;
  dic: string | null;
  vatStatus: string | null;
  email: string | null;
  phone: string | null;
  street: string | null;
  city: string | null;
  zip: string | null;
};

const inputCls =
  "w-full h-tap-min rounded-md border border-line bg-paper px-4 text-body text-ink placeholder:text-ink-muted focus:outline-none focus:border-ink";

export default function CustomerEditForm({ customer }: { customer: CustomerData }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const [vatStatus, setVatStatus] = useState<"PAYER" | "NON_PAYER">(
    (customer.vatStatus as "PAYER" | "NON_PAYER") ?? "NON_PAYER"
  );

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await updateCustomerAction(customer.id, fd);
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
        <h1 className="m-0 font-display text-title truncate">{customer.name}</h1>
      </header>

      {/* Type badge */}
      <div className="px-4 pb-3">
        <span className="inline-block text-caption text-ink-muted border border-line rounded px-2 py-0.5">
          {customer.type === "COMPANY" ? cs.customerForm.tabCompany : cs.customerForm.tabPerson}
        </span>
      </div>

      {/* Edit form */}
      <main className="flex-1 overflow-y-auto px-4 pb-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Field
            label={customer.type === "COMPANY" ? cs.customerForm.nameCompany : cs.customerForm.namePerson}
            required
          >
            <input
              name="name"
              type="text"
              defaultValue={customer.name}
              className={inputCls}
              required
            />
          </Field>

          {customer.type === "COMPANY" && (
            <>
              {customer.ico && (
                <div className="flex flex-col gap-1.5">
                  <span className="text-label font-semibold text-ink">{cs.customerForm.ico}</span>
                  <p className="h-tap-min flex items-center px-4 rounded-md bg-[#F5F6F8] text-body text-ink-muted border border-line">
                    {customer.ico}
                  </p>
                </div>
              )}
              <Field label={cs.customerForm.dic}>
                <input
                  name="dic"
                  type="text"
                  defaultValue={customer.dic ?? ""}
                  placeholder={cs.customerForm.dicPlaceholder}
                  className={inputCls}
                />
              </Field>
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
            </>
          )}

          <Field label={cs.customerForm.email}>
            <input
              name="email"
              type="email"
              defaultValue={customer.email ?? ""}
              placeholder={cs.customerForm.emailPlaceholder}
              className={inputCls}
            />
          </Field>
          <Field label={cs.customerForm.phone}>
            <input
              name="phone"
              type="tel"
              defaultValue={customer.phone ?? ""}
              placeholder={cs.customerForm.phonePlaceholder}
              inputMode="tel"
              className={inputCls}
            />
          </Field>
          <Field label={cs.customerForm.street}>
            <input
              name="street"
              type="text"
              defaultValue={customer.street ?? ""}
              placeholder={cs.customerForm.streetPlaceholder}
              className={inputCls}
            />
          </Field>
          <div className="flex gap-3">
            <Field label={cs.customerForm.city}>
              <input
                name="city"
                type="text"
                defaultValue={customer.city ?? ""}
                placeholder={cs.customerForm.cityPlaceholder}
                className={inputCls}
              />
            </Field>
            <div className="w-28 flex-shrink-0">
              <Field label={cs.customerForm.zip}>
                <input
                  name="zip"
                  type="text"
                  defaultValue={customer.zip ?? ""}
                  placeholder={cs.customerForm.zipPlaceholder}
                  inputMode="numeric"
                  className={inputCls}
                />
              </Field>
            </div>
          </div>

          {error && (
            <p className="text-caption text-signal-strong font-semibold">{error}</p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full h-14 rounded-md bg-ink text-on-ink text-body font-semibold disabled:opacity-50 mt-2"
          >
            {isPending ? "Ukládám…" : cs.customerForm.saveChanges}
          </button>
        </form>
      </main>
    </div>
  );
}

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
