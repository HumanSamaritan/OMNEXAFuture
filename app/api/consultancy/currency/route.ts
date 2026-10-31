import { NextResponse } from "next/server";
import { countryCurrency, parseRates, type RateTable } from "@/lib/consultancy-currency";
export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  let table: RateTable = { rates: { USD: 1 }, date: null };
  try {
    // Server-to-server only: do not send the visitor's IP or any contact details.
    const response = await fetch("https://api.frankfurter.dev/v2/rates?base=USD&quotes=SGD,INR,EUR,GBP,AUD,CAD,HKD,JPY,CHF", { next: { revalidate: 3600 }, signal: AbortSignal.timeout(5000) });
    if (response.ok) table = parseRates(await response.json());
  } catch { /* Keep the original catalogue price when reference rates are unavailable. */ }
  return NextResponse.json({ ...table, suggestedCurrency: countryCurrency(request.headers.get("x-vercel-ip-country")) }, { headers: { "Cache-Control": "private, no-store" } });
}
