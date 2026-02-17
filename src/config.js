import "dotenv/config";

export const config = {
  fmpApiKey: process.env.FMP_API_KEY,
  ntfyTopic: process.env.NTFY_TOPIC,
  pollIntervalMinutes: parseInt(process.env.POLL_INTERVAL_MINUTES || "30", 10),
  politicians: (process.env.POLITICIANS || "Nancy Pelosi")
    .split(",")
    .map((s) => s.trim()),
};

const missing = [];
if (!config.fmpApiKey) missing.push("FMP_API_KEY");
if (!config.ntfyTopic) missing.push("NTFY_TOPIC");

if (missing.length > 0) {
  console.error(`Missing required env vars: ${missing.join(", ")}`);
  console.error("Copy .env.example to .env and fill in your values.");
  process.exit(1);
}
