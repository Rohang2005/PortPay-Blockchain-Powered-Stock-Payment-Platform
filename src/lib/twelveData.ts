export type TDQuote = {
  symbol: string;
  price: number;
  change: number;
  percent_change: number; // positive or negative
};

const DEFAULT_API_KEY = "14b67f8c94eb48cdb8ad6fae9c7d1d75"; // user-provided fallback

function getApiKey(): string {
  const key = (import.meta as any)?.env?.VITE_TWELVEDATA_API_KEY as string | undefined;
  return key && key.length > 0 ? key : DEFAULT_API_KEY;
}

// Fetch real-time quote using Twelve Data /quote endpoint
export async function fetchTDQuote(symbol: string): Promise<TDQuote> {
  const apiKey = getApiKey();
  const url = new URL("https://api.twelvedata.com/quote");
  url.searchParams.set("symbol", symbol);
  url.searchParams.set("apikey", apiKey);

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Twelve Data error: ${res.status}`);
  const data = await res.json();

  if (data?.status === "error") {
    throw new Error(data?.message || "Twelve Data API error");
  }

  const price = Number(data?.price) || 0;
  const change = Number(data?.change) || 0;
  const percent_change = Number(data?.percent_change) || 0;

  return {
    symbol: String(data?.symbol || symbol),
    price,
    change,
    percent_change,
  };
}

export async function fetchMultipleTDQuotes(symbols: string[]): Promise<Record<string, TDQuote>> {
  const results = await Promise.all(
    symbols.map(async (s) => {
      const q = await fetchTDQuote(s);
      return [s, q] as const;
    })
  );
  return Object.fromEntries(results);
}


