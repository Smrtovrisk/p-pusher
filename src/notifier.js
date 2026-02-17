import { config } from "./config.js";

const NTFY_URL = `https://ntfy.sh/${config.ntfyTopic}`;

export async function sendNotification(trade) {
  const action = trade.type || "traded";
  const ticker = trade.ticker || "N/A";
  const asset = trade.assetDescription || trade.asset || ticker;
  const amount = trade.amount || "undisclosed amount";
  const owner = trade.owner === "SP" ? " (spouse)" : "";
  const date = trade.transactionDate || "unknown date";
  const representative = trade.representative || "Unknown";

  const title = `${representative}: ${action} ${ticker}`;
  const body = [
    `${action.toUpperCase()}: ${asset} (${ticker})`,
    `Amount: ${amount}`,
    `Date: ${date}${owner}`,
    trade.disclosureDate ? `Disclosed: ${trade.disclosureDate}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const res = await fetch(NTFY_URL, {
    method: "POST",
    headers: {
      Title: title,
      Priority: "high",
      Tags: action.toLowerCase().includes("purchase") ? "chart_with_upwards_trend" : "chart_with_downwards_trend",
    },
    body,
  });

  if (!res.ok) {
    throw new Error(`ntfy error ${res.status}: ${await res.text()}`);
  }

  console.log(`Notification sent: ${title}`);
}
