import { STATS } from "@/constants";
import type { Metadata } from "next";
import Image from "next/image";
import { cookies } from "next/headers";
import { TRANSLATIONS } from "@/constants/translations";
import ScrollReveal from "@/components/ScrollReveal";

export const metadata: Metadata = {
  title: "Giới thiệu về chúng tôi",
  description:
    "VietTour tự hào là nền tảng du lịch trực tuyến hàng đầu, mang đến những tour du lịch trải nghiệm thực tế chất lượng cao và bền vững tại Việt Nam.",
};

export default async function AboutPage() {
  const cookieStore = await cookies();
  const locale = cookieStore.get("locale")?.value || "vi";
  const dict = TRANSLATIONS[locale as keyof typeof TRANSLATIONS] || TRANSLATIONS.vi;

  const getStatLabel = (label: string) => {
    if (label === "Khách hàng") return dict.stats_customers;
    if (label === "Tour du lịch") return dict.stats_tours;
    if (label === "Tỉnh thành") return dict.stats_provinces;
    if (label === "Đánh giá") return dict.stats_rating;
    return label;
  };

  const CORE_VALUES = [
    {
      title: "Trải nghiệm thực tế",
      description: "Chúng tôi tập trung vào tính chân thực của văn hóa địa phương, đưa bạn chạm tới những vẻ đẹp ẩn giấu và cuộc sống thường nhật của người dân bản địa.",
      icon: (
        <svg className="h-8 w-8 text-green-50" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      ),
    },
    {
      title: "Chất lượng chuẩn mực",
      description: "Mỗi hành trình đều được đội ngũ chuyên gia khảo sát kỹ lưỡng, tối ưu hóa từ phương tiện vận chuyển, lưu trú đến bữa ăn để đảm bảo sự hài lòng tuyệt đối.",
      icon: (
        <svg className="h-8 w-8 text-green-50" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
    },
    {
      title: "Du lịch có trách nhiệm",
      description: "VietTour cam kết bảo vệ môi trường tự nhiên, tôn trọng bản sắc văn hóa vùng miền và trích một phần doanh thu để hỗ trợ phát triển sinh kế cho cộng đồng địa phương.",
      icon: (
        <svg className="h-8 w-8 text-green-50" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
    },
  ];
  return (
    <>
      {/* Main Content & Story */}
      <section className="padding-container max-container pt-12 pb-16 lg:py-20">
        {/* Simple Title & Intro Block */}
        <div className="mb-12 text-left border-b border-gray-10 dark:border-stone-700 pb-8 flex flex-col gap-1">
          <ScrollReveal variant="fade-down" duration={0.6}>
            <span className="text-[10px] font-black uppercase tracking-widest text-green-50">
              Về VietTour
            </span>
          </ScrollReveal>
          <ScrollReveal variant="fade-up" duration={0.6} delay={0.15}>
            <h1 className="mt-1 text-3xl font-black md:text-4xl text-slate-800 dark:text-stone-100 tracking-tight leading-tight">
              Kiến Tạo Những Hành Trình Chân Thực
            </h1>
          </ScrollReveal>
          <ScrollReveal variant="fade-up" duration={0.8} delay={0.3}>
            <p className="mt-2 text-xs md:text-sm text-slate-500 dark:text-stone-400 font-semibold max-w-3xl leading-relaxed">
              VietTour không chỉ bán những chuyến đi, chúng tôi mang tới cơ hội để bạn trải nghiệm chiều sâu của văn hóa, thiên nhiên và lòng hiếu khách trên khắp dải đất hình chữ S.
            </p>
          </ScrollReveal>
        </div>

        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <ScrollReveal variant="fade-right" duration={0.8} className="w-full">
            <div className="relative h-[320px] sm:h-[400px] lg:h-[500px] overflow-hidden rounded-3xl shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1528127269322-539801943592?w=1200&q=80"
                alt="Hành trình khám phá Việt Nam"
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
                unoptimized
              />
            </div>
          </ScrollReveal>

          <div className="flex flex-col">
            <ScrollReveal variant="fade-left" duration={0.6}>
              <span className="text-sm font-semibold uppercase tracking-[0.15em] text-green-50">Câu chuyện của chúng tôi</span>
            </ScrollReveal>
            <ScrollReveal variant="fade-left" duration={0.6} delay={0.15}>
              <h2 className="bold-32 mt-2 text-gray-90 dark:text-stone-100 lg:bold-40">Hơn cả một chuyến đi, đó là sự thấu hiểu</h2>
            </ScrollReveal>
            <ScrollReveal variant="fade-left" duration={0.8} delay={0.3}>
              <p className="regular-16 mt-6 leading-relaxed text-gray-50 dark:text-stone-400">
                Khởi nguồn từ niềm đam mê xê dịch và tình yêu vô bờ dành cho cảnh sắc thiên nhiên và con người Việt Nam, VietTour được thành lập nhằm mang tới một cách tiếp cận du lịch mới mẻ, chân thực hơn. Chúng tôi tập trung khai thác các giá trị lịch sử bản địa, ẩm thực truyền thống và vẻ đẹp tiềm ẩn chưa được khai phá.
              </p>
            </ScrollReveal>
            <ScrollReveal variant="fade-left" duration={0.8} delay={0.4}>
              <p className="regular-16 mt-4 leading-relaxed text-gray-50 dark:text-stone-400">
                Bằng việc tích hợp các công nghệ đặt chỗ thông minh và hệ thống quản trị dữ liệu hiện đại, chúng tôi loại bỏ hoàn toàn các rắc rối thủ tục cũ kỹ, giúp bạn dễ dàng lên kế hoạch và an tâm tận hưởng kỳ nghỉ của mình.
              </p>
            </ScrollReveal>
            
            {/* Callouts */}
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <ScrollReveal variant="fade-up" duration={0.6} delay={0.5}>
                <div className="flex gap-3 items-start p-4 bg-gray-10/40 dark:bg-stone-800 rounded-2xl border border-gray-10 dark:border-stone-700 h-full">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-50/10 text-green-50 bold-18">✓</span>
                  <div>
                    <p className="bold-16 text-gray-90 dark:text-stone-100">Hướng dẫn viên bản địa</p>
                    <p className="regular-14 mt-1 text-gray-30 dark:text-stone-400">Hiểu biết sâu sắc văn hóa địa phương.</p>
                  </div>
                </div>
              </ScrollReveal>
              <ScrollReveal variant="fade-up" duration={0.6} delay={0.6}>
                <div className="flex gap-3 items-start p-4 bg-gray-10/40 dark:bg-stone-800 rounded-2xl border border-gray-10 dark:border-stone-700 h-full">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-50/10 text-green-50 bold-18">✓</span>
                  <div>
                    <p className="bold-16 text-gray-90 dark:text-stone-100">Hỗ trợ khẩn cấp 24/7</p>
                    <p className="regular-14 mt-1 text-gray-30 dark:text-stone-400">Luôn đồng hành trên từng cung đường.</p>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Grid */}
      <section className="bg-gray-10/30 dark:bg-stone-800/50 border-y border-gray-10 dark:border-stone-700 py-16 lg:py-24">
        <div className="padding-container max-container">
          <div className="text-center mb-16 flex flex-col gap-1">
            <ScrollReveal variant="fade-up" duration={0.6}>
              <span className="text-sm font-semibold uppercase tracking-[0.15em] text-green-50">Giá trị cốt lõi</span>
            </ScrollReveal>
            <ScrollReveal variant="fade-up" duration={0.6} delay={0.15}>
              <h2 className="bold-32 mt-2 text-gray-90 dark:text-stone-100 lg:bold-40">Những nguyên tắc định hình dịch vụ</h2>
            </ScrollReveal>
            <ScrollReveal variant="fade-up" duration={0.8} delay={0.3}>
              <p className="regular-16 mt-4 mx-auto max-w-xl text-gray-30 dark:text-stone-400">
                Chúng tôi xây dựng mọi trải nghiệm du lịch dựa trên sự tử tế, minh bạch và mục tiêu phát triển bền vững cùng cộng đồng.
              </p>
            </ScrollReveal>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {CORE_VALUES.map((val, index) => (
              <ScrollReveal
                key={val.title}
                variant="fade-up"
                duration={0.6}
                delay={0.1 + index * 0.1}
                className="h-full"
              >
                <div className="flex flex-col rounded-3xl border border-gray-10 dark:border-stone-700 bg-white dark:bg-stone-900 p-8 shadow-sm transition-all duration-300 hover:border-green-50/30 hover:shadow-md h-full">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50/10 shadow-inner">
                    {val.icon}
                  </div>
                  <h3 className="bold-20 mt-6 text-gray-90 dark:text-stone-100">{val.title}</h3>
                  <p className="regular-15 mt-3 leading-relaxed text-gray-30 dark:text-stone-400">{val.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Block */}
      <section className="padding-container max-container py-16 lg:py-24">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5 flex flex-col gap-1">
            <ScrollReveal variant="fade-right" duration={0.6}>
              <span className="text-sm font-semibold uppercase tracking-[0.15em] text-green-50">Thành quả đạt được</span>
            </ScrollReveal>
            <ScrollReveal variant="fade-right" duration={0.6} delay={0.15}>
              <h2 className="bold-32 mt-2 text-gray-90 dark:text-stone-100 lg:bold-40">Những con số ấn tượng từ hành trình</h2>
            </ScrollReveal>
            <ScrollReveal variant="fade-right" duration={0.8} delay={0.3}>
              <p className="regular-16 mt-4 text-gray-30 dark:text-stone-400">
                Trong suốt những năm qua, sự tin tưởng của du khách chính là nguồn động lực to lớn giúp VietTour không ngừng hoàn thiện dịch vụ và mở rộng hệ thống tour tuyến trải dài toàn quốc.
              </p>
            </ScrollReveal>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:col-span-7">
            {STATS.map((stat, index) => (
              <ScrollReveal
                key={stat.label}
                variant="zoom-in"
                duration={0.6}
                delay={0.1 + index * 0.1}
              >
                <div className="relative overflow-hidden rounded-3xl border border-gray-10 dark:border-stone-700 bg-white dark:bg-stone-800 p-6 sm:p-8 shadow-sm transition-shadow hover:shadow-md text-center">
                  <p className="bold-36 sm:bold-48 text-green-50 leading-none">{stat.value}</p>
                  <p className="regular-14 sm:regular-16 mt-3 text-gray-30 dark:text-stone-400 font-medium">{getStatLabel(stat.label)}</p>
                  <div className="absolute -right-8 -bottom-8 h-24 w-24 rounded-full bg-green-50/5" />
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Earthy Forest Styled Callout Box */}
      <section className="padding-container max-container pb-20 lg:pb-28">
        <ScrollReveal variant="zoom-in" duration={0.8} className="w-full">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-green-90 to-emerald-950 p-10 text-white shadow-xl lg:p-16">
            <div className="pointer-events-none absolute -left-8 -top-8 h-56 w-56 rounded-full bg-white/5 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-8 -right-8 h-56 w-56 rounded-full bg-green-50/10 blur-2xl" />
            
            <div className="relative max-w-3xl">
              <h3 className="bold-28 sm:bold-36 lg:bold-44 leading-tight">Cam kết phát triển du lịch bền vững</h3>
              <p className="regular-16 mt-6 leading-relaxed text-gray-10 sm:regular-18">
                Mỗi tour du lịch của VietTour đều được lập kế hoạch tỉ mỉ nhằm giảm thiểu rác thải nhựa, tôn trọng hệ sinh thái tự nhiên và bảo vệ các di tích lịch sử. Chúng tôi tin tưởng rằng việc khám phá thế giới luôn cần đi đôi với việc giữ gìn và phát huy những giá trị nguyên bản cho thế hệ mai sau.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </>
  );
}
