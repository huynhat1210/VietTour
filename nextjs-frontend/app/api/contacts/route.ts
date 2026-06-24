import { createContact } from "@/lib/strapi";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await createContact(body);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { success: false, message: "Không thể gửi liên hệ" },
      { status: 500 }
    );
  }
}
