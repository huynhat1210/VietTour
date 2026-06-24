"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function NotFound() {
  const { language } = useLanguage();
  const isEn = language === "en";

  const t = {
    title: isEn ? "Lost Your Way?" : "Hành trình bị gián đoạn?",
    subtitle: isEn ? "Page Not Found" : "Không tìm thấy trang",
    desc: isEn 
      ? "The page you are looking for does not exist or has been moved." 
      : "Đường dẫn bạn yêu cầu không tồn tại, đã bị thay đổi hoặc tạm thời không khả dụng.",
    homeBtn: isEn ? "Back to Home" : "Quay về trang chủ",
    toursBtn: isEn ? "Explore Tours" : "Khám phá các tour",
  };

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center py-20 px-6 text-center bg-white dark:bg-stone-900 transition-colors duration-300">
      
      {/* Massive modern 404 Typo with Gradient */}
      <div className="relative select-none font-black text-[9rem] sm:text-[11rem] md:text-[13rem] leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-500 to-green-500 dark:from-emerald-400 dark:via-teal-400 dark:to-green-400">
        404
      </div>

      {/* Decorative subtitle */}
      <span className="text-xs font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mt-2">
        {t.subtitle}
      </span>

      {/* Primary headings */}
      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-stone-100 tracking-tight mt-6 mb-3 leading-snug">
        {t.title}
      </h1>

      {/* Support description */}
      <p className="text-sm sm:text-[15px] text-slate-400 dark:text-stone-400 max-w-md mx-auto leading-relaxed mb-10">
        {t.desc}
      </p>

      {/* Minimalist Pill Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full sm:w-auto">
        <Link
          href="/"
          className="w-full sm:w-auto min-w-[160px] text-center rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-6 py-3.5 text-xs transition-all duration-200 active:scale-95 shadow-md shadow-emerald-500/10 cursor-pointer"
        >
          {t.homeBtn}
        </Link>
        <Link
          href="/tours"
          className="w-full sm:w-auto min-w-[160px] text-center rounded-xl border border-slate-200 dark:border-stone-700 hover:bg-slate-50 dark:hover:bg-stone-800 text-slate-700 dark:text-stone-300 font-bold px-6 py-3.5 text-xs transition-all duration-200 active:scale-95 cursor-pointer"
        >
          {t.toursBtn}
        </Link>
      </div>

    </div>
  );
}
