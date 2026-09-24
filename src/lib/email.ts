/**
 * Provider-agnostic email for the enquiry form.
 * Defaults to a console logger. Set EMAIL_PROVIDER=resend to send for real.
 */

export interface EmailMessage {
  to: string;
  from: string;
  replyTo?: string;
  subject: string;
  text: string;
}

export interface EmailProvider {
  readonly name: string;
  send(
    message: EmailMessage,
  ): Promise<{ ok: true } | { ok: false; error: string }>;
}

const consoleProvider: EmailProvider = {
  name: "console",
  async send(message) {
    console.info("[email:console] Would send:", {
      to: message.to,
      subject: message.subject,
    });
    return { ok: true };
  },
};

const resendProvider: EmailProvider = {
  name: "resend",
  async send(message) {
    const key = process.env.RESEND_API_KEY;
    if (!key) return { ok: false, error: "Email provider not configured." };
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: message.from,
          to: message.to,
          reply_to: message.replyTo,
          subject: message.subject,
          text: message.text,
        }),
      });
      if (!res.ok) return { ok: false, error: `Provider error (${res.status}).` };
      return { ok: true };
    } catch {
      return { ok: false, error: "Email could not be sent. Please try again." };
    }
  },
};

const registry: Record<string, EmailProvider> = {
  console: consoleProvider,
  resend: resendProvider,
};

export function getEmailProvider(): EmailProvider {
  const chosen = (process.env.EMAIL_PROVIDER ?? "console").toLowerCase();
  return registry[chosen] ?? consoleProvider;
}

export function getContactInbox(): string {
  return process.env.CONTACT_INBOX ?? "info@kaizenlaw.ca";
}

export function getContactSender(): string {
  return process.env.CONTACT_SENDER ?? "website@kaizenlaw.ca";
}
