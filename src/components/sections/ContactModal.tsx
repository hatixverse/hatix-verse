"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { Check, Send, X } from "lucide-react";
import { contact } from "@/content/site";
import { productSlugs, serviceSlugs } from "@/content/seo";
import { contactSchema } from "@/lib/validations";
import { Button } from "@/components/ui/Button";

type Errors = Partial<Record<string, string>>;

const field =
  "mt-2 w-full rounded-lg border border-line bg-void px-4 py-3 text-text placeholder:text-faint focus:border-accent";

// One tap fills a sensible message, so most visitors only add a name and an email.
const DEFAULT_MESSAGE =
  "Hi, I have an idea I'd like to turn into a product. Could we set up a quick call?";
const TOPICS = [
  {
    label: "Validate an idea",
    message: "Hi, I have a product idea and want to validate it before building. Could we talk?",
  },
  {
    label: "Build an MVP",
    message: "Hi, I'd like to build an MVP. Could we discuss scope and timeline?",
  },
  {
    label: "Launch a product",
    message: "Hi, my product is ready and I need help launching it. Could we talk?",
  },
  {
    label: "AI for my business",
    message: "Hi, I'd like to explore how AI could help my business. Could we talk?",
  },
];

// On a product or service page, start from that page's topic.
function messageForPath(path: string) {
  const [, kind, slug] = path.split("/");
  if (kind === "products") {
    const p = productSlugs.find((x) => x.slug === slug);
    if (p)
      return `Hi, please add me to the waitlist for ${p.name}. I'd like to hear when it's ready.`;
  }
  if (kind === "services") {
    const s = serviceSlugs.find((x) => x.slug === slug);
    if (s)
      return `Hi, I'm interested in HATIX ${s.name}. Could we talk about how it would work for us?`;
  }
  return DEFAULT_MESSAGE;
}

export function ContactModal() {
  const dialog = useRef<HTMLDialogElement>(null);
  const dirty = useRef(false);
  const [message, setMessage] = useState(DEFAULT_MESSAGE);
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState("");

  const open = useCallback(() => {
    dirty.current = false;
    setMessage(messageForPath(window.location.pathname));
    setErrors({});
    setFormError("");
    setState("idle");
    const d = dialog.current;
    if (d && !d.open) {
      d.showModal();
      document.documentElement.style.overflow = "hidden";
    }
  }, []);

  const close = useCallback(() => dialog.current?.close(), []);

  useEffect(() => {
    // Any link to #contact opens the modal instead of scrolling.
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href]");
      if (!a || !/^\/?#contact$/.test(a.getAttribute("href") ?? "")) return;
      e.preventDefault();
      open();
    };
    // CTAs can pre-fill the message with a specific topic.
    const onPrefill = (e: Event) => {
      if (!dirty.current) setMessage((e as CustomEvent<string>).detail);
    };
    document.addEventListener("click", onClick, true);
    window.addEventListener("hatix:contact", open);
    window.addEventListener("hatix:prefill", onPrefill);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("hatix:contact", open);
      window.removeEventListener("hatix:prefill", onPrefill);
    };
  }, [open]);

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
      <p id={`m-${k}-err`} className="mt-1 text-sm text-[#c62828]">
        Error: {errors[k]}
      </p>
    ) : null;
  const aria = (k: string) => ({
    "aria-invalid": !!errors[k],
    "aria-describedby": errors[k] ? `m-${k}-err` : undefined,
  });

  return (
    <dialog
      ref={dialog}
      aria-labelledby="contact-title"
      data-lenis-prevent
      onClose={() => {
        document.documentElement.style.overflow = "";
      }}
      onClick={(e) => e.target === dialog.current && close()}
      className="border-line bg-void text-text m-auto max-h-[92svh] w-[min(94vw,560px)] overflow-y-auto rounded-2xl border p-0 shadow-[0_40px_120px_-30px_rgb(var(--accent-rgb)/0.55)] backdrop:bg-[#07080c]/60 backdrop:backdrop-blur-sm"
    >
      <div className="p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="label label-dot">Contact</p>
            <h2 id="contact-title" className="mt-3 text-2xl font-semibold tracking-tight">
              {contact.heading}
            </h2>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="border-line text-muted hover:border-accent hover:text-text grid size-9 shrink-0 place-items-center rounded-full border transition-colors"
          >
            <X size={18} aria-hidden />
          </button>
        </div>

        {state === "done" ? (
          <div className="mt-8">
            <span className="bg-lime mb-4 grid size-10 place-items-center rounded-full text-[#111823]">
              <Check size={20} strokeWidth={2.5} aria-hidden />
            </span>
            <p className="text-2xl font-semibold">Message received.</p>
            <p className="text-muted mt-2">
              Thank you. We will reply to the email you provided. {contact.replyNote}
            </p>
            <Button type="button" variant="secondary" onClick={close} className="mt-6">
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate className="mt-6 space-y-5" aria-live="polite">
            <div className="hidden" aria-hidden>
              <label>
                Website
                <input name="website" tabIndex={-1} autoComplete="off" />
              </label>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="m-name" className="label">
                  Name
                </label>
                <input
                  id="m-name"
                  name="name"
                  autoComplete="name"
                  autoFocus
                  className={field}
                  {...aria("name")}
                />
                {err("name")}
              </div>
              <div>
                <label htmlFor="m-email" className="label">
                  Email
                </label>
                <input
                  id="m-email"
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
              <p className="label">What do you need?</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {TOPICS.map((t) => (
                  <button
                    key={t.label}
                    type="button"
                    aria-pressed={message === t.message}
                    onClick={() => {
                      dirty.current = false;
                      setMessage(t.message);
                    }}
                    className="border-line text-muted hover:border-accent hover:text-text aria-pressed:border-accent aria-pressed:bg-accent rounded-full border px-3.5 py-1.5 text-sm transition-colors aria-pressed:text-white"
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="m-message" className="label">
                Message
              </label>
              <textarea
                id="m-message"
                name="message"
                rows={4}
                value={message}
                onChange={(e) => {
                  dirty.current = true;
                  setMessage(e.target.value);
                }}
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
    </dialog>
  );
}
