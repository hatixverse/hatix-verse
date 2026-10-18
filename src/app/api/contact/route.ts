import { NextResponse } from "next/server";
import { Resend } from "resend";
import { contactSchema } from "@/lib/validations";
import { rateLimit } from "@/lib/rateLimit";

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

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
  const { error } = await new Resend(key).emails.send({
    from: process.env.CONTACT_FROM_EMAIL ?? "HATIX Verse <onboarding@resend.dev>",
    to,
    replyTo: d.email,
    subject: `[HATIX Verse] Message from ${d.name}`,
    html: `<p><b>${esc(d.name)}</b> (${esc(d.email)})</p><p style="white-space:pre-wrap">${esc(d.message)}</p>`,
  });
  if (error) return NextResponse.json({ error: "Could not send message." }, { status: 502 });
  return NextResponse.json({ ok: true });
}
