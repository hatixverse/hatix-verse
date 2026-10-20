import { NextResponse } from "next/server";
import { Resend } from "resend";
import { contactSchema } from "@/lib/validations";
import { rateLimit } from "@/lib/rateLimit";
import { LOGO_PNG_BASE64 } from "@/lib/email/logoData";
import { LOGO_CID, acknowledgementEmail, notificationEmail } from "@/lib/email/templates";

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!rateLimit(ip))
    return NextResponse.json({ error: "Too many requests. Try again later." }, { status: 429 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    // Honeypot filled: pretend success.
    if (
      typeof (body as { website?: unknown })?.website === "string" &&
      (body as { website: string }).website
    ) {
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ error: "Please check the form and try again." }, { status: 400 });
  }
  const d = parsed.data;

  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!key || !to) {
    console.warn("[contact] RESEND_API_KEY / CONTACT_TO_EMAIL not set; message not sent.");
    return NextResponse.json({ error: "Contact form is not configured yet." }, { status: 503 });
  }
  const resend = new Resend(key);
  const from = process.env.CONTACT_FROM_EMAIL ?? "HATIX <onboarding@resend.dev>";
  const logo = [{ filename: "hatix.png", content: LOGO_PNG_BASE64, contentId: LOGO_CID }];

  // 1. Notify the team. This is the one that must succeed.
  const note = notificationEmail(d);
  const { error } = await resend.emails.send({
    from,
    to,
    replyTo: d.email,
    subject: note.subject,
    html: note.html,
    text: note.text,
    attachments: logo,
  });
  if (error) {
    console.error("[contact] notification failed:", error.message);
    return NextResponse.json({ error: "Could not send message." }, { status: 502 });
  }

  // 2. Acknowledge the visitor. Best effort: a bad or mistyped address must not fail the request.
  const ack = acknowledgementEmail(d);
  const { error: ackError } = await resend.emails.send({
    from,
    to: d.email,
    replyTo: process.env.CONTACT_REPLY_TO ?? to,
    subject: ack.subject,
    html: ack.html,
    text: ack.text,
    attachments: logo,
  });
  if (ackError) console.warn("[contact] acknowledgement not sent:", ackError.message);

  return NextResponse.json({ ok: true });
}
