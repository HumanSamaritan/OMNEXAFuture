export const displayCurrencies = ["USD", "SGD", "INR", "EUR", "GBP", "AUD", "CAD", "HKD", "JPY", "CHF"] as const;
export type DisplayCurrency = typeof displayCurrencies[number];
export type RateTable = { rates: Record<string, number>; date: string | null };
export function isDisplayCurrency(value: unknown): value is DisplayCurrency { return typeof value === "string" && (displayCurrencies as readonly string[]).includes(value); }
export function countryCurrency(country: string | null): DisplayCurrency {
  const code = country?.toUpperCase() || "";
  const direct: Record<string, DisplayCurrency> = { SG: "SGD", IN: "INR", GB: "GBP", AU: "AUD", CA: "CAD", HK: "HKD", JP: "JPY", CH: "CHF" };
  if (direct[code]) return direct[code];
  if ("AT BE CY DE EE ES FI FR GR HR IE IT LT LU LV MT NL PT SI SK".split(" ").includes(code)) return "EUR";
  return "USD";
}
export function parseRates(raw: unknown, now = Date.now()): RateTable {
  if (!Array.isArray(raw)) throw new Error("INVALID_RATES");
  const rates: Record<string, number> = { USD: 1 }; const dates: string[] = [];
  for (const row of raw) {
    if (!row || row.base?.toUpperCase() !== "USD" || !isDisplayCurrency(row.quote?.toUpperCase()) || row.quote?.toUpperCase() === "USD") continue;
    const date = row.date; const instant = Date.parse(`${date}T00:00:00Z`);
    if (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(instant) || now - instant > 10 * 86400000 || instant - now > 86400000 || typeof row.rate !== "number" || !Number.isFinite(row.rate) || row.rate <= 0) continue;
    rates[row.quote.toUpperCase()] = row.rate; dates.push(date);
  }
  return { rates, date: dates.length ? dates.sort()[0] : null };
}
export function convertedPrice(cents: number, base: string, quote: DisplayCurrency, rates: Record<string, number>) {
  const from = rates[base.toUpperCase()]; const to = rates[quote];
  if (!Number.isFinite(from) || from <= 0 || !Number.isFinite(to) || to <= 0) return null;
  return cents / 100 / from * to;
}
