"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import cs from "@/texts/cs";
import { updateItemAction } from "@/app/vice/cennik/actions";

const UNITS = ["ks", "h", "m", "m2", "km", "paušál"] as const;
const VAT_RATES = [0, 12, 21] as const;

type ItemData = {
  id: string;
  name: string;
  unit: string;
  priceHal: number;
  vatRate: number;
};

export default function ItemEditForm({ item }: { item: ItemData }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const [unit, setUnit] = useState(item.unit);
  const [vatRate, setVatRate] = useState(item.vatRate);

  const defaultPriceCzk = (item.priceHal / 100).toFixed(2).replace(".", ",");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const fd = new FormData(e.currentTarget);
    const priceCzk = parseFloat((fd.get("priceCzk") as string).replace(",", ".") || "0");
    fd.set("priceHal", String(Math.round(priceCzk * 100)));
    fd.delete("priceCzk");

    startTransition(async () => {
      const result = await updateItemAction(item.id, fd);
      if (result && "error" in result) {
        setError(result.error);
      } else {
        router.push("/vice/cennik");
      }
    });
  }

  const inputCls =
    "w-full h-tap-min rounded-md border border-line bg-paper px-4 text-body text-ink placeholder:text-ink-muted focus:outline-none focus:border-ink";

  return (
    <div className="flex flex-col h-dvh max-w-[390px] mx-auto bg-paper text-ink font-sans">
      <header className="px-4 pt-5 pb-2 flex items-center gap-3">
        <Link
          href="/vice/cennik"
          className="flex items-center justify-center w-10 h-10 -ml-2 rounded-md text-ink-muted"
          aria-label="Zpět"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </Link>
        <h1 className="m-0 font-display text-title">{cs.pricelist.titleEdit}</h1>
      </header>

      <main className="flex-1 overflow-y-auto px-4 pb-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-label font-semibold text-ink">
              {cs.pricelist.name}<span className="text-signal-strong ml-0.5">*</span>
            </span>
            <input
              name="name"
              type="text"
              defaultValue={item.name}
              className={inputCls}
              required
            />
          </label>

          <div className="flex flex-col gap-1.5">
            <span className="text-label font-semibold text-ink">{cs.pricelist.unit}</span>
            <input type="hidden" name="unit" value={unit} />
            <div className="flex flex-wrap gap-2">
              {UNITS.map((u) => (
                <button
                  key={u}
                  type="button"
                  onClick={() => setUnit(u)}
                  className={`h-11 px-4 rounded-md text-label font-semibold border transition-colors ${
                    unit === u
                      ? "bg-ink text-on-ink border-ink"
                      : "bg-paper text-ink border-line"
                  }`}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>

          <label className="flex flex-col gap-1.5">
            <span className="text-label font-semibold text-ink">{cs.pricelist.price}</span>
            <div className="relative">
              <input
                name="priceCzk"
                type="text"
                inputMode="decimal"
                defaultValue={defaultPriceCzk}
                className={`${inputCls} pr-12`}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-body text-ink-muted">Kč</span>
            </div>
          </label>

          <div className="flex flex-col gap-1.5">
            <span className="text-label font-semibold text-ink">{cs.pricelist.vatRate}</span>
            <input type="hidden" name="vatRate" value={vatRate} />
            <div className="flex gap-2">
              {VAT_RATES.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setVatRate(r)}
                  className={`flex-1 h-11 rounded-md text-label font-semibold border transition-colors ${
                    vatRate === r
                      ? "bg-ink text-on-ink border-ink"
                      : "bg-paper text-ink border-line"
                  }`}
                >
                  {r === 0 ? "Bez DPH" : `${r} %`}
                </button>
              ))}
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
            {isPending ? "Ukládám…" : cs.pricelist.saveChanges}
          </button>
        </form>
      </main>
    </div>
  );
}
