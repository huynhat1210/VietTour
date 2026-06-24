import { createBooking, getBookingsByUser, getBookingByDocumentId, getTourByDocumentId } from "@/lib/strapi";
import { AUTH_COOKIE, strapiGetMe } from "@/lib/auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const cookieStore = await cookies();
  const jwt = cookieStore.get(AUTH_COOKIE)?.value;

  if (!jwt) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const bookingId = searchParams.get("id");

  try {
    const user = await strapiGetMe(jwt);

    if (bookingId) {
      const booking = await getBookingByDocumentId(bookingId, jwt);
      if (!booking) {
        return NextResponse.json({ error: "Không tìm thấy booking" }, { status: 404 });
      }
      // Ensure the user owns this booking or is manager
      if (booking.email !== user.email && user.role?.type !== "manager") {
        return NextResponse.json({ error: "Không có quyền truy cập booking này" }, { status: 403 });
      }
      return NextResponse.json({ booking });
    }

    const bookings = await getBookingsByUser(user.email, jwt);
    console.log("GET /api/bookings returning to client:", bookings.map(b => ({ id: b.id, documentId: b.documentId, paymentStatus: b.paymentStatus })));
    return NextResponse.json({ bookings });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Không thể lấy danh sách đặt tour từ máy chủ" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Fetch tour to calculate totalAmount securely
    let totalAmount = 0;
    if (body.tour) {
      const tour = await getTourByDocumentId(body.tour as string);
      if (tour) {
        totalAmount = (tour.price || 0) * (Number(body.numberOfGuests) || 1);
      }
    }

    const result = await createBooking({ ...body, totalAmount });
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Không thể tạo đặt tour" },
      { status: 500 }
    );
  }
}

