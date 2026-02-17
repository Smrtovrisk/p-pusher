const topic = process.env.NTFY_TOPIC;
if (!topic) {
  console.error("Missing NTFY_TOPIC env var");
  process.exit(1);
}

const NTFY_URL = `https://ntfy.sh/${topic}`;

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
