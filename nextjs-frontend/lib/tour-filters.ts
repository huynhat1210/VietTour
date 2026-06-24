import type { Destination, Tour } from "@/types";

export type PriceRange = "all" | "under-2m" | "2-4m" | "4-6m" | "over-6m";
export type DurationFilter = "all" | "2d" | "3d" | "4d-plus";
export type SortOption = "featured" | "price-asc" | "price-desc" | "name";

export interface TourFilters {
  search: string;
  destination: string;
  priceRange: PriceRange;
  duration: DurationFilter;
  featuredOnly: boolean;
  sort: SortOption;
}

export const DEFAULT_FILTERS: TourFilters = {
  search: "",
  destination: "all",
  priceRange: "all",
  duration: "all",
  featuredOnly: false,
  sort: "featured",
};

const PRICE_RANGES: Record<Exclude<PriceRange, "all">, [number, number]> = {
  "under-2m": [0, 2_000_000],
  "2-4m": [2_000_000, 4_000_000],
  "4-6m": [4_000_000, 6_000_000],
  "over-6m": [6_000_000, Infinity],
};

function matchDuration(duration: string, filter: DurationFilter): boolean {
  if (filter === "all") return true;
  if (filter === "2d") return duration.includes("2 ngày");
  if (filter === "3d") return duration.includes("3 ngày");
  return duration.includes("4 ngày") || duration.includes("5 ngày");
}

function matchPrice(price: number, range: PriceRange): boolean {
  if (range === "all") return true;
  const [min, max] = PRICE_RANGES[range];
  return price >= min && price < max;
}

export function filterTours(tours: Tour[], filters: TourFilters): Tour[] {
  const query = filters.search.trim().toLowerCase();

  let result = tours.filter((tour) => {
    if (filters.featuredOnly && !tour.featured) return false;
    if (
      filters.destination !== "all" &&
      tour.destination?.slug !== filters.destination
    )
      return false;
    if (!matchPrice(tour.price, filters.priceRange)) return false;
    if (!matchDuration(tour.duration, filters.duration)) return false;

    if (query) {
      const haystack = [
        tour.title,
        tour.location,
        tour.shortDescription,
        tour.destination?.name,
        tour.destination?.region,
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(query)) return false;
    }

    return true;
  });

  result = [...result].sort((a, b) => {
    switch (filters.sort) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "name":
        return a.title.localeCompare(b.title, "vi");
      case "featured":
      default:
        if (a.featured !== b.featured) return a.featured ? -1 : 1;
        return a.price - b.price;
    }
  });

  return result;
}

export function getDestinationOptions(
  tours: Tour[],
  destinations: Destination[]
): Destination[] {
  const fromTours = new Set(
    tours.map((t) => t.destination?.slug).filter(Boolean) as string[]
  );
  const merged = destinations.filter((d) => fromTours.has(d.slug));
  return merged.length > 0 ? merged : destinations;
}

export function countActiveFilters(filters: TourFilters): number {
  let count = 0;
  if (filters.search.trim()) count++;
  if (filters.destination !== "all") count++;
  if (filters.priceRange !== "all") count++;
  if (filters.duration !== "all") count++;
  if (filters.featuredOnly) count++;
  return count;
}
