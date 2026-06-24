import { AUTH_COOKIE, strapiRegister, strapiGetMe, strapiUpdateUser } from "@/lib/auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await strapiRegister(body);

    // Save fullName and phone right after successful register since default endpoint discards them
    // Use STRAPI_TOKEN if available to bypass permission locks of unconfirmed users
    if (result.user && (body.fullName || body.phone)) {
      const authHeader = STRAPI_TOKEN ? `Bearer ${STRAPI_TOKEN}` : `Bearer ${result.jwt}`;
      await fetch(`${STRAPI_URL}/api/users/${result.user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
        body: JSON.stringify({
          fullName: body.fullName,
          phone: body.phone,
        }),
      });
    }

    // If Strapi email confirmation is enabled, the user will be unconfirmed
    if (result.user && !result.user.confirmed) {
      return NextResponse.json({
        success: true,
        user: result.user,
        verifyEmailRequired: true,
      });
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
          error instanceof Error ? error.message : "Đăng ký thất bại",
      },
      { status: 400 }
    );
  }
}
