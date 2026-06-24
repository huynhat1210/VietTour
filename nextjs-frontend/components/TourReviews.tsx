"use client";

import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import type { Testimonial } from "@/types";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import useSWR from "swr";

const defaultFetcher = (url: string) => fetch(url).then((res) => {
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
});

interface TourReviewsProps {
  tourSlug: string;
  tourTitle: string;
  mapContent?: React.ReactNode;
}

const TourReviews = ({ tourSlug, tourTitle, mapContent }: TourReviewsProps) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { t, language } = useLanguage();
  const { data: reviewsData, isLoading: loading, mutate } = useSWR(
    tourSlug ? `/api/tours/reviews?slug=${tourSlug}` : null,
    defaultFetcher
  );
  const reviews: Testimonial[] = reviewsData?.reviews || [];

  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showAllReviews, setShowAllReviews] = useState(false);
  
  // Media upload states
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    const newFiles: File[] = [];
    const newPreviews: string[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > 5 * 1024 * 1024) {
        showToast(language === "vi" ? "Kích thước ảnh tối đa 5MB" : "Max image size is 5MB", "error");
        continue;
      }
      newFiles.push(file);
      newPreviews.push(URL.createObjectURL(file));
    }
    
    setSelectedImages((prev) => [...prev, ...newFiles]);
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!user) {
      setError(t("review_login_to_submit"));
      showToast(t("review_login_to_submit"), "error");
      return;
    }

    if (!comment.trim()) {
      setError(t("review_enter_content"));
      return;
    }

    const formData = new FormData();
    formData.append("name", user.fullName || user.username || user.email);
    formData.append("content", comment.trim());
    formData.append("rating", rating.toString());
    formData.append("tourSlug", tourSlug);
    
    selectedImages.forEach((img) => {
      formData.append("images", img);
    });

    try {
      const res = await fetch("/api/tours/reviews", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setComment("");
        setRating(5);
        setSelectedImages([]);
        setImagePreviews([]);
        setSuccess(t("review_status_draft"));
        showToast(t("review_success_toast"), "success");
        setTimeout(() => setSuccess(""), 5000);
        mutate();
      } else {
        setError(data.error || t("review_submit_failed"));
        showToast(data.error || t("review_submit_failed"), "error");
      }
    } catch (err) {
      setError(t("review_error"));
      showToast(t("review_error"), "error");
    }
  };

  // Calculate summary metrics
  const totalReviews = reviews.length;
  const avgRating =
    totalReviews > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
      : "0.0";

  const starCounts = [5, 4, 3, 2, 1].map((stars) => {
    const count = reviews.filter((r) => r.rating === stars).length;
    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
    return { stars, count, percentage };
  });

  const formatDate = (dateString?: string) => {
    if (!dateString) return t("review_just_now");
    try {
      return new Date(dateString).toLocaleDateString(language === "vi" ? "vi-VN" : "en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return t("review_just_now");
    }
  };

  // Helper to parse content field for media URLs
  const parseReviewContent = (rawContent: string) => {
    const mediaRegex = /\[\[media:(.*?)\]\]/;
    const match = rawContent.match(mediaRegex);
    if (match) {
      const mediaStr = match[1];
      const media = mediaStr ? mediaStr.split(",") : [];
      const text = rawContent.replace(mediaRegex, "").trim();
      return { text, media };
    }
    return { text: rawContent, media: [] };
  };

  return (
    <div className="mt-12 border-t border-gray-10 dark:border-stone-700 pt-12">
      {/* First Row: Map next to Review Summary Header */}
      {mapContent ? (
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 items-start mb-12">
          {/* Left Column: Destination Map */}
          <div>
            {mapContent}
          </div>

          {/* Right Column: Review Summary Header */}
          <div>
            <h2 className="bold-24 mb-6 text-gray-90 dark:text-stone-100">{t("review_real_title")}</h2>
            <div className="grid grid-cols-1 gap-6 rounded-3xl border border-gray-10 dark:border-stone-700 bg-white dark:bg-stone-800 p-6 shadow-sm sm:grid-cols-12 sm:gap-8">
              <div className="text-center sm:col-span-4 sm:border-r sm:border-gray-10 dark:sm:border-stone-700 sm:py-4">
                <p className="bold-64 leading-none text-green-50">{avgRating}</p>
                <div className="my-3 flex justify-center gap-1">
                  {Array(5)
                    .fill(1)
                    .map((_, i) => {
                      const isHalf = Number(avgRating) - i >= 0.5 && Number(avgRating) - i < 1;
                      const isFull = Number(avgRating) - i >= 1;
                      return (
                        <svg
                          key={i}
                          className={`h-5 w-5 ${isFull
                              ? "text-amber-500 fill-amber-500"
                              : isHalf
                                ? "text-amber-500 fill-amber-500 opacity-60"
                                : "text-gray-200 fill-gray-200"
                            }`}
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      );
                    })}
                </div>
                <p className="regular-14 text-gray-30 dark:text-stone-400">({totalReviews} {t("review_real_count")})</p>
              </div>

              <div className="flex flex-col justify-center gap-2 sm:col-span-8">
                {starCounts.map(({ stars, count, percentage }) => (
                  <div key={stars} className="flex items-center gap-3">
                    <span className="regular-14 w-12 text-right text-gray-30 dark:text-stone-400">{stars} {t("review_stars")}</span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-10 dark:bg-stone-700">
                      <div
                        className="h-full bg-green-50 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="regular-14 w-8 text-left text-gray-30 dark:text-stone-400">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Fallback if mapContent is not provided */
        <div className="mb-12">
          <h2 className="bold-24 mb-6 text-gray-90 dark:text-stone-100">{t("review_real_title")}</h2>
          <div className="grid grid-cols-1 gap-6 rounded-3xl border border-gray-10 dark:border-stone-700 bg-white dark:bg-stone-800 p-6 shadow-sm sm:grid-cols-12 sm:gap-8">
            <div className="text-center sm:col-span-4 sm:border-r sm:border-gray-10 dark:sm:border-stone-700 sm:py-4">
              <p className="bold-64 leading-none text-green-50">{avgRating}</p>
              <div className="my-3 flex justify-center gap-1">
                {Array(5)
                  .fill(1)
                  .map((_, i) => {
                    const isHalf = Number(avgRating) - i >= 0.5 && Number(avgRating) - i < 1;
                    const isFull = Number(avgRating) - i >= 1;
                    return (
                      <svg
                        key={i}
                        className={`h-5 w-5 ${isFull
                            ? "text-amber-500 fill-amber-500"
                            : isHalf
                              ? "text-amber-500 fill-amber-500 opacity-60"
                              : "text-gray-200 fill-gray-200"
                          }`}
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    );
                  })}
              </div>
              <p className="regular-14 text-gray-30 dark:text-stone-400">({totalReviews} {t("review_real_count")})</p>
            </div>
            <div className="flex flex-col justify-center gap-2 sm:col-span-8">
              {starCounts.map(({ stars, count, percentage }) => (
                <div key={stars} className="flex items-center gap-3">
                  <span className="regular-14 w-12 text-right text-gray-30 dark:text-stone-400">{stars} {t("review_stars")}</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-10 dark:bg-stone-700">
                    <div
                      className="h-full bg-green-50 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="regular-14 w-8 text-left text-gray-30 dark:text-stone-400">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Second Row: Share Review Form & User Comments */}
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 items-start">
        {/* Left Column: Review Submission Form */}
        <div>
          {user ? (
            <form
              onSubmit={handleSubmit}
              className="rounded-3xl border border-gray-10 dark:border-stone-700 bg-white dark:bg-stone-800 p-6 shadow-sm"
            >
              <h3 className="bold-18 mb-4 text-gray-90 dark:text-stone-100">{t("review_share_title")}</h3>

              <div className="mb-4">
                <label className="regular-14 mb-2 block text-gray-40 dark:text-stone-400">{t("review_satisfaction")}</label>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(null)}
                      className="transition-transform duration-100 hover:scale-110 focus:outline-none"
                    >
                      <svg
                        className={`h-8 w-8 ${(hoverRating !== null ? star <= hoverRating : star <= rating)
                            ? "text-amber-500 fill-amber-500"
                            : "text-gray-200 fill-gray-200"
                          }`}
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="review-comment" className="regular-14 mb-2 block text-gray-40 dark:text-stone-400">
                  {t("review_feedback")}
                </label>
                <textarea
                  id="review-comment"
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={t("review_placeholder")}
                  className="w-full rounded-2xl border border-gray-20 dark:border-stone-600 p-4 regular-16 focus:border-green-50 focus:outline-none transition-colors bg-white dark:bg-stone-700 text-gray-90 dark:text-stone-100 placeholder:text-gray-30 dark:placeholder:text-stone-500"
                />
              </div>

              {/* Media File Upload Input */}
              <div className="mb-4">
                <label className="regular-14 mb-2 block text-gray-40 dark:text-stone-400">
                  {language === "vi" ? "Đính kèm hình ảnh chuyến đi" : "Attach trip images"}
                </label>
                
                <div className="flex flex-wrap gap-2.5 items-center">
                  <label className="flex flex-col items-center justify-center h-20 w-20 cursor-pointer rounded-2xl border-2 border-dashed border-gray-200 dark:border-stone-700 hover:border-green-50 bg-slate-50/50 dark:bg-stone-900/50 hover:bg-slate-100/50 dark:hover:bg-stone-850/50 transition-all">
                    <svg className="h-5 w-5 text-gray-40 dark:text-stone-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    <span className="text-[10px] font-bold text-gray-40 dark:text-stone-400 mt-1">Thêm ảnh</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>

                  {imagePreviews.map((previewUrl, idx) => (
                    <div key={idx} className="relative h-20 w-20 rounded-2xl border border-slate-150 dark:border-stone-700 overflow-hidden shadow-sm">
                      <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white font-bold text-[9px] hover:bg-red-600 shadow-md focus:outline-none"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {error && <p className="mb-4 text-red-500 text-sm">{error}</p>}
              {success && <p className="mb-4 text-green-600 text-sm font-semibold">{success}</p>}

              <button
                type="submit"
                className="rounded-full bg-green-50 px-6 py-2.5 bold-16 text-white hover:bg-green-600 transition-colors shadow-sm"
              >
                {t("review_submit")}
              </button>
            </form>
          ) : (
            <div className="rounded-3xl border border-dashed border-gray-20 dark:border-stone-600 bg-gray-10/30 dark:bg-stone-800/40 p-8 text-center">
              <p className="regular-16 text-gray-50 dark:text-stone-400">{t("review_login_required")}</p>
              <Link
                href="/login"
                className="bold-16 mt-3 inline-block rounded-full border border-green-50 px-6 py-2 text-green-50 hover:bg-green-50 hover:text-white transition-all"
              >
                {t("review_login_btn")}
              </Link>
            </div>
          )}
        </div>

        {/* Right Column: Reviews List */}
        <div className="flex flex-col gap-4">
          {loading ? (
            <p className="text-center py-6 text-gray-30 italic">{t("review_loading")}</p>
          ) : reviews.length > 0 ? (
            <>
              {(showAllReviews ? reviews : reviews.slice(0, 2)).map((r) => {
                const { text, media } = parseReviewContent(r.content);
                return (
                  <div
                    key={r.id}
                    className="rounded-3xl border border-gray-10 dark:border-stone-700 bg-white dark:bg-stone-800 p-6 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50/10 text-base font-bold text-green-50">
                          {r.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="bold-16 text-gray-90 dark:text-stone-100">{r.name}</h4>
                          <p className="regular-12 text-gray-30 dark:text-stone-400">{formatDate(r.publishedAt)}</p>
                        </div>
                      </div>
                    </div>

                    <div className="my-3 flex gap-0.5">
                      {Array(5)
                        .fill(1)
                        .map((_, i) => (
                          <svg
                            key={i}
                            className={`h-4 w-4 ${i < r.rating ? "text-amber-500 fill-amber-500" : "text-gray-200 fill-gray-200"
                              }`}
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                          </svg>
                        ))}
                    </div>

                    <p className="regular-15 leading-relaxed text-gray-50 dark:text-stone-300">{text}</p>
                    
                    {/* Media attachments */}
                    {media.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {media.map((imgUrl, idx) => (
                          <div
                            key={idx}
                            onClick={() => setLightboxImage(imgUrl)}
                            className="relative h-16 w-16 cursor-pointer overflow-hidden rounded-xl border border-gray-200/50 hover:border-green-50 shadow-sm transition-all hover:scale-105"
                          >
                            <img
                              src={imgUrl}
                              alt="Review attachment"
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {reviews.length > 2 && (
                <button
                  onClick={() => setShowAllReviews(!showAllReviews)}
                  className="bold-16 text-green-50 hover:text-green-600 transition-colors self-start mt-2 focus:outline-none"
                >
                  {showAllReviews ? t("review_show_less") : t("review_view_all")}
                </button>
              )}
            </>
          ) : (
            <p className="text-center py-6 text-gray-30 dark:text-stone-500 italic">{t("review_no_reviews")}</p>
          )}
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm transition-opacity duration-300"
        >
          <div className="relative max-h-[85vh] max-w-[90vw] overflow-hidden rounded-3xl bg-black" onClick={(e) => e.stopPropagation()}>
            <img
              src={lightboxImage}
              alt="Enlarged review media"
              className="max-h-[85vh] max-w-[90vw] object-contain rounded-2xl"
            />
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-lg focus:outline-none transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TourReviews;
