// api/contact.js — Vercel serverless function
// Uses Gmail SMTP via nodemailer. Credentials live in Vercel env vars only.
// Required env vars:
//   GMAIL_USER         — your Gmail address e.g. you@gmail.com
//   GMAIL_APP_PASSWORD — 16-char Google App Password (not your normal password)
//   CONTACT_EMAIL      — inbox to receive messages (can be same as GMAIL_USER)

import nodemailer from "nodemailer";

const ALLOWED_CATEGORIES = ["Feedback", "Bug", "Request", "Others"];
const EMAIL_REGEX   = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_NAME_LEN  = 100;
const MAX_MSG_LEN   = 1000;
const MAX_BODY_BYTES = 8 * 1024;

// ── Rate limiter ──────────────────────────────────────────────────────────────
const rateLimitMap = new Map();
const WINDOW_MS = 60_000;
const MAX_HITS  = 3;

function isRateLimited(ip) {
  const now = Date.now();
  const e = rateLimitMap.get(ip) || { count: 0, start: now };
  if (now - e.start > WINDOW_MS) { rateLimitMap.set(ip, { count: 1, start: now }); return false; }
  if (e.count >= MAX_HITS) return true;
  e.count++;
  rateLimitMap.set(ip, e);
  return false;
}

function sanitize(str) {
  return String(str).replace(/<[^>]*>/g, "").replace(/[<>]/g, "").replace(/[\r\n]/g, " ").trim();
}

const ALLOWED_ORIGINS = [
  "https://anaken.one",
  "https://www.anaken.one",
  "http://localhost:5173",
  "http://localhost:4173",
];

export default async function handler(req, res) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");

  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  // CSRF
  const origin = req.headers["origin"] || "";
  if (!ALLOWED_ORIGINS.includes(origin)) {
    console.warn("[contact] Blocked origin:", origin);
    return res.status(403).json({ error: "Forbidden." });
  }

  // Rate limit
  const ip = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.socket?.remoteAddress || "unknown";
  if (isRateLimited(ip)) return res.status(429).json({ error: "Too many requests. Please wait a minute." });

  // Body size
  const contentLength = parseInt(req.headers["content-length"] || "0", 10);
  if (contentLength > MAX_BODY_BYTES) return res.status(413).json({ error: "Request too large." });

  // Parse & validate
  const { name, email, category, message } = req.body ?? {};
  if (!name || !email || !category || !message) return res.status(400).json({ error: "All fields are required." });

  const cleanName     = sanitize(name).slice(0, MAX_NAME_LEN);
  const cleanEmail    = sanitize(email).slice(0, 254);
  const cleanCategory = sanitize(category);
  const cleanMessage  = sanitize(message).slice(0, MAX_MSG_LEN);

  if (!EMAIL_REGEX.test(cleanEmail))           return res.status(400).json({ error: "Invalid email address." });
  if (!ALLOWED_CATEGORIES.includes(cleanCategory)) return res.status(400).json({ error: "Invalid category." });
  if (cleanMessage.length < 5)                 return res.status(400).json({ error: "Message is too short." });

  // Env vars
  const GMAIL_USER         = process.env.GMAIL_USER;
  const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;
  const CONTACT_EMAIL      = process.env.CONTACT_EMAIL;

  if (!GMAIL_USER || !GMAIL_APP_PASSWORD || !CONTACT_EMAIL) {
    console.error("[contact] Missing env vars:", { GMAIL_USER: !!GMAIL_USER, GMAIL_APP_PASSWORD: !!GMAIL_APP_PASSWORD, CONTACT_EMAIL: !!CONTACT_EMAIL });
    return res.status(500).json({ error: "Server configuration error." });
  }

  // Send via Gmail SMTP
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
    });

    await transporter.sendMail({
      from:     `"Anaken Contact" <${GMAIL_USER}>`,
      to:       CONTACT_EMAIL,
      replyTo:  cleanEmail,
      subject:  `[${cleanCategory}] from ${cleanName}`,
      text: [
        `Name:     ${cleanName}`,
        `Email:    ${cleanEmail}`,
        `Category: ${cleanCategory}`,
        ``,
        cleanMessage,
      ].join("\n"),
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("[contact] Gmail send error:", err.message);
    return res.status(500).json({ error: "Failed to send message. Try again later." });
  }
}
