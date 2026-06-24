"use client";

import DestinationSlider from "./DestinationSlider";
import type { Destination } from "@/types";
import ScrollReveal from "./ScrollReveal";
import { useLanguage } from "@/context/LanguageContext";

interface DestinationsProps {
  destinations: Destination[];
}

const Destinations = ({ destinations }: DestinationsProps) => {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden bg-gray-10/40 dark:bg-stone-900/10 py-12 lg:py-16">
      <div className="padding-container max-container mb-6">
        <ScrollReveal variant="fade-up" duration={0.6}>
          <span className="section-badge">{t("dest_title" as any)}</span>
        </ScrollReveal>
      </div>

      <ScrollReveal variant="fade-up" duration={0.8} delay={0.2}>
        <DestinationSlider destinations={destinations} />
      </ScrollReveal>
    </section>
  );
};

export default Destinations;
