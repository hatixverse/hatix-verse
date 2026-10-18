"use client";
import { useEffect, useState } from "react";
import { Check, Clock, Mail, Send } from "lucide-react";
import { contact, site } from "@/content/site";
import { contactSchema } from "@/lib/validations";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";

type Errors = Partial<Record<string, string>>;
const field =
  "mt-2 w-full rounded-lg border border-line bg-void px-4 py-3 text-text placeholder:text-faint focus:border-accent";

export function Contact() {
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState("");

  // A package link can pre-fill the message so the visitor only has to add their name and email.
  useEffect(() => {
    const fill = (e: Event) => {
      const box = document.getElementById("message") as HTMLTextAreaElement | null;
      if (box && !box.value.trim()) box.value = (e as CustomEvent<string>).detail;
    };
    window.addEventListener("hatix:prefill", fill);
    return () => window.removeEventListener("hatix:prefill", fill);
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError("");
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const parsed = contactSchema.safeParse(data);
    if (!parsed.success) {
      const errs: Errors = {};
      for (const i of parsed.error.issues) errs[String(i.path[0])] ??= i.message;
      setErrors(errs);
      return;
    }
    setErrors({});
    setState("sending");
    try {
      const r = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (!r.ok)
        throw new Error((await r.json().catch(() => ({}))).error ?? "Something went wrong.");
      setState("done");
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Something went wrong.");
      setState("idle");
    }
  }

  const err = (k: string) =>
    errors[k] ? (
      <p id={`${k}-err`} className="mt-1 text-sm text-[#c62828]">
        Error: {errors[k]}
      </p>
    ) : null;
  const aria = (k: string) => ({
    "aria-invalid": !!errors[k],
    "aria-describedby": errors[k] ? `${k}-err` : undefined,
  });

  return (
    <Section id="contact" label="Contact" tint>
      <div className="grid gap-12 md:grid-cols-[1fr_1.2fr]">
        <div>
          <p className="label flex items-center gap-2">
            <span aria-hidden className="bg-spark size-1.5 rounded-full" />
            Contact
          </p>
          <h2 className="h2 mt-4">{contact.heading}</h2>
          <div className="text-muted mt-8 space-y-3">
            <p className="flex items-start gap-2.5">
              <Clock size={18} aria-hidden className="text-accent mt-1 shrink-0" />
              {contact.replyNote}
            </p>
            <p className="flex items-center gap-2.5">
              <Mail size={18} aria-hidden className="text-accent shrink-0" />
              <a
                href={`mailto:${site.email}`}
                className="text-text decoration-line hover:decoration-accent underline underline-offset-4"
              >
                Prefer email? Write to us
              </a>
            </p>
          </div>
        </div>
        <div aria-live="polite">
          {state === "done" ? (
            <div className="border-line bg-void rounded-2xl border p-8">
              <span className="bg-lime mb-4 grid size-10 place-items-center rounded-full text-[#111823]">
                <Check size={20} strokeWidth={2.5} aria-hidden />
              </span>
              <p className="text-2xl font-semibold">Message received.</p>
              <p className="text-muted mt-2">Thank you. We will reply to the email you provided.</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="space-y-5">
              <div className="hidden" aria-hidden>
                <label>
                  Website
                  <input name="website" tabIndex={-1} autoComplete="off" />
                </label>
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label htmlFor="name" className="label">
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    autoComplete="name"
                    className={field}
                    {...aria("name")}
                  />
                  {err("name")}
                </div>
                <div>
                  <label htmlFor="email" className="label">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    className={field}
                    {...aria("email")}
                  />
                  {err("email")}
                </div>
              </div>

              <div>
                <label htmlFor="message" className="label">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={3}
                  className={field}
                  {...aria("message")}
                />
                {err("message")}
              </div>
              {formError && (
                <p role="alert" className="text-sm text-[#c62828]">
                  Error: {formError}
                </p>
              )}
              <Button type="submit" disabled={state === "sending"}>
                {state === "sending" ? (
                  "Sending…"
                ) : (
                  <>
                    Send message <Send size={16} aria-hidden />
                  </>
                )}
              </Button>
            </form>
          )}
        </div>
      </div>
    </Section>
  );
}
