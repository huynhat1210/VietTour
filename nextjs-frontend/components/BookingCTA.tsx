"use client";

import Image from "next/image";
import Button from "./Button";
import ScrollReveal from "./ScrollReveal";
import { useLanguage } from "@/context/LanguageContext";

const BookingCTA = () => {
  const { t } = useLanguage();

  const getCtaStatLabelKey = (label: string) => {
    if (label === "Tour") return "nav_tours";
    if (label === "Hài lòng") return "cta_stat_satisfaction";
    if (label === "Hỗ trợ") return "cta_stat_support";
    if (label === "Đánh giá") return "stats_rating";
    return label;
  };

  return (
    <section className="padding-container max-container pb-12 pt-4 lg:pb-16">
      <ScrollReveal variant="zoom-in" duration={0.8} className="w-full">
        <div className="relative overflow-hidden rounded-3xl lg:rounded-5xl">
          {/* Background image */}
          <Image
            src="https://images.unsplash.com/photo-1528127269322-539801943592?w=1600&q=85"
            alt="Việt Nam"
            width={1600}
            height={600}
            className="absolute inset-0 h-full w-full object-cover"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-90/95 via-gray-90/80 to-gray-90/60" />

          <div className="relative z-10 flex flex-col items-center px-8 py-16 text-center lg:px-16 lg:py-20">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-green-50">
              {t("cta_badge" as any)}
            </p>
            <h2 className="bold-32 mt-3 max-w-2xl text-white lg:bold-52">
              {t("cta_title_direct" as any)}
            </h2>
            <p className="regular-16 mt-4 max-w-lg text-white/70">
              {t("cta_description" as any, { phone: "1900 1234" })}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button title={t("cta_btn" as any)} variant="btn_green" href="/tours" />
              <Button
                title={t("cta_contact_btn" as any)}
                variant="btn_dark_green_outline"
                href="/contact"
              />
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 border-t border-white/10 pt-8">
              {[
                { value: "100+", label: "Tour" },
                { value: "98%", label: "Hài lòng" },
                { value: "24/7", label: "Hỗ trợ" },
                { value: "4.9★", label: "Đánh giá" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="bold-24 text-white">{stat.value}</p>
                  <p className="regular-14 text-white/50">{t(getCtaStatLabelKey(stat.label) as any)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
};

export default BookingCTA;
