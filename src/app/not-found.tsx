import type { Metadata } from "next";
import { Container, GoldButton } from "@/components/ui/primitives";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className="bg-ink text-cream">
      <Container className="flex min-h-[70vh] flex-col justify-center py-32">
        <p className="eyebrow text-gold-bright">404</p>
        <h1 className="display mt-5 max-w-[14ch] text-[2.75rem] sm:text-6xl lg:text-[4.5rem]">
          That page is not here.
        </h1>
        <p className="mt-6 max-w-md text-lg text-cream/70">
          The address may have changed. You can return home or write to us
          directly.
        </p>
        <div className="mt-10">
          <GoldButton href="/">Back to home</GoldButton>
        </div>
      </Container>
    </section>
  );
}
