"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { convertedPrice, displayCurrencies, isDisplayCurrency, type DisplayCurrency, type RateTable } from "@/lib/consultancy-currency";

const CurrencyContext = createContext<{ currency: DisplayCurrency; table: RateTable }>({ currency: "USD", table: { rates: { USD: 1 }, date: null } });

export function ConsultancyCurrency({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<DisplayCurrency>("USD");
  const [table, setTable] = useState<RateTable>({ rates: { USD: 1 }, date: null });
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/consultancy/currency", { cache: "no-store", signal: controller.signal })
      .then(async response => { if (!response.ok) throw new Error("RATES_UNAVAILABLE"); return response.json(); })
      .then(data => { if (!controller.signal.aborted) setTable({ rates: data.rates, date: data.date }); })
      .catch(() => undefined);
    return () => controller.abort();
  }, []);
  return <CurrencyContext.Provider value={{ currency, table }}>
    <div className="consultancy-currency">
      <label htmlFor="consultancy-currency">Display currency
        <select id="consultancy-currency" value={currency} onChange={event => { if (isDisplayCurrency(event.target.value)) setCurrency(event.target.value); }}>
          {displayCurrencies.map(code => <option key={code} value={code}>{code}</option>)}
        </select>
      </label>
      <small>USD fees are fixed · {table.date ? `Approximate FX: Frankfurter (${table.date})` : "FX reference unavailable"} · Display conversions are estimates.</small>
    </div>
    {children}
  </CurrencyContext.Provider>;
}
export function ConsultancyPrice({ cents, base = "USD" }: { cents: number; base?: string }) {
  const { currency, table } = useContext(CurrencyContext);
  const original = new Intl.NumberFormat("en", { style: "currency", currency: base.toUpperCase(), currencyDisplay: "code" }).format(cents / 100);
  const converted = convertedPrice(cents, base, currency, table.rates);
  if (currency === base.toUpperCase() || converted === null) return <span>{original}</span>;
  return <span>≈ {new Intl.NumberFormat("en", { style: "currency", currency, currencyDisplay: "code" }).format(converted)} <small>(fixed {original})</small></span>;
}
