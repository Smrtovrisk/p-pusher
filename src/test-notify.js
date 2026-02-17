import { config } from "./config.js";

const NTFY_URL = `https://ntfy.sh/${config.ntfyTopic}`;

const res = await fetch(NTFY_URL, {
  method: "POST",
  headers: {
    Title: "P-Pusher: Test Notification",
    Priority: "high",
    Tags: "white_check_mark",
  },
  body: "If you see this, notifications are working!",
});

if (!res.ok) {
  throw new Error(`ntfy error ${res.status}: ${await res.text()}`);
}

console.log("Test notification sent successfully!");
