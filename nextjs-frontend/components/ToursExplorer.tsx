"use client";

import TourCard from "@/components/TourCard";
import { formatPrice } from "@/lib/format";
import { useLanguage } from "@/context/LanguageContext";
import {
  countActiveFilters,
  DEFAULT_FILTERS,
  filterTours,
  getDestinationOptions,
  type DurationFilter,
  type PriceRange,
  type SortOption,
  type TourFilters,
} from "@/lib/tour-filters";
import type { Destination, Tour } from "@/types";
import { useEffect, useMemo, useState } from "react";

const PAGE_SIZE = 9;

interface ToursExplorerProps {
  tours: Tour[];
  destinations: Destination[];
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl px-4 py-2 text-xs transition-all duration-200 border ${active
          ? "bg-green-50 text-white border-green-50 font-semibold shadow-sm shadow-green-50/10"
          : "bg-slate-50/50 dark:bg-stone-700 text-slate-600 dark:text-stone-300 border-slate-200/60 dark:border-stone-600 font-medium hover:bg-slate-100 dark:hover:bg-stone-600 hover:text-slate-800 hover:border-slate-350"
        }`}
    >
      {children}
    </button>
  );
}

export default function ToursExplorer({
  tours,
  destinations,
}: ToursExplorerProps) {
  const { t, language } = useLanguage();
  const [filters, setFilters] = useState<TourFilters>(DEFAULT_FILTERS);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [page, setPage] = useState(1);

  const priceOptions = useMemo(() => [
    { value: "all" as PriceRange, label: t("explorer_price_all" as any) },
    { value: "under-2m" as PriceRange, label: language === "vi" ? "Dưới 2 triệu" : "Under 2 million VND" },
    { value: "2-4m" as PriceRange, label: language === "vi" ? "2 – 4 triệu" : "2 – 4 million VND" },
    { value: "4-6m" as PriceRange, label: language === "vi" ? "4 – 6 triệu" : "4 – 6 million VND" },
    { value: "over-6m" as PriceRange, label: language === "vi" ? "Trên 6 triệu" : "Over 6 million VND" },
  ], [language, t]);

  const durationOptions = useMemo(() => [
    { value: "all" as DurationFilter, label: language === "vi" ? "Tất cả" : "All" },
    { value: "2d" as DurationFilter, label: language === "vi" ? "2 ngày 1 đêm" : "2 Days 1 Night" },
    { value: "3d" as DurationFilter, label: language === "vi" ? "3 ngày 2 đêm" : "3 Days 2 Nights" },
    { value: "4d-plus" as DurationFilter, label: language === "vi" ? "4 ngày trở lên" : "4 Days or more" },
  ], [language]);

  const sortOptions = useMemo(() => [
    { value: "featured" as SortOption, label: language === "vi" ? "Nổi bật nhất" : "Most Featured" },
    { value: "price-asc" as SortOption, label: t("explorer_sort_price_asc" as any) },
    { value: "price-desc" as SortOption, label: t("explorer_sort_price_desc" as any) },
    { value: "name" as SortOption, label: language === "vi" ? "Tên A → Z" : "Name A → Z" },
  ], [language, t]);

  const destinationOptions = useMemo(
    () => getDestinationOptions(tours, destinations),
    [tours, destinations]
  );

  const filtered = useMemo(() => filterTours(tours, filters), [tours, filters]);
  const activeCount = countActiveFilters(filters);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, currentPage]);

  useEffect(() => {
    setPage(1);
  }, [filters]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const minPrice = tours.length ? Math.min(...tours.map((t) => t.price)) : 0;
  const maxPrice = tours.length ? Math.max(...tours.map((t) => t.price)) : 0;

  const update = (patch: Partial<TourFilters>) =>
    setFilters((prev) => ({ ...prev, ...patch }));

  const reset = () => {
    setFilters(DEFAULT_FILTERS);
    setPage(1);
  };

  const sidebar = (
    <div className="space-y-8">
      {/* Destination filter */}
      <div>
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-slate-455 dark:text-stone-400 flex items-center gap-1.5">
          {t("explorer_dest_label" as any)}
        </p>
        <div className="flex flex-wrap gap-2">
          <FilterChip
            active={filters.destination === "all"}
            onClick={() => update({ destination: "all" })}
          >
            {language === "vi" ? "Tất cả" : "All"}
          </FilterChip>
          {destinationOptions.map((d) => (
            <FilterChip
              key={d.slug}
              active={filters.destination === d.slug}
              onClick={() => update({ destination: d.slug })}
            >
              {d.name}
            </FilterChip>
          ))}
        </div>
      </div>

      {/* Price filter */}
      <div>
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-slate-455 dark:text-stone-400 flex items-center gap-1.5">
          {t("explorer_price_label" as any)}
        </p>
        <div className="flex flex-wrap gap-2">
          {priceOptions.map((opt) => (
            <FilterChip
              key={opt.value}
              active={filters.priceRange === opt.value}
              onClick={() => update({ priceRange: opt.value })}
            >
              {opt.label}
            </FilterChip>
          ))}
        </div>
      </div>

      {/* Duration filter */}
      <div>
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-slate-455 dark:text-stone-400 flex items-center gap-1.5">
          {t("tour_duration" as any)}
        </p>
        <div className="flex flex-wrap gap-2">
          {durationOptions.map((opt) => (
            <FilterChip
              key={opt.value}
              active={filters.duration === opt.value}
              onClick={() => update({ duration: opt.value })}
            >
              {opt.label}
            </FilterChip>
          ))}
        </div>
      </div>

      {/* Featured checkbox */}
      <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-150 dark:border-stone-600 bg-slate-50/30 dark:bg-stone-700 px-4 py-3 transition-all duration-250 hover:bg-slate-50 dark:hover:bg-stone-600 hover:border-emerald-500/20">
        <input
          type="checkbox"
          checked={filters.featuredOnly}
          onChange={(e) => update({ featuredOnly: e.target.checked })}
          className="h-4 w-4 rounded border-slate-300 text-green-50 focus:ring-green-50/20 cursor-pointer"
        />
        <span className="text-xs font-medium text-slate-650 dark:text-stone-300 select-none">
          {language === "vi" ? "Chỉ hiện tour nổi bật" : "Featured tours only"}
        </span>
      </label>

      {/* Clear Filters Button */}
      {activeCount > 0 && (
        <button
          type="button"
          onClick={reset}
          className="w-full rounded-xl border border-red-200/50 py-3 text-xs font-medium text-red-600 bg-red-50/30 hover:bg-red-50 hover:text-red-700 hover:border-red-300 transition-all duration-200"
        >
          {language === "vi" ? `Xóa bộ lọc (${activeCount})` : `Clear filters (${activeCount})`}
        </button>
      )}
    </div>
  );

  return (
    <div>
      {/* Page Title & Intro Block (Banner-free design) */}
      <div className="mb-10 text-left">
        <span className="text-[10px] font-black uppercase tracking-widest text-green-50">
          {language === "vi" ? "Khám Phá Hành Trình" : "EXPLORE JOURNEYS"}
        </span>
        <h1 className="mt-1 text-3xl font-black md:text-4xl text-slate-800 dark:text-stone-100 tracking-tight leading-tight">
          {t("nav_tours" as any)}
        </h1>
        <p className="mt-2 text-xs md:text-sm text-slate-500 dark:text-stone-400 font-semibold max-w-2xl leading-relaxed">
          {language === "vi"
            ? "Tìm kiếm & trải nghiệm các chuyến đi cắm trại, dã ngoại, du lịch tự nhiên và nghỉ dưỡng cao cấp khắp Việt Nam được chọn lọc cho trải nghiệm trọn vẹn."
            : "Search & experience camping trips, outdoor excursions, nature travel, and luxury resorts across Vietnam curated for a complete experience."}
        </p>
      </div>

      {/* Grid container */}
      <div className="grid gap-8 lg:grid-cols-[280px_1fr] lg:gap-10">

        {/* Desktop filter sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-3xl bg-transparent p-1">
            <h2 className="mb-6 text-sm font-semibold text-slate-800 dark:text-stone-100 border-b border-slate-150 dark:border-stone-700 pb-4 flex items-center gap-2">
              <span className="h-4 w-1 bg-green-50 rounded-full inline-block"></span>
              {language === "vi" ? "Bộ lọc nâng cao" : "Advanced Filters"}
            </h2>
            {sidebar}
          </div>
        </aside>

        {/* Mobile filter panel */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button
              type="button"
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
              aria-label={language === "vi" ? "Đóng bộ lọc" : "Close filters"}
            />
            <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-[2.5rem] bg-white dark:bg-stone-800 p-6 shadow-2xl">
              <div className="mb-6 flex items-center justify-between border-b border-slate-100 dark:border-stone-700 pb-3">
                <h2 className="text-lg font-semibold text-slate-800 dark:text-stone-100">{language === "vi" ? "Bộ lọc tour" : "Tour Filters"}</h2>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-full bg-slate-100 dark:bg-stone-700 p-2 text-slate-500 dark:text-stone-300 hover:text-slate-800 dark:hover:text-white"
                >
                  ✕
                </button>
              </div>
              {sidebar}
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="btn_green mt-6 w-full rounded-xl py-3 text-xs font-semibold uppercase tracking-wider text-center flex items-center justify-center bg-green-50 text-white font-bold"
              >
                {language === "vi" ? `Xem ${filtered.length} tour phù hợp` : `View ${filtered.length} matching tours`}
              </button>
            </div>
          </div>
        )}

        {/* Results section */}
        <div>
          {/* Toolbar with integrated search */}
          <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-stone-800 border border-slate-100/80 dark:border-stone-700 rounded-[2rem] p-4 shadow-[0_8px_30px_rgb(0,0,0,0.015)]">
            <div className="flex items-center gap-4 flex-1 w-full">
              {/* Integrated search input */}
              <div className="relative w-full max-w-sm">
                <svg
                  className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="search"
                  value={filters.search}
                  onChange={(e) => update({ search: e.target.value })}
                  placeholder={t("explorer_search" as any)}
                  className="w-full rounded-2xl border border-slate-200/80 dark:border-stone-600 bg-slate-100/60 dark:bg-stone-700 py-2.5 pl-10 pr-4 text-xs font-semibold text-slate-800 dark:text-stone-100 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-stone-500 focus:border-green-50 focus:bg-white dark:focus:bg-stone-700 focus:ring-4 focus:ring-green-50/10"
                />
              </div>

              <p className="hidden md:block text-xs text-slate-450 dark:text-stone-400 font-medium">
                {language === "vi" ? (
                  <>Hiển thị <span className="font-semibold text-slate-700 dark:text-stone-200">{filtered.length}</span> tour</>
                ) : (
                  <>Showing <span className="font-semibold text-slate-700 dark:text-stone-200">{filtered.length}</span> tours</>
                )}
              </p>
            </div>

            <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto">
              <p className="block md:hidden text-xs text-slate-450 dark:text-stone-400 font-medium">
                {language === "vi" ? (
                  <>Hiển thị <span className="font-semibold text-slate-700 dark:text-stone-200">{filtered.length}</span> tour</>
                ) : (
                  <>Showing <span className="font-semibold text-slate-700 dark:text-stone-200">{filtered.length}</span> tours</>
                )}
              </p>

              <div className="flex items-center gap-3">
                <select
                  value={filters.sort}
                  onChange={(e) => update({ sort: e.target.value as SortOption })}
                  className="rounded-2xl border border-slate-200 dark:border-stone-600 bg-white dark:bg-stone-700 px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-stone-200 outline-none focus:border-green-50 focus:ring-2 focus:ring-green-50/10 cursor-pointer"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {language === "vi" ? `Sắp xếp: ${opt.label}` : `Sort by: ${opt.label}`}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => setMobileOpen(!mobileOpen)}
                  className="flex items-center gap-2 rounded-2xl border border-slate-200 dark:border-stone-600 bg-white dark:bg-stone-700 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-stone-200 transition-all hover:border-green-50/40 lg:hidden"
                >
                  ⚙️ {language === "vi" ? "Bộ lọc" : "Filters"}
                  {activeCount > 0 && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-green-50 px-1.5 text-xs text-white">
                      {activeCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {filtered.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-7 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3">
                {paginated.map((tour) => (
                  <TourCard key={tour.id} tour={tour} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="rounded-2xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-650 transition-all hover:border-green-50/45 hover:text-green-50 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:text-slate-600 disabled:hover:border-slate-200"
                  >
                    {language === "vi" ? "← Trước" : "← Prev"}
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPage(p)}
                        className={`flex h-10 w-10 items-center justify-center rounded-2xl text-xs font-bold transition-all ${p === currentPage
                            ? "bg-green-50 text-white shadow-md shadow-green-50/20"
                            : "border border-slate-200 text-slate-650 hover:border-green-50/40 hover:text-green-50 bg-white"
                          }`}
                      >
                        {p}
                      </button>
                    )
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      setPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="rounded-2xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-650 transition-all hover:border-green-50/45 hover:text-green-50 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:text-slate-600 disabled:hover:border-slate-200"
                  >
                    {language === "vi" ? "Sau →" : "Next →"}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-[2rem] border border-dashed border-slate-200 dark:border-stone-700 bg-white dark:bg-stone-800 px-8 py-20 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 dark:bg-stone-700 text-3xl">
                🔍
              </div>
              <h3 className="text-base font-black text-slate-800 dark:text-stone-100">
                {language === "vi" ? "Không tìm thấy tour phù hợp" : "No matching tours found"}
              </h3>
              <p className="mt-2 max-w-xs text-xs text-slate-550 dark:text-stone-400 leading-relaxed font-semibold">
                {language === "vi"
                  ? "Không tìm thấy kết quả nào khớp với bộ lọc của bạn. Thử thay đổi từ khóa hoặc bộ lọc để xem thêm lựa chọn."
                  : "No results found matching your filters. Try changing your search query or filters."}
              </p>
              <button
                type="button"
                onClick={reset}
                className="mt-6 rounded-2xl bg-green-50 px-6 py-3.5 text-xs font-bold text-white transition-all hover:bg-emerald-600 shadow-md shadow-green-50/10"
              >
                {language === "vi" ? "Xóa tất cả bộ lọc" : "Clear all filters"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}