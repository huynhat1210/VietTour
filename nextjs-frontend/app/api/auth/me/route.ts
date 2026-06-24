import { AUTH_COOKIE, strapiGetMe, strapiUpdateUser } from "@/lib/auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();
  const jwt = cookieStore.get(AUTH_COOKIE)?.value;

  if (!jwt) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  try {
    const user = await strapiGetMe(jwt);
    return NextResponse.json({ user });
  } catch {
    cookieStore.delete(AUTH_COOKIE);
    return NextResponse.json({ user: null }, { status: 401 });
  }
}

export async function PUT(request: Request) {
  const cookieStore = await cookies();
  const jwt = cookieStore.get(AUTH_COOKIE)?.value;

  if (!jwt) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }

  try {
    const user = await strapiGetMe(jwt);
    const body = await request.json();
    const { fullName, phone, gender, dateOfBirth, province, district, ward, addressDetail } = body;

    const updatedUser = await strapiUpdateUser(user.id, jwt, {
      fullName,
      phone,
      gender,
      dateOfBirth,
      province,
      district,
      ward,
      addressDetail,
    });
    if (!updatedUser) {
      return NextResponse.json({ error: "Cập nhật thất bại" }, { status: 400 });
    }

    return NextResponse.json({ user: updatedUser });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Lỗi cập nhật thông tin" },
      { status: 500 }
    );
  }
}
