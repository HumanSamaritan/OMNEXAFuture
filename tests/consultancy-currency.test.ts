import { test } from "node:test";
import assert from "node:assert/strict";
import { countryCurrency, parseRates, convertedPrice } from "../lib/consultancy-currency";
test("country suggestions cover key markets and safely default for unknown countries", () => {
  for (const [country, currency] of [["SG","SGD"],["in","INR"],["DE","EUR"],["GB","GBP"],["AU","AUD"],["US","USD"],["ZZ","USD"]]) assert.equal(countryCurrency(country), currency);
  assert.equal(countryCurrency(null), "USD");
});
test("reference conversions reject stale and invalid rates and preserve source amounts", () => {
  const now = Date.parse("2026-10-31T12:00:00Z");
  const rows = [
    { base: "USD", quote: "SGD", rate: 1.3, date: "2026-10-30" },
    { base: "USD", quote: "INR", rate: 90, date: "2026-10-01" },
    { base: "USD", quote: "EUR", rate: -1, date: "2026-10-30" },
    { base: "EUR", quote: "GBP", rate: 1, date: "2026-10-30" }
  ];
  const table = parseRates(rows, now);
  assert.deepEqual(table.rates, { USD: 1, SGD: 1.3 });
  assert.equal(convertedPrice(5000, "usd", "SGD", table.rates), 65);
  assert.equal(convertedPrice(5000, "usd", "INR", table.rates), null);
  assert.equal(convertedPrice(5000, "usd", "USD", table.rates), 50);
  assert.throws(() => parseRates({}));
});
