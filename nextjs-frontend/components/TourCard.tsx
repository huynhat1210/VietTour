"use client";

import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { formatPrice } from "@/lib/format";
import type { Tour } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

interface TourCardProps {
  tour: Tour;
}

const TourCard = ({ tour }: TourCardProps) => {
  const { toggleFavorite, isFavorite } = useAuth();
  const { showToast } = useToast();
  const { t, language } = useLanguage();
  const favorited = isFavorite(tour.slug);

  const imageUrl =
    tour.image?.url ||
    "https://images.unsplash.com/photo-1528127269322-539801943592?w=800&q=85";

  const testimonials = tour.testimonials || [];
  const ratingCount = testimonials.length;
  const ratingScore = ratingCount > 0
    ? (testimonials.reduce((sum, r) => sum + r.rating, 0) / ratingCount).toFixed(1)
    : "5.0";

  return (
    <article className="group flex flex-col bg-transparent transition-all duration-350 hover:-translate-y-1.5">
      
      {/* Thumbnail section */}
      <Link
        href={`/tours/${tour.slug}`}
        className="relative block h-60 w-full overflow-hidden rounded-[2rem] bg-slate-100 dark:bg-stone-900 shadow-[0_8px_30px_rgb(0,0,0,0.015)] group-hover:shadow-[0_20px_40px_rgba(4,120,87,0.08)] dark:group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] transition-all duration-350"
      >
        <Image
          src={imageUrl}
          alt={tour.title}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        
        {/* Shadow overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 transition-opacity group-hover:opacity-80" />
        
        {/* Badges overlay */}
        <div className="absolute left-4 top-4 flex flex-col gap-2">
          {tour.featured && (
            <span className="rounded-full bg-amber-700/80 backdrop-blur-md px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white">
              {language === "vi" ? "Nổi bật" : "Featured"}
            </span>
          )}
          {tour.destination && (
            <span className="w-fit rounded-full bg-black/40 backdrop-blur-md px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
              {tour.destination.name}
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(tour.slug);
            if (favorited) {
              showToast(
                language === "vi"
                  ? "Đã xóa tour khỏi danh sách yêu thích."
                  : "Removed tour from wishlist.",
                "info"
              );
            } else {
              showToast(
                language === "vi"
                  ? "Đã thêm tour vào danh sách yêu thích."
                  : "Added tour to wishlist.",
                "success"
              );
            }
          }}
          className={`absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 dark:bg-stone-900/80 backdrop-blur-md shadow-sm transition-all duration-300 hover:scale-110 active:scale-90 ${
            favorited ? "text-red-500 bg-white dark:bg-stone-850" : "text-slate-700 dark:text-stone-300 hover:text-red-500"
          } cursor-pointer`}
          aria-label={favorited ? (language === "vi" ? "Xóa khỏi yêu thích" : "Remove from favorites") : (language === "vi" ? "Thêm vào yêu thích" : "Add to favorites")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill={favorited ? "currentColor" : "none"}
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-5 w-5 transition-colors duration-300"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
            />
          </svg>
        </button>

        {/* Floating duration badge on bottom right */}
        <span className="absolute bottom-4 right-4 rounded-full bg-black/40 px-3 py-1 text-[10px] font-bold text-white shadow-sm backdrop-blur-md">
          ⏱️ {tour.duration}
        </span>
      </Link>

      {/* Details section */}
      <div className="flex flex-1 flex-col gap-3 pt-4 px-1 pb-2">
        
        {/* Location & Rating Header */}
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-stone-400">
          <div className="flex items-center gap-1.5">
            <span className="text-emerald-600">📍</span>
            <span className="truncate max-w-[150px] font-bold text-slate-600 dark:text-stone-300">{tour.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-amber-500 text-sm">★</span>
            <span className="text-slate-800 dark:text-stone-200 font-extrabold">{ratingScore}</span>
            <span className="text-slate-400 dark:text-stone-500 font-normal">({ratingCount})</span>
          </div>
        </div>

        {/* Title */}
        <Link href={`/tours/${tour.slug}`}>
          <h3 className="font-extrabold text-[17px] text-slate-800 dark:text-stone-100 leading-snug transition-colors duration-300 group-hover:text-green-50 line-clamp-1">
            {tour.title}
          </h3>
        </Link>

        {/* Short Description */}
        <p className="text-xs text-slate-500 dark:text-stone-400 line-clamp-1 leading-relaxed">
          {tour.shortDescription}
        </p>

        {/* Small attribute chips */}
        <div className="flex flex-wrap gap-2 text-[10px] font-bold text-slate-500 dark:text-stone-400">
          <span className="bg-slate-100/60 dark:bg-stone-900/60 px-2.5 py-1 rounded-full">
            👤 Max: {tour.maxGroupSize} {language === "vi" ? "người" : "guests"}
          </span>
        </div>

        {/* Bottom Price and action */}
        <div className="mt-2 pt-3 border-t border-slate-150/80 dark:border-stone-850 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-400 dark:text-stone-500 uppercase tracking-widest">{t("tour_price_from" as any)}</p>
            <p className="text-[1.35rem] font-black text-green-50 mt-0.5">
              {formatPrice(tour.price)}
            </p>
          </div>
          
          <Link
            href={`/tours/${tour.slug}`}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50 text-white shadow-md shadow-green-50/10 hover:bg-emerald-600 transition-all duration-300 hover:shadow-lg hover:shadow-green-50/20 active:scale-95"
            aria-label="Xem chi tiết tour"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-0.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
};

export default TourCard;
