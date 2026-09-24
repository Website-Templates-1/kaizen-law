import { Container, GoldButton } from "@/components/ui/primitives";
import { contact } from "@/lib/site.config";

export function CtaBand({
  eyebrow = "Start a conversation",
  title = "Let's discuss",
  italic = "your next step.",
  note = "Information requests are answered by email. Share a little about your matter and we will be in touch.",
}: {
  eyebrow?: string;
  title?: string;
  italic?: string;
  note?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-ink text-cream">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          background:
            "linear-gradient(125deg, transparent 48%, var(--gold) 49%, transparent 50%), linear-gradient(35deg, transparent 48%, var(--gold) 49%, transparent 50%)",
        }}
      />
      <Container className="relative py-24 sm:py-28">
        <div className="grid gap-y-10 gap-x-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            {eyebrow && <p className="eyebrow text-gold-bright">{eyebrow}</p>}
            <h2 className="display mt-6 text-[2.25rem] leading-[1.08] sm:text-[2.75rem] sm:leading-[1.02] lg:text-[3.25rem]">
              {title} <em className="italic text-gold-bright">{italic}</em>
            </h2>
          </div>
          <div>
            <p className="max-w-md text-base leading-[1.75] text-cream/60">{note}</p>
            <div className="mt-9 flex flex-col gap-4 sm:mt-8 sm:flex-row sm:items-center sm:gap-5 [&>*]:w-full sm:[&>*]:w-auto">
              <GoldButton href="/contact">Discuss your matter</GoldButton>
              <a href={contact.emailHref} className="button button-ghost">
                Email us
                <span aria-hidden="true">+</span>
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
