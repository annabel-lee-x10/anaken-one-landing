import nodemailer from "nodemailer";

const ALLOWED_CATEGORIES = ["Feedback", "Bug", "Request", "Others"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const rateLimitMap = new Map<string, { count: number; start: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const e = rateLimitMap.get(ip) || { count: 0, start: now };
  if (now - e.start > 60000) { rateLimitMap.set(ip, { count: 1, start: now }); return false; }
  if (e.count >= 3) return true;
  e.count++; rateLimitMap.set(ip, e); return false;
}

function sanitize(str: unknown): string {
  return String(str).replace(/<[^>]*>/g, "").replace(/[<>]/g, "").replace(/[\r\n]/g, " ").trim();
}

const ALLOWED_ORIGINS = ["https://anaken.one", "https://www.anaken.one", "http://localhost:3000", "http://localhost:3001", "http://localhost:3002"];

export async function POST(request: Request) {
  const origin = request.headers.get("origin") || "";
  if (!ALLOWED_ORIGINS.includes(origin)) return Response.json({ error: "Forbidden." }, { status: 403 });

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(ip)) return Response.json({ error: "Too many requests. Please wait a minute." }, { status: 429 });

  const contentLength = parseInt(request.headers.get("content-length") || "0", 10);
  if (contentLength > 8192) return Response.json({ error: "Request too large." }, { status: 413 });

  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return Response.json({ error: "Invalid JSON." }, { status: 400 }); }

  const { name, email, category, message } = body ?? {};
  if (!name || !email || !category || !message) return Response.json({ error: "All fields are required." }, { status: 400 });

  const cleanName     = sanitize(name).slice(0, 100);
  const cleanEmail    = sanitize(email).slice(0, 254);
  const cleanCategory = sanitize(category);
  const cleanMessage  = sanitize(message).slice(0, 1000);

  if (!EMAIL_RE.test(cleanEmail)) return Response.json({ error: "Invalid email." }, { status: 400 });
  if (!ALLOWED_CATEGORIES.includes(cleanCategory)) return Response.json({ error: "Invalid category." }, { status: 400 });
  if (cleanMessage.length < 5) return Response.json({ error: "Message too short." }, { status: 400 });

  const { GMAIL_USER, GMAIL_APP_PASSWORD, CONTACT_EMAIL } = process.env;
  if (!GMAIL_USER || !GMAIL_APP_PASSWORD || !CONTACT_EMAIL) return Response.json({ error: "Server config error." }, { status: 500 });

  try {
    const transporter = nodemailer.createTransport({ service: "gmail", auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD } });
    await transporter.sendMail({
      from: `"Anaken Contact" <${GMAIL_USER}>`, to: CONTACT_EMAIL, replyTo: cleanEmail,
      subject: `[anaken.one] [${cleanCategory}] from ${cleanName}`,
      text: `Name:     ${cleanName}\nEmail:    ${cleanEmail}\nCategory: ${cleanCategory}\n\n${cleanMessage}`,
    });
    return Response.json({ ok: true });
  } catch (err) {
    console.error("[contact]", err instanceof Error ? err.message : err);
    return Response.json({ error: "Failed to send. Try again." }, { status: 500 });
  }
}
