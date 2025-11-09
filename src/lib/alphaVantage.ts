export type GlobalQuote = {
  symbol: string;
  price: number;
  change: number;
  changePercent: number; // 0.0 - can be negative
};

const DEFAULT_API_KEY = "NL35HIFH06TLQ7SF"; // fallback provided by user

function getApiKey(): string {
  const key = (import.meta as any)?.env?.VITE_ALPHAVANTAGE_API_KEY as string | undefined;
  return key && key.length > 0 ? key : DEFAULT_API_KEY;
}

export async function fetchGlobalQuote(rawSymbol: string): Promise<GlobalQuote> {
  const apiKey = getApiKey();
  const url = new URL("https://www.alphavantage.co/query");
  url.searchParams.set("function", "GLOBAL_QUOTE");
  url.searchParams.set("symbol", rawSymbol);
  url.searchParams.set("apikey", apiKey);

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`Alpha Vantage error: ${response.status}`);
  }

  const data = await response.json();
  const quote = data?.["Global Quote"]; // Alpha Vantage wraps result

  if (!quote) {
    // When throttled or invalid symbol, Alpha Vantage returns different shapes
    const message = data?.Note || data?.Information || data?.["Error Message"] || "Unknown Alpha Vantage response";
    throw new Error(typeof message === "string" ? message : "No Global Quote in response");
  }

  const price = Number(quote["05. price"]) || 0;
  const change = Number(quote["09. change"]) || 0;
  const changePercentStr = (quote["10. change percent"] as string | undefined) || "0%";
  const changePercent = Number(changePercentStr.replace("%", "")) || 0;

  return {
    symbol: String(quote["01. symbol"]) || rawSymbol,
    price,
    change,
    changePercent,
  };
}

export async function fetchMultipleQuotes(symbols: string[]): Promise<Record<string, GlobalQuote>> {
  const results = await Promise.all(
    symbols.map(async (s) => {
      const q = await fetchGlobalQuote(s);
      return [s, q] as const;
    })
  );
  return Object.fromEntries(results);
}


