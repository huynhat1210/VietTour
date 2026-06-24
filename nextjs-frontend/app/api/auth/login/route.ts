import { AUTH_COOKIE, strapiLogin, strapiGetMe } from "@/lib/auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    const result = await strapiLogin({ email, password });

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
          error instanceof Error ? error.message : "Đăng nhập thất bại",
      },
      { status: 401 }
    );
  }
}
