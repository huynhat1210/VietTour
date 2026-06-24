"use client";

import type { Testimonial } from "@/types";
import Image from "next/image";
import ScrollReveal from "./ScrollReveal";
import { useLanguage } from "@/context/LanguageContext";

interface TestimonialsProps {
  testimonials: Testimonial[];
}

const Testimonials = ({ testimonials }: TestimonialsProps) => {
  const { t, language } = useLanguage();
  const displayTestimonials = testimonials.slice(0, 5);
  const [featured, ...rest] = displayTestimonials;

  return (
    <section className="padding-container max-container py-12 lg:py-16">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
        {/* Left — rating summary */}
        <div className="lg:col-span-4">
          <ScrollReveal variant="fade-right" duration={0.8}>
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-green-50">
              {t("test_title" as any)}
            </p>
            <h2 className="bold-32 mt-2 text-gray-90 dark:text-white lg:bold-40">
              {t("test_subtitle" as any)}
            </h2>

            <div className="mt-8 rounded-2xl border border-gray-10 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 shadow-sm">
              <p className="bold-52 text-green-50">4.9</p>
              <div className="mt-2 flex gap-1">
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
              <p className="regular-14 mt-3 text-gray-30 dark:text-stone-400">
                {language === "vi" ? "Từ hơn 2.000+ đánh giá thực tế" : "From over 2,000+ genuine reviews"}
              </p>
            </div>
          </ScrollReveal>
        </div>

        {/* Right — testimonial cards */}
        <div className="flex flex-col gap-5 lg:col-span-8">
          {featured && (
            <ScrollReveal variant="fade-left" duration={0.8} delay={0.2}>
              <div className="relative rounded-2xl border border-gray-10 dark:border-stone-800 bg-white dark:bg-stone-900 p-8 shadow-sm">
                <Image
                  src="/quote.svg"
                  alt=""
                  width={40}
                  height={40}
                  className="absolute right-8 top-8 opacity-10"
                  unoptimized
                />
                <div className="mb-3 flex gap-1">
                  {Array(featured.rating)
                    .fill(1)
                    .map((_, i) => (
                      <Image
                        key={i}
                        src="/star.svg"
                        alt=""
                        width={16}
                        height={16}
                        unoptimized
                      />
                    ))}
                </div>
                <p className="regular-18 leading-relaxed text-gray-50 dark:text-stone-300 lg:regular-20">
                  &ldquo;{featured.content}&rdquo;
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-50 bold-16 text-white">
                    {featured.name.charAt(0)}
                  </div>
                  <div>
                    <p className="bold-16 text-gray-90 dark:text-stone-200">{featured.name}</p>
                    {featured.tour && (
                      <p className="regular-14 text-gray-20 dark:text-stone-400">{featured.tour}</p>
                    )}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          )}

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {rest.map((item, index) => (
              <ScrollReveal 
                key={item.id} 
                variant="fade-up" 
                duration={0.6} 
                delay={0.3 + index * 0.12}
                className="h-full"
              >
                <div className="h-full flex flex-col rounded-2xl border border-gray-10 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                  <div className="mb-3 flex gap-1">
                    {Array(item.rating)
                      .fill(1)
                      .map((_, i) => (
                        <Image
                          key={i}
                          src="/star.svg"
                          alt=""
                          width={16}
                          height={16}
                          unoptimized
                        />
                      ))}
                  </div>
                  <p className="regular-14 flex-1 leading-relaxed text-gray-30 dark:text-stone-400">
                    &ldquo;{item.content}&rdquo;
                  </p>
                  <div className="mt-5 flex items-center gap-3 border-t border-gray-10 dark:border-stone-800 pt-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-50/10 text-sm font-bold text-green-50">
                      {item.name.charAt(0)}
                    </div>
                    <div>
                      <p className="bold-16 text-gray-90 dark:text-stone-200">{item.name}</p>
                      {item.tour && (
                        <p className="regular-14 text-gray-20 dark:text-stone-400">{item.tour}</p>
                      )}
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
