import { config } from "./config.js";
import { fetchAllTrackedTrades, tradeId } from "./api.js";
import { sendNotification } from "./notifier.js";
import { loadSeen, hasSeen, markSeen } from "./store.js";

async function checkForNewTrades() {
  console.log(`[${new Date().toISOString()}] Checking for new trades...`);

  const trades = await fetchAllTrackedTrades();

  let newCount = 0;

  for (const trade of trades) {
    const id = tradeId(trade);

    if (hasSeen(id)) continue;

    newCount++;
    console.log(`New trade found: ${trade.representative} ${trade.type} ${trade.ticker} (${trade.amount})`);

    try {
      await sendNotification(trade);
    } catch (err) {
      console.error(`Failed to send notification:`, err.message);
    }

    markSeen(id);
  }

  if (newCount === 0) {
    console.log("No new trades found.");
  } else {
    console.log(`Processed ${newCount} new trade(s).`);
  }
}

async function main() {
  console.log("p-pusher: Pelosi Stock Trade Tracker");
  console.log(`Tracking: ${config.politicians.join(", ")}`);
  console.log(`Poll interval: ${config.pollIntervalMinutes} minutes`);
  console.log(`ntfy topic: ${config.ntfyTopic}`);
  console.log("---");

  loadSeen();

  // Run immediately on start
  await checkForNewTrades();

  // Then poll on interval
  const intervalMs = config.pollIntervalMinutes * 60 * 1000;
  setInterval(async () => {
    try {
      await checkForNewTrades();
    } catch (err) {
      console.error("Polling error:", err.message);
    }
  }, intervalMs);

  console.log(`\nPolling every ${config.pollIntervalMinutes} minutes. Press Ctrl+C to stop.`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
