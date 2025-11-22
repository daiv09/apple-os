import { CallToAction } from "@/components/ui/cta-3";

export default function ContactSection() {
  return (
    <section className="w-full min-h-3/4 flex items-center justify-center p-2 bg-light-200">
      <div className="max-w-4xl w-full flex flex-col items-center">
        <CallToAction />
      </div>
    </section>
  );
}
