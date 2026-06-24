"use client";

import { STATS } from "@/constants";
import { useLanguage } from "@/context/LanguageContext";
import Image from "next/image";
import Button from "./Button";
import ScrollReveal from "./ScrollReveal";
import { useEffect, useState } from "react";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1528127269322-539801943592?w=1920&q=85&auto=format&fit=crop";

const Hero = () => {
  const [scrollY, setScrollY] = useState(0);
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getStatLabelKey = (label: string) => {
    if (label === "Khách hàng") return "stats_customers";
    if (label === "Tour du lịch") return "stats_tours";
    if (label === "Tỉnh thành") return "stats_provinces";
    if (label === "Đánh giá") return "stats_rating";
    return label;
  };

  return (
    <section className="relative min-h-[calc(100vh-64px)] overflow-hidden">
      {/* Background image with Parallax effect */}
      <div
        className="absolute inset-0 w-full h-full scale-110"
        style={{ transform: `translateY(${scrollY * 0.35}px)` }}
      >
        <Image
          src={HERO_IMAGE}
          alt="Vịnh Hạ Long"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent dark:from-black/70 dark:via-black/50 dark:to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent lg:hidden" />
      </div>

      <div className="padding-container relative z-10 mx-auto flex min-h-[calc(100vh-64px)] max-w-[1440px] items-center py-8 lg:py-12">
        <div className="w-full lg:max-w-[70%]">
          {/* Left — copy */}
          <div className="flex flex-col">
            <ScrollReveal variant="fade-down" duration={0.6} delay={0.1}>
              <span className="mb-3 inline-flex w-fit items-center gap-2 rounded-full border border-emerald-500/35 bg-emerald-500/10 px-4 py-2 backdrop-blur-sm">
                <Image src="/location.svg" alt="" width={18} height={18} unoptimized />
                <span className="medium-14 uppercase tracking-wide text-emerald-400">
                  {t("hero_location" as any)}
                </span>
              </span>
            </ScrollReveal>

            <ScrollReveal variant="fade-up" duration={0.8} delay={0.2}>
              <h1 className="bold-32 leading-tight text-white sm:bold-40 lg:bold-52 xl:bold-64">
                {t("hero_title_1" as any)}{" "}
                <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  {t("hero_title_2" as any)}
                </span>
              </h1>
            </ScrollReveal>

            <ScrollReveal variant="fade-up" duration={0.8} delay={0.35}>
              <p className="regular-16 mt-4 max-w-[520px] leading-relaxed text-stone-200/90 lg:regular-18">
                {t("hero_description" as any)}
              </p>
            </ScrollReveal>

            <ScrollReveal variant="zoom-in" duration={0.8} delay={0.5}>
              <div className="my-4 flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-1.5 rounded-full bg-white/10 border border-white/10 px-4 py-2 shadow-sm backdrop-blur-sm">
                  {Array(5)
                    .fill(1)
                    .map((_, i) => (
                      <Image
                        key={i}
                        src="/star.svg"
                        alt=""
                        width={20}
                        height={20}
                        unoptimized
                      />
                    ))}
                </div>
                <p className="bold-16 text-white">
                  4.9/5
                  <span className="regular-16 ml-1 font-normal text-white/70">
                    {t("hero_reviews" as any)}
                  </span>
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal variant="fade-up" duration={0.8} delay={0.6}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button title={t("hero_explore" as any)} variant="btn_green" href="/tours" />
                <Button
                  title={t("hero_learn_more" as any)}
                  icon="/play.svg"
                  variant="btn_white_text"
                  href="/about"
                />
              </div>
            </ScrollReveal>

            {/* Stats row */}
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {STATS.map((stat, index) => (
                <ScrollReveal
                  key={stat.label}
                  variant="fade-up"
                  duration={0.6}
                  delay={0.7 + index * 0.1}
                >
                  <div className="h-full rounded-2xl border border-white/10 bg-black/35 p-4 shadow-lg backdrop-blur-md transition-transform duration-300 hover:-translate-y-1 hover:shadow-md">
                    <p className="bold-20 text-emerald-400 lg:bold-24">{stat.value}</p>
                    <p className="regular-14 text-white/75">{t(getStatLabelKey(stat.label) as any)}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
