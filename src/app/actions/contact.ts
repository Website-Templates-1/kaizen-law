"use server";

import {
  getContactInbox,
  getContactSender,
  getEmailProvider,
} from "@/lib/email";
import { practices } from "@/lib/site.config";

export interface ContactState {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Record<string, string>;
}

const MAX = { name: 120, email: 200, phone: 40, message: 4000 } as const;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MATTERS = new Set(practices.map((p) => p.title));

function clean(value: FormDataEntryValue | null, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  if (clean(formData.get("company_website"), 200)) {
    return { status: "success" };
  }

  const name = clean(formData.get("name"), MAX.name);
  const email = clean(formData.get("email"), MAX.email);
  const phone = clean(formData.get("phone"), MAX.phone);
  const matter = clean(formData.get("matter"), 80);
  const message = clean(formData.get("message"), MAX.message);

  const errors: Record<string, string> = {};
  if (name.length < 2) errors.name = "Please enter your name.";
  if (!EMAIL_RE.test(email)) errors.email = "Please enter a valid email address.";
  if (phone && phone.length < 7) errors.phone = "Please check the phone number.";
  if (!MATTERS.has(matter)) errors.matter = "Please select a matter type.";
  if (message.length < 10) {
    errors.message = "Please share a little about your matter.";
  }

  if (Object.keys(errors).length > 0) {
    return { status: "error", message: "Please fix the fields below.", errors };
  }

  const provider = getEmailProvider();
  const result = await provider.send({
    to: getContactInbox(),
    from: getContactSender(),
    replyTo: email,
    subject: `New enquiry from ${name} — ${matter}`,
    text: [
      `Name: ${name}`,
      `Email: ${email}`,
      phone ? `Phone: ${phone}` : null,
      `Matter: ${matter}`,
      "",
      message,
    ]
      .filter(Boolean)
      .join("\n"),
  });

  if (!result.ok) {
    return {
      status: "error",
      message:
        "We could not send that message. Please email info@kaizenlaw.ca or call 905-641-7003.",
    };
  }

  return {
    status: "success",
    message: "Thank you. We have your message, and we will reply by email.",
  };
}
