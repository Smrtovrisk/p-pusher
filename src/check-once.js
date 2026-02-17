import { config } from "./config.js";
import { fetchAllTrackedTrades, tradeId } from "./api.js";
import { sendNotification } from "./notifier.js";
import { loadSeen, hasSeen, markSeen } from "./store.js";

// One-shot check: fetch trades, notify on new ones, then exit.
// Useful for running via cron instead of a long-running process.

async function main() {
  console.log(`[${new Date().toISOString()}] One-time check for: ${config.politicians.join(", ")}`);

  loadSeen();

  const trades = await fetchAllTrackedTrades();
  let newCount = 0;

  for (const trade of trades) {
    const id = tradeId(trade);
    if (hasSeen(id)) continue;

    newCount++;
    console.log(`New: ${trade.representative} ${trade.type} ${trade.ticker} (${trade.amount})`);

    try {
      await sendNotification(trade);
    } catch (err) {
      console.error(`Notification failed:`, err.message);
    }

    markSeen(id);
  }

  console.log(newCount > 0 ? `Sent ${newCount} notification(s).` : "No new trades.");
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
