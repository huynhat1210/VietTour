import {
  FALLBACK_DESTINATIONS,
  FALLBACK_TESTIMONIALS,
  FALLBACK_TOURS,
} from "@/data/fallback";
import {
  getDestinations,
  getTestimonials,
  getTourBySlug,
  getTours,
} from "@/lib/strapi";
import type { Destination, Testimonial, Tour } from "@/types";

export async function fetchTours(featured?: boolean, locale?: string): Promise<Tour[]> {
  try {
    const tours = await getTours(featured, locale);
    if (tours.length > 0) return tours;
  } catch {
    // Strapi chưa sẵn sàng — dùng dữ liệu mẫu
  }
  return featured
    ? FALLBACK_TOURS.filter((t) => t.featured)
    : FALLBACK_TOURS;
}

export async function fetchTourBySlug(slug: string, locale?: string): Promise<Tour | null> {
  try {
    const tour = await getTourBySlug(slug, locale);
    if (tour) return tour;
  } catch {
    // fallback
  }
  return FALLBACK_TOURS.find((t) => t.slug === slug) || null;
}

export async function fetchDestinations(
  featured?: boolean,
  locale?: string
): Promise<Destination[]> {
  try {
    const destinations = await getDestinations(featured, locale);
    if (destinations.length > 0) return destinations;
  } catch {
    // fallback
  }
  return featured
    ? FALLBACK_DESTINATIONS.filter((d) => d.featured)
    : FALLBACK_DESTINATIONS;
}

export async function fetchTestimonials(): Promise<Testimonial[]> {
  try {
    const testimonials = await getTestimonials();
    if (testimonials.length > 0) return testimonials;
  } catch {
    // fallback
  }
  return FALLBACK_TESTIMONIALS;
}
