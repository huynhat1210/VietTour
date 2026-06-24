import { AUTH_COOKIE, strapiGetMe } from "@/lib/auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const provider = searchParams.get("provider");
    const code = searchParams.get("code");
    const accessToken = searchParams.get("access_token");

    if (!provider || (!code && !accessToken)) {
      return NextResponse.json(
        { message: "Missing provider, code, or access_token" },
        { status: 400 }
      );
    }

    // Build query params for Strapi callback
    let callbackUrl = `${STRAPI_URL}/api/auth/${provider}/callback`;
    if (code) {
      callbackUrl += `?code=${encodeURIComponent(code)}`;
    } else if (accessToken) {
      callbackUrl += `?access_token=${encodeURIComponent(accessToken)}`;
    }

    const response = await fetch(callbackUrl);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result?.error?.message || "Xác thực tài khoản thất bại");
    }

    const cookieStore = await cookies();
    cookieStore.set(AUTH_COOKIE, result.jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    const user = await strapiGetMe(result.jwt);
    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Đăng nhập mạng xã hội thất bại",
      },
      { status: 400 }
    );
  }
}
