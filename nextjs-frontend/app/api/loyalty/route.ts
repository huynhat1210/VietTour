import { getLoyaltyRecord, redeemLoyaltyPoints } from "@/lib/loyalty";
import { AUTH_COOKIE, strapiGetMe } from "@/lib/auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();
  const jwt = cookieStore.get(AUTH_COOKIE)?.value;

  if (!jwt) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }

  try {
    const user = await strapiGetMe(jwt);
    if (!user || !user.email) {
      return NextResponse.json({ error: "Không tìm thấy người dùng" }, { status: 404 });
    }

    const record = await getLoyaltyRecord(user.email);
    return NextResponse.json({ success: true, record });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Lỗi tải thông tin tích điểm" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const jwt = cookieStore.get(AUTH_COOKIE)?.value;

  if (!jwt) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }

  try {
    const user = await strapiGetMe(jwt);
    if (!user || !user.email) {
      return NextResponse.json({ error: "Không tìm thấy người dùng" }, { status: 404 });
    }

    const body = await request.json();
    const { voucherType } = body;

    if (!voucherType || !["VT50K", "VT200K", "VT400K"].includes(voucherType)) {
      return NextResponse.json({ error: "Loại voucher không hợp lệ" }, { status: 400 });
    }

    const result = await redeemLoyaltyPoints(user.email, voucherType);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Lỗi đổi điểm" },
      { status: 500 }
    );
  }
}
