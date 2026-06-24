import { NextResponse } from "next/server";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

export async function POST(request: Request) {
  try {
    const { code, password, passwordConfirmation } = await request.json();

    if (!code || !password || !passwordConfirmation) {
      return NextResponse.json({ error: "Thiếu thông tin yêu cầu" }, { status: 400 });
    }

    if (password !== passwordConfirmation) {
      return NextResponse.json({ error: "Mật khẩu xác nhận không khớp" }, { status: 400 });
    }

    const res = await fetch(`${STRAPI_URL}/api/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code, password, passwordConfirmation }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.error?.message || "Đặt lại mật khẩu thất bại");
    }

    return NextResponse.json({ success: true, message: "Mật khẩu đã được đặt lại thành công!" });
  } catch (error: any) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: error.message || "Lỗi khi xử lý đặt lại mật khẩu" },
      { status: 500 }
    );
  }
}
