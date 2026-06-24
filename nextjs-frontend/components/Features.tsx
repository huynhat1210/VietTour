"use client";

import { FEATURES } from "@/constants";
import { useLanguage } from "@/context/LanguageContext";
import Image from "next/image";
import ScrollReveal from "./ScrollReveal";

const Features = () => {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden bg-gray-90 py-12 lg:py-16">
      {/* Decorative blurs */}
      <div className="pointer-events-none absolute -left-32 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-green-50/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-0 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />

      <div className="padding-container relative z-10 max-container">
        <div className="mb-12 lg:mb-16">
          <ScrollReveal variant="fade-up" duration={0.6}>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-green-50">
              {t("features_subtitle" as any)}
            </p>
            <h2 className="bold-32 mt-2 text-white lg:bold-52">{t("features_title" as any)}</h2>
          </ScrollReveal>
        </div>

        <ul className="grid gap-5 sm:grid-cols-2 lg:gap-6">
          {FEATURES.map((feature, index) => (
            <ScrollReveal 
              key={index} 
              variant="fade-up" 
              duration={0.6} 
              delay={index * 0.1}
              className="h-full"
            >
              <FeatureItem
                index={index}
                title={t(`feature_title_${index}` as any)}
                icon={feature.icon}
                description={t(`feature_desc_${index}` as any)}
              />
            </ScrollReveal>
          ))}
        </ul>
      </div>
    </section>
  );
};

type FeatureItemProps = {
  index: number;
  title: string;
  icon: string;
  description: string;
};

const FeatureItem = ({ index, title, icon, description }: FeatureItemProps) => {
  return (
    <li className="h-full group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-7 backdrop-blur-sm transition-all duration-300 hover:border-green-50/40 hover:bg-white/10 lg:p-8">
      <span className="absolute right-6 top-6 text-5xl font-bold text-white/5 transition-colors group-hover:text-green-50/10">
        {String(index + 1).padStart(2, "0")}
      </span>

      <div className="relative z-10 flex gap-5">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-green-50 shadow-lg shadow-green-50/20 transition-transform duration-300 group-hover:scale-110">
          <Image
            src={icon}
            alt=""
            width={24}
            height={24}
            className="brightness-0 invert"
            unoptimized
          />
        </div>
        <div>
          <h3 className="bold-18 text-white lg:bold-20">{title}</h3>
          <p className="regular-14 mt-2 leading-relaxed text-white/60 lg:regular-16">
            {description}
          </p>
        </div>
      </div>
    </li>
  );
};

export default Features;
