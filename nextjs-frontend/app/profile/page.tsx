"use client";

import TourCard from "@/components/TourCard";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import type { Tour } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { useLanguage } from "@/context/LanguageContext";
import useSWR from "swr";

interface Ward {
  Id: string;
  Name: string;
  Level: string;
}

interface District {
  Id: string;
  Name: string;
  Wards: Ward[];
}

interface Province {
  Id: string;
  Name: string;
  Districts: District[];
}

const defaultFetcher = (url: string) => fetch(url).then((res) => {
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
});

const bookingsFetcher = async (url: string, usernameOrId: string) => {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch");
    const data = await res.json();
    const serverBookings = data.bookings || [];
    
    // Sync with localStorage
    const userKey = `bookings_${usernameOrId}`;
    if (typeof window !== "undefined") {
      localStorage.setItem(userKey, JSON.stringify(serverBookings));
    }
    return serverBookings;
  } catch (error) {
    console.error("Failed to load bookings, using local fallback:", error);
    if (typeof window !== "undefined") {
      const userKey = `bookings_${usernameOrId}`;
      const localData = localStorage.getItem(userKey);
      return localData ? JSON.parse(localData) : [];
    }
    return [];
  }
};

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-gray-10/60 dark:border-stone-700 bg-white dark:bg-stone-800 p-5 shadow-sm transition-all hover:border-green-50/30 hover:shadow-md">
      <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-green-50/10 text-green-50">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-20 dark:text-stone-500">
          {label}
        </p>
        <p className="mt-1 truncate text-[15px] font-semibold text-gray-90 dark:text-stone-100">
          {value}
        </p>
      </div>
    </div>
  );
}

function QuickLink({
  href,
  title,
  desc,
  icon,
}: {
  href: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 rounded-2xl border border-gray-10/60 dark:border-stone-700 bg-white dark:bg-stone-800 p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-green-50/30 hover:shadow-lg"
    >
      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-slate-50 dark:bg-stone-700 text-gray-50 dark:text-stone-300 transition-colors group-hover:bg-green-50/10 group-hover:text-green-50">
        {icon}
      </div>
      <div>
        <p className="font-semibold text-gray-90 dark:text-stone-100">{title}</p>
        <p className="mt-0.5 text-sm text-gray-30 dark:text-stone-400">{desc}</p>
      </div>
      <span className="ml-auto text-gray-20 dark:text-stone-500 transition-transform group-hover:translate-x-0.5 group-hover:text-green-50">
        →
      </span>
    </Link>
  );
} export default function ProfilePage() {
  const { user, loading, logout, favorites, updateProfile, uploadAvatar } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const { t, language } = useLanguage();
  const isEn = language === "en";

  const prof = useMemo(() => {
    return {
      // Toasts/Alerts
      toastNameEmpty: isEn ? "Full name cannot be empty" : "Họ và tên không được để trống",
      toastUpdateSuccess: isEn ? "Profile updated successfully!" : "Cập nhật thông tin thành công!",
      toastUpdateError: isEn ? "Unable to update profile" : "Không thể cập nhật thông tin",
      toastAvatarInvalidType: isEn ? "Only JPG, PNG, WEBP or GIF images are accepted" : "Chỉ chấp nhận file ảnh JPG, PNG, WEBP hoặc GIF",
      toastAvatarTooLarge: isEn ? "Image size must not exceed 5MB" : "Ảnh không được vượt quá 5MB",
      toastAvatarSuccess: isEn ? "Profile picture updated successfully! 🎉" : "Cập nhật ảnh đại diện thành công! 🎉",
      toastAvatarError: isEn ? "Unable to upload image" : "Không thể tải ảnh lên",

      // General Labels / Actions
      changeAvatar: isEn ? "Change profile picture" : "Đổi ảnh đại diện",
      roleManager: isEn ? "VietTour Manager" : "Quản lý VietTour",
      roleMember: isEn ? "Member" : "Thành viên",
      personalInfo: isEn ? "Personal Information" : "Thông tin cá nhân",
      editBtn: isEn ? "✏️ Edit" : "✏️ Sửa",
      fullName: isEn ? "Full Name" : "Họ và tên",
      phone: isEn ? "Phone Number" : "Số điện thoại",
      email: isEn ? "Email Address" : "Email",
      saving: isEn ? "Saving..." : "Đang lưu...",
      save: isEn ? "Save" : "Lưu",
      cancel: isEn ? "Cancel" : "Hủy",
      notUpdated: isEn ? "Not updated" : "Chưa cập nhật",
      gender: isEn ? "Gender" : "Giới tính",
      dateOfBirth: isEn ? "Date of Birth" : "Ngày sinh",
      province: isEn ? "Province / City" : "Tỉnh / Thành phố",
      district: isEn ? "District / Town" : "Quận / Huyện",
      ward: isEn ? "Ward / Commune" : "Phường / Xã",
      addressDetail: isEn ? "Detailed Address" : "Địa chỉ chi tiết",
      genderMale: isEn ? "Male" : "Nam",
      genderFemale: isEn ? "Female" : "Nữ",
      genderOther: isEn ? "Other" : "Khác",
      selectProvince: isEn ? "Select Province/City" : "Chọn Tỉnh / Thành phố",
      selectDistrict: isEn ? "Select District" : "Chọn Quận / Huyện",
      selectWard: isEn ? "Select Ward" : "Chọn Phường / Xã",

      // Tabs
      tabBookings: isEn ? "Booking History" : "Lịch sử đặt tour",
      tabFavorites: isEn ? "Favorite Tours" : "Tour yêu thích",

      // Bookings tab content
      bookingsTitle: isEn ? "My Bookings" : "Đơn đặt tour của tôi",
      bookingsSubtitle: isEn ? "View and track the status of your booked tours" : "Xem và theo dõi trạng thái các tour du lịch bạn đã đặt",
      bookingsCountSingle: isEn ? " Booking" : " Đơn đặt",
      bookingsCountPlural: isEn ? " Bookings" : " Đơn đặt",
      bookedTour: isEn ? "Booked tour" : "Tour đã đặt",

      statusPending: isEn ? "Pending" : "Chờ duyệt",
      statusConfirmed: isEn ? "Confirmed" : "Đã xác nhận",
      statusCancelled: isEn ? "Cancelled" : "Đã hủy",
      paid: isEn ? "Paid" : "Đã thanh toán",
      unpaid: isEn ? "Unpaid" : "Chưa thanh toán",
      dateLabel: isEn ? "Departure date" : "Ngày đi",
      guestsLabel: isEn ? "Guests" : "Số người",
      codeLabel: isEn ? "Booking code" : "Mã đơn",
      bookerLabel: isEn ? "Booker" : "Người đặt",
      totalLabel: isEn ? "Total:" : "Tổng cộng:",
      payNow: isEn ? "Pay Now" : "Thanh toán ngay",

      noBookings: isEn ? "No booking history" : "Chưa có lịch sử đặt tour",
      noBookingsSubtitle: isEn ? "Choose your favorite itinerary and book today to get special offers!" : "Hãy chọn hành trình ưng ý và đặt ngay hôm nay để nhận ưu đãi!",
      findTours: isEn ? "Find tours now" : "Tìm kiếm tour ngay",

      // Favorites tab content
      favoritesTitle: isEn ? "My Favorite Tours" : "Tour yêu thích của tôi",
      favoritesSubtitle: isEn ? "List of tours you saved to view later" : "Danh sách các tour bạn đã lưu để xem lại sau",
      favoritesCountSingle: isEn ? "1 Tour" : "1 Tour",
      favoritesCountPlural: isEn ? "Tours" : "Tour",

      noFavorites: isEn ? "No favorite tours yet" : "Chưa có tour yêu thích nào",
      noFavoritesSubtitle: isEn ? "Explore attractive itineraries from VietTour and click the heart to save them." : "Khám phá các hành trình hấp dẫn của VietTour và bấm trái tim để lưu lại.",

      // Bottom banner
      promoTitle: isEn ? "Ready to explore?" : "Sẵn sàng khám phá?",
      promoHeader: isEn ? "100+ quality tours are waiting for you" : "Hơn 100+ tour chất lượng đang chờ bạn",
      promoText: isEn ? "Book online, get quick confirmation and enjoy member benefits." : "Đặt tour trực tuyến, nhận xác nhận nhanh và tận hưởng ưu đãi thành viên.",
      promoBtn: isEn ? "Explore tours now" : "Khám phá tour ngay",

      // Quick links
      quickLinkToursTitle: isEn ? "Travel Tours" : "Tour du lịch",
      quickLinkToursDesc: isEn ? "View featured tour list" : "Xem danh sách tour nổi bật",
      quickLinkContactTitle: isEn ? "Contact Support" : "Liên hệ hỗ trợ",
      quickLinkContactDesc: isEn ? "Tour advisory & booking support" : "Tư vấn tour & hỗ trợ đặt chỗ",
      viewAll: isEn ? "View all" : "Xem tất cả",
      showLess: isEn ? "Show less" : "Thu gọn",
    };
  }, [isEn]);

  const handlePrintInvoice = (booking: any) => {
    if (!user) return;
    const docId = booking.documentId || booking.document_id || "";
    const total = booking.totalAmount || (booking.tour?.price || 0) * (booking.numberOfGuests || 1);
    const formattedTotal = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(total);
    const formattedPrice = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(booking.tour?.price || 0);
    const formattedSubtotal = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format((booking.tour?.price || 0) * (booking.numberOfGuests || 1));
    const discountAmount = ((booking.tour?.price || 0) * (booking.numberOfGuests || 1)) - total;
    const formattedDiscount = discountAmount > 0 ? new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(discountAmount) : null;
    const currentDate = new Date().toLocaleDateString("vi-VN");
    const currentTime = new Date().toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' });
    const tourTitle = booking.tour?.title || (isEn ? "Booked Tour" : "Tour đã đặt");
    const tourLocation = booking.tour?.location || "";
    const dateLabel = isEn ? "Departure date" : "Khởi hành";
    
    const barcodeValues = [1, 2, 1, 3, 1, 2, 4, 1, 2, 1, 3, 2, 1, 2, 1, 4, 2, 1, 1, 3];
    const barcodeHtml = barcodeValues.map((val) => `<div style="background-color: #111827; height: 24px; width: ${val}px; display: inline-block; margin-right: 0.5px;"></div>`).join("");

    const iframe = document.createElement("iframe");
    iframe.style.position = "absolute";
    iframe.style.width = "0px";
    iframe.style.height = "0px";
    iframe.style.border = "none";
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document || iframe.contentDocument;
    if (!doc) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Hóa đơn - ${booking.id}</title>
          <meta charset="utf-8" />
          <style>
            @media print {
              body {
                margin: 0;
                padding: 10px;
                color: #111827;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
              }
            }
            body {
              color: #111827;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
              padding: 20px;
              max-width: 650px;
              margin: 0 auto;
              background-color: #ffffff;
            }
            .invoice-container {
              border: 1px solid #e5e7eb;
              border-radius: 20px;
              padding: 24px;
              position: relative;
              overflow: hidden;
              box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
            }
            .watermark {
              position: absolute;
              right: 16px;
              top: 16px;
              border: 3px dashed rgba(16, 185, 129, 0.3);
              color: rgba(16, 185, 129, 0.4);
              font-weight: 900;
              font-size: 18px;
              text-transform: uppercase;
              letter-spacing: 0.1em;
              padding: 8px 16px;
              border-radius: 8px;
              transform: rotate(12deg);
              user-select: none;
              pointer-events: none;
            }
            .header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              border-bottom: 1px solid #e5e7eb;
              padding-bottom: 16px;
              margin-bottom: 16px;
            }
            .logo-container {
              display: flex;
              align-items: center;
              gap: 4px;
            }
            .logo-badge {
              height: 20px;
              width: 20px;
              background-color: #10b981;
              color: white;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: 900;
              font-size: 12px;
              border-radius: 4px;
            }
            .logo-text {
              font-weight: 700;
              font-size: 20px;
              color: #111827;
              margin: 0;
            }
            .logo-text span {
              color: #10b981;
            }
            .company-info {
              font-size: 9px;
              color: #4b5563;
              margin-top: 8px;
              line-height: 1.4;
            }
            .invoice-title-container {
              text-align: right;
            }
            .invoice-title {
              font-size: 16px;
              font-weight: 800;
              color: #111827;
              margin: 0;
              text-transform: uppercase;
            }
            .invoice-code {
              font-size: 11px;
              color: #4b5563;
              margin: 4px 0 0 0;
              font-weight: 600;
            }
            .invoice-code span {
              font-family: monospace;
              color: #111827;
            }
            .invoice-date {
              font-size: 10px;
              color: #4b5563;
              margin: 2px 0 0 0;
            }
            .customer-info-box {
              background-color: #f9fafb;
              border: 1px solid #f3f4f6;
              border-radius: 12px;
              padding: 14px;
              margin-bottom: 16px;
            }
            .box-title {
              font-size: 11px;
              font-weight: 750;
              color: #111827;
              text-transform: uppercase;
              letter-spacing: 0.05em;
              margin-top: 0;
              margin-bottom: 8px;
            }
            .info-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              row-gap: 6px;
              column-gap: 12px;
              font-size: 11px;
            }
            .info-item span:first-child {
              color: #4b5563;
            }
            .info-item span:last-child {
              font-weight: 600;
              color: #111827;
              margin-left: 4px;
            }
            .info-item-full {
              grid-column: span 2;
            }
            .table-title {
              font-size: 11px;
              font-weight: 750;
              color: #111827;
              text-transform: uppercase;
              letter-spacing: 0.05em;
              margin-top: 0;
              margin-bottom: 8px;
            }
            .invoice-table {
              width: 100%;
              border-collapse: collapse;
              font-size: 11px;
              text-align: left;
              margin-bottom: 16px;
            }
            .invoice-table th {
              border-bottom: 1px solid #e5e7eb;
              color: #4b5563;
              background-color: rgba(249, 250, 251, 0.5);
              padding: 8px 10px;
              font-weight: 600;
            }
            .invoice-table td {
              border-bottom: 1px solid #f3f4f6;
              padding: 10px 10px;
            }
            .tour-name {
              font-weight: 650;
              color: #111827;
              max-width: 250px;
            }
            .tour-subinfo {
              font-size: 9px;
              color: #4b5563;
              font-weight: 400;
              margin-top: 2px;
            }
            .text-center {
              text-align: center;
            }
            .text-right {
              text-align: right;
            }
            .summary-container {
              display: flex;
              justify-content: flex-end;
              border-top: 1px solid #e5e7eb;
              padding-top: 6px;
            }
            .summary-box {
              width: 220px;
              font-size: 11px;
            }
            .summary-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 6px;
              color: #4b5563;
            }
            .summary-row-bold {
              font-weight: 700;
              color: #111827;
              border-top: 1px solid #f3f4f6;
              padding-top: 6px;
              font-size: 13px;
            }
            .summary-row-bold span:last-child {
              color: #10b981;
            }
            .summary-row-italic {
              font-size: 10px;
              color: #4b5563;
              font-style: italic;
            }
            .summary-row-italic span:last-child {
              font-family: monospace;
            }
            .footer {
              border-top: 1px solid #e5e7eb;
              margin-top: 24px;
              padding-top: 12px;
              text-align: center;
            }
            .footer p {
              font-size: 9px;
              color: #4b5563;
              line-height: 1.4;
              margin: 0;
            }
            .barcode-container {
              display: flex;
              justify-content: center;
              align-items: center;
              margin-top: 8px;
            }
            .ticket-code {
              font-size: 8px;
              font-family: monospace;
              color: #4b5563;
              margin-top: 4px;
              text-transform: uppercase;
            }
          </style>
        </head>
        <body>
          <div class="invoice-container">
            <div class="watermark">ĐÃ THANH TOÁN / PAID</div>
            <div class="header">
              <div>
                <div class="logo-container">
                  <span class="logo-badge">VT</span>
                  <span class="logo-text">Viet<span>Tour</span></span>
                </div>
                <div class="company-info">
                  Công ty TNHH Lữ hành VietTour Việt Nam
                  <br />
                  Địa chỉ: 123 Đường Lê Lợi, Quận 1, TP. Hồ Chí Minh
                  <br />
                  Hotline: 1900 6789 | Email: support@viettour.vn
                </div>
              </div>
              <div class="invoice-title-container">
                <h3 class="invoice-title">HÓA ĐƠN ĐẶT TOUR</h3>
                <p class="invoice-code">Mã đơn: <span>#${booking.id}</span></p>
                <p class="invoice-date">Ngày lập: ${currentDate} | ${currentTime}</p>
              </div>
            </div>

            <div class="customer-info-box">
              <h4 class="box-title">Thông tin khách hàng</h4>
              <div class="info-grid">
                <div class="info-item">
                  <span>Họ và tên:</span><span>${booking.fullName || user.fullName}</span>
                </div>
                <div class="info-item">
                  <span>Số điện thoại:</span><span>${booking.phone || user.phone}</span>
                </div>
                <div class="info-item info-item-full">
                  <span>Email nhận vé:</span><span style="word-break: break-all;">${booking.email || user.email}</span>
                </div>
                ${user.gender ? `
                  <div class="info-item">
                    <span>Giới tính:</span><span>${user.gender}</span>
                  </div>
                ` : ''}
                ${user.dateOfBirth ? `
                  <div class="info-item">
                    <span>Ngày sinh:</span><span>${new Date(user.dateOfBirth).toLocaleDateString("vi-VN")}</span>
                  </div>
                ` : ''}
                ${(user.addressDetail || user.ward || user.district || user.province) ? `
                  <div class="info-item info-item-full">
                    <span>Địa chỉ:</span><span>${[user.addressDetail, user.ward, user.district, user.province].filter(Boolean).join(", ")}</span>
                  </div>
                ` : ''}
              </div>
            </div>

            <div>
              <h4 class="table-title">Thông tin dịch vụ</h4>
              <table class="invoice-table">
                <thead>
                  <tr>
                    <th>Tên Tour / Địa điểm</th>
                    <th class="text-center">Số lượng</th>
                    <th class="text-right">Đơn giá</th>
                    <th class="text-right">Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="tour-name">
                      ${tourTitle}
                      <div class="tour-subinfo">${dateLabel}: ${booking.tourDate} | 📍 ${tourLocation}</div>
                    </td>
                    <td class="text-center font-medium">${booking.numberOfGuests} người</td>
                    <td class="text-right">${formattedPrice}</td>
                    <td class="text-right" style="font-weight: 600; color: #111827;">${formattedSubtotal}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="summary-container">
              <div class="summary-box">
                <div class="summary-row">
                  <span>Tạm tính:</span>
                  <span>${formattedSubtotal}</span>
                </div>
                
                ${booking.promoCode ? `
                  <div class="summary-row">
                    <span>Mã giảm giá (${booking.promoCode}):</span>
                    <span style="color: #ef4444; font-weight: 500;">-${formattedDiscount}</span>
                  </div>
                ` : ''}

                <div class="summary-row summary-row-bold">
                  <span>Tổng cộng:</span>
                  <span>${formattedTotal}</span>
                </div>

                <div class="summary-row summary-row-italic" style="margin-top: 6px;">
                  <span>Thanh toán bằng:</span>
                  <span>${booking.paymentMethod || "VNPAY"}</span>
                </div>
                <div class="summary-row summary-row-italic">
                  <span>Mã giao dịch:</span>
                  <span>${booking.transactionId || "N/A"}</span>
                </div>
              </div>
            </div>

            <div class="footer">
              <p>
                Chúc quý khách có một chuyến đi vui vẻ và ý nghĩa cùng <strong>VietTour</strong>!
                <br />
                *Vui lòng xuất trình vé/hóa đơn này (bản in hoặc ảnh chụp điện thoại) cho Hướng dẫn viên tại điểm hẹn khởi hành.*
              </p>
              <div class="barcode-container">
                ${barcodeHtml}
              </div>
              <p class="ticket-code">VT-TICKET-${docId.slice(0, 8) || "00000"}</p>
            </div>
          </div>
        </body>
      </html>
    `;

    doc.open();
    doc.write(htmlContent);
    doc.close();

    // Wait briefly for content to render and trigger print
    iframe.contentWindow?.focus();
    setTimeout(() => {
      iframe.contentWindow?.print();
      // Clean up
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 1000);
    }, 300);
  };

  const [activeTab, setActiveTab] = useState<"bookings" | "favorites" | "loyalty">("bookings");
  const [showAllBookings, setShowAllBookings] = useState(false);
  const [showAllFavorites, setShowAllFavorites] = useState(false);
  const [redeeming, setRedeeming] = useState(false);

  // SWR hook to fetch loyalty points and status
  const { data: loyaltyData, mutate: mutateLoyalty } = useSWR(
    user ? "/api/loyalty" : null,
    defaultFetcher
  );

  const loyalty = loyaltyData?.record || {
    points: 0,
    tier: "Đồng",
    redeemedCoupons: [],
    history: []
  };

  const handleRedeem = async (voucherType: "VT50K" | "VT200K" | "VT400K") => {
    setRedeeming(true);
    try {
      const res = await fetch("/api/loyalty", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voucherType }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(data.message, "success");
        mutateLoyalty();
      } else {
        showToast(data.error || data.message || "Không thể đổi điểm", "error");
      }
    } catch (err) {
      showToast("Lỗi kết nối máy chủ", "error");
    } finally {
      setRedeeming(false);
    }
  };

  // Edit profile states
  const [isEditing, setIsEditing] = useState(false);
  const [editFullName, setEditFullName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editGender, setEditGender] = useState("");
  const [editDateOfBirth, setEditDateOfBirth] = useState("");
  const [editProvince, setEditProvince] = useState("");
  const [editDistrict, setEditDistrict] = useState("");
  const [editWard, setEditWard] = useState("");
  const [editAddressDetail, setEditAddressDetail] = useState("");
  const [updatingProfile, setUpdatingProfile] = useState(false);

  // Vietnam provinces data
  const [provincesData, setProvincesData] = useState<Province[]>([]);

  useEffect(() => {
    fetch("/vietnam-provinces.json")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load provinces");
        return res.json();
      })
      .then((data) => setProvincesData(data))
      .catch((err) => console.error("Error loading address JSON:", err));
  }, []);

  const availableDistricts = useMemo(() => {
    if (!editProvince || provincesData.length === 0) return [];
    const prov = provincesData.find((p) => p.Name === editProvince);
    return prov ? prov.Districts : [];
  }, [editProvince, provincesData]);

  const availableWards = useMemo(() => {
    if (!editDistrict || availableDistricts.length === 0) return [];
    const dist = availableDistricts.find((d) => d.Name === editDistrict);
    return dist ? dist.Wards : [];
  }, [editDistrict, availableDistricts]);

  const handleProvinceChange = (provinceName: string) => {
    setEditProvince(provinceName);
    setEditDistrict("");
    setEditWard("");
  };

  const handleDistrictChange = (districtName: string) => {
    setEditDistrict(districtName);
    setEditWard("");
  };

  // Avatar upload states
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const startEditing = () => {
    setEditFullName(user?.fullName || user?.username || "");
    setEditPhone(user?.phone || "");
    setEditGender(user?.gender || "");
    setEditDateOfBirth(user?.dateOfBirth || "");
    setEditProvince(user?.province || "");
    setEditDistrict(user?.district || "");
    setEditWard(user?.ward || "");
    setEditAddressDetail(user?.addressDetail || "");
    setIsEditing(true);
  };

  const handleSaveProfile = async () => {
    if (!editFullName.trim()) {
      showToast(prof.toastNameEmpty, "error");
      return;
    }

    setUpdatingProfile(true);
    try {
      await updateProfile({
        fullName: editFullName,
        phone: editPhone,
        gender: editGender,
        dateOfBirth: editDateOfBirth,
        province: editProvince,
        district: editDistrict,
        ward: editWard,
        addressDetail: editAddressDetail,
      });
      showToast(prof.toastUpdateSuccess, "success");
      setIsEditing(false);
    } catch (err: any) {
      showToast(err.message || prof.toastUpdateError, "error");
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate on client side first
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      showToast(prof.toastAvatarInvalidType, "error");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast(prof.toastAvatarTooLarge, "error");
      return;
    }

    // Show local preview immediately
    const localPreview = URL.createObjectURL(file);
    setAvatarPreview(localPreview);
    setUploadingAvatar(true);
    setUploadProgress(10);

    // Simulate progress while uploading
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => Math.min(prev + 15, 85));
    }, 300);

    try {
      const avatarUrl = await uploadAvatar(file);
      clearInterval(progressInterval);
      setUploadProgress(100);
      setAvatarPreview(avatarUrl);
      showToast(prof.toastAvatarSuccess, "success");
    } catch (err: any) {
      clearInterval(progressInterval);
      setAvatarPreview(null);
      showToast(err.message || prof.toastAvatarError, "error");
    } finally {
      setTimeout(() => {
        setUploadingAvatar(false);
        setUploadProgress(0);
      }, 800);
      // Reset input so same file can be selected again
      e.target.value = "";
    }
  };

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [user, loading, router]);

  const { data: toursData, isLoading: loadingTours } = useSWR(
    user ? "/api/tours" : null,
    defaultFetcher
  );
  const tours = useMemo<Tour[]>(() => toursData?.tours || [], [toursData]);
  const favoriteTours = useMemo<Tour[]>(
    () => tours.filter((t) => favorites.includes(t.slug)),
    [tours, favorites]
  );

  const { data: serverBookings, isLoading: loadingBookings } = useSWR(
    user ? ["/api/bookings", user.username || String(user.id)] : null,
    ([url, userKey]) => bookingsFetcher(url, userKey)
  );

  const bookings = useMemo<any[]>(() => {
    if (!serverBookings) return [];
    return serverBookings.filter(
      (b: any) => b.email?.toLowerCase() === user?.email?.toLowerCase()
    );
  }, [serverBookings, user?.email]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-9 w-9 animate-spin rounded-full border-2 border-green-50 border-t-transparent" />
      </div>
    );
  }

  if (!user) return null;

  const displayName = user.fullName || user.username;
  const initial = displayName.charAt(0).toUpperCase();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-slate-100 via-white to-slate-50 dark:from-stone-900 dark:via-stone-900 dark:to-stone-900">
      <div className="relative h-56 overflow-hidden sm:h-64 lg:h-72">
        <Image
          src="https://images.unsplash.com/photo-1528127269322-539801943592?w=1920&q=80"
          alt=""
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/45 to-slate-100 dark:to-stone-900" />
      </div>

      <div className="padding-container max-container relative -mt-24 pb-20 lg:-mt-28">
        <div className="grid gap-8 lg:grid-cols-[380px_1fr] lg:gap-10">
          {/* Column 1: Unified Profile & Account Info Card */}
          <aside className="lg:sticky lg:top-28 self-start">
            <div className="overflow-hidden rounded-3xl border border-slate-100 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-xl shadow-slate-200/35 dark:shadow-none transition-all duration-300">
              {/* Header cover gradient */}
              <div className="h-28 bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-green-500/20 dark:from-emerald-900/10 dark:via-teal-900/10 dark:to-green-900/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/20 rounded-full blur-2xl -mr-6 -mt-6" />
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-teal-500/20 rounded-full blur-xl -ml-4 -mb-4" />
                <div className="absolute inset-0 bg-white/10 dark:bg-black/10 backdrop-blur-[1px]" />
              </div>

              <div className="relative px-6 pb-6 -mt-14">
                {/* Avatar with upload button */}
                <div className="flex justify-center">
                  <div className="relative group">
                    {(avatarPreview || user.avatar) ? (
                      <div className="relative h-28 w-28 rounded-2xl border-4 border-white dark:border-stone-900 shadow-lg overflow-hidden bg-slate-50 transition-transform duration-300 group-hover:scale-105">
                        <Image
                          src={avatarPreview || user.avatar!}
                          alt={displayName}
                          fill
                          className="object-cover"
                        />
                        {/* Upload progress overlay */}
                        {uploadingAvatar && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 rounded-2xl">
                            <div className="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            <span className="mt-1 text-[10px] text-white font-bold">{uploadProgress}%</span>
                          </div>
                        )}
                        {/* Progress bar at bottom */}
                        {uploadingAvatar && (
                          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30">
                            <div
                              className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
                              style={{ width: `${uploadProgress}%` }}
                            />
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex h-28 w-28 items-center justify-center rounded-2xl border-4 border-white dark:border-stone-900 bg-gradient-to-br from-emerald-400 to-green-600 text-5xl font-black text-white shadow-lg relative transition-transform duration-300 group-hover:scale-105">
                        {initial}
                        {uploadingAvatar && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 rounded-2xl">
                            <div className="h-7 w-7 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          </div>
                        )}
                      </div>
                    )}

                    {/* Camera icon overlay */}
                    <label
                      htmlFor="avatar-upload"
                      className={`absolute -bottom-1 -right-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 border-white dark:border-stone-900 shadow-md transition-all ${uploadingAvatar
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-emerald-500 hover:bg-emerald-600 text-white hover:scale-110"
                        }`}
                      title={prof.changeAvatar}
                    >
                      {uploadingAvatar ? (
                        <svg className="h-3.5 w-3.5 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                      ) : (
                        <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      )}
                    </label>
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      className="hidden"
                      disabled={uploadingAvatar}
                      onChange={handleAvatarChange}
                    />
                  </div>
                </div>

                <div className="mt-4 text-center">
                  <h1 className="text-xl font-bold tracking-tight text-slate-800 dark:text-stone-100">
                    {displayName}
                  </h1>
                  <p className="mt-0.5 text-xs text-slate-400 dark:text-stone-500 font-medium">@{user.username}</p>

                  <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-50/60 dark:bg-emerald-900/20 border border-emerald-500/20 px-3 py-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 shadow-sm shadow-emerald-500/5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    {user.role?.type === "manager" ? prof.roleManager : prof.roleMember}
                  </span>
                </div>

                {/* Account Details & Edit Section */}
                <div className="mt-6 pt-5 text-left space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-stone-850 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-1 bg-emerald-500 rounded-full" />
                      <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-stone-500">{prof.personalInfo}</h3>
                    </div>
                    {!isEditing && (
                      <button
                        onClick={startEditing}
                        className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 transition-all hover:scale-105 active:scale-95 bg-emerald-50/60 dark:bg-emerald-900/20 border border-emerald-500/20 px-2.5 py-1 rounded-lg"
                      >
                        {prof.editBtn}
                      </button>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="space-y-4 mt-4">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 dark:text-stone-500 uppercase tracking-wider">{prof.fullName} *</span>
                        <input
                          type="text"
                          value={editFullName}
                          onChange={(e) => setEditFullName(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 dark:border-stone-700 px-3.5 py-2.5 text-xs text-slate-800 dark:text-stone-200 bg-slate-50/50 dark:bg-stone-800/50 focus:bg-white dark:focus:bg-stone-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                          placeholder={prof.fullName}
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 dark:text-stone-500 uppercase tracking-wider">{prof.phone}</span>
                        <input
                          type="text"
                          value={editPhone}
                          onChange={(e) => setEditPhone(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 dark:border-stone-700 px-3.5 py-2.5 text-xs text-slate-800 dark:text-stone-200 bg-slate-50/50 dark:bg-stone-800/50 focus:bg-white dark:focus:bg-stone-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                          placeholder={prof.phone}
                        />
                      </div>

                      <div className="space-y-1 opacity-70">
                        <span className="text-[10px] font-bold text-slate-400 dark:text-stone-500 uppercase tracking-wider">{prof.email}</span>
                        <input
                          type="email"
                          value={user.email}
                          disabled
                          className="w-full rounded-xl border border-slate-150 dark:border-stone-800 px-3.5 py-2.5 text-xs text-slate-450 dark:text-stone-500 bg-slate-50 dark:bg-stone-850 cursor-not-allowed outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 dark:text-stone-500 uppercase tracking-wider">{prof.gender}</span>
                        <select
                          value={editGender}
                          onChange={(e) => setEditGender(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 dark:border-stone-700 px-3.5 py-2.5 text-xs text-slate-800 dark:text-stone-200 bg-slate-50/50 dark:bg-stone-800/50 focus:bg-white dark:focus:bg-stone-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all cursor-pointer"
                        >
                          <option value="">-- {isEn ? "Select gender" : "Chọn giới tính"} --</option>
                          <option value="Nam">{prof.genderMale}</option>
                          <option value="Nữ">{prof.genderFemale}</option>
                          <option value="Khác">{prof.genderOther}</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 dark:text-stone-500 uppercase tracking-wider">{prof.dateOfBirth}</span>
                        <input
                          type="date"
                          value={editDateOfBirth}
                          onChange={(e) => setEditDateOfBirth(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 dark:border-stone-700 px-3.5 py-2.5 text-xs text-slate-800 dark:text-stone-200 bg-slate-50/50 dark:bg-stone-800/50 focus:bg-white dark:focus:bg-stone-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                        />
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 dark:text-stone-500 uppercase tracking-wider">{prof.province}</span>
                        <select
                          value={editProvince}
                          onChange={(e) => handleProvinceChange(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 dark:border-stone-700 px-3.5 py-2.5 text-xs text-slate-800 dark:text-stone-200 bg-slate-50/50 dark:bg-stone-800/50 focus:bg-white dark:focus:bg-stone-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all cursor-pointer"
                        >
                          <option value="">-- {prof.selectProvince} --</option>
                          {provincesData.map((prov) => (
                            <option key={prov.Id} value={prov.Name}>{prov.Name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 dark:text-stone-500 uppercase tracking-wider">{prof.district}</span>
                        <select
                          value={editDistrict}
                          onChange={(e) => handleDistrictChange(e.target.value)}
                          disabled={!editProvince}
                          className="w-full rounded-xl border border-slate-200 dark:border-stone-700 px-3.5 py-2.5 text-xs text-slate-800 dark:text-stone-200 bg-slate-50/50 dark:bg-stone-800/50 focus:bg-white dark:focus:bg-stone-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all disabled:opacity-50 cursor-pointer"
                        >
                          <option value="">-- {prof.selectDistrict} --</option>
                          {availableDistricts.map((dist) => (
                            <option key={dist.Id} value={dist.Name}>{dist.Name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 dark:text-stone-500 uppercase tracking-wider">{prof.ward}</span>
                        <select
                          value={editWard}
                          onChange={(e) => setEditWard(e.target.value)}
                          disabled={!editDistrict}
                          className="w-full rounded-xl border border-slate-200 dark:border-stone-700 px-3.5 py-2.5 text-xs text-slate-800 dark:text-stone-200 bg-slate-50/50 dark:bg-stone-800/50 focus:bg-white dark:focus:bg-stone-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all disabled:opacity-50 cursor-pointer"
                        >
                          <option value="">-- {prof.selectWard} --</option>
                          {availableWards.map((w) => (
                            <option key={w.Id} value={w.Name}>{w.Name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 dark:text-stone-500 uppercase tracking-wider">{prof.addressDetail}</span>
                        <textarea
                          value={editAddressDetail}
                          onChange={(e) => setEditAddressDetail(e.target.value)}
                          rows={2}
                          className="w-full rounded-xl border border-slate-200 dark:border-stone-700 px-3.5 py-2.5 text-xs text-slate-800 dark:text-stone-200 bg-slate-50/50 dark:bg-stone-800/50 focus:bg-white dark:focus:bg-stone-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all resize-none"
                          placeholder={isEn ? "Street name, building, house number..." : "Tên đường, tòa nhà, số nhà..."}
                        />
                      </div>

                      <div className="flex gap-2 pt-2">
                        <button
                          type="button"
                          disabled={updatingProfile}
                          onClick={handleSaveProfile}
                          className="flex-1 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-500/10 font-bold text-xs py-2.5 transition-all disabled:opacity-60 text-center active:scale-95"
                        >
                          {updatingProfile ? prof.saving : prof.save}
                        </button>
                        <button
                          type="button"
                          disabled={updatingProfile}
                          onClick={() => setIsEditing(false)}
                          className="flex-1 rounded-xl border border-slate-200 dark:border-stone-700 hover:bg-slate-50 dark:hover:bg-stone-850 text-slate-600 dark:text-stone-300 font-bold text-xs py-2.5 transition-all disabled:opacity-60 text-center active:scale-95"
                        >
                          {prof.cancel}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100 dark:divide-stone-850/80">
                      {/* Email Row */}
                      <div className="flex gap-3.5 items-start py-3.5">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-50 dark:bg-stone-800/50 text-slate-500 dark:text-stone-400 border border-slate-100 dark:border-slate-850/80">
                          <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-stone-500">{prof.email}</p>
                          <p className="text-sm font-semibold text-slate-800 dark:text-stone-200 mt-0.5 break-all select-all leading-snug">{user.email}</p>
                        </div>
                      </div>

                      {/* Phone Row */}
                      <div className="flex gap-3.5 items-start py-3.5">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-50 dark:bg-stone-800/50 text-slate-500 dark:text-stone-400 border border-slate-100 dark:border-slate-850/80">
                          <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-stone-500">{prof.phone}</p>
                          <p className="text-sm font-semibold text-slate-800 dark:text-stone-200 mt-0.5">{user.phone || prof.notUpdated}</p>
                        </div>
                      </div>

                      {/* Gender Row */}
                      <div className="flex gap-3.5 items-start py-3.5">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-50 dark:bg-stone-800/50 text-slate-500 dark:text-stone-400 border border-slate-100 dark:border-slate-850/80">
                          <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-stone-500">{prof.gender}</p>
                          <p className="text-sm font-semibold text-slate-800 dark:text-stone-200 mt-0.5">
                            {user.gender === "Nam" ? prof.genderMale : user.gender === "Nữ" ? prof.genderFemale : user.gender === "Khác" ? prof.genderOther : (user.gender || prof.notUpdated)}
                          </p>
                        </div>
                      </div>

                      {/* Birthday Row */}
                      <div className="flex gap-3.5 items-start py-3.5">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-50 dark:bg-stone-800/50 text-slate-500 dark:text-stone-400 border border-slate-100 dark:border-slate-850/80">
                          <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-stone-500">{prof.dateOfBirth}</p>
                          <p className="text-sm font-semibold text-slate-800 dark:text-stone-200 mt-0.5">
                            {user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString(isEn ? "en-US" : "vi-VN") : prof.notUpdated}
                          </p>
                        </div>
                      </div>

                      {/* Address Row */}
                      <div className="flex gap-3.5 items-start py-3.5">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-50 dark:bg-stone-800/50 text-slate-500 dark:text-stone-400 border border-slate-100 dark:border-slate-850/80">
                          <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-stone-500">{isEn ? "Address" : "Địa chỉ"}</p>
                          <p className="text-sm font-semibold text-slate-800 dark:text-stone-200 mt-1 whitespace-pre-wrap leading-relaxed">
                            {(() => {
                              const parts = [
                                user.addressDetail,
                                user.ward,
                                user.district,
                                user.province,
                              ].filter(Boolean);
                              return parts.length > 0 ? parts.join(", ") : prof.notUpdated;
                            })()}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>


              </div>
            </div>
          </aside>

          {/* Column 2: Booking History & Favorites */}
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-100 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 shadow-xl shadow-slate-200/35 dark:shadow-none sm:p-8">
              {/* Tabs Selector */}
              <div className="flex p-1.5 bg-slate-100/80 dark:bg-stone-800/80 backdrop-blur-md rounded-2xl mb-6 max-w-md border border-slate-200/30 dark:border-stone-700/40">
                <button
                  type="button"
                  onClick={() => setActiveTab("bookings")}
                  className={`flex-1 py-2 px-4 rounded-xl text-sm font-bold transition-all duration-300 ${
                    activeTab === "bookings"
                      ? "bg-white dark:bg-stone-700 text-emerald-600 dark:text-emerald-400 shadow-md shadow-slate-200/60 dark:shadow-none"
                      : "text-slate-500 dark:text-stone-400 hover:text-slate-700 dark:hover:text-slate-200"
                  }`}
                >
                  {prof.tabBookings}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("favorites")}
                  className={`flex-1 py-2 px-4 rounded-xl text-sm font-bold transition-all duration-300 ${
                    activeTab === "favorites"
                      ? "bg-white dark:bg-stone-700 text-emerald-600 dark:text-emerald-400 shadow-md shadow-slate-200/60 dark:shadow-none"
                      : "text-slate-500 dark:text-stone-400 hover:text-slate-700 dark:hover:text-slate-200"
                  }`}
                >
                  {prof.tabFavorites}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("loyalty")}
                  className={`flex-1 py-2 px-4 rounded-xl text-sm font-bold transition-all duration-300 ${
                    activeTab === "loyalty"
                      ? "bg-white dark:bg-stone-700 text-emerald-600 dark:text-emerald-400 shadow-md shadow-slate-200/60 dark:shadow-none"
                      : "text-slate-500 dark:text-stone-400 hover:text-slate-700 dark:hover:text-slate-200"
                  }`}
                >
                  {isEn ? "Rewards" : "Ưu đãi"}
                </button>
              </div>

              {activeTab === "bookings" ? (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-lg font-bold text-gray-90 dark:text-stone-100">{prof.bookingsTitle}</h2>
                      <p className="mt-1 text-sm text-gray-30 dark:text-stone-400">
                        {prof.bookingsSubtitle}
                      </p>
                    </div>
                    <span className="rounded-full bg-green-50/10 px-3 py-1 text-xs font-semibold text-green-50 dark:text-green-400">
                      {bookings.length} {bookings.length === 1 ? prof.bookingsCountSingle : prof.bookingsCountPlural}
                    </span>
                  </div>

                  {loadingBookings ? (
                    <div className="space-y-4">
                      {[1, 2].map((i) => (
                        <div key={i} className="relative flex flex-col sm:flex-row gap-5 overflow-hidden rounded-3xl border border-slate-100 dark:border-stone-800 bg-slate-50/10 dark:bg-stone-800/10 p-5 shadow-sm animate-pulse">
                          <div className="h-28 w-full sm:w-36 flex-shrink-0 rounded-2xl bg-slate-200 dark:bg-stone-700" />
                          <div className="flex-1 flex flex-col justify-between py-1 space-y-3">
                            <div className="space-y-2">
                              <div className="h-5 w-2/3 bg-slate-200 dark:bg-stone-700 rounded" />
                              <div className="h-3.5 w-1/3 bg-slate-200 dark:bg-stone-700 rounded" />
                            </div>
                            <div className="h-4 w-1/4 bg-slate-200 dark:bg-stone-700 rounded" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : bookings.length > 0 ? (
                    <div className="space-y-4">
                      {(showAllBookings ? bookings : bookings.slice(0, 2)).map((booking) => {
                        console.log("Profile page booking item:", booking);
                        const total = booking.totalAmount || (booking.tour?.price || 0) * (booking.numberOfGuests || 1);
                        const tourImage = booking.tour?.image?.url || "https://images.unsplash.com/photo-1528127269322-539801943592?w=800&q=85";

                        let statusColor = "bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-400";
                        let statusText = prof.statusPending;
                        if (booking.status === "confirmed") {
                          statusColor = "bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-400";
                          statusText = prof.statusConfirmed;
                        } else if (booking.status === "cancelled") {
                          statusColor = "bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400";
                          statusText = prof.statusCancelled;
                        }

                        const formatPriceValue = (val: number) => {
                          return new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(val);
                        };

                        const docId = booking.documentId || booking.document_id;

                        return (
                          <div
                            key={booking.id}
                            className="relative flex flex-col sm:flex-row gap-5 overflow-hidden rounded-3xl border border-slate-100 dark:border-stone-850 bg-white dark:bg-stone-800/10 p-5 shadow-sm hover:border-emerald-500/20 dark:hover:border-emerald-500/15 hover:shadow-md transition-all duration-300 group"
                          >
                            <div className="relative h-28 w-full sm:w-36 flex-shrink-0 overflow-hidden rounded-2xl bg-slate-50 dark:bg-stone-900 shadow-inner">
                               <Image
                                src={tourImage}
                                alt={booking.tour?.title || prof.bookedTour}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            </div>
                            <div className="flex flex-1 flex-col justify-between">
                              <div>
                                <div className="flex items-start justify-between gap-3 flex-wrap sm:flex-nowrap">
                                  <h3 className="font-bold text-slate-800 dark:text-stone-100 line-clamp-1 transition-colors group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                                    {booking.tour?.title || prof.bookedTour}
                                  </h3>
                                  <div className="flex gap-1.5 shrink-0 flex-wrap">
                                    {/* Payment status badge */}
                                    {booking.paymentStatus === "paid" ? (
                                      <span className="rounded-full border bg-emerald-500/10 dark:bg-emerald-500/5 border-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 shadow-sm shadow-emerald-500/5">
                                        {prof.paid} {booking.paymentMethod ? `(${booking.paymentMethod})` : ""}
                                      </span>
                                    ) : (
                                      <span className="rounded-full border bg-rose-500/10 dark:bg-rose-500/5 border-rose-500/20 px-2.5 py-0.5 text-[10px] font-bold text-rose-600 dark:text-rose-400 shadow-sm shadow-rose-500/5">
                                        {prof.unpaid}
                                      </span>
                                    )}
                                    {/* Approval status badge */}
                                    <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${statusColor} shadow-sm shadow-black/5`}>
                                      {statusText}
                                    </span>
                                  </div>
                                </div>
                                <div className="mt-3.5 grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-slate-500 dark:text-stone-400">
                                  <div className="flex items-center gap-1.5 min-w-0">
                                    <span className="text-slate-400 dark:text-stone-500 select-none">📅</span>
                                    <span className="truncate">{prof.dateLabel}: <span className="font-semibold text-slate-700 dark:text-stone-250">{booking.tourDate}</span></span>
                                  </div>
                                  <div className="flex items-center gap-1.5 min-w-0">
                                    <span className="text-slate-400 dark:text-stone-500 select-none">👥</span>
                                    <span className="truncate">{prof.guestsLabel}: <span className="font-semibold text-slate-700 dark:text-stone-250">{booking.numberOfGuests}</span></span>
                                  </div>
                                  <div className="flex items-center gap-1.5 min-w-0">
                                    <span className="text-slate-400 dark:text-stone-500 select-none">🏷️</span>
                                    <span className="truncate">{prof.codeLabel}: <span className="font-mono font-semibold text-slate-700 dark:text-stone-200">#{booking.id}</span></span>
                                  </div>
                                  <div className="flex items-center gap-1.5 min-w-0">
                                    <span className="text-slate-400 dark:text-stone-500 select-none">👤</span>
                                    <span className="truncate">{prof.bookerLabel}: <span className="font-medium text-slate-700 dark:text-stone-250">{booking.fullName}</span></span>
                                  </div>
                                </div>
                              </div>
                              <div className="mt-4 flex items-center justify-between border-t border-slate-100 dark:border-stone-850 pt-3 text-xs">
                                <div className="flex items-center gap-2">
                                  <span className="text-slate-400 dark:text-stone-500">{prof.totalLabel}</span>
                                  <span className="font-extrabold text-[15px] text-emerald-600 dark:text-emerald-400">{formatPriceValue(total)}</span>
                                </div>

                                {booking.paymentStatus === "paid" && docId && (
                                  <button
                                    onClick={() => handlePrintInvoice(booking)}
                                    className="inline-flex items-center gap-1 rounded-xl bg-slate-50 dark:bg-stone-800 hover:bg-slate-100 dark:hover:bg-stone-750 px-4 py-2 text-xs font-bold text-slate-700 dark:text-stone-200 shadow-sm border border-slate-200/50 dark:border-stone-700/50 transition-all duration-200 active:scale-95 cursor-pointer"
                                  >
                                    🖨️ In hóa đơn
                                  </button>
                                )}

                                {booking.paymentStatus !== "paid" && booking.status !== "cancelled" && docId && (
                                  <Link
                                    href={`/checkout?id=${docId}`}
                                    className="inline-flex items-center gap-1 rounded-xl bg-orange-500 hover:bg-orange-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-orange-500/10 hover:shadow-orange-500/25 transition-all duration-200 active:scale-95 cursor-pointer"
                                  >
                                    {prof.payNow}
                                  </Link>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      {bookings.length > 2 && (
                        <button
                          type="button"
                          onClick={() => setShowAllBookings(!showAllBookings)}
                          className="bold-16 text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 transition-colors mt-2 focus:outline-none"
                        >
                          {showAllBookings ? prof.showLess : prof.viewAll}
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-10 dark:border-stone-700 bg-slate-50/50 dark:bg-stone-700/30 p-8 text-center">
                      <span className="text-3xl">🧳</span>
                      <p className="mt-3 text-sm font-medium text-gray-90 dark:text-stone-100">
                        {prof.noBookings}
                      </p>
                      <p className="mt-1 text-xs text-gray-30 dark:text-stone-400 max-w-[240px]">
                        {prof.noBookingsSubtitle}
                      </p>
                      <Link
                        href="/tours"
                        className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-green-50 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-emerald-600"
                      >
                        {prof.findTours}
                      </Link>
                    </div>
                  )}
                </div>
              ) : activeTab === "favorites" ? (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-lg font-bold text-gray-90 dark:text-stone-100">{prof.favoritesTitle}</h2>
                      <p className="mt-1 text-sm text-gray-30 dark:text-stone-400">
                        {prof.favoritesSubtitle}
                      </p>
                    </div>
                    <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-500">
                      {favoriteTours.length} {favoriteTours.length === 1 ? prof.favoritesCountSingle : prof.favoritesCountPlural}
                    </span>
                  </div>

                  {loadingTours ? (
                    <div className="grid gap-6 sm:grid-cols-2">
                      {[1, 2].map((i) => (
                        <div key={i} className="flex flex-col gap-4 rounded-[2rem] border border-gray-10 bg-slate-50/30 p-5 shadow-sm animate-pulse">
                          <div className="h-48 w-full rounded-2xl bg-slate-200" />
                          <div className="space-y-3">
                            <div className="h-5 w-2/3 bg-slate-200 rounded" />
                            <div className="h-4 w-1/2 bg-slate-200 rounded" />
                            <div className="pt-3 border-t border-gray-10 flex justify-between">
                              <div className="h-5 w-1/3 bg-slate-200 rounded" />
                              <div className="h-8 w-8 rounded-full bg-slate-200" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : favoriteTours.length > 0 ? (
                    <div>
                      <div className="grid gap-6 sm:grid-cols-2">
                        {(showAllFavorites ? favoriteTours : favoriteTours.slice(0, 2)).map((tour) => (
                          <TourCard key={tour.id} tour={tour} />
                        ))}
                      </div>

                      {favoriteTours.length > 2 && (
                        <button
                          type="button"
                          onClick={() => setShowAllFavorites(!showAllFavorites)}
                          className="bold-16 text-green-50 hover:text-green-600 transition-colors mt-4 focus:outline-none"
                        >
                          {showAllFavorites ? prof.showLess : prof.viewAll}
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-10 dark:border-stone-700 bg-slate-50/50 dark:bg-stone-700/30 p-8 text-center">
                      <span className="text-3xl">❤️</span>
                      <p className="mt-3 text-sm font-medium text-gray-90 dark:text-stone-100">
                        {prof.noFavorites}
                      </p>
                      <p className="mt-1 text-xs text-gray-30 dark:text-stone-400 max-w-[240px]">
                        {prof.noFavoritesSubtitle}
                      </p>
                      <Link
                        href="/tours"
                        className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-green-50 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-emerald-600"
                      >
                        {prof.findTours}
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-8 animate-fade-in">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-lg font-bold text-gray-90 dark:text-stone-100">
                        {isEn ? "Loyalty Club & Rewards" : "Hành trình tích lũy & Ưu đãi"}
                      </h2>
                      <p className="mt-1 text-sm text-gray-30 dark:text-stone-400">
                        {isEn ? "Accumulate points to level up and redeem high-value discount codes." : "Tích lũy xu để nâng hạng thành viên và đổi các mã giảm giá giá trị cao."}
                      </p>
                    </div>
                  </div>

                  {/* Tier details, points card */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Membership Card */}
                    <div className={`relative overflow-hidden rounded-3xl p-6 text-white shadow-lg ${
                      loyalty.tier === "Kim Cương"
                        ? "bg-gradient-to-br from-cyan-600 via-blue-500 to-indigo-700"
                        : loyalty.tier === "Vàng"
                          ? "bg-gradient-to-br from-yellow-600 via-amber-500 to-yellow-700"
                          : loyalty.tier === "Bạc"
                            ? "bg-gradient-to-br from-slate-400 via-slate-300 to-slate-500"
                            : "bg-gradient-to-br from-amber-700 via-amber-600 to-amber-800"
                    }`}>
                      <div className="absolute right-4 top-4 text-4xl opacity-15 select-none pointer-events-none font-bold">VIETTOUR</div>
                      <div className="absolute -left-10 -bottom-10 h-32 w-32 rounded-full bg-white/10 blur-xl" />
                      
                      <p className="text-xs uppercase tracking-widest text-white/70">{isEn ? "Membership Club" : "Thẻ thành viên"}</p>
                      
                      <div className="mt-6">
                        <p className="text-sm font-medium opacity-80">{displayName}</p>
                        <h4 className="text-2xl font-black mt-1 tracking-wide">{loyalty.tier}</h4>
                      </div>

                      <div className="mt-8 flex justify-between items-end">
                        <div>
                          <p className="text-[10px] uppercase text-white/60 tracking-wider">{isEn ? "Points Balance" : "Điểm tích lũy"}</p>
                          <p className="text-2xl font-black mt-0.5">{loyalty.points.toLocaleString()} <span className="text-sm font-semibold">xu</span></p>
                        </div>
                        <span className="text-3xl">
                          {loyalty.tier === "Kim Cương" ? "💎" : loyalty.tier === "Vàng" ? "👑" : loyalty.tier === "Bạc" ? "🥈" : "🥉"}
                        </span>
                      </div>
                    </div>

                    {/* Progress to Next Tier Card */}
                    <div className="rounded-3xl border border-gray-10/60 dark:border-stone-700 bg-slate-50/50 dark:bg-stone-900/20 p-6 flex flex-col justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-gray-90 dark:text-stone-100 mb-1">{isEn ? "Next Tier Progress" : "Tiến trình thăng hạng"}</h4>
                        
                        {loyalty.tier === "Kim Cương" ? (
                          <p className="text-xs text-gray-45 dark:text-stone-400 mt-2">{isEn ? "You have reached the maximum Diamond tier! 🎉" : "Bạn đã đạt cấp độ thành viên cao nhất! 🎉"}</p>
                        ) : (
                          <>
                            {(() => {
                              const nextTiers = {
                                "Đồng": { name: "Bạc", target: 500, prev: 0 },
                                "Bạc": { name: "Vàng", target: 2000, prev: 500 },
                                "Vàng": { name: "Kim Cương", target: 5000, prev: 2000 },
                              };
                              const next = nextTiers[loyalty.tier as keyof typeof nextTiers] || { name: "Bạc", target: 500, prev: 0 };
                              const progress = Math.min(100, Math.max(0, ((loyalty.points - next.prev) / (next.target - next.prev)) * 100));
                              return (
                                <div className="mt-3">
                                  <div className="flex justify-between text-xs font-semibold text-gray-50 dark:text-stone-400 mb-2">
                                    <span>{loyalty.points} xu</span>
                                    <span>{next.target} xu ({next.name})</span>
                                  </div>
                                  <div className="h-2.5 w-full bg-gray-100 dark:bg-stone-700 rounded-full overflow-hidden">
                                    <div className="h-full bg-green-50 transition-all duration-500 rounded-full" style={{ width: `${progress}%` }} />
                                  </div>
                                  <p className="text-[11px] text-gray-50 dark:text-stone-400 mt-3">
                                    {isEn 
                                      ? `Earn ${next.target - loyalty.points} more points to reach ${next.name} tier.` 
                                      : `Tích lũy thêm ${next.target - loyalty.points} xu nữa để lên hạng ${next.name}.`}
                                  </p>
                                </div>
                              );
                            })()}
                          </>
                        )}
                      </div>
                      
                      <div className="border-t border-gray-10 dark:border-stone-700 pt-3 mt-4 text-[10px] text-gray-40 dark:text-stone-500 leading-normal">
                        * {isEn ? "Earn 1 point for every 10,000 VND spent booking tours on VietTour." : "Mỗi 10.000 ₫ thanh toán đặt tour sẽ nhận được 1 xu tích lũy."}
                      </div>
                    </div>
                  </div>

                  {/* Vouchers exchange panel */}
                  <div className="mt-8">
                    <h3 className="text-base font-bold text-gray-90 dark:text-stone-100 mb-4">{isEn ? "Exchange Points for Vouchers" : "Đổi điểm nhận ưu đãi"}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {[
                        { type: "VT50K", value: "50.000 ₫", cost: 100 },
                        { type: "VT200K", value: "200.000 ₫", cost: 300 },
                        { type: "VT400K", value: "400.000 ₫", cost: 500 },
                      ].map((v) => {
                        const canRedeem = loyalty.points >= v.cost;
                        return (
                          <div key={v.type} className="rounded-2xl border border-gray-10/60 dark:border-stone-700 bg-white dark:bg-stone-900/10 p-5 shadow-sm flex flex-col justify-between items-center text-center">
                            <div>
                              <div className="text-2xl mb-1">🎁</div>
                              <h4 className="font-bold text-gray-90 dark:text-stone-100">Giảm {v.value}</h4>
                              <p className="text-xs text-gray-30 dark:text-stone-400 mt-1">{isEn ? "Flat booking discount" : "Trừ tiền trực tiếp khi thanh toán"}</p>
                              <p className="text-xs font-bold text-green-50 mt-3">{v.cost} xu</p>
                            </div>
                            <button
                              type="button"
                              disabled={!canRedeem || redeeming}
                              onClick={() => handleRedeem(v.type as any)}
                              className={`mt-4 w-full rounded-xl py-2.5 text-xs font-bold transition-all shadow-sm ${
                                canRedeem && !redeeming
                                  ? "bg-green-50 text-white hover:bg-emerald-600 active:scale-95 cursor-pointer"
                                  : "bg-slate-100 dark:bg-stone-800 text-gray-30 dark:text-stone-600 cursor-not-allowed"
                              }`}
                            >
                              {redeeming ? (isEn ? "Redeeming..." : "Đang đổi...") : (isEn ? "Redeem" : "Đổi quà")}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Redeemed coupons list */}
                  {loyalty.redeemedCoupons && loyalty.redeemedCoupons.length > 0 && (
                    <div className="mt-8">
                      <h3 className="text-base font-bold text-gray-90 dark:text-stone-100 mb-4">{isEn ? "My Vouchers" : "Ưu đãi của tôi"}</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {loyalty.redeemedCoupons.map((coupon: any) => (
                          <div key={coupon.code} className={`relative flex items-center justify-between border rounded-2xl p-4 bg-white dark:bg-stone-900/10 shadow-sm ${
                            coupon.used 
                              ? "border-gray-100 dark:border-stone-800 opacity-60" 
                              : "border-green-50/30 hover:shadow-md animate-fade-in"
                          }`}>
                            <div>
                              <p className="text-sm font-bold text-gray-90 dark:text-stone-100">Voucher {coupon.amount.toLocaleString()} ₫</p>
                              <p className="font-mono text-xs font-bold text-green-50 mt-1 select-all">{coupon.code}</p>
                              <p className="text-[10px] text-gray-30 mt-1.5">{isEn ? "Redeemed at: " : "Ngày đổi: "} {new Date(coupon.redeemedAt).toLocaleDateString("vi-VN")}</p>
                            </div>

                            <div>
                              {coupon.used ? (
                                <span className="rounded-full bg-slate-100 dark:bg-stone-800 px-3 py-1 text-[10px] font-bold text-gray-40 dark:text-stone-500 uppercase">{isEn ? "Used" : "Đã dùng"}</span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => {
                                    navigator.clipboard.writeText(coupon.code);
                                    showToast(isEn ? "Voucher code copied!" : "Đã sao chép mã giảm giá!", "success");
                                  }}
                                  className="rounded-full bg-green-50/10 hover:bg-green-50/20 px-3 py-1.5 text-[10px] font-bold text-green-50 shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer"
                                >
                                  {isEn ? "Copy Code" : "Sao chép mã"}
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Loyalty Points History Log */}
                  {loyalty.history && loyalty.history.length > 0 && (
                    <div className="mt-8 border-t border-gray-10 dark:border-stone-700 pt-6">
                      <h3 className="text-base font-bold text-gray-90 dark:text-stone-100 mb-4">{isEn ? "Points History" : "Lịch sử tích lũy"}</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs text-left border-collapse">
                          <thead>
                            <tr className="border-b border-gray-10 dark:border-stone-850 text-gray-40 dark:text-stone-500">
                              <th className="py-2.5 px-3 font-semibold">{isEn ? "Date" : "Thời gian"}</th>
                              <th className="py-2.5 px-3 font-semibold">{isEn ? "Action" : "Nội dung"}</th>
                              <th className="py-2.5 px-3 font-semibold text-right">{isEn ? "Change" : "Thay đổi"}</th>
                              <th className="py-2.5 px-3 font-semibold text-right">{isEn ? "Balance" : "Số dư"}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {loyalty.history.map((item: any, idx: number) => (
                              <tr key={idx} className="border-b border-gray-5 dark:border-stone-850/50 hover:bg-slate-50/50 dark:hover:bg-stone-800/30">
                                <td className="py-3 px-3 text-gray-30 dark:text-stone-400">{new Date(item.date).toLocaleDateString("vi-VN")}</td>
                                <td className="py-3 px-3 font-medium text-gray-90 dark:text-stone-200">{item.action}</td>
                                <td className={`py-3 px-3 text-right font-bold ${item.change.startsWith("+") ? "text-green-50" : "text-red-500"}`}>
                                  {item.change}
                                </td>
                                <td className="py-3 px-3 text-right font-medium text-gray-90 dark:text-stone-200">{item.current} xu</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <QuickLink
                href="/tours"
                title={prof.quickLinkToursTitle}
                desc={prof.quickLinkToursDesc}
                icon={
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                }
              />
              <QuickLink
                href="/contact"
                title={prof.quickLinkContactTitle}
                desc={prof.quickLinkContactDesc}
                icon={
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                }
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
