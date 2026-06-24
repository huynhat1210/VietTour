import { fetchDestinations } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { TRANSLATIONS } from "@/constants/translations";
import ScrollReveal from "@/components/ScrollReveal";

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const locale = cookieStore.get("locale")?.value || "vi";
  const dict = TRANSLATIONS[locale as keyof typeof TRANSLATIONS] || TRANSLATIONS.vi;

  return {
    title: dict.dest_meta_title,
    description: dict.dest_meta_desc,
  };
}

export default async function DestinationsPage() {
  const cookieStore = await cookies();
  const locale = cookieStore.get("locale")?.value || "vi";
  const dict = TRANSLATIONS[locale as keyof typeof TRANSLATIONS] || TRANSLATIONS.vi;

  const destinations = await fetchDestinations(false, locale);

  return (
    <section className="padding-container max-container py-12 lg:py-16">
      {/* Header section */}
      <div className="mb-12 text-center max-w-2xl mx-auto flex flex-col gap-2">
        <ScrollReveal variant="fade-down" duration={0.6}>
          <span className="text-[10px] font-black uppercase tracking-widest text-green-50">
            {dict.dest_page_subtitle}
          </span>
        </ScrollReveal>
        <ScrollReveal variant="fade-up" duration={0.6} delay={0.15}>
          <h1 className="mt-1 text-3xl font-black md:text-4xl text-slate-800 dark:text-stone-100 tracking-tight leading-tight">
            {dict.dest_page_title}
          </h1>
        </ScrollReveal>
        <ScrollReveal variant="fade-up" duration={0.8} delay={0.3}>
          <p className="mt-1 text-xs md:text-sm text-slate-500 dark:text-stone-400 font-semibold leading-relaxed">
            {dict.dest_page_description}
          </p>
        </ScrollReveal>
      </div>

      {/* Grid listing */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {destinations.map((d, index) => (
          <ScrollReveal
            key={d.slug}
            variant="fade-up"
            duration={0.6}
            delay={0.1 + (index % 3) * 0.1}
            className="h-full"
          >
            <Link
              href={`/destinations/${d.slug}`}
              className="group relative flex flex-col justify-between overflow-hidden rounded-[2rem] border border-slate-100 dark:border-stone-700/60 bg-white dark:bg-stone-800 p-4 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-green-50/20 hover:shadow-xl hover:shadow-green-50/5 h-full"
            >
              <div>
                {/* Image container */}
                <div className="relative h-56 w-full overflow-hidden rounded-2xl bg-slate-100 dark:bg-stone-700">
                  <Image
                    src={d.image?.url || "https://images.unsplash.com/photo-1528127269322-539801943592?w=800&q=85"}
                    alt={d.image?.alternativeText || d.name}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                  <span className="absolute left-3.5 top-3.5 rounded-full bg-black/60 px-3 py-1 text-[10px] font-semibold text-white/90 backdrop-blur-sm">
                    📍 {d.region}
                  </span>
                </div>

                {/* Title & Description */}
                <div className="mt-5 px-1">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-stone-100 transition-colors duration-300 group-hover:text-green-50">
                    {d.name}
                  </h3>
                  <p className="mt-2 text-xs font-semibold text-slate-500 dark:text-stone-400 leading-relaxed line-clamp-3">
                    {d.description}
                  </p>
                </div>
              </div>

              {/* Read more footer */}
              <div className="mt-6 border-t border-slate-100/80 dark:border-stone-700/60 pt-3.5 px-1 flex items-center justify-between text-xs font-bold text-green-50">
                <span>{dict.dest_tours_link}</span>
                <span className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
              </div>
            </Link>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
