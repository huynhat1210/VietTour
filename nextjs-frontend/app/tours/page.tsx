import ToursExplorer from "@/components/ToursExplorer";
import { fetchDestinations, fetchTours } from "@/lib/data";
import type { Metadata } from "next";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Tour du lịch",
  description:
    "Danh sách tour du lịch khắp Việt Nam - Hạ Long, Hội An, Sa Pa, Phú Quốc và nhiều hơn nữa.",
};

export default async function ToursPage() {
  const cookieStore = await cookies();
  const locale = cookieStore.get("locale")?.value || "vi";

  const [tours, destinations] = await Promise.all([
    fetchTours(false, locale),
    fetchDestinations(false, locale),
  ]);

  return (
    <section className="padding-container max-container py-12 lg:py-16 dark:bg-transparent">
      <ToursExplorer tours={tours} destinations={destinations} />
    </section>
  );
}
