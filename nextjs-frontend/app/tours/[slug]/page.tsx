import TourGallery from "@/components/TourGallery";
import { fetchTourBySlug, fetchTours } from "@/lib/data";
import { formatPrice } from "@/lib/format";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { TRANSLATIONS } from "@/constants/translations";
import BookingForm from "@/components/BookingForm";
import TourReviews from "@/components/TourReviews";
import TourCard from "@/components/TourCard";


interface TourDetailPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60; // Revalidate this page every 60 seconds

export async function generateStaticParams() {
  try {
    const tours = await fetchTours(false, "vi");
    return tours.map((tour) => ({
      slug: tour.slug,
    }));
  } catch (error) {
    console.error("Error in generateStaticParams:", error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: TourDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const cookieStore = await cookies();
  const locale = cookieStore.get("locale")?.value || "vi";
  const tour = await fetchTourBySlug(slug, locale);
  if (!tour) return { title: locale === "en" ? "Tour Not Found" : "Tour không tồn tại" };

  return {
    title: tour.title,
    description: tour.shortDescription,
  };
}

export default async function TourDetailPage({ params }: TourDetailPageProps) {
  const { slug } = await params;
  const cookieStore = await cookies();
  const locale = cookieStore.get("locale")?.value || "vi";
  const dict = TRANSLATIONS[locale as keyof typeof TRANSLATIONS] || TRANSLATIONS.vi;
  
  const [tour, allTours] = await Promise.all([
    fetchTourBySlug(slug, locale),
    fetchTours(false, locale),
  ]);

  if (!tour) notFound();

  const suggestedTours = allTours.filter((t) => t.slug !== slug).slice(0, 3);

  const imageUrl =
    tour.image?.url ||
    "https://images.unsplash.com/photo-1528127269322-539801943592?w=1200&q=80";

  const galleryUrls = tour.images?.map((img) => img.url) || [];

  return (
    <section className="padding-container max-container py-16 lg:py-24">
      <Link
        href="/tours"
        className="regular-16 mb-8 inline-flex items-center gap-2 text-green-50 hover:underline"
      >
        ← {dict.detail_back}
      </Link>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <div>
          <TourGallery mainImage={imageUrl} slug={slug} galleryImages={galleryUrls} />

          <h1 className="bold-32 lg:bold-40 dark:text-stone-100">{tour.title}</h1>
          <p className="regular-16 mt-4 text-gray-30 dark:text-stone-400">{tour.description}</p>

          {tour.itinerary && (
            <div className="mt-8">
              <h2 className="bold-20 mb-4 dark:text-stone-100">{dict.detail_itinerary}</h2>
              <pre className="regular-16 whitespace-pre-wrap rounded-2xl bg-gray-10/50 dark:bg-stone-800 border border-transparent dark:border-stone-700 p-6 text-gray-30 dark:text-stone-400">
                {tour.itinerary}
              </pre>
            </div>
          )}

        </div>

        <div className="flex flex-col gap-8">
          <div className="grid grid-cols-2 gap-4 rounded-3xl border border-gray-10 dark:border-stone-700 bg-white dark:bg-stone-800 p-6 shadow-sm">
            <div>
              <p className="regular-14 text-gray-20 dark:text-stone-500">{dict.detail_price}</p>
              <p className="bold-24 text-green-50">{formatPrice(tour.price)}</p>
            </div>
            <div>
              <p className="regular-14 text-gray-20 dark:text-stone-500">{dict.detail_duration}</p>
              <p className="bold-18 dark:text-stone-100">{tour.duration}</p>
            </div>
            <div>
              <p className="regular-14 text-gray-20 dark:text-stone-500">{dict.detail_location}</p>
              <p className="bold-18 dark:text-stone-100">{tour.location}</p>
            </div>
            <div>
              <p className="regular-14 text-gray-20 dark:text-stone-500">{dict.detail_max_size}</p>
              <p className="bold-18 dark:text-stone-100">{tour.maxGroupSize} {dict.detail_max_size_value}</p>
            </div>
            {tour.destination && (
              <div>
                <p className="regular-14 text-gray-20 dark:text-stone-500">{dict.detail_destination}</p>
                <p className="bold-18 dark:text-stone-100">{tour.destination.name}</p>
              </div>
            )}
          </div>

          <BookingForm tour={tour} />
        </div>
      </div>

      <TourReviews
        tourSlug={slug}
        tourTitle={tour.title}
        mapContent={tour.location ? (() => {
          const osmQuery = encodeURIComponent(tour.location + ", Vietnam");
          const osmSrc = `https://www.openstreetmap.org/export/embed.html?bbox=&layer=mapnik&marker=&query=${osmQuery}`;
          const mapSrc = tour.mapUrl || osmSrc;
          const googleMapsLink = `https://www.google.com/maps/search/${encodeURIComponent(tour.location + ", Vietnam")}`;
          return (
            <div className="w-full">
              <div className="flex items-center justify-between mb-4">
                <h2 className="bold-20">📍 {dict.detail_map}</h2>
                <a
                  href={googleMapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-full bg-green-50/10 border border-green-50/30 px-4 py-1.5 text-xs font-semibold text-green-50 hover:bg-green-50/20 transition-colors"
                >
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  {dict.detail_map_btn}
                </a>
              </div>
              <div className="overflow-hidden rounded-3xl border border-gray-10 dark:border-stone-700 bg-slate-55 shadow-sm aspect-video w-full relative">
                <iframe
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={mapSrc}
                  title={`${dict.detail_map} ${tour.location}`}
                />
                {/* Location label overlay */}
                <div className="pointer-events-none absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur-sm px-3 py-1.5 shadow-sm border border-gray-10/50">
                  <span className="text-xs font-bold text-gray-90">📌</span>
                  <span className="text-xs font-semibold text-gray-70">{tour.location}</span>
                </div>
              </div>
              {!tour.mapUrl && (
                <p className="mt-2 text-[11px] text-gray-20 text-right">
                  🗺️ {locale === "en" ? 'OpenStreetMap · Click "Open Google Maps" to view details' : 'Bản đồ OpenStreetMap · Nhấn "Mở Google Maps" để xem chi tiết'}
                </p>
              )}
            </div>
          );
        })() : undefined}
      />

      {/* Suggested Tours Section */}
        {suggestedTours.length > 0 && (
        <div className="mt-16 border-t border-gray-10 dark:border-stone-700 pt-16">
          <div className="flex flex-col gap-2 mb-10 text-center sm:text-left">
            <span className="text-sm font-semibold uppercase tracking-[0.15em] text-green-50">
              {locale === "vi" ? "Gợi ý hành trình" : "Suggested Journeys"}
            </span>
            <h2 className="bold-28 sm:bold-32 text-gray-90 dark:text-stone-100">
              {locale === "vi" ? "Các tour gợi ý khác" : "Other suggested tours"}
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {suggestedTours.map((t) => (
              <TourCard key={t.id} tour={t} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
