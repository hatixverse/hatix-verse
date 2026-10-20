"use client";
import { Clock, Mail, MessageCircle } from "lucide-react";
import { contact, site } from "@/content/site";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";

// The form itself lives in ContactModal; this band is the closing call to action.
export function Contact() {
  return (
    <Section id="contact" label="Contact" tint>
      <div className="grid items-center gap-10 md:grid-cols-[1fr_auto]">
        <div>
          <p className="label label-dot">Contact</p>
          <h2 className="h2 mt-4">{contact.heading}</h2>
          <div className="text-muted mt-6 space-y-3">
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
                Prefer email? {site.email}
              </a>
            </p>
          </div>
        </div>
        <Button type="button" onClick={() => window.dispatchEvent(new Event("hatix:contact"))}>
          <MessageCircle size={18} aria-hidden />
          Tell us about your idea
        </Button>
      </div>
    </Section>
  );
}
