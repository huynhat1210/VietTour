import { AUTH_COOKIE, strapiGetMe } from "@/lib/auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

export async function GET() {
  const cookieStore = await cookies();
  const jwt = cookieStore.get(AUTH_COOKIE)?.value;

  if (!jwt) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const me = await strapiGetMe(jwt);
    if (me.role?.type !== "manager") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Fetch users
    const usersRes = await fetch(`${STRAPI_URL}/api/users-admin`, {
      headers: { Authorization: `Bearer ${jwt}` },
      cache: "no-store",
    });
    if (!usersRes.ok) {
      throw new Error(`Failed to fetch users from Strapi: ${usersRes.status}`);
    }
    const usersData = await usersRes.json();

    // Fetch roles
    const rolesRes = await fetch(`${STRAPI_URL}/api/users-admin/roles`, {
      headers: { Authorization: `Bearer ${jwt}` },
      cache: "no-store",
    });
    if (!rolesRes.ok) {
      throw new Error(`Failed to fetch roles from Strapi: ${rolesRes.status}`);
    }
    const rolesData = await rolesRes.json();

    return NextResponse.json({
      users: usersData.data || [],
      roles: rolesData.data || [],
    });
  } catch (error: any) {
    console.error("GET /api/admin/users error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch users data" },
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
    const me = await strapiGetMe(jwt);
    if (me.role?.type !== "manager") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { documentId, ...updateData } = body;

    if (!documentId) {
      return NextResponse.json({ error: "Missing documentId" }, { status: 400 });
    }

    const res = await fetch(`${STRAPI_URL}/api/users-admin/${documentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify(updateData),
    });

    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.error?.message || "Failed to update user in Strapi");
    }

    return NextResponse.json({ success: true, user: result.data });
  } catch (error: any) {
    console.error("PUT /api/admin/users error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update user" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const cookieStore = await cookies();
  const jwt = cookieStore.get(AUTH_COOKIE)?.value;

  if (!jwt) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const me = await strapiGetMe(jwt);
    if (me.role?.type !== "manager") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const documentId = searchParams.get("documentId");

    if (!documentId) {
      return NextResponse.json({ error: "Missing documentId" }, { status: 400 });
    }

    const res = await fetch(`${STRAPI_URL}/api/users-admin/${documentId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${jwt}` },
    });

    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.error?.message || "Failed to delete user in Strapi");
    }

    return NextResponse.json({ success: true, message: "User deleted successfully" });
  } catch (error: any) {
    console.error("DELETE /api/admin/users error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete user" },
      { status: 500 }
    );
  }
}
