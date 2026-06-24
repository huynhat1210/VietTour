import { fetchDestinations, fetchTours } from "@/lib/data";
import TourCard from "@/components/TourCard";
import ScrollReveal from "@/components/ScrollReveal";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { TRANSLATIONS } from "@/constants/translations";

interface DestinationDetailPageProps {
  params: Promise<{ slug: string }>;
}

const getFallbackDetails = (name: string, region: string, locale: string) => {
  const isEn = locale === "en";
  return {
    intro: isEn
      ? `Explore ${name} in ${region} - a promising tourist destination with beautiful natural scenery, rich local cuisine, and unique cultural features waiting for you to experience.`
      : `Khám phá ${name} tại ${region} - điểm đến du lịch đầy hứa hẹn với cảnh sắc thiên nhiên tuyệt đẹp, ẩm thực địa phương phong phú và những nét văn hóa đặc sắc đang chờ đón bạn trải nghiệm.`,
    spots: [
      {
        name: isEn ? `Scenic spots in ${name}` : `Danh lam thắng cảnh tại ${name}`,
        description: isEn
          ? `Top famous beautiful landscapes in ${name} attracting tourist crowds every year.`
          : `Những cảnh quan tuyệt mỹ nổi tiếng hàng đầu của vùng đất ${name} thu hút đông đảo du khách ghé thăm hàng năm.`,
        image: "https://images.unsplash.com/photo-1528127269322-539801943592?w=800&q=80"
      },
      {
        name: isEn ? `Local Culture & Life` : `Văn hóa & Đời sống địa phương`,
        description: isEn
          ? `Experience the unique daily life, traditional festivals, and the warm hospitality of the locals here.`
          : `Trải nghiệm những nét sinh hoạt thường ngày độc đáo, lễ hội truyền thống cùng sự thân thiện, mến khách của người dân nơi đây.`,
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80"
      }
    ],
    tips: isEn
      ? [
        "Check the weather beforehand and plan your travel itinerary in detail.",
        "Bring appropriate clothing for visiting spiritual sites or outdoor excursions.",
        "Enjoy unique local street food specialties."
      ]
      : [
        "Tìm hiểu trước thời tiết và lên lịch trình di chuyển chi tiết.",
        "Mang theo trang phục phù hợp với các địa điểm tham quan tâm linh hoặc dã ngoại ngoài trời.",
        "Thưởng thức các đặc sản ẩm thực đường phố độc đáo tại địa phương."
      ]
  };
};

export async function generateMetadata({
  params,
}: DestinationDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const cookieStore = await cookies();
  const locale = cookieStore.get("locale")?.value || "vi";
  const destinations = await fetchDestinations(false, locale);
  const d = destinations.find((x) => x.slug === slug);
  if (!d) return { title: locale === "en" ? "Destination Not Found" : "Điểm đến không tồn tại" };

  return {
    title: locale === "en" ? `Explore ${d.name} | VietTour` : `Khám phá ${d.name} | VietTour`,
    description: d.description,
  };
}

export default async function DestinationDetailPage({
  params,
}: DestinationDetailPageProps) {
  const { slug } = await params;
  const cookieStore = await cookies();
  const locale = cookieStore.get("locale")?.value || "vi";
  const dict = TRANSLATIONS[locale as keyof typeof TRANSLATIONS] || TRANSLATIONS.vi;

  const destinations = await fetchDestinations(false, locale);
  const d = destinations.find((x) => x.slug === slug);

  if (!d) notFound();

  const details = {
    intro: d.intro || d.description || getFallbackDetails(d.name, d.region, locale).intro,
    spots: d.spots || getFallbackDetails(d.name, d.region, locale).spots,
    tips: d.tips || getFallbackDetails(d.name, d.region, locale).tips,
  };

  const tours = await fetchTours(false, locale);
  const matchingTours = tours.filter(
    (t) =>
      t.destination?.slug === slug ||
      t.location.toLowerCase().includes(d.name.toLowerCase()) ||
      d.name.toLowerCase().includes(t.location.toLowerCase())
  );

  const heroImageUrl =
    d.image?.url ||
    "https://images.unsplash.com/photo-1528127269322-539801943592?w=1200&q=85";

  return (
    <section className="padding-container max-container py-12 lg:py-16">
      {/* Back to destinations listing */}
      <div className="mb-6">
        <Link
          href="/destinations"
          className="regular-16 inline-flex items-center gap-2 font-semibold text-green-50 hover:underline"
          id="back-to-destinations-link"
        >
          {dict.dest_detail_back}
        </Link>
      </div>

      {/* Hero Section */}
      <ScrollReveal variant="fade-in" duration={0.8}>
        <div className="relative h-[350px] lg:h-[480px] w-full overflow-hidden rounded-[2.5rem] shadow-xl shadow-slate-100/50">
          <Image
            src={heroImageUrl}
            alt={d.name}
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12 text-white">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-wider text-white backdrop-blur-sm shadow-md">
              📍 {d.region}
            </span>
            <h1 className="bold-32 lg:bold-52 mt-4 text-white leading-tight tracking-tight">
              {d.name}
            </h1>
            <p className="mt-3 text-xs lg:text-sm font-medium text-white/80 max-w-xl leading-relaxed">
              {d.description}
            </p>
          </div>
        </div>
      </ScrollReveal>

      {/* Two Column Details Grid */}
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-3 mt-12">
        {/* Left Column (Main details & Spots) */}
        <div className="lg:col-span-2">
          <ScrollReveal variant="fade-up" duration={0.8}>
            <div className="bg-white rounded-[2rem] border border-slate-100/80 p-6 md:p-8 shadow-sm">
              <span className="text-[10px] font-black uppercase tracking-widest text-green-50">
                {dict.dest_detail_overview}
              </span>
              <h2 className="mt-2 text-2xl font-bold text-slate-800 leading-tight">
                {dict.dest_detail_discover_beauty}
              </h2>
              <p className="mt-4 text-sm font-semibold text-slate-500 leading-relaxed">
                {details.intro}
              </p>
            </div>
          </ScrollReveal>

          {/* Spots Grid */}
          <div className="mt-10">
            <ScrollReveal variant="fade-up" duration={0.8}>
              <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                {dict.dest_detail_spots}
              </h3>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {details.spots.map((spot, idx) => (
                <ScrollReveal key={idx} variant="fade-up" duration={0.8} delay={idx * 0.1}>
                  <div className="group overflow-hidden rounded-[2rem] border border-slate-100 bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-md">
                    <div className="relative h-44 w-full overflow-hidden rounded-2xl bg-slate-55">
                      <Image
                        src={spot.image}
                        alt={spot.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <h4 className="mt-4 text-base font-bold text-slate-800 transition-colors group-hover:text-green-50">
                      {spot.name}
                    </h4>
                    <p className="mt-2 text-xs font-semibold text-slate-500 leading-relaxed">
                      {spot.description}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>

          {/* Travel Tips */}
          <div className="mt-10">
            <ScrollReveal variant="fade-up" duration={0.8}>
              <div className="rounded-[2rem] border border-slate-100 bg-emerald-50/20 p-6 md:p-8">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  {dict.dest_detail_tips}
                </h3>
                <ul className="space-y-3">
                  {details.tips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-xs md:text-sm font-semibold text-slate-600 leading-relaxed">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-50/15 text-[10px] text-green-50">
                        ✓
                      </span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* Right Column (Sidebar and Statistics Card) */}
        <div>
          <div className="lg:sticky lg:top-24 flex flex-col gap-6">
            <ScrollReveal variant="fade-left" duration={0.8}>
              <div className="rounded-[2rem] border border-slate-100 bg-white p-6 md:p-8 shadow-sm">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">
                  {dict.dest_detail_info_title}
                </h3>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-slate-100/50">
                    <span className="text-xs font-semibold text-slate-500">{dict.dest_detail_region}</span>
                    <span className="text-xs font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded-full">{d.region}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-slate-100/50">
                    <span className="text-xs font-semibold text-slate-500">{dict.dest_detail_active_tours}</span>
                    <span className="text-xs font-extrabold text-green-50 bg-green-50/10 px-3 py-1 rounded-full">
                      {locale === "en"
                        ? `${matchingTours.length} tour${matchingTours.length !== 1 ? "s" : ""}`
                        : `${matchingTours.length} tour`}
                    </span>
                  </div>
                </div>

                {matchingTours.length > 0 ? (
                  <a
                    href="#tours-showcase"
                    className="mt-8 flex w-full items-center justify-center bg-green-50 text-white font-bold text-sm py-4 rounded-2xl hover:bg-emerald-600 shadow-lg shadow-green-50/15 hover:shadow-xl hover:shadow-green-50/20 active:scale-95 transition-all duration-300 text-center"
                    id="view-matching-tours-btn"
                  >
                    {dict.dest_detail_view_available}
                  </a>
                ) : (
                  <Link
                    href="/tours"
                    className="mt-8 flex w-full items-center justify-center bg-slate-800 text-white font-bold text-sm py-4 rounded-2xl hover:bg-slate-750 shadow-md active:scale-95 transition-all duration-300 text-center"
                    id="view-all-tours-btn"
                  >
                    {dict.dest_detail_view_all}
                  </Link>
                )}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>

      {/* Matching Tours Showcase Section */}
      <div id="tours-showcase" className="mt-16 pt-12 border-t border-slate-150/80">
        <ScrollReveal variant="fade-up" duration={0.8}>
          <div className="mb-10 text-center max-w-xl mx-auto">
            <span className="text-[10px] font-black uppercase tracking-widest text-green-50">
              {dict.dest_detail_program}
            </span>
            <h2 className="mt-2 text-2xl font-black md:text-3xl text-slate-800 tracking-tight leading-tight">
              {dict.dest_detail_tours_at.replace("{name}", d.name)}
            </h2>
            <p className="mt-3 text-xs md:text-sm text-slate-500 font-semibold leading-relaxed">
              {dict.dest_detail_tours_desc.replace("{name}", d.name)}
            </p>
          </div>
        </ScrollReveal>

        {matchingTours.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-8">
            {matchingTours.map((tour, index) => (
              <ScrollReveal key={tour.id} variant="fade-up" duration={0.8} delay={index * 0.1}>
                <TourCard tour={tour} />
              </ScrollReveal>
            ))}
          </div>
        ) : (
          <ScrollReveal variant="fade-up" duration={0.8}>
            <div className="rounded-[2rem] bg-slate-55 border border-slate-100 p-10 text-center max-w-md mx-auto shadow-sm">
              <span className="text-3xl mb-4 block">🗓️</span>
              <p className="text-sm font-semibold text-slate-500">{dict.dest_detail_no_tours}</p>
              <Link
                href="/tours"
                className="mt-6 inline-flex items-center justify-center bg-green-50 text-white font-bold text-sm px-6 py-3 rounded-full hover:bg-emerald-600 shadow-md transition-all duration-300"
              >
                {dict.dest_detail_explore_other}
              </Link>
            </div>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
}
