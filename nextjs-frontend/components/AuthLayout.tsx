import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
  wide?: boolean;
}

const FEATURES = [
  "Đặt tour chỉ vài phút",
  "Ưu đãi dành riêng thành viên",
  "Hỗ trợ 24/7 trước & sau chuyến đi",
];

const AuthLayout = ({
  title,
  subtitle,
  children,
  footer,
  wide = false,
}: AuthLayoutProps) => {
  useEffect(() => {
    // Prevent document body scrolling completely
    const htmlEl = document.documentElement;
    const bodyEl = document.body;

    const originalHtmlOverflow = htmlEl.style.overflow;
    const originalBodyOverflow = bodyEl.style.overflow;
    const originalHtmlHeight = htmlEl.style.height;
    const originalBodyHeight = bodyEl.style.height;
    const originalHtmlBg = htmlEl.style.backgroundColor;
    const originalBodyBg = bodyEl.style.backgroundColor;

    htmlEl.style.overflow = "hidden";
    bodyEl.style.overflow = "hidden";
    htmlEl.style.height = "100%";
    bodyEl.style.height = "100%";
    htmlEl.style.backgroundColor = "#070f1e";
    bodyEl.style.backgroundColor = "#070f1e";

    return () => {
      htmlEl.style.overflow = originalHtmlOverflow;
      bodyEl.style.overflow = originalBodyOverflow;
      htmlEl.style.height = originalHtmlHeight;
      bodyEl.style.height = originalBodyHeight;
      htmlEl.style.backgroundColor = originalHtmlBg;
      bodyEl.style.backgroundColor = originalBodyBg;
    };
  }, []);

  return (
    <section className="relative flex h-screen w-screen items-center justify-center overflow-hidden bg-[#070f1e]">
      <Image
        src="https://images.unsplash.com/photo-1528127269322-539801943592?w=1920&q=85"
        alt=""
        fill
        className="object-cover z-0"
        priority
        unoptimized
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#030712]/95 via-[#030712]/75 to-transparent z-10" />

      <div className="pointer-events-none absolute -left-24 top-1/4 h-[28rem] w-[28rem] rounded-full bg-green-50/15 blur-3xl z-10" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl z-10" />

      <header className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-6 py-6 lg:px-12">
        <Link href="/" className="flex items-center gap-2 transition-transform duration-300 hover:scale-[1.04]">
          <Image
            src="/camp.svg"
            alt="VietTour"
            width={40}
            height={40}
            style={{ width: "auto", height: "auto" }}
            unoptimized
            priority
          />
          <span className="font-black text-2xl tracking-tight text-white">
            Viet<span className="text-emerald-400">Tour</span>
          </span>
        </Link>
        <Link
          href="/"
          className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white/90 backdrop-blur-md transition-all hover:bg-white/20"
        >
          ← Trang chủ
        </Link>
      </header>

      <div className="relative z-20 mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-10 px-6 lg:grid-cols-2 lg:gap-16 lg:px-12 max-h-[90vh]">
        <div className="hidden text-white lg:block">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Du lịch Việt Nam
          </span>
          <h2 className="mt-6 max-w-lg text-[2.75rem] font-bold leading-[1.15] tracking-tight text-white drop-shadow-lg">
            Hành trình du lịch <br />
            <span className="bg-gradient-to-r from-emerald-400 to-green-300 bg-clip-text text-transparent">
              bắt đầu từ đây
            </span>
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-slate-300/90 font-medium">
            Tạo tài khoản VietTour để đặt tour nhanh hơn, lưu điểm đến yêu
            thích và nhận ưu đãi độc quyền.
          </p>
          <ul className="mt-10 space-y-4">
            {FEATURES.map((item) => (
              <li key={item} className="flex items-center gap-3 text-slate-200">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-400">
                  ✓
                </span>
                <span className="text-sm font-semibold">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className={`mx-auto w-full ${wide ? "max-w-xl" : "max-w-[440px]"} lg:mx-0 lg:ml-auto`}>
          <div className="rounded-[1.75rem] border border-white/25 bg-white/95 shadow-2xl shadow-black/25 backdrop-blur-2xl">
            <div className="p-6 sm:p-8">
              <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight text-gray-90">
                  {title}
                </h1>
                <p className="mt-2 text-[15px] leading-relaxed text-gray-30">
                  {subtitle}
                </p>
              </div>
              {children}
              <div className="mt-6 border-t border-gray-10/80 pt-5">
                {footer}
                <div className="mt-4 text-center">
                  <Link href="/" className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline transition-colors flex items-center justify-center gap-1">
                    ← Quay lại Trang chủ
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AuthLayout;

const ICONS: Record<string, React.ReactNode> = {
  user: (
    <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  email: (
    <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  lock: (
    <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  ),
  phone: (
    <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  ),
  at: (
    <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
    </svg>
  ),
};

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: keyof typeof ICONS;
}

export function AuthInput({ label, icon, className = "", ...props }: AuthInputProps) {
  return (
    <label className="group flex flex-col gap-2">
      <span className="text-[13px] font-semibold tracking-wide text-gray-50">
        {label}
      </span>
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-20 transition-colors group-focus-within:text-green-50">
            {ICONS[icon]}
          </span>
        )}
        <input
          className={`auth-input ${icon ? "auth-input-with-icon" : ""} ${className}`}
          {...props}
        />
      </div>
    </label>
  );
}

export function AuthError({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50/80 px-4 py-3.5">
      <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-red-100 text-xs font-bold text-red-500">
        !
      </span>
      <p className="text-sm leading-relaxed text-red-600">{message}</p>
    </div>
  );
}

export function AuthSubmit({
  loading,
  label,
  loadingLabel,
}: {
  loading: boolean;
  label: string;
  loadingLabel: string;
}) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="group relative mt-2 w-full overflow-hidden rounded-2xl bg-gradient-to-r from-green-50 to-emerald-500 py-3 text-[15px] font-semibold text-white shadow-lg shadow-green-50/30 transition-all hover:shadow-xl hover:shadow-green-50/40 disabled:opacity-60"
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {loading && (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
        )}
        {loading ? loadingLabel : label}
      </span>
    </button>
  );
}
