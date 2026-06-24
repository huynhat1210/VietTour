"use client";

import { formatPrice } from "@/lib/format";
import type { Tour } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

const TOUR_IMAGES: Record<string, string> = {
  "ha-long-2n1d":
    "https://images.unsplash.com/photo-1528127269322-539801943592?w=1200&q=85",
  "hoi-an-da-nang-3n2d":
    "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=1200&q=85",
  "sa-pa-fansipan-3n2d":
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=85",
  "mien-tay-2n1d":
    "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&q=85",
  "phu-quoc-4n3d":
    "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=1200&q=85",
  "ninh-binh-2n1d":
    "https://images.unsplash.com/photo-1583417319070-4a6bedd02e64?w=1200&q=85",
};

function getTourImage(tour: Tour) {
  return (
    tour.image?.url ||
    TOUR_IMAGES[tour.slug] ||
    "https://images.unsplash.com/photo-1528127269322-539801943592?w=1200&q=85"
  );
}

interface FeaturedToursShowcaseProps {
  tours: Tour[];
}

const FeaturedToursShowcase = ({ tours }: FeaturedToursShowcaseProps) => {
  const featured = tours.filter((t) => t.featured).slice(0, 4);
  const displayTours = featured.length >= 3 ? featured : tours.slice(0, 4);

  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const next = useCallback(() => {
    setActive((i) => (i + 1) % displayTours.length);
  }, [displayTours.length]);

  useEffect(() => {
    if (isPaused || displayTours.length <= 1) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [isPaused, next, displayTours.length]);

  const hero = displayTours[active];
  const others = displayTours
    .map((t, i) => ({ tour: t, index: i }))
    .filter(({ index }) => index !== active)
    .slice(0, 3);

  if (!hero) return null;

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Tab pills */}
      <div className="mb-6 flex flex-wrap gap-2">
        {displayTours.map((tour, i) => (
          <button
            key={tour.id}
            type="button"
            onClick={() => setActive(i)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
              i === active
                ? "bg-green-50 text-white shadow-lg shadow-green-50/25"
                : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
            }`}
          >
            {tour.location}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-5">
        {/* Hero spotlight */}
        <Link
          href={`/tours/${hero.slug}`}
          className="group relative min-h-[380px] overflow-hidden rounded-3xl lg:col-span-7 lg:min-h-[520px]"
        >
          {displayTours.map((tour, i) => (
            <div
              key={tour.id}
              className={`absolute inset-0 transition-all duration-700 ${
                i === active
                  ? "scale-100 opacity-100"
                  : "scale-105 opacity-0"
              }`}
            >
              <Image
                src={getTourImage(tour)}
                alt={tour.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 60vw"
                priority={i === 0}
              />
            </div>
          ))}

          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />

          <div className="relative z-10 flex h-full flex-col justify-end p-6 lg:p-10">
            <span className="mb-3 w-fit rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-widest text-white/80 backdrop-blur-md">
              Top {String(active + 1).padStart(2, "0")}
            </span>
            <h3 className="bold-28 max-w-lg text-white transition-transform duration-300 group-hover:translate-x-1 lg:bold-40">
              {hero.title}
            </h3>
            <p className="regular-14 mt-3 max-w-md text-white/70 lg:regular-16">
              {hero.shortDescription}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <span className="rounded-2xl bg-white/15 px-5 py-2.5 backdrop-blur-md">
                <span className="regular-14 text-white/60">Từ </span>
                <span className="bold-20 text-white">
                  {formatPrice(hero.price)}
                </span>
              </span>
              <span className="regular-14 text-white/60">{hero.duration}</span>
              <span className="ml-auto flex items-center gap-2 text-sm font-semibold text-green-50 opacity-0 transition-opacity group-hover:opacity-100">
                Khám phá
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-50 text-white">
                  →
                </span>
              </span>
            </div>
          </div>
        </Link>

        {/* Side list */}
        <div className="flex flex-col gap-4 lg:col-span-5">
          {others.map(({ tour, index }) => (
            <button
              key={tour.id}
              type="button"
              onClick={() => setActive(index)}
              className="group flex flex-1 items-center gap-4 overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-3 text-left backdrop-blur-sm transition-all duration-300 hover:border-green-50/40 hover:bg-white/10 lg:p-4"
            >
              <div className="relative h-20 w-24 flex-shrink-0 overflow-hidden rounded-xl lg:h-24 lg:w-28">
                <Image
                  src={getTourImage(tour)}
                  alt={tour.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="112px"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-white/50">{tour.location}</p>
                <p className="bold-16 mt-0.5 line-clamp-2 text-white group-hover:text-green-50">
                  {tour.title}
                </p>
                <div className="mt-2 flex items-center gap-3">
                  <span className="text-sm font-semibold text-green-50">
                    {formatPrice(tour.price)}
                  </span>
                  <span className="text-xs text-white/40">{tour.duration}</span>
                </div>
              </div>
              <span className="flex-shrink-0 text-white/30 transition-all group-hover:text-green-50">
                →
              </span>
            </button>
          ))}

          <Link
            href="/tours"
            className="flex items-center justify-center gap-2 rounded-2xl border border-dashed border-white/20 py-4 text-sm font-medium text-white/60 transition-all hover:border-green-50/50 hover:text-green-50"
          >
            Xem tất cả tour
            <span>↗</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FeaturedToursShowcase;
