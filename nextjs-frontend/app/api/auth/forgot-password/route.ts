import { NextResponse } from "next/server";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Vui lòng cung cấp email" }, { status: 400 });
    }

    const res = await fetch(`${STRAPI_URL}/api/auth/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.error?.message || "Không thể gửi yêu cầu đặt lại mật khẩu");
    }

    return NextResponse.json({ success: true, message: "Link đặt lại mật khẩu đã được gửi đến email của bạn!" });
  } catch (error: any) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: error.message || "Lỗi khi xử lý yêu cầu" },
      { status: 500 }
    );
  }
}
