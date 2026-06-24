"use client";

import type { Tour } from "@/types";
import FeaturedToursShowcase from "./FeaturedToursShowcase";
import ScrollReveal from "./ScrollReveal";
import { useLanguage } from "@/context/LanguageContext";

interface FeaturedToursProps {
  tours: Tour[];
}

const FeaturedTours = ({ tours }: FeaturedToursProps) => {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden bg-gray-90 py-12 lg:py-16">
      {/* Decorative blurs */}
      <div className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-green-50/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl" />

      <div className="padding-container relative z-10 max-container">
        <div className="mb-6">
          <ScrollReveal variant="fade-up" duration={0.6}>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-green-50">
              {t("tours_title" as any)}
            </p>
          </ScrollReveal>
        </div>

        <ScrollReveal variant="fade-up" duration={0.8} delay={0.25}>
          <FeaturedToursShowcase tours={tours} />
        </ScrollReveal>
      </div>
    </section>
  );
};

export default FeaturedTours;
