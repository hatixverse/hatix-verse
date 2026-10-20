import { site } from "@/content/site";

const linkedin = site.socials.find((s) => s.id === "linkedin")?.href ?? "#";
const facebook = site.socials.find((s) => s.id === "facebook")?.href;

// Table-based, inline-styled HTML so it renders in Gmail, Outlook and Apple Mail.
// The logo is an inline attachment referenced by this content id.
export const LOGO_CID = "hatix-logo";

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
// Links in emails must always point at the public site, never at a local dev URL.
const base = () =>
  (/localhost|127\.0\.0\.1/.test(site.url) ? "https://hatixverse.com" : site.url).replace(
    /\/$/,
    "",
  );

const C = {
  accent: "#5e17eb",
  lime: "#c8ff3d",
  text: "#0b0d14",
  muted: "#555b6b",
  faint: "#7b8192",
  line: "#e0e3eb",
  soft: "#f7f8fb",
};

const logo = (w: number, extra = "") =>
  `<img src="cid:${LOGO_CID}" width="${w}" alt="HATIX" style="display:block;border:0;height:auto;${extra}" />`;

function shell(preheader: string, inner: string) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><meta name="color-scheme" content="light" /></head>
<body style="margin:0;padding:0;background:#f4f5f8;font-family:-apple-system,'Segoe UI',Helvetica,Arial,sans-serif;color:${C.text}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">${esc(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f5f8;padding:24px 12px"><tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid ${C.line}">
<tr><td style="height:5px;background:${C.accent};background-image:linear-gradient(90deg,${C.accent} 0%,${C.accent} 70%,${C.lime} 70%,${C.lime} 100%);font-size:0;line-height:0">&nbsp;</td></tr>
<tr><td style="padding:28px 36px 8px">${logo(130)}</td></tr>
${inner}
</table></td></tr></table></body></html>`;
}

const label = (t: string) =>
  `<div style="font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:${C.faint};margin-bottom:8px">${t}</div>`;

const quote = (message: string, size = 15) =>
  `<div style="border-left:4px solid ${C.lime};background:${C.soft};border-radius:0 10px 10px 0;padding:16px 18px;font-size:${size}px;line-height:1.65;color:${C.text};white-space:pre-wrap">${esc(message)}</div>`;

export type Enquiry = { name: string; email: string; message: string };

const ist = (d: Date) =>
  new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(d) + " IST";

/** Notification to the HATIX team. Reply-To is the visitor. */
export function notificationEmail(e: Enquiry, at = new Date()) {
  const first = e.name.split(/\s+/)[0];
  const row = (k: string, v: string, top = true) =>
    `<tr><td style="padding:12px 0;${top ? "border-top:1px solid #eef0f5;" : ""}width:96px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:${C.faint}">${k}</td><td style="padding:12px 0;${top ? "border-top:1px solid #eef0f5;" : ""}font-size:15px;color:${C.text}">${v}</td></tr>`;
  const html = shell(
    `${e.name} sent a message through the contact form.`,
    `<tr><td style="padding:20px 36px 4px">
<div style="font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:${C.accent};font-weight:700">New enquiry</div>
<div style="font-size:24px;line-height:1.3;font-weight:700;margin-top:8px">${esc(e.name)} wants to talk</div></td></tr>
<tr><td style="padding:16px 36px 0"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid ${C.line};border-bottom:1px solid ${C.line}">
${row("Name", esc(e.name), false)}
${row("Email", `<a href="mailto:${esc(e.email)}" style="color:${C.accent};text-decoration:none">${esc(e.email)}</a>`)}
${row("Received", ist(at))}
</table></td></tr>
<tr><td style="padding:22px 36px 0">${label("Message")}${quote(e.message)}</td></tr>
<tr><td style="padding:26px 36px 8px"><table role="presentation" cellpadding="0" cellspacing="0"><tr><td style="background:${C.accent};border-radius:999px"><a href="mailto:${esc(e.email)}" style="display:inline-block;padding:13px 26px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none">Reply to ${esc(first)} &nbsp;&#8599;</a></td></tr></table></td></tr>
<tr><td style="padding:18px 36px 30px;font-size:12px;line-height:1.6;color:${C.faint}">Sent from the contact form at hatixverse.com. Hitting reply writes straight to ${esc(first)}.</td></tr>`,
  );
  const text = `New enquiry from ${e.name} <${e.email}>\nReceived: ${ist(at)}\n\n${e.message}\n\nReply to this email to respond to ${first}.`;
  return { subject: `New enquiry from ${e.name}`, html, text };
}

/** Acknowledgement to the visitor. Reply-To is the team inbox. */
export function acknowledgementEmail(e: Enquiry) {
  const first = e.name.split(/\s+/)[0];
  const excerpt = e.message.length > 280 ? `${e.message.slice(0, 280).trimEnd()}…` : e.message;
  const step = (n: number, title: string, body: string, last = false) =>
    `<tr><td valign="top" style="width:34px;padding:0 0 ${last ? 0 : 14}px"><div style="width:24px;height:24px;border-radius:50%;background:${C.lime};color:${C.text};font-size:12px;font-weight:700;line-height:24px;text-align:center">${n}</div></td><td style="padding:2px 0 ${last ? 0 : 14}px;font-size:15px;line-height:1.55;color:${C.text}"><b>${title}</b><br /><span style="color:${C.muted}">${body}</span></td></tr>`;
  const link = (href: string, t: string) =>
    `<a href="${href}" style="color:${C.muted};text-decoration:none">${t}</a>`;
  const html = shell(
    "We received your message and will reply by email.",
    `<tr><td style="padding:20px 36px 0">
<div style="font-size:26px;line-height:1.3;font-weight:700">Thanks, ${esc(first)}. We&rsquo;ve got your message.</div>
<div style="font-size:16px;line-height:1.65;color:${C.muted};margin-top:12px">A person on our team will read it and reply by email, usually within one working day. No automated sales sequence.</div></td></tr>
<tr><td style="padding:22px 36px 0">${label("What you sent us")}${quote(excerpt, 14)}</td></tr>
<tr><td style="padding:28px 36px 0"><div style="font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:${C.accent};font-weight:700;margin-bottom:12px">What happens next</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
${step(1, "We read it properly.", "We look at what you&rsquo;re trying to do before we reply, so the answer isn&rsquo;t generic.")}
${step(2, "A short conversation.", "A call or an email thread to understand the idea, who it&rsquo;s for and what &ldquo;done&rdquo; looks like.")}
${step(3, "A clear next step.", "Validate it, build it or launch it. We&rsquo;ll recommend the smallest step that makes sense.", true)}
</table></td></tr>
<tr><td style="padding:28px 36px 0;font-size:14px;line-height:1.65;color:${C.muted}">Want to add something? Just reply to this email and it goes straight to us.</td></tr>
<tr><td style="padding:26px 36px 0"><div style="font-size:15px;line-height:1.6">Talk soon,</div>
<table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:14px"><tr><td style="width:4px;background:${C.accent};border-radius:2px">&nbsp;</td><td style="padding:2px 0 2px 14px">
<div style="font-size:16px;font-weight:700;line-height:1.4">The HATIX team</div>
${logo(96, "margin-top:10px")}
<div style="font-size:13px;line-height:1.7;margin-top:8px"><a href="mailto:contact@hatixverse.com" style="color:${C.accent};text-decoration:none;font-weight:600">contact@hatixverse.com</a><br /><a href="${base()}" style="color:${C.accent};text-decoration:none;font-weight:600">hatixverse.com</a></div>
</td></tr></table>
<div style="margin-top:16px;font-size:12px;line-height:1.7;color:${C.faint}">${link(`${base()}/#products`, "Products")} &nbsp;&middot;&nbsp; ${link(`${base()}/#journey`, "Services")} &nbsp;&middot;&nbsp; ${link(linkedin, "LinkedIn")}${facebook ? ` &nbsp;&middot;&nbsp; ${link(facebook, "Facebook")}` : ""}</div></td></tr>
<tr><td style="padding:24px 36px 0"><div style="border-top:1px solid ${C.line}"></div></td></tr>
<tr><td style="padding:16px 36px 30px;font-size:11px;line-height:1.7;color:${C.faint}"><b style="color:${C.muted}">HATIX VERSE LLP</b> &middot; India<br />You&rsquo;re receiving this once because you sent a message through the contact form at hatixverse.com. We won&rsquo;t add you to any list.</td></tr>`,
  );
  const text = `Thanks, ${first}. We've got your message.\n\nA person on our team will read it and reply by email, usually within one working day.\n\nWhat you sent us:\n${excerpt}\n\nWhat happens next:\n1. We read it properly.\n2. A short conversation to understand the idea.\n3. A clear next step: validate it, build it or launch it.\n\nWant to add something? Just reply to this email.\n\nTalk soon,\nThe HATIX team\ncontact@hatixverse.com | ${base()}\n\nHATIX VERSE LLP, India. You're receiving this once because you sent a message through our contact form.`;
  return { subject: `We got your message, ${first}`, html, text };
}
