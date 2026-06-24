import { payBooking, getBookingByDocumentId } from "@/lib/strapi";
import { AUTH_COOKIE, strapiGetMe } from "@/lib/auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { addLoyaltyPoints, useCoupon } from "@/lib/loyalty";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const jwt = cookieStore.get(AUTH_COOKIE)?.value;

  if (!jwt) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { documentId, paymentMethod, transactionId, totalAmount, promoCode } = body;

    if (!documentId || !paymentMethod) {
      return NextResponse.json(
        { error: "Thiếu dữ liệu thanh toán bắt buộc" },
        { status: 400 }
      );
    }

    const user = await strapiGetMe(jwt);

    // Fetch booking to verify ownership
    const booking = await getBookingByDocumentId(documentId, jwt);
    if (!booking) {
      return NextResponse.json({ error: "Không tìm thấy booking" }, { status: 404 });
    }

    // Ensure the logged in user is the owner of the booking
    if (booking.email !== user.email && user.role?.type !== "manager") {
      return NextResponse.json(
        { error: "Không có quyền thanh toán booking này" },
        { status: 403 }
      );
    }

    // Process payment updates
    const txId = transactionId || `VT-SIM-${Date.now()}`;
    const result = await payBooking(
      documentId,
      paymentMethod,
      txId,
      totalAmount ? Number(totalAmount) : undefined,
      promoCode
    );

    if (result.success) {
      const finalAmount = totalAmount ? Number(totalAmount) : (booking.totalAmount || (booking.tour?.price || 0) * (booking.numberOfGuests || 1));
      try {
        // Award loyalty points: 1 point per 10k VND spent
        await addLoyaltyPoints(booking.email, finalAmount, booking.id || documentId);
        
        // If a membership voucher was used, mark it as used
        if (promoCode && (promoCode.startsWith("VT50K-") || promoCode.startsWith("VT200K-") || promoCode.startsWith("VT400K-"))) {
          await useCoupon(booking.email, promoCode);
        }
      } catch (pointsErr) {
        console.error("Lỗi cập nhật điểm tích lũy / voucher:", pointsErr);
      }
    }

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Lỗi xử lý thanh toán" },
      { status: 500 }
    );
  }
}
