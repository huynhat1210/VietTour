import type { Metadata } from "next";

import "./globals.css";
import MainChrome from "@/components/MainChrome";
import Providers from "@/components/Providers";
import { SITE_NAME, SITE_TAGLINE } from "@/constants";

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} - ${SITE_TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "VietTour - Website du lịch và đặt tour khắp Việt Nam. Khám phá Hạ Long, Hội An, Sa Pa, Phú Quốc và hơn 100 tour chất lượng. Đặt tour trực tuyến dễ dàng.",
  keywords: [
    "du lịch Việt Nam",
    "đặt tour",
    "tour du lịch",
    "Hạ Long",
    "Hội An",
    "Sa Pa",
    "Phú Quốc",
    "VietTour",
    "travel Vietnam",
  ],
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: SITE_NAME,
    title: `${SITE_NAME} - ${SITE_TAGLINE}`,
    description:
      "Khám phá vẻ đẹp Việt Nam với tour chất lượng, giá tốt. Đặt tour trực tuyến dễ dàng.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1528127269322-539801943592?w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "VietTour - Du lịch Việt Nam",
      },
    ],
  },
  other: {
    "theme-color": "#059669",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>
          <MainChrome>{children}</MainChrome>
        </Providers>
      </body>
    </html>
  );
}
