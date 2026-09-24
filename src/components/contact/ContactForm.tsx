"use client";

import { useActionState, useId, useRef, useEffect } from "react";
import { submitContact, type ContactState } from "@/app/actions/contact";
import { practices } from "@/lib/site.config";

const initial: ContactState = { status: "idle" };

export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContact, initial);
  const formRef = useRef<HTMLFormElement>(null);
  const uid = useId();

  useEffect(() => {
    if (state.status === "success") formRef.current?.reset();
  }, [state.status]);

  if (state.status === "success") {
    return (
      <div className="contact-form form-success" role="status">
        <p className="person-role" style={{ color: "var(--gold-light)" }}>
          Received
        </p>
        <p className="serif" style={{ fontSize: 28, color: "#fff", margin: "10px 0 12px" }}>
          Message sent.
        </p>
        <p style={{ color: "#aaa69d", maxWidth: 360, lineHeight: 1.7 }}>{state.message}</p>
      </div>
    );
  }

  const err = state.errors ?? {};

  return (
    <form ref={formRef} action={formAction} className="contact-form" noValidate>
      {state.status === "error" && state.message && (
        <p role="alert" className="form-error">
          {state.message}
        </p>
      )}

      <div aria-hidden="true" style={{ position: "absolute", left: -9999 }}>
        <label>
          Company website
          <input type="text" name="company_website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <label htmlFor={`${uid}-name`}>Name</label>
      <input id={`${uid}-name`} name="name" required autoComplete="name" aria-invalid={err.name ? true : undefined} />
      {err.name && <p className="form-error">{err.name}</p>}

      <label htmlFor={`${uid}-email`}>Email</label>
      <input
        id={`${uid}-email`}
        name="email"
        type="email"
        required
        autoComplete="email"
        aria-invalid={err.email ? true : undefined}
      />
      {err.email && <p className="form-error">{err.email}</p>}

      <label htmlFor={`${uid}-phone`}>
        Phone <span>(optional)</span>
      </label>
      <input
        id={`${uid}-phone`}
        name="phone"
        type="tel"
        autoComplete="tel"
        aria-invalid={err.phone ? true : undefined}
      />
      {err.phone && <p className="form-error">{err.phone}</p>}

      <label htmlFor={`${uid}-matter`}>Matter type</label>
      <select
        id={`${uid}-matter`}
        name="matter"
        required
        defaultValue=""
        aria-invalid={err.matter ? true : undefined}
      >
        <option value="" disabled>
          Select an area
        </option>
        {practices.map((practice) => (
          <option key={practice.slug} value={practice.title}>
            {practice.title}
          </option>
        ))}
      </select>
      {err.matter && <p className="form-error">{err.matter}</p>}

      <label htmlFor={`${uid}-message`}>How can we help?</label>
      <textarea
        id={`${uid}-message`}
        name="message"
        required
        rows={4}
        aria-invalid={err.message ? true : undefined}
      />
      {err.message && <p className="form-error">{err.message}</p>}

      <button type="submit" className="button button-gold" disabled={pending}>
        {pending ? "Sending…" : "Send enquiry"}
        <span aria-hidden="true">+</span>
      </button>
    </form>
  );
}
