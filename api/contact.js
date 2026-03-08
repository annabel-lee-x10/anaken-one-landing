// api/contact.js — Vercel serverless function
// CONTACT_EMAIL and RESEND_API_KEY live only in Vercel env vars, never exposed to client

const ALLOWED_CATEGORIES = ["Feedback", "Bug", "Request", "Others"];
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_MESSAGE_LEN = 1000;
const MAX_NAME_LEN = 100;
const MAX_BODY_BYTES = 8 * 1024; // 8 KB hard cap

// ── In-memory rate limiter (best-effort per serverless instance) ──────────────
// For stronger rate limiting across instances, swap for Upstash Redis.
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 3; // max 3 submissions per IP per minute

function isRateLimited(ip) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip) || { count: 0, start: now };
  if (now - entry.start > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, start: now });
    return false;
  }
  if (entry.count >= RATE_LIMIT_MAX) return true;
  entry.count++;
  rateLimitMap.set(ip, entry);
  return false;
}

/** Strip HTML tags, angle brackets, AND newlines (prevents email header injection) */
function sanitize(str) {
  return String(str)
    .replace(/<[^>]*>/g, "")   // strip HTML tags
    .replace(/[<>]/g, "")      // strip remaining angle brackets
    .replace(/[\r\n]/g, " ")   // strip newlines — prevents SMTP header injection
    .trim();
}

const ALLOWED_ORIGINS = [
  "https://anaken.one",
  "https://www.anaken.one",
];

export default async function handler(req, res) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // ── CSRF: validate Origin ─────────────────────────────────────────────────
  const origin = req.headers["origin"] || "";
  if (!ALLOWED_ORIGINS.includes(origin)) {
    return res.status(403).json({ error: "Forbidden." });
  }

  // ── Rate limiting ─────────────────────────────────────────────────────────
  const ip = req.headers["x-forwarded-for"]?.split(",")[0]?.trim()
    || req.socket?.remoteAddress
    || "unknown";
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: "Too many requests. Please wait a minute." });
  }

  // ── Body size guard ───────────────────────────────────────────────────────
  const contentLength = parseInt(req.headers["content-length"] || "0", 10);
  if (contentLength > MAX_BODY_BYTES) {
    return res.status(413).json({ error: "Request too large." });
  }

  const { name, email, category, message } = req.body ?? {};

  // ── Validate ──────────────────────────────────────────────────────────────
  if (!name || !email || !category || !message) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const cleanName     = sanitize(name).slice(0, MAX_NAME_LEN);
  const cleanEmail    = sanitize(email).slice(0, 254);
  const cleanCategory = sanitize(category);
  const cleanMessage  = sanitize(message).slice(0, MAX_MESSAGE_LEN);

  if (!EMAIL_REGEX.test(cleanEmail)) {
    return res.status(400).json({ error: "Invalid email address." });
  }
  if (!ALLOWED_CATEGORIES.includes(cleanCategory)) {
    return res.status(400).json({ error: "Invalid category." });
  }
  if (cleanMessage.length < 5) {
    return res.status(400).json({ error: "Message is too short." });
  }

  // ── Send via Resend ────────────────────────────────────────────────────────
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const CONTACT_EMAIL  = process.env.CONTACT_EMAIL;

  if (!RESEND_API_KEY || !CONTACT_EMAIL) {
    console.error("Missing RESEND_API_KEY or CONTACT_EMAIL env vars");
    return res.status(500).json({ error: "Server configuration error." });
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Anaken Contact <contact@anaken.one>",
        to: [CONTACT_EMAIL],
        reply_to: cleanEmail,
        subject: `[${cleanCategory}] from ${cleanName}`,
        text: [
          `Name:     ${cleanName}`,
          `Email:    ${cleanEmail}`,
          `Category: ${cleanCategory}`,
          ``,
          cleanMessage,
        ].join("\n"),
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Resend error:", err);
      return res.status(502).json({ error: "Failed to send message. Try again later." });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Contact send error:", err);
    return res.status(500).json({ error: "Unexpected error. Try again later." });
  }
}
