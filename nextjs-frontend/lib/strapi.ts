import type {
  BookingFormData,
  ContactFormData,
  Destination,
  StrapiImage,
  Testimonial,
  Tour,
} from "@/types";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

type StrapiMedia = {
  url?: string;
  alternativeText?: string;
  width?: number;
  height?: number;
  data?: {
    url?: string;
    alternativeText?: string;
    width?: number;
    height?: number;
    attributes?: {
      url?: string;
      alternativeText?: string;
      width?: number;
      height?: number;
    };
  } | null;
  attributes?: {
    url?: string;
    alternativeText?: string;
    width?: number;
    height?: number;
  };
};

function getMediaUrl(media?: StrapiMedia | null): StrapiImage | undefined {
  if (!media) return undefined;

  const raw =
    media.url ??
    media.data?.url ??
    media.data?.attributes?.url ??
    media.attributes?.url;

  if (!raw) return undefined;

  return {
    url: raw.startsWith("http") ? raw : `${STRAPI_URL}${raw}`,
    alternativeText:
      media.alternativeText ??
      media.data?.alternativeText ??
      media.data?.attributes?.alternativeText ??
      media.attributes?.alternativeText,
    width:
      media.width ??
      media.data?.width ??
      media.data?.attributes?.width ??
      media.attributes?.width,
    height:
      media.height ??
      media.data?.height ??
      media.data?.attributes?.height ??
      media.attributes?.height,
  };
}

function getMediaUrls(media?: any): StrapiImage[] {
  if (!media) return [];

  if (media.data && Array.isArray(media.data)) {
    return media.data
      .map((item: any) => getMediaUrl(item))
      .filter((img: any): img is StrapiImage => img !== undefined);
  }

  if (Array.isArray(media)) {
    return media
      .map((item: any) => getMediaUrl(item))
      .filter((img: any): img is StrapiImage => img !== undefined);
  }

  const single = getMediaUrl(media);
  return single ? [single] : [];
}

function unwrapEntry<T extends Record<string, unknown>>(
  entry: Record<string, unknown>
): T {
  if (entry.attributes && typeof entry.attributes === "object") {
    return {
      id: entry.id,
      documentId: entry.documentId,
      ...(entry.attributes as T),
    } as any;
  }
  return entry as T;
}

function unwrapRelation<T extends Record<string, unknown>>(
  relation: unknown
): T | undefined {
  if (!relation || typeof relation !== "object") return undefined;

  const rel = relation as Record<string, unknown>;

  if (rel.data) {
    if (Array.isArray(rel.data)) {
      return rel.data[0]
        ? (unwrapEntry(rel.data[0] as Record<string, unknown>) as T)
        : undefined;
    }
    return unwrapEntry(rel.data as Record<string, unknown>) as T;
  }

  return unwrapEntry(rel) as T;
}

async function strapiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(STRAPI_TOKEN ? { Authorization: `Bearer ${STRAPI_TOKEN}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${STRAPI_URL}/api${path}`, {
    next: options.cache === "no-store" ? undefined : { revalidate: 60 },
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`Strapi request failed: ${response.status} ${path}`);
  }

  return response.json();
}

function normalizeDestination(raw: Record<string, unknown>): Destination {
  const entry = unwrapEntry<Record<string, unknown>>(raw);
  return {
    id: entry.id as number,
    documentId: entry.documentId as string | undefined,
    name: (entry.name as string) || "",
    slug: (entry.slug as string) || "",
    description: (entry.description as string) || "",
    region: (entry.region as string) || "",
    image: getMediaUrl(entry.image as StrapiMedia),
    featured: Boolean(entry.featured),
    intro: (entry.intro as string) || undefined,
    spots: Array.isArray(entry.spots)
      ? entry.spots.map((spot: any) => {
          if (!spot) return spot;
          let spotImage = spot.image;
          if (spotImage && typeof spotImage === "object") {
            const mediaUrlObj = getMediaUrl(spotImage);
            spotImage = mediaUrlObj ? mediaUrlObj.url : "";
          }
          return {
            ...spot,
            image: spotImage || "",
          };
        })
      : undefined,
    tips: Array.isArray(entry.tips) ? (entry.tips as any) : undefined,
  };
}

function normalizeTour(raw: Record<string, unknown>): Tour {
  const entry = unwrapEntry<Record<string, unknown>>(raw);
  const destinationRaw = unwrapRelation<Record<string, unknown>>(
    entry.destination
  );

  return {
    id: entry.id as number,
    documentId: entry.documentId as string | undefined,
    title: (entry.title as string) || "",
    slug: (entry.slug as string) || "",
    shortDescription: (entry.shortDescription as string) || "",
    description: (entry.description as string) || "",
    price: Number(entry.price) || 0,
    duration: (entry.duration as string) || "",
    location: (entry.location as string) || "",
    maxGroupSize: Number(entry.maxGroupSize) || 0,
    difficulty: (entry.difficulty as Tour["difficulty"]) || "Trung bình",
    itinerary: (entry.itinerary as string) || "",
    mapUrl: (entry.mapUrl as string) || undefined,
    image: getMediaUrl(entry.image as StrapiMedia),
    images: getMediaUrls(entry.images),
    featured: Boolean(entry.featured),
    destination: destinationRaw
      ? normalizeDestination(destinationRaw)
      : undefined,
    testimonials: Array.isArray(entry.testimonials)
      ? entry.testimonials.map(normalizeTestimonial)
      : [],
  };
}

function normalizeTestimonial(raw: Record<string, unknown>): Testimonial {
  const entry = unwrapEntry<Record<string, unknown>>(raw);
  const tourRel = unwrapRelation<Record<string, unknown>>(entry.tour);
  const userRel = unwrapRelation<Record<string, unknown>>(entry.user);

  return {
    id: entry.id as number,
    documentId: entry.documentId as string | undefined,
    name: (userRel?.fullName as string) || (userRel?.username as string) || (entry.name as string) || "",
    content: (entry.content as string) || "",
    rating: Number(entry.rating) || 5,
    avatar: getMediaUrl(entry.avatar as StrapiMedia),
    tour: (tourRel?.title as string) || undefined,
    tourSlug: (tourRel?.slug as string) || undefined,
    publishedAt: (entry.publishedAt as string) || undefined,
  };
}

function normalizeBooking(raw: Record<string, unknown>): any {
  const entry = unwrapEntry<any>(raw);
  if (entry.tour) {
    entry.tour = normalizeTour(entry.tour);
  }
  return {
    ...entry,
    status: entry.bookingStatus || entry.status || "pending",
  };
}

export async function getTours(featured?: boolean, locale: string = "vi"): Promise<Tour[]> {
  const filters = featured ? "&filters[featured][$eq]=true" : "";
  let data = await strapiFetch<{ data: Record<string, unknown>[] }>(
    `/tours?populate=*&sort=createdAt:desc${filters}&locale=${locale}`
  );
  if ((!data.data || data.data.length === 0) && locale !== "vi") {
    data = await strapiFetch<{ data: Record<string, unknown>[] }>(
      `/tours?populate=*&sort=createdAt:desc${filters}&locale=vi`
    );
  }
  return (data.data || []).map(normalizeTour);
}

export async function getTourBySlug(slug: string, locale: string = "vi"): Promise<Tour | null> {
  let data = await strapiFetch<{ data: Record<string, unknown>[] }>(
    `/tours?filters[slug][$eq]=${slug}&populate=*&locale=${locale}`
  );
  if ((!data.data || data.data.length === 0) && locale !== "vi") {
    data = await strapiFetch<{ data: Record<string, unknown>[] }>(
      `/tours?filters[slug][$eq]=${slug}&populate=*&locale=vi`
    );
  }
  const tour = data.data?.[0];
  return tour ? normalizeTour(tour) : null;
}

export async function getDestinations(
  featured?: boolean,
  locale: string = "vi"
): Promise<Destination[]> {
  const filters = featured ? "&filters[featured][$eq]=true" : "";
  let data = await strapiFetch<{ data: Record<string, unknown>[] }>(
    `/destinations?populate[0]=image&populate[1]=tours&populate[2]=spots.image&sort=createdAt:desc${filters}&locale=${locale}`
  );
  if ((!data.data || data.data.length === 0) && locale !== "vi") {
    data = await strapiFetch<{ data: Record<string, unknown>[] }>(
      `/destinations?populate[0]=image&populate[1]=tours&populate[2]=spots.image&sort=createdAt:desc${filters}&locale=vi`
    );
  }
  return (data.data || []).map(normalizeDestination);
}

export async function getDestinationBySlug(
  slug: string,
  locale: string = "vi"
): Promise<Destination | null> {
  let data = await strapiFetch<{ data: Record<string, unknown>[] }>(
    `/destinations?filters[slug][$eq]=${slug}&populate[0]=image&populate[1]=tours&populate[2]=spots.image&locale=${locale}`
  );
  if ((!data.data || data.data.length === 0) && locale !== "vi") {
    data = await strapiFetch<{ data: Record<string, unknown>[] }>(
      `/destinations?filters[slug][$eq]=${slug}&populate[0]=image&populate[1]=tours&populate[2]=spots.image&locale=vi`
    );
  }
  const destination = data.data?.[0];
  return destination ? normalizeDestination(destination) : null;
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const data = await strapiFetch<{ data: Record<string, unknown>[] }>(
    `/testimonials?populate=*&sort=createdAt:desc`
  );
  return (data.data || []).map(normalizeTestimonial);
}

export async function getTourByDocumentId(documentId: string): Promise<Tour | null> {
  try {
    const data = await strapiFetch<{ data: Record<string, unknown> }>(
      `/tours/${documentId}?populate=*`
    );
    return data.data ? normalizeTour(data.data) : null;
  } catch (err) {
    console.error("Failed to fetch tour by documentId:", err);
    return null;
  }
}

export async function createBooking(
  booking: BookingFormData & { totalAmount?: number }
): Promise<{ success: boolean; message: string; data?: any }> {
  const tourRef = booking.tour;

  const res = await strapiFetch<{ data: any }>("/bookings", {
    method: "POST",
    body: JSON.stringify({
      data: {
        fullName: booking.fullName,
        email: booking.email,
        phone: booking.phone,
        tourDate: booking.tourDate,
        numberOfGuests: booking.numberOfGuests,
        message: booking.message || "",
        tour: tourRef,
        bookingStatus: "pending",
        totalAmount: booking.totalAmount,
        paymentStatus: "unpaid",
      },
    }),
  });

  return { success: true, message: "Đặt tour thành công!", data: res.data };
}

export async function getBookingByDocumentId(
  documentId: string,
  jwt: string
): Promise<any | null> {
  try {
    const data = await strapiFetch<{ data: any }>(
      `/bookings/${documentId}?populate[tour][populate]=image`,
      {
        headers: { Authorization: `Bearer ${jwt}` },
      }
    );
    return data.data ? normalizeBooking(data.data) : null;
  } catch (err) {
    console.error("Failed to fetch booking by documentId:", err);
    return null;
  }
}

export async function payBooking(
  documentId: string,
  paymentMethod: string,
  transactionId: string,
  totalAmount?: number,
  promoCode?: string
): Promise<{ success: boolean; message: string }> {
  await strapiFetch(`/bookings/${documentId}`, {
    method: "PUT",
    body: JSON.stringify({
      data: {
        paymentStatus: "paid",
        bookingStatus: "confirmed",
        paymentMethod,
        transactionId,
        ...(totalAmount !== undefined ? { totalAmount } : {}),
        ...(promoCode !== undefined ? { promoCode } : {}),
      },
    }),
  });

  return { success: true, message: "Thanh toán thành công!" };
}

export async function createContact(
  contact: ContactFormData
): Promise<{ success: boolean; message: string }> {
  await strapiFetch("/contacts", {
    method: "POST",
    body: JSON.stringify({
      data: {
        fullName: contact.fullName,
        email: contact.email,
        subject: contact.subject,
        message: contact.message,
      },
    }),
  });

  return { success: true, message: "Gửi liên hệ thành công!" };
}

export async function getBookingsByUser(
  email: string,
  jwt: string
): Promise<any[]> {
  const data = await strapiFetch<{ data: any[] }>(
    `/bookings?filters[email][$eq]=${email}&populate[tour][populate]=image&sort=createdAt:desc`,
    {
      headers: { Authorization: `Bearer ${jwt}` },
      cache: "no-store",
    }
  );

  return (data.data || []).map(normalizeBooking);
}

/** Update booking status via the custom /status route (bypasses Content Manager validation) */
export async function updateBookingStatus(
  documentId: string,
  status: "pending" | "confirmed" | "cancelled",
  jwt: string
): Promise<{ success: boolean; message: string }> {
  const res = await fetch(
    `${STRAPI_URL}/api/bookings/${documentId}/status`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({ status }),
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      err?.error?.message || `Failed to update status: ${res.status}`
    );
  }

  return { success: true, message: "Cập nhật trạng thái thành công!" };
}

/** Get ALL bookings (admin use — requires JWT) */
export async function getAllBookings(jwt: string): Promise<any[]> {
  const data = await strapiFetch<{ data: any[] }>(
    `/bookings?populate[tour]=true&sort=createdAt:desc&pagination[pageSize]=200`,
    {
      headers: { Authorization: `Bearer ${jwt}` },
      cache: "no-store",
    }
  );

  return (data.data || []).map(normalizeBooking);
}

export async function getReviewsByTourSlug(
  slug: string,
  preview: boolean = false
): Promise<Testimonial[]> {
  const statusParam = preview ? "status=draft" : "status=published";
  const data = await strapiFetch<{ data: Record<string, unknown>[] }>(
    `/testimonials?filters[tour][slug][$eq]=${slug}&populate=*&${statusParam}`,
    {
      next: { revalidate: preview ? 0 : 60 },
      cache: preview ? 'no-store' : undefined,
    } as any
  );
  return (data.data || []).map(normalizeTestimonial);
}

export async function createReview(data: {
  name: string;
  content: string;
  rating: number;
  tour: string | number;
  user?: string;
}): Promise<{ success: boolean; message: string; data?: any }> {
  const res = await strapiFetch<{ data: any }>("/testimonials?status=draft", {
    method: "POST",
    body: JSON.stringify({
      data: {
        name: data.name,
        content: data.content,
        rating: data.rating,
        tour: data.tour,
        user: data.user,
      },
    }),
    next: { revalidate: 0 },
    cache: 'no-store',
  } as any);

  return {
    success: true,
    message: "Đánh giá của bạn đã được ghi nhận và đang chờ duyệt!",
    data: res.data,
  };
}

export async function publishReview(
  documentId: string
): Promise<{ success: boolean; message: string }> {
  await strapiFetch(`/testimonials-publish/${documentId}`, {
    method: "PUT",
    next: { revalidate: 0 },
    cache: 'no-store',
  } as any);

  return { success: true, message: "Phê duyệt đánh giá thành công!" };
}

export async function deleteReview(
  documentId: string
): Promise<{ success: boolean; message: string }> {
  await strapiFetch(`/testimonials/${documentId}`, {
    method: "DELETE",
    next: { revalidate: 0 },
    cache: 'no-store',
  } as any);

  return { success: true, message: "Xóa đánh giá thành công!" };
}

export async function getAllTestimonialsAdmin(): Promise<Testimonial[]> {
  // 1. Fetch drafts
  const draftData = await strapiFetch<{ data: Record<string, unknown>[] }>(
    `/testimonials?populate=*&status=draft&sort=createdAt:desc&pagination[pageSize]=200`,
    {
      next: { revalidate: 0 },
      cache: 'no-store',
    } as any
  );
  const drafts = (draftData.data || []).map(normalizeTestimonial);

  // 2. Fetch published versions to check which ones are active
  const publishedData = await strapiFetch<{ data: Record<string, unknown>[] }>(
    `/testimonials?status=published&pagination[pageSize]=200`,
    {
      next: { revalidate: 0 },
      cache: 'no-store',
    } as any
  );
  
  const publishedMap = new Map<string, string>();
  (publishedData.data || []).forEach((item: any) => {
    const docId = item.documentId || item.attributes?.documentId;
    const pubAt = item.publishedAt || item.attributes?.publishedAt;
    if (docId && pubAt) {
      publishedMap.set(docId, pubAt);
    }
  });

  // 3. Map publishedAt timestamps onto the drafts
  return drafts.map((draft) => {
    if (draft.documentId && publishedMap.has(draft.documentId)) {
      return {
        ...draft,
        publishedAt: publishedMap.get(draft.documentId),
      };
    }
    return draft;
  });
}

export { STRAPI_URL };

