import { getAllBookings, updateBookingStatus } from "@/lib/strapi";
import { AUTH_COOKIE, strapiGetMe } from "@/lib/auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();
  const jwt = cookieStore.get(AUTH_COOKIE)?.value;

  if (!jwt) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await strapiGetMe(jwt);
    if (user.role?.type !== "manager") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const bookings = await getAllBookings(jwt);
    return NextResponse.json({ bookings });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const cookieStore = await cookies();
  const jwt = cookieStore.get(AUTH_COOKIE)?.value;

  if (!jwt) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await strapiGetMe(jwt);
    if (user.role?.type !== "manager") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { documentId, status } = await request.json();
    if (!documentId || !status) {
      return NextResponse.json({ error: "Bad Request" }, { status: 400 });
    }

    const result = await updateBookingStatus(documentId, status, jwt);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update booking status" },
      { status: 500 }
    );
  }
}
