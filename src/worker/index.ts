/**
 * Fajfka background worker
 * Handles EET submissions and email sending via pg-boss queue.
 * Full implementation in task 8 (email) and task 9 (EET).
 */

console.log("[worker] Fajfka worker starting...");
console.log("[worker] DATABASE_URL:", process.env["DATABASE_URL"] ? "set" : "NOT SET");

// Keep process alive
setInterval(() => {
  console.log("[worker] alive", new Date().toISOString());
}, 30_000);

console.log("[worker] Ready. Waiting for jobs (EET + email queues coming in tasks 8–9).");
