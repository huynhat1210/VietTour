"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import Image from "next/image";

interface BookingDetail {
  id: number;
  documentId: string;
  fullName: string;
  email: string;
  phone: string;
  tourDate: string;
  numberOfGuests: number;
  status: string;
  paymentStatus: "unpaid" | "paid";
  message?: string;
  totalAmount?: number;
  paymentMethod?: string;
  transactionId?: string;
  promoCode?: string;
  tour?: {
    id: number;
    title: string;
    price: number;
    location: string;
    image?: {
      url: string;
    };
  };
}

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("id");
  const { user, loading: authLoading } = useAuth();
  const { showToast } = useToast();

  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<"MOMO" | "VNPAY" | "CARD">("VNPAY");
  const [showSimModal, setShowSimModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  
  // Card Inputs
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVV, setCardCVV] = useState("");
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [otpCode, setOtpCode] = useState("");

  // Countdown Timer state (10 minutes)
  const [timeLeft, setTimeLeft] = useState(600);

  // Promo code states
  const [promoCode, setPromoCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [flatDiscount, setFlatDiscount] = useState(0);
  const [promoError, setPromoError] = useState("");
  const [appliedCode, setAppliedCode] = useState("");

  const PROMO_CODES: Record<string, number> = {
    WELCOME5: 5,
    VIETTOUR10: 10,
    HELLOSUMMER: 15,
  };

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (!code) {
      setPromoError("Vui lòng nhập mã giảm giá");
      return;
    }
    if (code in PROMO_CODES) {
      setDiscountPercent(PROMO_CODES[code]);
      setFlatDiscount(0);
      setAppliedCode(code);
      setPromoError("");
      showToast(`Áp dụng mã ${code} thành công! Giảm ${PROMO_CODES[code]}%`, "success");
    } else if (code.startsWith("VT50K-")) {
      setFlatDiscount(50000);
      setDiscountPercent(0);
      setAppliedCode(code);
      setPromoError("");
      showToast(`Áp dụng mã ${code} thành công! Giảm 50.000 ₫`, "success");
    } else if (code.startsWith("VT200K-")) {
      setFlatDiscount(200000);
      setDiscountPercent(0);
      setAppliedCode(code);
      setPromoError("");
      showToast(`Áp dụng mã ${code} thành công! Giảm 200.000 ₫`, "success");
    } else if (code.startsWith("VT400K-")) {
      setFlatDiscount(400000);
      setDiscountPercent(0);
      setAppliedCode(code);
      setPromoError("");
      showToast(`Áp dụng mã ${code} thành công! Giảm 400.000 ₫`, "success");
    } else {
      setPromoError("Mã giảm giá không hợp lệ");
      setDiscountPercent(0);
      setFlatDiscount(0);
      setAppliedCode("");
    }
  };

  const handleRemovePromo = () => {
    setAppliedCode("");
    setDiscountPercent(0);
    setFlatDiscount(0);
    setPromoCode("");
    setPromoError("");
    showToast("Đã hủy áp dụng mã giảm giá", "info");
  };

  // Card formatting handlers
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const clean = e.target.value.replace(/\D/g, "");
    const formatted = clean.match(/.{1,4}/g)?.join(" ") || clean;
    setCardNumber(formatted.slice(0, 19)); // Max 16 digits + 3 spaces
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const clean = e.target.value.replace(/\D/g, "");
    if (clean.length > 2) {
      setCardExpiry(`${clean.slice(0, 2)}/${clean.slice(2, 4)}`);
    } else {
      setCardExpiry(clean.slice(0, 2));
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const clean = e.target.value.replace(/\D/g, "");
    setCardCVV(clean.slice(0, 3));
  };

  // Luhn algorithm check
  const validateLuhn = (cardNumberStr: string): boolean => {
    const digits = cardNumberStr.replace(/\s+/g, "").split("").map(Number);
    let sum = 0;
    let shouldDouble = false;
    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = digits[i];
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    return sum % 10 === 0 && digits.length >= 13;
  };

  // Countdown timer hook
  useEffect(() => {
    if (!showSimModal || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [showSimModal, timeLeft]);

  useEffect(() => {
    if (timeLeft === 0 && showSimModal) {
      setShowSimModal(false);
      setShowOtpScreen(false);
      showToast("Giao dịch đã hết hạn thanh toán (Quá thời hạn 10 phút). Vui lòng thử lại!", "error");
      setTimeLeft(600); // reset
    }
  }, [timeLeft, showSimModal, showToast]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    if (!authLoading && !user) {
      showToast("Vui lòng đăng nhập để tiến hành thanh toán", "error");
      router.push("/login?redirect=" + encodeURIComponent(window.location.pathname + window.location.search));
    }
  }, [user, authLoading, router, showToast]);

  useEffect(() => {
    if (!bookingId) return;

    const fetchBooking = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/bookings?id=${bookingId}`);
        if (!res.ok) {
          throw new Error("Không thể tải thông tin đặt tour");
        }
        const data = await res.json();
        setBooking(data.booking);
      } catch (err: any) {
        showToast(err.message || "Lỗi tải thông tin booking", "error");
        router.push("/profile");
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId, router, showToast]);

  if (loading || authLoading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 bg-slate-50 dark:bg-stone-900">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-green-50 border-t-transparent" />
        <p className="text-gray-50 dark:text-stone-400 font-medium">Đang tải thông tin thanh toán...</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 bg-slate-50 dark:bg-stone-900">
        <p className="text-red-500 font-bold text-xl">Không tìm thấy thông tin đặt tour</p>
        <button
          onClick={() => router.push("/")}
          className="rounded-full bg-green-50 px-6 py-2.5 text-white font-semibold hover:bg-emerald-600 transition-colors"
        >
          Về trang chủ
        </button>
      </div>
    );
  }

  // Handle printing page layout
  if (booking.paymentStatus === "paid") {
    const total = booking.totalAmount || (booking.tour?.price || 0) * booking.numberOfGuests;
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4 flex flex-col items-center justify-center">
        {/* Print specific CSS override using styled-like HTML tags */}
        <style dangerouslySetInnerHTML={{ __html: `
          @media print {
            body {
              background: white !important;
              color: black !important;
            }
            body * {
              visibility: hidden;
            }
            #printable-invoice, #printable-invoice * {
              visibility: visible;
            }
            #printable-invoice {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              margin: 0 !important;
              padding: 0 !important;
              box-shadow: none !important;
              border: none !important;
            }
            .no-print {
              display: none !important;
            }
          }
        `}} />

        <div className="w-full max-w-2xl bg-white rounded-3xl p-8 shadow-lg border border-slate-100 no-print text-center flex flex-col items-center mb-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-4 animate-bounce">
            <svg className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-gray-90">Đặt Tour & Thanh Toán Thành Công!</h2>
          <p className="text-gray-50 mt-2 max-w-md text-sm leading-relaxed">
            Cảm ơn bạn đã lựa chọn **VietTour**. Giao dịch của bạn đã được xác nhận. Bạn có thể in hóa đơn / vé bên dưới hoặc xem lại trong lịch sử đặt tour.
          </p>

          <div className="flex gap-4 mt-6 flex-wrap justify-center">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 rounded-full bg-green-50 hover:bg-emerald-600 text-white font-bold px-6 py-3.5 shadow-md hover:shadow-lg transition-all active:scale-95 text-sm cursor-pointer"
            >
              🖨️ In hóa đơn / Tải vé PDF
            </button>
            <button
              onClick={() => router.push("/profile")}
              className="flex items-center gap-2 rounded-full bg-slate-100 hover:bg-slate-200 text-gray-70 font-semibold px-6 py-3.5 transition-all active:scale-95 text-sm cursor-pointer"
            >
              💼 Lịch sử đặt tour
            </button>
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-2 rounded-full bg-white border border-slate-200 hover:bg-slate-50 text-gray-70 font-semibold px-6 py-3.5 transition-all active:scale-95 text-sm cursor-pointer"
            >
              🏠 Về trang chủ
            </button>
          </div>
        </div>

        {/* Printable Ticket / Invoice Panel */}
        <div id="printable-invoice" className="w-full max-w-2xl bg-white rounded-3xl p-8 shadow-lg border border-slate-150 relative overflow-hidden">
          {/* Decorative watermark stamp */}
          <div className="absolute right-6 top-6 border-4 border-dashed border-emerald-500/30 text-emerald-500/30 font-black text-2xl uppercase tracking-widest px-6 py-3 rounded-xl rotate-12 select-none pointer-events-none">
            ĐÃ THANH TOÁN / PAID
          </div>

          {/* Invoice Header */}
          <div className="flex justify-between items-start border-b border-slate-200 pb-6 mb-6">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="h-6 w-6 rounded bg-green-50 flex items-center justify-center text-white font-black text-sm">VT</span>
                <span className="font-bold text-2xl tracking-tight text-gray-90">Viet<span className="text-green-50">Tour</span></span>
              </div>
              <p className="text-[10px] text-gray-30 mt-2.5 max-w-[280px] leading-relaxed">
                Công ty TNHH Lữ hành VietTour Việt Nam
                <br />
                Địa chỉ: 123 Đường Lê Lợi, Quận 1, TP. Hồ Chí Minh
                <br />
                Hotline: 1900 6789 | Email: support@viettour.vn
              </p>
            </div>
            <div className="text-right">
              <h3 className="text-xl font-extrabold text-gray-90 uppercase">HÓA ĐƠN ĐẶT TOUR</h3>
              <p className="text-xs text-gray-50 mt-1 font-semibold">Mã đơn: <span className="font-mono text-gray-90">#{booking.id}</span></p>
              <p className="text-[11px] text-gray-30 mt-0.5">Ngày lập: {new Date().toLocaleDateString("vi-VN")} | {new Date().toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          </div>

          {/* Booker Info */}
          <div className="mb-6 bg-slate-50 p-4.5 rounded-2xl border border-slate-100">
            <h4 className="text-xs font-bold text-gray-90 uppercase tracking-wider mb-2.5">Thông tin khách hàng</h4>
            <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs">
              <div>
                <span className="text-gray-30">Họ và tên:</span> <span className="font-semibold text-gray-90 ml-1">{booking.fullName}</span>
              </div>
              <div>
                <span className="text-gray-30">Số điện thoại:</span> <span className="font-semibold text-gray-90 ml-1">{booking.phone}</span>
              </div>
              <div className="col-span-2">
                <span className="text-gray-30">Email nhận vé:</span> <span className="font-semibold text-gray-90 ml-1 break-all">{booking.email}</span>
              </div>
            </div>
          </div>

          {/* Tour Details */}
          <div className="mb-6">
            <h4 className="text-xs font-bold text-gray-90 uppercase tracking-wider mb-2.5">Thông tin dịch vụ</h4>
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-gray-30 bg-slate-50/50">
                  <th className="py-2.5 px-3">Tên Tour / Địa điểm</th>
                  <th className="py-2.5 px-3 text-center">Số lượng</th>
                  <th className="py-2.5 px-3 text-right">Đơn giá</th>
                  <th className="py-2.5 px-3 text-right">Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-100">
                  <td className="py-3.5 px-3 font-semibold text-gray-90 max-w-[280px]">
                    {booking.tour?.title || "Tour du lịch Việt Nam"}
                    <div className="text-[10px] text-gray-30 font-normal mt-1">Khởi hành: {booking.tourDate} | 📍 {booking.tour?.location}</div>
                  </td>
                  <td className="py-3.5 px-3 text-center font-medium">{booking.numberOfGuests} người</td>
                  <td className="py-3.5 px-3 text-right">{(booking.tour?.price || 0).toLocaleString("vi-VN")} ₫</td>
                  <td className="py-3.5 px-3 text-right font-semibold text-gray-90">{((booking.tour?.price || 0) * booking.numberOfGuests).toLocaleString("vi-VN")} ₫</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Payment Summary */}
          <div className="flex justify-end pt-2 border-t border-slate-200">
            <div className="w-64 text-xs space-y-2">
              <div className="flex justify-between text-gray-50">
                <span>Tạm tính:</span>
                <span>{((booking.tour?.price || 0) * booking.numberOfGuests).toLocaleString("vi-VN")} ₫</span>
              </div>
              
              {booking.promoCode && (
                <div className="flex justify-between text-gray-50">
                  <span>Mã giảm giá ({booking.promoCode}):</span>
                  <span className="text-red-500 font-medium">-{((booking.tour?.price || 0) * booking.numberOfGuests - total).toLocaleString("vi-VN")} ₫</span>
                </div>
              )}

              <div className="flex justify-between text-gray-90 font-bold border-t border-slate-100 pt-2 text-sm">
                <span>Tổng cộng:</span>
                <span className="text-green-50">{total.toLocaleString("vi-VN")} ₫</span>
              </div>

              <div className="flex justify-between text-[11px] text-gray-30 italic pt-1">
                <span>Thanh toán bằng:</span>
                <span>{booking.paymentMethod || "VNPAY"}</span>
              </div>
              <div className="flex justify-between text-[11px] text-gray-30 italic">
                <span>Mã giao dịch:</span>
                <span className="font-mono">{booking.transactionId || "N/A"}</span>
              </div>
            </div>
          </div>

          {/* Footer Terms */}
          <div className="border-t border-slate-200 mt-8 pt-4 text-center">
            <p className="text-[10px] text-gray-30 leading-relaxed">
              Chúc quý khách có một chuyến đi vui vẻ và ý nghĩa cùng **VietTour**!
              <br />
              *Vui lòng xuất trình vé/hóa đơn này (bản in hoặc ảnh chụp điện thoại) cho Hướng dẫn viên tại điểm hẹn khởi hành.*
            </p>
            <div className="flex justify-center mt-3 select-none">
              {/* Barcode representation */}
              <div className="flex items-center gap-0.5 h-6">
                {[1, 2, 1, 3, 1, 2, 4, 1, 2, 1, 3, 2, 1, 2, 1, 4, 2, 1, 1, 3].map((val, idx) => (
                  <div key={idx} className="bg-gray-90 h-full" style={{ width: `${val}px` }} />
                ))}
              </div>
            </div>
            <p className="text-[8px] font-mono text-gray-30 mt-1.5 uppercase">VT-TICKET-{booking.documentId?.slice(0, 8) || "00000"}</p>
          </div>
        </div>
      </div>
    );
  }

  // Fallback price if backend totalAmount not yet configured
  const baseTotal = booking.totalAmount || (booking.tour?.price || 0) * booking.numberOfGuests;
  const discountAmount = flatDiscount > 0 ? flatDiscount : Math.round((baseTotal * discountPercent) / 100);
  const calculatedTotal = Math.max(0, baseTotal - discountAmount);

  const handleSimulatePayment = async () => {
    if (paymentMethod === "CARD" && !showOtpScreen) {
      if (!cardNumber || !cardHolder || !cardExpiry || !cardCVV) {
        showToast("Vui lòng điền đầy đủ thông tin thẻ ngân hàng", "error");
        return;
      }
      // Run Luhn validation
      if (!validateLuhn(cardNumber)) {
        showToast("Số thẻ không hợp lệ (Lỗi thuật toán Luhn). Thử dùng: 4111 1111 1111 1111", "error");
        return;
      }
      setShowOtpScreen(true);
      showToast("Mã xác thực OTP đã được gửi đến số điện thoại đăng ký thẻ (Mô phỏng)", "info");
      return;
    }

    if (paymentMethod === "CARD" && showOtpScreen && otpCode !== "123456") {
      if (!otpCode) {
        showToast("Vui lòng nhập mã OTP", "error");
        return;
      }
      showToast("Mã OTP không đúng. Vui lòng nhập '123456' để mô phỏng thành công.", "error");
      return;
    }

    setProcessing(true);
    try {
      const res = await fetch("/api/bookings/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentId: booking.documentId,
          paymentMethod,
          transactionId: `VT-PAY-${paymentMethod}-${Date.now().toString().slice(-6)}`,
          totalAmount: calculatedTotal,
          promoCode: appliedCode || undefined,
        }),
      });

      if (!res.ok) {
        throw new Error("Không thể xác nhận thanh toán");
      }

      showToast("Thanh toán thành công!", "success");
      setShowSimModal(false);
      setShowOtpScreen(false);
      
      // Update local state to trigger print invoice layout rather than immediate redirect
      setBooking(prev => prev ? { 
        ...prev, 
        paymentStatus: "paid", 
        status: "confirmed", 
        paymentMethod,
        promoCode: appliedCode || undefined,
        totalAmount: calculatedTotal,
        transactionId: `VT-PAY-${paymentMethod}-${Date.now().toString().slice(-6)}`
      } : null);
    } catch (err: any) {
      showToast(err.message || "Thanh toán thất bại", "error");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-stone-900 py-10">
      <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left column: Booking summary */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="bg-white dark:bg-stone-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-stone-700">
            <h2 className="text-xl font-bold mb-5 text-gray-90 dark:text-stone-100 flex items-center gap-2">
              <span className="h-6 w-1.5 bg-green-50 rounded-full inline-block"></span>
              Chi tiết đặt tour
            </h2>

            {booking.tour && (
              <div className="flex gap-4 items-center border-b border-slate-100 dark:border-stone-700 pb-5 mb-5">
                <div className="relative h-20 w-28 shrink-0 rounded-2xl overflow-hidden bg-slate-100 dark:bg-stone-700 border border-slate-100 dark:border-stone-600">
                  <Image
                    src={booking.tour.image?.url || "https://images.unsplash.com/photo-1528127269322-539801943592?w=300"}
                    alt={booking.tour.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div>
                  <h3 className="font-bold text-gray-90 dark:text-stone-100 text-base leading-snug">{booking.tour.title}</h3>
                  <p className="text-sm text-gray-50 dark:text-stone-400 flex items-center gap-1 mt-1">
                    📍 {booking.tour.location}
                  </p>
                  <p className="text-sm font-semibold text-green-50 mt-1">
                    {booking.tour.price.toLocaleString("vi-VN")} ₫ / người
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm">
              <div>
                <p className="text-gray-30 dark:text-stone-400">Họ tên khách hàng</p>
                <p className="font-semibold text-gray-90 dark:text-stone-100 mt-0.5">{booking.fullName}</p>
              </div>
              <div>
                <p className="text-gray-30 dark:text-stone-400">Số điện thoại</p>
                <p className="font-semibold text-gray-90 dark:text-stone-100 mt-0.5">{booking.phone}</p>
              </div>
              <div>
                <p className="text-gray-30 dark:text-stone-400">Email nhận vé</p>
                <p className="font-semibold text-gray-90 dark:text-stone-100 mt-0.5 break-all">{booking.email}</p>
              </div>
              <div>
                <p className="text-gray-30 dark:text-stone-400">Ngày khởi hành</p>
                <p className="font-semibold text-gray-90 dark:text-stone-100 mt-0.5">
                  {new Date(booking.tourDate).toLocaleDateString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div>
                <p className="text-gray-30 dark:text-stone-400">Số lượng người</p>
                <p className="font-semibold text-gray-90 dark:text-stone-100 mt-0.5">{booking.numberOfGuests} người</p>
              </div>
              {booking.message && (
                <div className="col-span-2">
                  <p className="text-gray-30 dark:text-stone-400">Ghi chú đặc biệt</p>
                  <p className="text-gray-70 dark:text-stone-300 italic mt-0.5 bg-slate-50 dark:bg-stone-700 p-2.5 rounded-xl text-xs">
                    "{booking.message}"
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Payment Method selector */}
          <div className="bg-white dark:bg-stone-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-stone-700">
            <h2 className="text-xl font-bold mb-5 text-gray-90 dark:text-stone-100 flex items-center gap-2">
              <span className="h-6 w-1.5 bg-green-50 rounded-full inline-block"></span>
              Chọn phương thức thanh toán
            </h2>

            <div className="flex flex-col gap-3">
              {/* VNPay */}
              <label
                className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                  paymentMethod === "VNPAY"
                    ? "border-green-50 bg-emerald-50/10 shadow-sm"
                    : "border-slate-100 dark:border-stone-700 hover:border-slate-200 bg-white dark:bg-stone-800"
                }`}
                onClick={() => setPaymentMethod("VNPAY")}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="pay_method"
                    checked={paymentMethod === "VNPAY"}
                    onChange={() => {}}
                    className="accent-green-50 h-5 w-5 shrink-0"
                  />
                  <div>
                    <p className="font-bold text-gray-90 dark:text-stone-100 text-sm">Cổng thanh toán VNPay</p>
                    <p className="text-xs text-gray-30 dark:text-stone-400 mt-0.5">Quét mã QR VNPay hoặc qua thẻ ATM, Mobile Banking</p>
                  </div>
                </div>
                <div className="relative w-12 h-6 flex-shrink-0">
                  <div className="bg-blue-800 text-white text-[10px] font-black rounded px-1.5 py-0.5 flex items-center justify-center tracking-tight">
                    VNPAY
                  </div>
                </div>
              </label>

              {/* MoMo */}
              <label
                className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                  paymentMethod === "MOMO"
                    ? "border-green-50 bg-emerald-50/10 shadow-sm"
                    : "border-slate-100 dark:border-stone-700 hover:border-slate-200 bg-white dark:bg-stone-800"
                }`}
                onClick={() => setPaymentMethod("MOMO")}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="pay_method"
                    checked={paymentMethod === "MOMO"}
                    onChange={() => {}}
                    className="accent-green-50 h-5 w-5 shrink-0"
                  />
                  <div>
                    <p className="font-bold text-gray-90 dark:text-stone-100 text-sm">Ví điện tử MoMo</p>
                    <p className="text-xs text-gray-30 dark:text-stone-400 mt-0.5">Thanh toán nhanh qua ví điện tử trên điện thoại</p>
                  </div>
                </div>
                <div className="h-6 w-6 rounded bg-pink-600 flex items-center justify-center text-white text-[9px] font-black shrink-0">
                  momo
                </div>
              </label>

              {/* Credit Card */}
              <label
                className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                  paymentMethod === "CARD"
                    ? "border-green-50 bg-emerald-50/10 shadow-sm"
                    : "border-slate-100 dark:border-stone-700 hover:border-slate-200 bg-white dark:bg-stone-800"
                }`}
                onClick={() => setPaymentMethod("CARD")}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="pay_method"
                    checked={paymentMethod === "CARD"}
                    onChange={() => {}}
                    className="accent-green-500 h-5 w-5 shrink-0"
                  />
                  <div>
                    <p className="font-bold text-gray-900 dark:text-stone-100 text-sm">Thẻ Quốc tế (Visa / Mastercard)</p>
                    <p className="text-xs text-gray-400 dark:text-stone-400 mt-0.5">Hỗ trợ các loại thẻ tín dụng và ghi nợ quốc tế</p>
                  </div>
                </div>
                <div className="flex gap-1 shrink-0 text-slate-400">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
                  </svg>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right column: Invoice summary & Action button */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-white dark:bg-stone-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-stone-700 sticky top-24">
            <h2 className="text-xl font-bold mb-5 text-gray-900 dark:text-stone-100">Tóm tắt thanh toán</h2>

            <div className="flex flex-col gap-3.5 border-b border-slate-100 dark:border-stone-700 pb-5 mb-5 text-sm">
              <div className="flex justify-between text-gray-500 dark:text-stone-400">
                <span>Số lượng khách</span>
                <span>{booking.numberOfGuests} người</span>
              </div>
              <div className="flex justify-between text-gray-500 dark:text-stone-400">
                <span>Đơn giá tour</span>
                <span>{(booking.tour?.price || 0).toLocaleString("vi-VN")} ₫</span>
              </div>
              <div className="flex justify-between text-gray-500 dark:text-stone-400">
                <span>Thuế & Phí dịch vụ</span>
                <span className="text-emerald-600 font-semibold">Miễn phí</span>
              </div>
            </div>

            {/* Promo Code Input */}
            <div className="border-b border-slate-100 dark:border-stone-700 pb-5 mb-5">
              <p className="text-xs font-semibold text-gray-50 dark:text-stone-400 uppercase tracking-wide mb-2.5 flex items-center gap-1">
                🏷️ Áp dụng mã giảm giá
              </p>
              {appliedCode ? (
                <div className="flex items-center justify-between bg-emerald-50/10 border border-green-50/25 px-4 py-2.5 rounded-2xl animate-in fade-in duration-200">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-green-50 uppercase bg-green-50/10 px-2 py-0.5 rounded">
                      {appliedCode}
                    </span>
                    <span className="text-xs text-gray-50 font-medium">Giảm {discountPercent}%</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemovePromo}
                    className="text-xs text-red-500 hover:text-red-600 font-bold hover:underline"
                  >
                    Gỡ bỏ
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2 animate-in fade-in duration-200">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Ví dụ: HELLOSUMMER"
                      value={promoCode}
                      onChange={(e) => {
                        setPromoCode(e.target.value);
                        setPromoError("");
                      }}
                      className="flex-1 rounded-xl border border-slate-200 dark:border-stone-600 px-4 py-2.5 text-xs outline-none focus:border-green-50 bg-slate-50/50 dark:bg-stone-700 text-gray-90 dark:text-stone-100 uppercase font-semibold"
                    />
                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      className="bg-green-50 hover:bg-emerald-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm active:scale-95"
                    >
                      Áp dụng
                    </button>
                  </div>
                  {promoError && (
                    <p className="text-[11px] text-red-500 font-medium ml-1">
                      ⚠️ {promoError}
                    </p>
                  )}
                  <p className="text-[10px] text-gray-30 dark:text-stone-500 ml-1 leading-normal">
                    * Thử dùng mã: <span className="font-semibold text-gray-50 dark:text-stone-300">WELCOME5</span> (5%), <span className="font-semibold text-gray-50 dark:text-stone-300">VIETTOUR10</span> (10%), <span className="font-semibold text-gray-50 dark:text-stone-300">HELLOSUMMER</span> (15%)
                  </p>
                </div>
              )}
            </div>

            {discountPercent > 0 && (
              <div className="flex justify-between text-sm text-gray-50 mb-3 border-b border-slate-100/50 pb-2 animate-in fade-in duration-205">
                <span>Giảm giá ({appliedCode})</span>
                <span className="text-red-550 font-bold text-red-600">-{discountAmount.toLocaleString("vi-VN")} ₫</span>
              </div>
            )}

            <div className="flex justify-between items-baseline mb-6">
              <span className="font-bold text-gray-90 dark:text-stone-100 text-base">Tổng tiền thanh toán</span>
              <span className="text-2xl font-black text-green-50">
                {calculatedTotal.toLocaleString("vi-VN")} ₫
              </span>
            </div>

            {paymentMethod === "CARD" && (
              <div className="flex flex-col gap-3 mb-6 bg-slate-50 dark:bg-stone-700 p-4.5 rounded-2xl border border-slate-100 dark:border-stone-600 animate-in fade-in slide-in-from-top-2 duration-200">
                <p className="font-bold text-xs text-gray-50 dark:text-stone-300 uppercase tracking-wide">Nhập thông tin thẻ Visa/Mastercard</p>
                <input
                  type="text"
                  placeholder="Số thẻ (Ví dụ: 4111 2222 3333 4444)"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  className="rounded-xl border border-slate-200 dark:border-stone-500 px-4 py-2.5 text-sm outline-none focus:border-green-50 bg-white dark:bg-stone-800 text-gray-90 dark:text-stone-100"
                />
                <input
                  type="text"
                  placeholder="Tên chủ thẻ viết liền không dấu"
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  className="rounded-xl border border-slate-200 dark:border-stone-500 px-4 py-2.5 text-sm outline-none focus:border-green-50 bg-white dark:bg-stone-800 text-gray-90 dark:text-stone-100 uppercase"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    maxLength={5}
                    value={cardExpiry}
                    onChange={handleExpiryChange}
                    className="rounded-xl border border-slate-200 dark:border-stone-500 px-4 py-2.5 text-sm outline-none focus:border-green-50 bg-white dark:bg-stone-800 text-gray-90 dark:text-stone-100 text-center"
                  />
                  <input
                    type="password"
                    placeholder="CVV"
                    maxLength={3}
                    value={cardCVV}
                    onChange={handleCvvChange}
                    className="rounded-xl border border-slate-200 dark:border-stone-500 px-4 py-2.5 text-sm outline-none focus:border-green-50 bg-white dark:bg-stone-800 text-gray-90 dark:text-stone-100 text-center"
                  />
                </div>
                <p className="text-[10px] text-gray-30 dark:text-stone-500 italic leading-normal mt-1">
                  * Thử nhập thẻ test: <span className="font-semibold text-gray-50 dark:text-stone-300 font-mono">4111 1111 1111 1111</span> (Visa) hoặc <span className="font-semibold text-gray-50 dark:text-stone-300 font-mono">5105 1051 0510 5105</span> (Mastercard) để vượt qua bộ kiểm tra thuật toán Luhn.
                </p>
              </div>
            )}

            <button
              onClick={() => {
                setTimeLeft(600); // Reset timer when opening modal
                setShowSimModal(true);
              }}
              className="w-full btn_green rounded-full py-4 bold-16 shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              Thanh toán ngay ({paymentMethod})
            </button>
            <p className="text-center text-xs text-gray-30 dark:text-stone-500 mt-3 flex items-center justify-center gap-1.5">
              🔒 Bảo mật SSL mã hóa an toàn 256-bit
            </p>
          </div>
        </div>

      </div>

      {/* Simulated Payment Modal */}
      {showSimModal && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white dark:bg-stone-800 rounded-3xl overflow-hidden shadow-2xl p-6 border border-slate-100 dark:border-stone-700 animate-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-stone-700 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 text-sm font-bold animate-pulse">
                  $
                </span>
                <h3 className="font-bold text-gray-90 dark:text-stone-100 text-lg">Cổng Thanh Tự Động VietTour</h3>
              </div>
              <button
                onClick={() => {
                  setShowSimModal(false);
                  setShowOtpScreen(false);
                }}
                className="text-gray-30 hover:text-gray-90 transition-colors p-1"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Countdown timer banner inside modal */}
            <div className="flex items-center justify-center gap-1.5 text-xs font-semibold rounded-full bg-amber-50 text-amber-700 px-4 py-1.5 w-fit mx-auto mb-4 border border-amber-100">
              <span>⏱️ Thời gian thanh toán còn lại:</span>
              <span className="font-mono font-bold text-sm tracking-wide">{formatTime(timeLeft)}</span>
            </div>

            {/* Simulated OTP Screen */}
            {paymentMethod === "CARD" && showOtpScreen ? (
              <div className="text-center py-2 flex flex-col gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600 mx-auto">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-gray-90 dark:text-stone-100">Xác thực mã giao dịch OTP</h4>
                  <p className="text-xs text-gray-30 dark:text-stone-400 mt-1 max-w-xs mx-auto">
                    Để hoàn tất thanh toán, vui lòng nhập mã xác thực OTP giả lập bên dưới.
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-left text-xs font-semibold text-gray-50 dark:text-stone-300">Nhập mã OTP (Nhập: 123456)</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="Mã OTP gồm 6 chữ số"
                    className="rounded-xl border border-slate-200 dark:border-stone-600 px-4 py-3 text-center text-lg font-mono tracking-widest outline-none focus:border-green-50 bg-slate-50 dark:bg-stone-700 text-gray-90 dark:text-stone-100"
                  />
                </div>

                <div className="flex gap-3.5 mt-2">
                  <button
                    onClick={() => setShowOtpScreen(false)}
                    className="flex-1 rounded-full border border-slate-200 dark:border-stone-600 py-3 font-semibold text-gray-70 dark:text-stone-300 hover:bg-slate-50 dark:hover:bg-stone-700 transition-colors text-sm cursor-pointer"
                  >
                    Quay lại
                  </button>
                  <button
                    onClick={handleSimulatePayment}
                    disabled={processing}
                    className="flex-1 rounded-full bg-green-50 py-3 font-semibold text-white hover:bg-emerald-600 shadow transition-colors text-sm disabled:opacity-60 cursor-pointer"
                  >
                    {processing ? "Đang xác nhận..." : "Xác nhận giao dịch"}
                  </button>
                </div>
              </div>
            ) : (
              /* QR Code simulation for Momo and VNPay */
              <div className="text-center py-2 flex flex-col gap-4">
                <div>
                  <p className="text-xs text-gray-30">Mã giao dịch: <span className="font-mono text-gray-90">VT{booking.documentId.slice(0, 8).toUpperCase()}</span></p>
                  <p className="text-sm font-semibold text-gray-90 mt-1">
                    Tổng thanh toán: <span className="text-green-50 font-bold text-lg">{calculatedTotal.toLocaleString("vi-VN")} ₫</span>
                  </p>
                </div>

                {/* Simulated Dynamic VietQR Code using img.vietqr.io */}
                <div className="mx-auto border border-slate-100 dark:border-stone-700 rounded-3xl p-4 bg-slate-50 dark:bg-stone-700 w-52 h-52 flex flex-col items-center justify-center gap-2 relative group shadow-inner">
                  <div className="relative w-40 h-40">
                    <img
                      src={`https://img.vietqr.io/image/MB-1234567890-compact2.png?amount=${calculatedTotal}&addInfo=VT${booking.documentId.slice(0, 8).toUpperCase()}&accountName=VIETTOUR%20CO%20LTD`}
                      alt="VietQR Payment Code"
                      className="object-contain w-full h-full rounded-2xl bg-white p-1"
                    />
                  </div>
                  <span className="text-[10px] text-gray-30 dark:text-stone-500 font-semibold mt-1">Quét bằng app {paymentMethod} / Ngân hàng</span>
                </div>

                <div className="bg-slate-50 dark:bg-stone-700 p-3 rounded-2xl text-left border border-slate-100 dark:border-stone-600">
                  <p className="text-[11px] text-gray-50 dark:text-stone-300 font-semibold leading-relaxed">
                    💡 **Hướng dẫn thanh toán:**
                    <br />
                    1. Mở ứng dụng ngân hàng hoặc ví {paymentMethod}.
                    <br />
                    2. Nhấp nút **"Xác nhận quét thành công"** bên dưới để giả lập hoàn tất chuyển khoản thành công từ điện thoại.
                  </p>
                </div>

                <div className="flex gap-3.5 mt-2">
                  <button
                    onClick={() => setShowSimModal(false)}
                    className="flex-1 rounded-full border border-slate-200 dark:border-stone-600 py-3 font-semibold text-gray-70 dark:text-stone-300 hover:bg-slate-50 dark:hover:bg-stone-700 transition-colors text-sm cursor-pointer"
                  >
                    Hủy giao dịch
                  </button>
                  <button
                    onClick={handleSimulatePayment}
                    disabled={processing}
                    className="flex-1 rounded-full bg-green-50 py-3 font-semibold text-white hover:bg-emerald-600 shadow transition-colors text-sm disabled:opacity-60 cursor-pointer"
                  >
                    {processing ? "Đang xử lý..." : "Xác nhận quét thành công"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 bg-slate-50 dark:bg-stone-900">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-green-50 border-t-transparent" />
        <p className="text-gray-50 dark:text-stone-400 font-medium">Đang tải...</p>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
