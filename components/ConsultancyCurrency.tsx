"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { convertedPrice, displayCurrencies, isDisplayCurrency, type DisplayCurrency, type RateTable } from "@/lib/consultancy-currency";
const CurrencyContext = createContext<{ currency: DisplayCurrency; table: RateTable }>({ currency: "USD", table: { rates: { USD: 1 }, date: null } });
const preferenceKey = "omnexa-display-currency-v1";
export function ConsultancyCurrency({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<DisplayCurrency>("USD");
  const [table, setTable] = useState<RateTable>({ rates: { USD: 1 }, date: null });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const controller = new AbortController(); let chosen = false;
    try { const saved = localStorage.getItem(preferenceKey); if (isDisplayCurrency(saved)) { chosen = true; setCurrency(saved); } } catch { /* Storage is optional. */ }
    fetch("/api/consultancy/currency", { cache: "no-store", signal: controller.signal })
      .then(async response => { if (!response.ok) throw new Error("RATES_UNAVAILABLE"); return response.json(); })
      .then(data => { setTable({ rates: data.rates, date: data.date }); if (!chosen && isDisplayCurrency(data.suggestedCurrency)) setCurrency(data.suggestedCurrency); })
      .catch(() => undefined).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, []);
  function choose(value: string) {
    if (!isDisplayCurrency(value)) return;
    setCurrency(value);
    try { localStorage.setItem(preferenceKey, value); } catch { /* Continue without persistence. */ }
  }
  return <CurrencyContext.Provider value={{ currency, table }}>
    <div className="consultancy-currency">
      <label htmlFor="consultancy-currency">Display prices in<select id="consultancy-currency" disabled={loading} value={currency} onChange={event => choose(event.target.value)}>{displayCurrencies.map(code => <option key={code} value={code}>{code}</option>)}</select></label>
      <p>{loading ? "Loading currency options…" : "We suggest a currency from your approximate location. Your selection overrides that suggestion."} Converted amounts are estimates; the original fee and checkout currency remain USD. Your card provider may apply its own exchange rate and fees.{table.date ? ` Reference rates dated ${table.date}, via Frankfurter.` : " Reference rates are currently unavailable; original USD fees are shown."}</p>
    </div>
    {children}
  </CurrencyContext.Provider>;
}
export function ConsultancyPrice({ cents, base = "USD" }: { cents: number; base?: string }) {
  const { currency, table } = useContext(CurrencyContext);
  const original = new Intl.NumberFormat("en", { style: "currency", currency: base.toUpperCase(), currencyDisplay: "code" }).format(cents / 100);
  const converted = convertedPrice(cents, base, currency, table.rates);
  if (currency === base.toUpperCase() || converted === null) return <span>{original}</span>;
  return <span>≈ {new Intl.NumberFormat("en", { style: "currency", currency, currencyDisplay: "code" }).format(converted)} <small>({original} billed)</small></span>;
}
