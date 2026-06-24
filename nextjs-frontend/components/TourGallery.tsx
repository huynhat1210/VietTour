"use client";

import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import { useLanguage } from "@/context/LanguageContext";

interface TourGalleryProps {
  mainImage: string;
  slug: string;
  galleryImages?: string[];
}

// Supplemental high-quality gallery photos mapped by tour slug
const SUPPLEMENTAL_IMAGES: Record<string, string[]> = {
  "ha-long-2n1d": [
    "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=1200&q=80",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80",
    "https://images.unsplash.com/photo-1605538032432-a9f0c8d9baac?w=1200&q=80",
    "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&q=80",
  ],
  "sa-pa-fansipan-3n2d": [
    "https://images.unsplash.com/photo-1583417319070-4a6bedd02e64?w=1200&q=80",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
    "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=1200&q=80",
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&q=80",
  ],
  "hoi-an-da-nang-3n2d": [
    "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=1200&q=80",
    "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?w=1200&q=80",
    "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=1200&q=80",
    "https://images.unsplash.com/photo-1528127269322-539801943592?w=1200&q=80",
  ],
};

const DEFAULT_FALLBACKS = [
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
  "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=1200&q=80",
  "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=1200&q=80",
];

export default function TourGallery({ mainImage, slug, galleryImages }: TourGalleryProps) {
  const { language } = useLanguage();
  const [images, setImages] = useState<string[]>([]);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Combine main image + galleryImages or supplemental images on mount or slug change
  useEffect(() => {
    const supplementals =
      galleryImages && galleryImages.length > 0
        ? galleryImages
        : (SUPPLEMENTAL_IMAGES[slug] || DEFAULT_FALLBACKS);
    setImages([mainImage, ...supplementals.slice(0, 4)]);
    setActiveIdx(0);
  }, [mainImage, slug, galleryImages]);

  const handlePrev = useCallback(() => {
    setActiveIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const handleNext = useCallback(() => {
    setActiveIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  // Smooth transition effect when switching slides
  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 250);
    return () => clearTimeout(timer);
  }, [activeIdx]);

  // Slideshow auto-play (every 4 seconds), pauses on mouse hover or when lightbox is open
  useEffect(() => {
    if (images.length <= 1 || isLightboxOpen || isHovered) return;

    const timer = setInterval(() => {
      handleNext();
    }, 4000);

    return () => clearInterval(timer);
  }, [images.length, isLightboxOpen, isHovered, handleNext]);

  // Handle keyboard keys for navigation when Lightbox is open
  useEffect(() => {
    if (!isLightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsLightboxOpen(false);
      else if (e.key === "ArrowLeft") handlePrev();
      else if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen, handlePrev, handleNext]);

  if (images.length === 0) return null;

  return (
    <div className="relative mb-8">
      {/* Main Image Banner (Slide container) */}
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative h-72 overflow-hidden rounded-3xl lg:h-96 shadow-md transition-shadow hover:shadow-lg"
      >
        {/* Clickable Image to open Lightbox */}
        <div
          onClick={() => setIsLightboxOpen(true)}
          className="relative w-full h-full cursor-zoom-in"
        >
          <Image
            src={images[activeIdx]}
            alt={language === "en" ? "Tour Detail Image" : "Hình ảnh chi tiết của Tour"}
            fill
            className={`object-cover transition-all duration-500 ${
              isTransitioning ? "opacity-60 scale-98 blur-[2px]" : "opacity-100 scale-100 blur-0"
            }`}
            priority
          />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/15 transition-colors" />

          {/* Zoom / Search Icon Overlay */}
          <span className="absolute bottom-4 right-4 flex h-9.5 w-9.5 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm shadow-sm opacity-80 group-hover:opacity-100 transition-all duration-300">
            <svg className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
            </svg>
          </span>
        </div>

        {/* Slide Counter Overlay */}
        <div className="absolute top-4 left-4 rounded-full bg-black/50 px-3 py-1.5 text-xs font-semibold text-white/90 backdrop-blur-sm shadow-sm select-none">
          {activeIdx + 1} / {images.length}
        </div>

        {/* Navigation Arrow Left */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handlePrev();
          }}
          className="absolute left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm hover:bg-black/60 hover:scale-105 active:scale-95 transition-all opacity-0 group-hover:opacity-100 focus:outline-none z-10"
          aria-label={language === "en" ? "Previous image" : "Ảnh trước"}
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Navigation Arrow Right */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleNext();
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm hover:bg-black/60 hover:scale-105 active:scale-95 transition-all opacity-0 group-hover:opacity-100 focus:outline-none z-10"
          aria-label={language === "en" ? "Next image" : "Ảnh tiếp"}
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Grid of 5 Preview Thumbnails */}
      <div className="mt-4 grid grid-cols-5 gap-2 sm:gap-3">
        {images.map((img, idx) => (
          <div
            key={idx}
            onClick={() => {
              setActiveIdx(idx);
            }}
            className={`group relative aspect-video cursor-pointer overflow-hidden rounded-2xl border transition-all duration-300 ${
              activeIdx === idx
                ? "border-green-50 ring-2 ring-green-50/20 scale-105 shadow-md z-10"
                : "border-gray-10 opacity-75 hover:opacity-100 hover:scale-102"
            }`}
          >
            <Image
              src={img}
              alt={language === "en" ? `Detailed image ${idx + 1}` : `Ảnh chi tiết ${idx + 1}`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div
              className={`absolute inset-0 transition-colors ${
                activeIdx === idx ? "bg-transparent" : "bg-black/5 group-hover:bg-black/20"
              }`}
            />
          </div>
        ))}
      </div>

      {/* Full-screen Zoomable Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 animate-in fade-in duration-200">
          {/* Close button */}
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute right-6 top-6 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors focus:outline-none"
            aria-label={language === "en" ? "Close" : "Đóng"}
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Left Navigation Arrow */}
          <button
            onClick={handlePrev}
            className="absolute left-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors focus:outline-none sm:left-6"
            aria-label={language === "en" ? "Previous image" : "Ảnh trước"}
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Active Image Wrapper */}
          <div className="relative max-h-[80vh] max-w-[90vw] h-full w-full select-none flex items-center justify-center">
            <img
              src={images[activeIdx]}
              alt={language === "en" ? `Zoomed image ${activeIdx + 1}` : `Ảnh phóng to ${activeIdx + 1}`}
              className="max-h-full max-w-full object-contain rounded-xl shadow-2xl animate-in zoom-in-95 duration-200"
            />
          </div>

          {/* Right Navigation Arrow */}
          <button
            onClick={handleNext}
            className="absolute right-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors focus:outline-none sm:right-6"
            aria-label={language === "en" ? "Next image" : "Ảnh tiếp"}
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Image index indicator */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-4 py-1.5 text-sm font-semibold text-white/90 backdrop-blur-sm">
            {activeIdx + 1} / {images.length}
          </div>
        </div>
      )}
    </div>
  );
}

