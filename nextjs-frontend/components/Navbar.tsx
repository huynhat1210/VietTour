"use client";

import { NAV_LINKS } from "@/constants";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, ReactNode } from "react";
import Button from "./Button";

interface AppNotification {
  id: string | number;
  type: "promo" | "booking";
  icon: string;
  title: string;
  body: ReactNode;
  createdAt?: string;
  unread: boolean;
}

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: "promo-welcome",
      type: "promo",
      icon: "🎉",
      title: "Khuyến mãi cực hot!",
      body: (
        <span>
          Giảm ngay 10% khi đặt tour đầu tiên. Nhập mã:{" "}
          <strong className="text-green-50 font-bold">WELCOME10</strong>
        </span>
      ),
      unread: true,
    }
  ]);
  const [unreadCount, setUnreadCount] = useState(1);
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();
  const { showToast } = useToast();
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (!user) {
      const readIdsStr = localStorage.getItem("read_notifications_anonymous") || "[]";
      let readIds: string[] = [];
      try {
        readIds = JSON.parse(readIdsStr);
      } catch (_) {}

      const initialPromo = {
        id: "promo-welcome",
        type: "promo" as const,
        icon: "🎉",
        title: "Khuyến mãi cực hot!",
        body: (
          <span>
            Giảm ngay 10% khi đặt tour đầu tiên. Nhập mã:{" "}
            <strong className="text-green-50 font-bold">WELCOME10</strong>
          </span>
        ),
        unread: !readIds.includes("promo-welcome"),
      };

      setNotifications([initialPromo]);
      setUnreadCount(initialPromo.unread ? 1 : 0);
      return;
    }

    const fetchNotifications = async () => {
      try {
        const res = await fetch("/api/bookings");
        if (res.ok) {
          const data = await res.json();
          const bookings = data.bookings || [];
          
          const bookingNotifications: AppNotification[] = bookings.map((b: any) => {
            const tourTitle = b.tour?.title || "Tour";
            const isConfirmed = b.status === "confirmed" || b.bookingStatus === "confirmed" || b.paymentStatus === "paid";
            const isCancelled = b.status === "cancelled" || b.bookingStatus === "cancelled";
            
            let icon = "✓";
            let title = "Đơn đặt tour thành công";
            let body = `Yêu cầu đặt tour ${tourTitle} của bạn đã được xác nhận thành công.`;
            
            if (isCancelled) {
              icon = "✕";
              title = "Đơn đặt tour đã hủy";
              body = `Đơn đặt tour ${tourTitle} của bạn đã bị hủy.`;
            } else if (!isConfirmed) {
              icon = "⏳";
              title = "Đơn đặt tour đang chờ";
              body = `Đơn đặt tour ${tourTitle} đang chờ xác nhận hoặc thanh toán.`;
            }

            return {
              id: `booking-${b.id || b.documentId}`,
              type: "booking" as const,
              icon,
              title,
              body,
              createdAt: b.createdAt,
              unread: true,
            };
          });

          const readIdsStr = localStorage.getItem(`read_notifications_${user.id}`) || "[]";
          let readIds: string[] = [];
          try {
            readIds = JSON.parse(readIdsStr);
          } catch (_) {}

          const finalNotifications = [
            {
              id: "promo-welcome",
              type: "promo" as const,
              icon: "🎉",
              title: "Khuyến mãi cực hot!",
              body: (
                <span>
                  Giảm ngay 10% khi đặt tour đầu tiên. Nhập mã:{" "}
                  <strong className="text-green-50 font-bold">WELCOME10</strong>
                </span>
              ),
              unread: !readIds.includes("promo-welcome"),
            },
            ...bookingNotifications.map(n => ({
              ...n,
              unread: !readIds.includes(String(n.id))
            }))
          ];

          setNotifications(finalNotifications);
          setUnreadCount(finalNotifications.filter(n => n.unread).length);
        }
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [user, mounted]);

  const handleMarkAllAsRead = () => {
    setUnreadCount(0);
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    const allIds = notifications.map(n => String(n.id));
    if (user) {
      localStorage.setItem(`read_notifications_${user.id}`, JSON.stringify(allIds));
    } else {
      localStorage.setItem("read_notifications_anonymous", JSON.stringify(allIds));
    }
    setShowNotificationDropdown(false);
    showToast("Đã đánh dấu tất cả là đã đọc", "info");
  };

  const handleMarkSingleAsRead = (id: string | number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
    const targetIdStr = String(id);
    const key = user ? `read_notifications_${user.id}` : "read_notifications_anonymous";
    const readIdsStr = localStorage.getItem(key) || "[]";
    let readIds: string[] = [];
    try {
      readIds = JSON.parse(readIdsStr);
    } catch (_) {}
    if (!readIds.includes(targetIdStr)) {
      readIds.push(targetIdStr);
      localStorage.setItem(key, JSON.stringify(readIds));
    }
    // Update unread count dynamically
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  useEffect(() => {
    if (!showDropdown) return;
    const closeDropdown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".user-menu-container")) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("click", closeDropdown);
    return () => document.removeEventListener("click", closeDropdown);
  }, [showDropdown]);

  useEffect(() => {
    if (!showLangDropdown) return;
    const closeLangDropdown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".lang-menu-container")) {
        setShowLangDropdown(false);
      }
    };
    document.addEventListener("click", closeLangDropdown);
    return () => document.removeEventListener("click", closeLangDropdown);
  }, [showLangDropdown]);

  useEffect(() => {
    if (!showNotificationDropdown) return;
    const closeNotificationDropdown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".notification-container")) {
        setShowNotificationDropdown(false);
      }
    };
    document.addEventListener("click", closeNotificationDropdown);
    return () => document.removeEventListener("click", closeNotificationDropdown);
  }, [showNotificationDropdown]);

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
    showToast("Đăng xuất tài khoản thành công.", "info");
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 border-b ${scrolled
        ? "border-emerald-600/10 dark:border-stone-900 bg-white/80 dark:bg-stone-950/80 shadow-[0_10px_30px_-10px_rgba(4,120,87,0.08)] dark:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] backdrop-blur-md py-2"
        : "border-gray-10/40 dark:border-stone-900 bg-white/95 dark:bg-stone-950 py-3"
        }`}
    >
      <nav className="flexBetween max-container padding-container">
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
          <span className="font-black text-2xl tracking-tight text-gray-90 dark:text-white">
            Viet<span className="text-green-50">Tour</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <ul className="hidden h-full items-center gap-1.5 lg:flex">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                href={link.href}
                key={link.key}
                className={`regular-16 rounded-full px-5 py-2.5 transition-all duration-300 font-bold ${isActive
                  ? "bg-green-50/10 dark:bg-green-50/20 border border-green-50/20 text-green-50 shadow-sm"
                  : "text-gray-50 dark:text-stone-400 border border-transparent hover:bg-green-50/5 dark:hover:bg-stone-900/50 hover:text-green-50 dark:hover:text-green-50"
                  }`}
              >
                {t(`nav_${link.key}` as any)}
              </Link>
            );
          })}
        </ul>

        {/* Desktop Action Buttons */}
        <div className="hidden items-center gap-3 lg:flex">
          {!loading && (
            <>
              {user ? (
                <>
                  {/* User menu container */}
                  <div className="relative user-menu-container">
                    <button
                      type="button"
                      onClick={() => {
                        setShowDropdown(!showDropdown);
                        setShowNotificationDropdown(false);
                      }}
                      className="regular-16 flex items-center gap-2 text-gray-90 dark:text-stone-200 transition-colors duration-200 hover:text-green-50 focus:outline-none"
                    >
                      {user.avatar ? (
                        <div className="relative h-7 w-7 rounded-full overflow-hidden ring-2 ring-green-50/20">
                          <Image
                            src={user.avatar}
                            alt={user.fullName || user.username}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      ) : (
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-green-50 text-xs font-bold text-white shadow-sm ring-2 ring-green-50/20">
                          {(user.fullName || user.username).charAt(0).toUpperCase()}
                        </span>
                      )}
                      <span className="font-semibold text-green-50">
                        {user.fullName || user.username}
                      </span>
                      <svg
                        className={`h-4 w-4 text-green-50 transition-transform duration-200 ${showDropdown ? "rotate-180" : ""
                          }`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {showDropdown && (
                      <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-56 overflow-hidden rounded-2xl border border-gray-10/80 dark:border-stone-850 bg-white/95 dark:bg-stone-950 p-1.5 shadow-xl transition-all duration-300 backdrop-blur-md">
                        <Link
                          href="/profile"
                          onClick={() => setShowDropdown(false)}
                          className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-70 dark:text-stone-300 hover:bg-green-50/10 dark:hover:bg-green-50/20 hover:text-green-50 dark:hover:text-green-50 transition-all duration-200"
                        >
                          <svg
                            className="h-5 w-5 text-gray-50 transition-colors group-hover:text-green-50"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          {t("nav_profile" as any)}
                        </Link>
                        {user?.role?.type === "manager" && (
                          <Link
                            href="/admin-bookings"
                            onClick={() => setShowDropdown(false)}
                            className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50/10 dark:hover:bg-indigo-900/20 hover:text-indigo-700 transition-all duration-200"
                          >
                            <svg
                              className="h-5 w-5 text-indigo-500"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            {t("nav_admin" as any)}
                          </Link>
                        )}

                        {/* Customization Settings Area */}
                        <div className="border-t border-slate-100 dark:border-stone-900/60 my-1.5"></div>
                        <div className="px-3.5 py-1.5">
                          
                          {/* Theme toggle */}
                          <div className="flex items-center justify-between py-1">
                            <span className="text-xs font-semibold text-gray-70 dark:text-stone-300">Chế độ tối</span>
                            <button
                              type="button"
                              onClick={toggleTheme}
                              className="flex items-center justify-center rounded-lg border border-stone-200 dark:border-stone-850 bg-slate-50 dark:bg-stone-900/80 p-1.5 text-gray-70 dark:text-stone-300 hover:bg-slate-100 dark:hover:bg-stone-800 transition-colors"
                              aria-label="Toggle Theme"
                            >
                              {mounted && theme === "dark" ? (
                                <svg className="h-4 w-4 text-amber-500 fill-amber-500/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 9H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                                </svg>
                              ) : (
                                <svg className="h-4 w-4 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                </svg>
                              )}
                            </button>
                          </div>

                          {/* Language switcher */}
                          <div className="flex items-center justify-between py-1">
                            <span className="text-xs font-semibold text-gray-70 dark:text-stone-300">Ngôn ngữ</span>
                            <div className="flex items-center border border-stone-200 dark:border-stone-850 bg-slate-50 dark:bg-stone-900/80 p-0.5 rounded-lg">
                              <button
                                onClick={() => setLanguage("vi")}
                                className={`px-2 py-1 rounded text-[10px] font-bold transition-all duration-200 ${language === "vi"
                                  ? "bg-green-50 text-white shadow-sm"
                                  : "text-gray-50 dark:text-stone-400 hover:text-green-50"
                                  }`}
                              >
                                VI
                              </button>
                              <button
                                onClick={() => setLanguage("en")}
                                className={`px-2 py-1 rounded text-[10px] font-bold transition-all duration-200 ${language === "en"
                                  ? "bg-green-50 text-white shadow-sm"
                                  : "text-gray-50 dark:text-stone-400 hover:text-green-50"
                                  }`}
                              >
                                EN
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="border-t border-slate-100 dark:border-stone-900/60 my-1.5"></div>

                        <button
                          onClick={() => {
                            setShowDropdown(false);
                            handleLogout();
                          }}
                          className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 transition-all duration-200 text-left"
                        >
                          <svg
                            className="h-5 w-5 text-red-400"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          {t("nav_logout" as any)}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Notification Bell */}
                  <div className="relative notification-container">
                    <button
                      type="button"
                      onClick={() => {
                        setShowNotificationDropdown(!showNotificationDropdown);
                        setShowDropdown(false);
                      }}
                      className="relative flex items-center justify-center rounded-full border border-stone-800/30 dark:border-stone-700 bg-slate-50/50 dark:bg-stone-900/50 p-2.5 text-gray-70 dark:text-stone-300 hover:bg-slate-100 dark:hover:bg-stone-800 hover:border-stone-800/60 focus:outline-none shadow-sm transition-all duration-200 cursor-pointer"
                      aria-label="Notifications"
                    >
                      <svg className="h-5 w-5 text-slate-700 dark:text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                      {unreadCount > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-stone-950">
                          {unreadCount}
                        </span>
                      )}
                    </button>

                    {showNotificationDropdown && (
                      <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-80 overflow-hidden rounded-2xl border border-gray-10/80 dark:border-stone-850 bg-white/95 dark:bg-stone-950 p-3 shadow-xl transition-all duration-300 backdrop-blur-md">
                        <div className="flex items-center justify-between border-b border-gray-100 dark:border-stone-800 pb-2 px-1">
                          <span className="text-sm font-bold text-gray-90 dark:text-stone-100">Thông báo</span>
                          <button
                            onClick={handleMarkAllAsRead}
                            className="text-[11px] text-green-50 hover:text-green-600 font-semibold cursor-pointer"
                          >
                            Đã đọc tất cả
                          </button>
                        </div>
                        <div className="mt-2 flex flex-col gap-1.5 max-h-72 overflow-y-auto">
                          {notifications.length > 0 ? (
                            notifications.map((n) => (
                              <div
                                key={n.id}
                                onClick={() => handleMarkSingleAsRead(n.id)}
                                className={`flex gap-3 rounded-xl p-2 transition-colors cursor-pointer ${
                                  n.unread
                                    ? "bg-green-50/5 dark:bg-stone-900/40 hover:bg-slate-50 dark:hover:bg-stone-900 font-semibold"
                                    : "hover:bg-slate-50 dark:hover:bg-stone-900 opacity-70"
                                }`}
                              >
                                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                                  n.type === "promo"
                                    ? "bg-orange-500/10 text-orange-500"
                                    : n.icon === "✕"
                                    ? "bg-red-500/10 text-red-500"
                                    : n.icon === "⏳"
                                    ? "bg-amber-500/10 text-amber-500"
                                    : "bg-green-50/10 text-green-50"
                                } text-base`}>
                                  {n.icon}
                                </span>
                                <div className="text-left flex-1">
                                  <div className="flex items-center justify-between">
                                    <p className="text-xs font-bold text-gray-90 dark:text-stone-100">{n.title}</p>
                                    {n.unread && <span className="h-1.5 w-1.5 rounded-full bg-red-500"></span>}
                                  </div>
                                  <div className="text-[11px] mt-0.5 text-gray-40 dark:text-stone-400 leading-normal">
                                    {n.body}
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="py-6 text-center text-xs text-gray-40 dark:text-stone-500">
                              Không có thông báo nào
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <Link
                  href="/login"
                  className="flexCenter gap-1.5 rounded-full border border-stone-800/30 dark:border-stone-700 bg-slate-50/50 dark:bg-stone-900/50 px-4 py-2 text-xs font-bold text-gray-70 dark:text-stone-300 hover:bg-slate-100 dark:hover:bg-stone-800 hover:border-stone-800/60 focus:outline-none shadow-sm transition-all duration-200 cursor-pointer"
                >
                  <img
                    src="/user.svg"
                    alt=""
                    className="h-4.5 w-4.5 invert dark:invert-0"
                  />
                  <span>{t("nav_login" as any)}</span>
                </Link>
              )}
            </>
          )}

          {/* Theme Toggle Button */}
          {!user && (
            <button
              type="button"
              onClick={toggleTheme}
              className="flex items-center justify-center rounded-full border border-stone-800/30 dark:border-stone-700 bg-slate-50/50 dark:bg-stone-900/50 p-2.5 text-gray-70 dark:text-stone-300 hover:bg-slate-100 dark:hover:bg-stone-800 hover:border-stone-800/60 focus:outline-none shadow-sm transition-all duration-200 cursor-pointer"
              aria-label="Toggle Theme"
            >
              {mounted && theme === "dark" ? (
                <svg className="h-5 w-5 text-amber-500 fill-amber-500/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 9H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                </svg>
              ) : (
                <svg className="h-5 w-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          )}

          {/* Language Switcher Dropdown */}
          {!user && (
            <div className="relative lang-menu-container">
              <button
                type="button"
                onClick={() => setShowLangDropdown(!showLangDropdown)}
                className="flex items-center gap-1.5 rounded-full border border-stone-800/30 dark:border-stone-800 bg-slate-50/50 dark:bg-stone-900/50 px-3.5 py-2 text-xs font-bold text-gray-70 dark:text-stone-300 hover:bg-slate-100 dark:hover:bg-stone-900 hover:border-stone-800/60 focus:outline-none shadow-sm transition-all duration-200"
              >
                <span>{language === "vi" ? "🇻🇳 VI" : "🇬🇧 EN"}</span>
                <svg
                  className={`h-3 w-3 text-gray-50 transition-transform duration-200 ${showLangDropdown ? "rotate-180" : ""
                    }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showLangDropdown && (
                <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-36 overflow-hidden rounded-2xl border border-gray-10/80 dark:border-stone-850 bg-white/95 dark:bg-stone-950 p-1.5 shadow-xl transition-all duration-300 backdrop-blur-md">
                  <button
                    onClick={() => {
                      setLanguage("vi");
                      setShowLangDropdown(false);
                    }}
                    className={`flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all duration-200 text-left ${language === "vi"
                      ? "bg-green-50/10 dark:bg-green-50/20 text-green-50 dark:text-green-400 font-bold"
                      : "text-gray-70 dark:text-stone-300 hover:bg-green-50/5 dark:hover:bg-green-50/10 hover:text-green-50"
                      }`}
                  >
                    <span className="text-sm">🇻🇳</span> Tiếng Việt
                  </button>
                  <button
                    onClick={() => {
                      setLanguage("en");
                      setShowLangDropdown(false);
                    }}
                    className={`flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all duration-200 text-left ${language === "en"
                      ? "bg-green-50/10 dark:bg-green-50/20 text-green-50 dark:text-green-400 font-bold"
                      : "text-gray-70 dark:text-stone-300 hover:bg-green-50/5 dark:hover:bg-green-50/10 hover:text-green-50"
                      }`}
                  >
                    <span className="text-sm">🇬🇧</span> English
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Hamburger menu */}
        <button
          type="button"
          className="inline-flex cursor-pointer items-center justify-center rounded-lg p-1.5 hover:bg-gray-10 dark:hover:bg-stone-900 lg:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Menu"
        >
          <Image
            src={isOpen ? "/close.svg" : "/menu.svg"}
            alt="menu"
            width={26}
            height={26}
            unoptimized
          />
        </button>
      </nav>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full border-b border-gray-10 dark:border-stone-900 bg-white/95 dark:bg-stone-950 px-6 py-6 shadow-xl backdrop-blur-md lg:hidden">
          <ul className="flex flex-col gap-1.5">
            {NAV_LINKS.map((link) => (
              <Link
                href={link.href}
                key={link.key}
                onClick={() => setIsOpen(false)}
                className={`regular-16 rounded-2xl px-4 py-3 transition-colors ${pathname === link.href
                  ? "bg-green-50/10 dark:bg-green-50/20 font-bold text-green-50"
                  : "text-gray-50 dark:text-stone-300 hover:bg-gray-10 dark:hover:bg-stone-900"
                  }`}
              >
                {t(`nav_${link.key}` as any)}
              </Link>
            ))}

            <div className="mt-4 flex flex-col gap-3 border-t border-gray-10 dark:border-stone-900 pt-4">
              {/* Language Switcher in Mobile */}
              <div className="flex items-center justify-between px-4 py-2 bg-slate-50 dark:bg-stone-900/50 rounded-2xl mb-2">
                <span className="text-xs font-bold text-gray-50 dark:text-stone-400">Ngôn ngữ / Language</span>
                <div className="flex items-center border border-gray-10 dark:border-stone-800 bg-white dark:bg-stone-950 p-0.5 rounded-full shadow-sm">
                  <button
                    onClick={() => setLanguage("vi")}
                    className={`px-3 py-1.5 rounded-full text-xs font-black transition-all duration-200 flex items-center gap-1 focus:outline-none ${language === "vi"
                      ? "bg-green-50 text-white"
                      : "text-gray-50 dark:text-stone-400"
                      }`}
                  >
                    🇻🇳 VI
                  </button>
                  <button
                    onClick={() => setLanguage("en")}
                    className={`px-3 py-1.5 rounded-full text-xs font-black transition-all duration-200 flex items-center gap-1 focus:outline-none ${language === "en"
                      ? "bg-green-50 text-white"
                      : "text-gray-50 dark:text-stone-400"
                      }`}
                  >
                    🇬🇧 EN
                  </button>
                </div>
              </div>

              {/* Theme Switcher in Mobile */}
              <div className="flex items-center justify-between px-4 py-2 bg-slate-50 dark:bg-stone-900/50 rounded-2xl mb-2">
                <span className="text-xs font-bold text-gray-50 dark:text-stone-400">Chế độ tối / Dark Mode</span>
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="flex items-center border border-gray-10 dark:border-stone-800 bg-white dark:bg-stone-950 p-1 rounded-full shadow-sm focus:outline-none cursor-pointer"
                >
                  <div className={`flex items-center justify-center h-6 w-12 rounded-full relative transition-colors duration-300 ${mounted && theme === "dark" ? "bg-green-50" : "bg-gray-200 dark:bg-stone-800"}`}>
                    <span className={`absolute left-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-white transition-transform duration-300 ${mounted && theme === "dark" ? "translate-x-5.5" : "translate-x-0"}`}>
                      {mounted && theme === "dark" ? "🌙" : "☀️"}
                    </span>
                  </div>
                </button>
              </div>

              {user ? (
                <>
                  <div className="flex items-center gap-3 px-4 py-2">
                    {user.avatar ? (
                      <div className="relative h-10 w-10 rounded-full overflow-hidden shadow-sm">
                        <Image
                          src={user.avatar}
                          alt={user.fullName || user.username}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50 text-base font-bold text-white shadow-sm">
                        {(user.fullName || user.username).charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="bold-16 text-gray-90 dark:text-stone-200">{user.fullName || user.username}</p>
                      <p className="regular-12 text-gray-30 dark:text-stone-400">{user.email}</p>
                    </div>
                  </div>

                  {/* Notifications list in mobile */}
                  {notifications.filter(n => n.unread).length > 0 ? (
                    <div className="flex flex-col gap-2.5 bg-slate-50 dark:bg-stone-900/30 p-4 rounded-2xl mb-2 border border-gray-100 dark:border-stone-850">
                      <div className="flex items-center justify-between border-b border-gray-100 dark:border-stone-800 pb-1.5">
                        <span className="text-xs font-bold text-gray-90 dark:text-stone-200">Thông báo mới</span>
                        <span className="rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white">{unreadCount}</span>
                      </div>
                      <div className="flex flex-col gap-3 mt-1">
                        {notifications
                          .filter(n => n.unread)
                          .map((n) => (
                            <div
                              key={n.id}
                              onClick={() => handleMarkSingleAsRead(n.id)}
                              className="text-[11px] leading-relaxed text-gray-50 dark:text-stone-400 text-left cursor-pointer"
                            >
                              <strong className="text-gray-90 dark:text-stone-200 block text-xs font-bold">
                                {n.icon} {n.title}
                              </strong>
                              {n.body}
                            </div>
                          ))}
                      </div>
                      <div className="flex justify-end border-t border-gray-100 dark:border-stone-800/80 pt-1.5 mt-0.5">
                        <button
                          onClick={handleMarkAllAsRead}
                          className="text-[10px] text-green-50 hover:text-green-600 font-semibold"
                        >
                          Đã đọc tất cả
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-slate-50 dark:bg-stone-900/30 p-3 rounded-2xl mb-2 border border-gray-100 dark:border-stone-850 text-center">
                      <p className="text-xs text-gray-40 dark:text-stone-500 font-medium">Không có thông báo mới</p>
                    </div>
                  )}
                  <Link
                    href="/profile"
                    onClick={() => setIsOpen(false)}
                    className="regular-16 rounded-2xl bg-gray-10/50 dark:bg-stone-900/50 px-4 py-3 text-center font-semibold text-gray-90 dark:text-stone-200 hover:bg-gray-10 dark:hover:bg-stone-800 transition-colors"
                  >
                    {t("nav_profile" as any)}
                  </Link>
                  {user?.role?.type === "manager" && (
                    <Link
                      href="/admin-bookings"
                      onClick={() => setIsOpen(false)}
                      className="regular-16 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 px-4 py-3 text-center font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
                    >
                      {t("nav_admin" as any)}
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="regular-16 rounded-2xl bg-red-50/50 dark:bg-red-950/30 px-4 py-3 text-center font-semibold text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer"
                  >
                    {t("nav_logout" as any)}
                  </button>
                  <Button title={t("cta_btn" as any)} variant="btn_green" href="/tours" full />
                </>
              ) : (
                <Link
                  href="/login"
                  className="flexCenter gap-2 rounded-full border border-stone-800/30 dark:border-stone-700 bg-slate-50/50 dark:bg-stone-900/50 px-6 py-2.5 text-xs font-bold text-gray-70 dark:text-stone-300 hover:bg-slate-100 dark:hover:bg-stone-800 transition-all duration-200 active:scale-95 shadow-sm text-center w-full cursor-pointer"
                >
                  <img
                    src="/user.svg"
                    alt=""
                    className="h-4.5 w-4.5 invert dark:invert-0"
                  />
                  <span>{t("nav_login" as any)}</span>
                </Link>
              )}
            </div>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Navbar;
