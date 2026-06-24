"use client";

import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import type { Tour } from "@/types";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";

interface BookingFormProps {
  tour: Tour;
}

const BookingForm = ({ tour }: BookingFormProps) => {
  const router = useRouter();
  const { user } = useAuth();
  const { showToast } = useToast();
  const { t, language } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-gray-20 dark:border-stone-600 bg-gray-10/30 dark:bg-stone-800/50 p-8 text-center shadow-sm">
        <h3 className="bold-20 text-gray-90 dark:text-stone-100">{t("book_title" as any)}: {tour.title}</h3>
        <p className="regular-16 text-slate-500 dark:text-stone-400">
          {language === "vi" ? "Bạn cần đăng nhập để đặt tour này." : "You need to log in to book this tour."}
        </p>
        <Link
          href={`/login?redirect=${encodeURIComponent(mounted ? window.location.pathname + window.location.search : "")}`}
          className="bold-16 mt-3 inline-block rounded-full bg-green-50 px-6 py-2.5 text-white hover:bg-green-600 transition-all shadow-sm active:scale-95 cursor-pointer"
        >
          {language === "vi" ? "Đăng nhập ngay" : "Log in now"}
        </Link>
      </div>
    );
  }

  const saveLocalBooking = (formData: FormData) => {
    const bookingData = {
      id: Date.now(),
      fullName: formData.get("fullName") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      tourDate: formData.get("tourDate") as string,
      numberOfGuests: Number(formData.get("numberOfGuests")),
      message: (formData.get("message") || "") as string,
      status: "pending",
      tour: {
        id: tour.id,
        title: tour.title,
        slug: tour.slug,
        price: tour.price,
        duration: tour.duration,
        location: tour.location,
        image: tour.image,
      },
      createdAt: new Date().toISOString(),
    };

    const userKey = user ? `bookings_${user.username || user.id}` : "bookings_anonymous";
    try {
      const existing = localStorage.getItem(userKey);
      const list = existing ? JSON.parse(existing) : [];
      list.unshift(bookingData);
      localStorage.setItem(userKey, JSON.stringify(list));
    } catch (err) {
      console.error("Failed to save local booking:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");

    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.get("fullName"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          tourDate: formData.get("tourDate"),
          numberOfGuests: Number(formData.get("numberOfGuests")),
          message: formData.get("message") || "",
          tour: tour.documentId || tour.id,
        }),
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.message);
      
      saveLocalBooking(formData);
      setStatus("success");
      setMessage(result.message || (language === "vi" ? "Đặt tour thành công!" : "Tour booked successfully!"));
      
      const docId = result.data?.documentId;
      if (docId) {
        showToast(
          language === "vi"
            ? "Đặt tour thành công! Đang chuyển hướng đến trang thanh toán..."
            : "Tour booked successfully! Redirecting to checkout...",
          "success"
        );
        setTimeout(() => {
          router.push(`/checkout?id=${docId}`);
        }, 1200);
      } else {
        showToast(
          language === "vi"
            ? "Đặt tour thành công! Vui lòng kiểm tra lịch sử đặt tour."
            : "Tour booked successfully! Please check your booking history.",
          "success"
        );
        (e.target as HTMLFormElement).reset();
      }
    } catch {
      saveLocalBooking(formData);
      setStatus("success");
      setMessage(
        language === "vi"
          ? "Đặt tour thành công! (Lưu cục bộ dưới trình duyệt do máy chủ offline)"
          : "Tour booked successfully! (Saved offline as server is down)"
      );
      showToast(
        language === "vi"
          ? "Đặt tour thành công! (Đã lưu cục bộ offline)"
          : "Tour booked successfully! (Saved offline)",
        "success"
      );
      (e.target as HTMLFormElement).reset();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 rounded-3xl border border-gray-10 dark:border-stone-700 bg-white dark:bg-stone-800 p-8 shadow-sm"
    >
      <h3 className="bold-24 dark:text-stone-100">{t("book_title" as any)}: {tour.title}</h3>

      {user && (
        <div className="rounded-2xl bg-gray-10/50 dark:bg-stone-700 p-5 border border-gray-10/80 dark:border-stone-600 mb-2 flex flex-col gap-2">
          <p className="text-sm font-bold text-gray-50 dark:text-stone-300 flex items-center gap-1.5 mb-1">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-50 text-[10px] font-bold text-white shadow-sm">
              ✓
            </span>
            {language === "vi" ? "Thông tin đặt tour của bạn:" : "Your booking details:"}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
            <div>
              <span className="text-gray-30 dark:text-stone-400 text-xs block">{t("book_fullname" as any)}</span>
              <span className="font-semibold text-gray-90 dark:text-stone-100 mt-0.5 block">{user.fullName || user.username}</span>
            </div>
            <div>
              <span className="text-gray-30 dark:text-stone-400 text-xs block">{t("book_email" as any)}</span>
              <span className="font-semibold text-gray-90 dark:text-stone-100 mt-0.5 block truncate">{user.email}</span>
            </div>
            <div>
              <span className="text-gray-30 dark:text-stone-400 text-xs block">{t("book_phone" as any)}</span>
              <span className="font-semibold text-gray-90 dark:text-stone-100 mt-0.5 block">{user.phone || (language === "vi" ? "Chưa cập nhật" : "Not updated")}</span>
            </div>
          </div>
          <input type="hidden" name="fullName" value={user.fullName || user.username || ""} />
          <input type="hidden" name="email" value={user.email || ""} />
          <input type="hidden" name="phone" value={user.phone || ""} />
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {!user && (
          <>
            <label className="flex flex-col gap-2">
              <span className="regular-14 text-gray-30 dark:text-stone-400">{t("book_fullname" as any)} *</span>
              <input
                name="fullName"
                required
                defaultValue=""
                className="rounded-xl border border-gray-10 dark:border-stone-600 px-4 py-3 regular-16 outline-none focus:border-green-50 bg-white dark:bg-stone-700 text-gray-90 dark:text-stone-100"
                placeholder={language === "vi" ? "Nguyễn Văn A" : "John Doe"}
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="regular-14 text-gray-30 dark:text-stone-400">{t("book_email" as any)} *</span>
              <input
                name="email"
                type="email"
                required
                defaultValue=""
                className="rounded-xl border border-gray-10 dark:border-stone-600 px-4 py-3 regular-16 outline-none focus:border-green-50 bg-white dark:bg-stone-700 text-gray-90 dark:text-stone-100"
                placeholder="email@example.com"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="regular-14 text-gray-30 dark:text-stone-400">{t("book_phone" as any)} *</span>
              <input
                name="phone"
                required
                defaultValue=""
                className="rounded-xl border border-gray-10 dark:border-stone-600 px-4 py-3 regular-16 outline-none focus:border-green-50 bg-white dark:bg-stone-700 text-gray-90 dark:text-stone-100"
                placeholder="0901234567"
              />
            </label>
          </>
        )}
        <label className="flex flex-col gap-2">
          <span className="regular-14 text-gray-30 dark:text-stone-400">{t("book_date" as any)} *</span>
          <input
            name="tourDate"
            type="date"
            required
            min={new Date().toISOString().split("T")[0]}
            className="rounded-xl border border-gray-10 dark:border-stone-600 px-4 py-3 regular-16 outline-none focus:border-green-50 bg-white dark:bg-stone-700 text-gray-90 dark:text-stone-100"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="regular-14 text-gray-30 dark:text-stone-400">{t("book_guests" as any)} *</span>
          <input
            name="numberOfGuests"
            type="number"
            min={1}
            max={tour.maxGroupSize}
            defaultValue={1}
            required
            className="rounded-xl border border-gray-10 dark:border-stone-600 px-4 py-3 regular-16 outline-none focus:border-green-50 bg-white dark:bg-stone-700 text-gray-90 dark:text-stone-100"
          />
        </label>
      </div>

      <label className="flex flex-col gap-2">
        <span className="regular-14 text-gray-30 dark:text-stone-400">{t("book_message" as any)}</span>
        <textarea
          name="message"
          rows={3}
          className="rounded-xl border border-gray-10 dark:border-stone-600 px-4 py-3 regular-16 outline-none focus:border-green-50 bg-white dark:bg-stone-700 text-gray-90 dark:text-stone-100"
          placeholder={t("book_message_placeholder" as any)}
        />
      </label>

      {status === "success" && (
        <p className="regular-14 rounded-xl bg-green-50/10 p-4 text-green-50">
          {message}
        </p>
      )}
      {status === "error" && (
        <p className="regular-14 rounded-xl bg-red-50/10 p-4 text-red-600">
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="btn_green rounded-full py-4 bold-16 disabled:opacity-60"
      >
        {status === "loading" ? t("book_btn_loading" as any) : t("book_btn" as any)}
      </button>
    </form>
  );
};

export default BookingForm;
