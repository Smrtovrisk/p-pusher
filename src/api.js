import { config } from "./config.js";

const BASE_URL = "https://financialmodelingprep.com/stable";

export async function fetchTradesForPolitician(name) {
  const url = `${BASE_URL}/house-trades-by-name?name=${encodeURIComponent(name)}&apikey=${config.fmpApiKey}`;

  const res = await fetch(url);

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`FMP API error ${res.status}: ${body}`);
  }

  const data = await res.json();

  if (!Array.isArray(data)) {
    // FMP returns an object with error message when something goes wrong
    if (data && data["Error Message"]) {
      throw new Error(`FMP API: ${data["Error Message"]}`);
    }
    console.warn("Unexpected API response format:", JSON.stringify(data).slice(0, 200));
    return [];
  }

  return data;
}

export async function fetchAllTrackedTrades() {
  const allTrades = [];

  for (const politician of config.politicians) {
    try {
      const trades = await fetchTradesForPolitician(politician);
      allTrades.push(...trades);
      console.log(`Fetched ${trades.length} trades for ${politician}`);
    } catch (err) {
      console.error(`Failed to fetch trades for ${politician}:`, err.message);
    }
  }

  return allTrades;
}

// Generate a unique ID for a trade to detect duplicates
export function tradeId(trade) {
  const parts = [
    trade.representative,
    trade.transactionDate,
    trade.ticker || trade.asset,
    trade.type,
    trade.amount,
    trade.owner,
  ];
  return parts.filter(Boolean).join("|");
}
