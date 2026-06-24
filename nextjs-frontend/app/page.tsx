import BookingCTA from "@/components/BookingCTA";
import Destinations from "@/components/Destinations";
import FeaturedTours from "@/components/FeaturedTours";
import Features from "@/components/Features";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import {
  fetchDestinations,
  fetchTestimonials,
  fetchTours,
} from "@/lib/data";
import { cookies } from "next/headers";

export default async function Home() {
  const cookieStore = await cookies();
  const locale = cookieStore.get("locale")?.value || "vi";

  const [tours, destinations, testimonials] = await Promise.all([
    fetchTours(true, locale),
    fetchDestinations(true, locale),
    fetchTestimonials(),
  ]);

  return (
    <>
      <Hero />
      <Destinations destinations={destinations} />
      <FeaturedTours tours={tours} />
      <HowItWorks />
      <Features />
      <Testimonials testimonials={testimonials} />
      <BookingCTA />
    </>
  );
}
