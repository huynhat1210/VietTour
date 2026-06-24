"use client";

import type { Destination } from "@/types";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

interface DestinationCardProps {
  destination: Destination;
}

const DestinationCard = ({ destination }: DestinationCardProps) => {
  const imageUrl =
    destination.image?.url ||
    "https://images.unsplash.com/photo-1528127269322-539801943592?w=1200&q=85";

  return (
    <Link
      href={`/destinations/${destination.slug}`}
      className="destination-card group relative block h-[400px] overflow-hidden rounded-3xl shadow-lg ring-1 ring-black/5 lg:h-[440px] lg:rounded-5xl"
    >
      <span className="destination-shine pointer-events-none absolute inset-0 z-20" />

      <Image
        src={imageUrl}
        alt={destination.name}
        fill
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        sizes="(max-width: 1024px) 100vw, 33vw"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 transition-all duration-500 group-hover:from-green-90/95 group-hover:via-black/50" />
      <div className="absolute inset-0 bg-green-50/0 transition-colors duration-500 group-hover:bg-green-50/10" />
      <div className="absolute inset-0 rounded-3xl ring-2 ring-transparent transition-all duration-500 group-hover:ring-green-50/60 lg:rounded-5xl" />

      <div className="relative z-10 flex h-full flex-col justify-end p-6 lg:p-8">
        <span className="mb-auto flex w-fit items-center gap-2 rounded-full bg-white/20 px-3 py-1.5 backdrop-blur-md transition-all duration-500 group-hover:bg-green-50 group-hover:shadow-lg group-hover:shadow-green-50/30">
          <Image
            src="/folded-map.svg"
            alt=""
            width={16}
            height={16}
            className="transition-[filter] group-hover:brightness-0 group-hover:invert"
            unoptimized
          />
          <span className="regular-14 text-white">{destination.region}</span>
        </span>

        <div className="translate-y-2 transition-transform duration-500 group-hover:translate-y-0">
          <h3 className="bold-24 text-white transition-colors duration-300 group-hover:text-green-50 lg:bold-32">
            {destination.name}
          </h3>
          <p className="regular-14 mt-2 line-clamp-2 max-h-0 overflow-hidden text-white/80 opacity-0 transition-all duration-500 group-hover:max-h-20 group-hover:opacity-100 lg:regular-16">
            {destination.description}
          </p>
        </div>

        <div className="mt-4 flex translate-y-4 items-center justify-between opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <span className="regular-14 font-semibold text-white">
            Khám phá ngay
          </span>
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50 text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
            →
          </span>
        </div>
      </div>
    </Link>
  );
};

interface DestinationSliderProps {
  destinations: Destination[];
}

const autoplayPlugin = Autoplay({
  delay: 4000,
  stopOnInteraction: false,
  stopOnMouseEnter: true,
});

const DestinationSlider = ({ destinations }: DestinationSliderProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      align: "start",
      loop: true,
      slidesToScroll: 1,
    },
    [autoplayPlugin]
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
    autoplayPlugin.reset();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
    autoplayPlugin.reset();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div className="padding-container max-container relative">
      {/* Prev button — left */}
      <button
        type="button"
        onClick={scrollPrev}
        aria-label="Slide trước"
        className="absolute left-2 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-gray-10 dark:border-stone-850 bg-white dark:bg-stone-900 text-lg text-gray-90 dark:text-stone-100 shadow-md transition-all hover:border-green-50 hover:bg-green-50 hover:text-white lg:left-4 lg:h-12 lg:w-12 cursor-pointer"
      >
        ←
      </button>

      {/* Next button — right */}
      <button
        type="button"
        onClick={scrollNext}
        aria-label="Slide sau"
        className="absolute right-2 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-gray-10 dark:border-stone-850 bg-white dark:bg-stone-900 text-lg text-gray-90 dark:text-stone-100 shadow-md transition-all hover:border-green-50 hover:bg-green-50 hover:text-white lg:right-4 lg:h-12 lg:w-12 cursor-pointer"
      >
        →
      </button>

      {/* Slider — 3 cards on desktop */}
      <div className="mx-12 overflow-hidden lg:mx-14" ref={emblaRef}>
        <div className="flex touch-pan-y">
          {destinations.map((destination) => (
            <div
              key={destination.id}
              className="min-w-0 flex-[0_0_100%] px-2 sm:flex-[0_0_50%] lg:flex-[0_0_33.333%]"
            >
              <DestinationCard destination={destination} />
            </div>
          ))}
        </div>
      </div>

      {/* Pagination dots */}
      <div className="mt-8 flex items-center justify-center gap-2">
        {scrollSnaps.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => scrollTo(index)}
            aria-label={`Đến slide ${index + 1}`}
            className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
              index === selectedIndex
                ? "w-8 bg-green-50"
                : "w-2 bg-gray-20 dark:bg-stone-700 hover:bg-green-50/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default DestinationSlider;
