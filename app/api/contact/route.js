// app/api/contact/route.js — Next.js Route Handler
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
  "http://localhost:3000",
  "http://localhost:3001",
];

export async function POST(request) {
  // CSRF check
  const origin = request.headers.get("origin") || "";
  if (!ALLOWED_ORIGINS.includes(origin)) {
    console.warn("[contact] Blocked origin:", origin);
    return Response.json({ error: "Forbidden." }, { status: 403 });
  }

  // Rate limit
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(ip)) {
    return Response.json({ error: "Too many requests. Please wait a minute." }, { status: 429 });
  }

  // Body size
  const contentLength = parseInt(request.headers.get("content-length") || "0", 10);
  if (contentLength > MAX_BODY_BYTES) {
    return Response.json({ error: "Request too large." }, { status: 413 });
  }

  // Parse & validate
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const { name, email, category, message } = body ?? {};
  if (!name || !email || !category || !message) {
    return Response.json({ error: "All fields are required." }, { status: 400 });
  }

  const cleanName     = sanitize(name).slice(0, MAX_NAME_LEN);
  const cleanEmail    = sanitize(email).slice(0, 254);
  const cleanCategory = sanitize(category);
  const cleanMessage  = sanitize(message).slice(0, MAX_MSG_LEN);

  if (!EMAIL_REGEX.test(cleanEmail))
    return Response.json({ error: "Invalid email address." }, { status: 400 });
  if (!ALLOWED_CATEGORIES.includes(cleanCategory))
    return Response.json({ error: "Invalid category." }, { status: 400 });
  if (cleanMessage.length < 5)
    return Response.json({ error: "Message is too short." }, { status: 400 });

  // Env vars
  const GMAIL_USER         = process.env.GMAIL_USER;
  const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;
  const CONTACT_EMAIL      = process.env.CONTACT_EMAIL;

  if (!GMAIL_USER || !GMAIL_APP_PASSWORD || !CONTACT_EMAIL) {
    console.error("[contact] Missing env vars");
    return Response.json({ error: "Server configuration error." }, { status: 500 });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
    });

    await transporter.sendMail({
      from:    `"Anaken Contact" <${GMAIL_USER}>`,
      to:      CONTACT_EMAIL,
      replyTo: cleanEmail,
      subject: `[anaken.one] [${cleanCategory}] from ${cleanName}`,
      text: [
        `Name:     ${cleanName}`,
        `Email:    ${cleanEmail}`,
        `Category: ${cleanCategory}`,
        ``,
        cleanMessage,
      ].join("\n"),
    });

    return Response.json({ ok: true });
  } catch (err) {
    console.error("[contact] Gmail send error:", err.message);
    return Response.json({ error: "Failed to send message. Try again later." }, { status: 500 });
  }
}
