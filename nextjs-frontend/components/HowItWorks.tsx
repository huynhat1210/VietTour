"use client";

import Image from "next/image";
import Button from "./Button";
import ScrollReveal from "./ScrollReveal";
import { useLanguage } from "@/context/LanguageContext";

const steps = [
  {
    step: "01",
    icon: "/map.svg",
  },
  {
    step: "02",
    icon: "/calendar.svg",
  },
  {
    step: "03",
    icon: "/location.svg",
  },
];

const HowItWorks = () => {
  const { t, language } = useLanguage();

  return (
    <section className="padding-container max-container py-12 lg:py-16">
      <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-20">
        {/* Left — heading */}
        <ScrollReveal variant="fade-right" duration={0.8}>
          <div className="lg:sticky lg:top-28">
            <span className="section-badge">{t("how_title" as any)}</span>
            <h2 className="bold-40 mt-4 text-gray-90 dark:text-white lg:bold-52">
              {language === "vi" ? (
                <>
                  Đặt tour chỉ <span className="text-green-50">3 bước</span>
                </>
              ) : (
                <>
                  Book in just <span className="text-green-50">3 steps</span>
                </>
              )}
            </h2>
            <p className="regular-16 mt-4 max-w-md leading-relaxed text-gray-30 dark:text-stone-400">
              {t("how_description" as any)}
            </p>
            <div className="mt-8 hidden lg:block">
              <Button title={t("how_btn" as any)} variant="btn_green" href="/tours" />
            </div>
          </div>
        </ScrollReveal>

        {/* Right — vertical timeline */}
        <div className="relative flex flex-col gap-0">
          {/* Vertical line */}
          <div className="absolute bottom-8 left-6 top-8 w-px bg-gradient-to-b from-green-50 via-green-50/40 to-transparent lg:left-7" />

          {steps.map((item, index) => (
            <ScrollReveal 
              key={item.step} 
              variant="fade-left" 
              duration={0.6} 
              delay={index * 0.18}
            >
              <div className="group relative flex gap-6 pb-10 last:pb-0">
                {/* Step circle */}
                <div className="relative z-10 flex-shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 shadow-lg shadow-green-50/30 transition-transform duration-300 group-hover:scale-110 lg:h-14 lg:w-14">
                    <Image
                      src={item.icon}
                      alt=""
                      width={22}
                      height={22}
                      className="brightness-0 invert"
                      unoptimized
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 rounded-2xl border border-gray-10 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 transition-all duration-300 group-hover:border-green-50/30 dark:group-hover:border-green-50/50 group-hover:shadow-md">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold uppercase tracking-widest text-green-50">
                      {t("how_step" as any)} {item.step}
                    </span>
                    {index < steps.length - 1 && (
                      <span className="h-px flex-1 bg-gray-10 dark:bg-stone-800" />
                    )}
                  </div>
                  <h3 className="bold-20 mt-2 text-gray-90 dark:text-white">{t(`step_title_${index}` as any)}</h3>
                  <p className="regular-14 mt-2 leading-relaxed text-gray-30 dark:text-stone-400 lg:regular-16">
                    {t(`step_desc_${index}` as any)}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="lg:hidden">
          <Button title={t("how_btn" as any)} variant="btn_green" href="/tours" full />
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
