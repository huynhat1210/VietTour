import { fetchTours } from "@/lib/data";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const tours = await fetchTours();
    return NextResponse.json({ tours });
  } catch (error) {
    return NextResponse.json(
      { error: "Không thể tải danh sách tour du lịch" },
      { status: 500 }
    );
  }
}
