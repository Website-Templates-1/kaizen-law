/**
 * Shared admin-panel chrome, reskinned to the Kaizen black + gold palette.
 * One family of h-9 pills used on chip rows, list-row actions, and form
 * submits so Blog / Reviews / Account / Backlog stay visually in sync.
 */
const chip =
  "inline-flex h-9 shrink-0 items-center justify-center whitespace-nowrap rounded-full border px-4 text-sm font-semibold leading-none transition-colors";

export const chipIdle = `${chip} border-white/15 bg-transparent text-cream/70 hover:border-white/30 hover:text-cream disabled:pointer-events-none disabled:text-cream/30`;

export const chipPrimary = `${chip} border-gold bg-gold text-ink hover:bg-gold-bright disabled:pointer-events-none disabled:border-white/12 disabled:bg-white/5 disabled:text-cream/40`;

export const chipDanger = `${chip} border-red-400/40 bg-transparent text-red-300 hover:bg-red-400/10`;

export const chipOn = `${chip} border-gold bg-gold text-ink`;

export const rowActions = "mt-3 flex flex-wrap items-center gap-2";

export const listCard =
  "mt-4 divide-y divide-white/10 rounded-[14px] border border-white/12 bg-white/[0.03]";

export const listRow = "px-5 py-4";

/* Panels + form fields on the dark admin ground. */
export const cardPanel =
  "rounded-[14px] border border-white/12 bg-white/[0.03] p-6 sm:p-8";

export const fieldLabel =
  "block text-[11px] font-semibold uppercase tracking-[0.14em] text-cream/55";

export const fieldInput =
  "mt-2 w-full rounded-[10px] border border-white/15 bg-white/[0.04] px-3.5 py-2.5 text-[15px] text-cream placeholder:text-cream/30 outline-none transition-colors focus:border-gold";

/** Section eyebrow inside the admin. */
export const eyebrow =
  "text-[11px] font-semibold uppercase tracking-[0.16em] text-gold-bright";
