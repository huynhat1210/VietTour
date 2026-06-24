export interface StrapiImage {
  url: string;
  alternativeText?: string;
  width?: number;
  height?: number;
}

export interface Destination {
  id: number;
  documentId?: string;
  name: string;
  slug: string;
  description: string;
  region: string;
  image?: StrapiImage;
  featured?: boolean;
  intro?: string;
  spots?: { name: string; description: string; image: string }[];
  tips?: string[];
}

export interface Tour {
  id: number;
  documentId?: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  price: number;
  duration: string;
  location: string;
  maxGroupSize: number;
  difficulty: "Dễ" | "Trung bình" | "Khó";
  itinerary?: string;
  mapUrl?: string;
  image?: StrapiImage;
  images?: StrapiImage[];
  featured?: boolean;
  destination?: Destination;
  testimonials?: Testimonial[];
}

export interface Testimonial {
  id: number;
  documentId?: string;
  name: string;
  content: string;
  rating: number;
  avatar?: StrapiImage;
  tour?: string;
  publishedAt?: string;
  tourSlug?: string;
}

export interface BookingFormData {
  fullName: string;
  email: string;
  phone: string;
  tourDate: string;
  numberOfGuests: number;
  message?: string;
  tour: number | string;
}

export interface ContactFormData {
  fullName: string;
  email: string;
  subject: string;
  message: string;
}

export interface User {
  id: number;
  documentId?: string;
  username: string;
  email: string;
  fullName?: string;
  phone?: string;
  avatar?: string;
  confirmed?: boolean;
  gender?: string;
  dateOfBirth?: string;
  province?: string;
  district?: string;
  ward?: string;
  addressDetail?: string;
  role?: {
    id: number;
    name: string;
    type: string;
  };
}

export interface AuthResponse {
  jwt: string;
  user: User;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  fullName?: string;
  phone?: string;
}
