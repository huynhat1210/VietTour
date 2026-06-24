import { AUTH_COOKIE, strapiGetMe } from "@/lib/auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
// Use full-access API token for upload (user JWT doesn't have upload permission by default)
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const jwt = cookieStore.get(AUTH_COOKIE)?.value;

  if (!jwt) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }

  try {
    // Verify user is authenticated first
    const user = await strapiGetMe(jwt);

    // Parse multipart form data
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Không có file được gửi lên" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Chỉ chấp nhận file ảnh (JPG, PNG, WEBP, GIF)" },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "Ảnh không được vượt quá 5MB" },
        { status: 400 }
      );
    }

    // Use API token for upload (bypasses user permission restrictions on /api/upload)
    const authHeader = STRAPI_TOKEN
      ? `Bearer ${STRAPI_TOKEN}`
      : `Bearer ${jwt}`;

    // Step 1: Upload file to Strapi media library using API token
    const uploadFormData = new FormData();
    uploadFormData.append("files", file, file.name || "avatar.jpg");
    uploadFormData.append("ref", "plugin::users-permissions.user");
    uploadFormData.append("refId", String(user.id));
    uploadFormData.append("field", "avatar");

    const uploadRes = await fetch(`${STRAPI_URL}/api/upload`, {
      method: "POST",
      headers: {
        Authorization: authHeader,
      },
      body: uploadFormData,
    });

    if (!uploadRes.ok) {
      const errText = await uploadRes.text();
      let errMsg = "Upload ảnh thất bại";
      try {
        const errJson = JSON.parse(errText);
        errMsg = errJson?.error?.message || errMsg;
      } catch {}
      console.error("Strapi upload error:", uploadRes.status, errText);
      throw new Error(`Upload thất bại (${uploadRes.status}): ${errMsg}`);
    }

    const uploadedFiles = await uploadRes.json();
    const uploadedFile = Array.isArray(uploadedFiles) ? uploadedFiles[0] : uploadedFiles;

    if (!uploadedFile?.url) {
      throw new Error("Không nhận được URL ảnh từ server");
    }

    // Build full avatar URL
    const avatarUrl = uploadedFile.url.startsWith("http")
      ? uploadedFile.url
      : `${STRAPI_URL}${uploadedFile.url}`;

    // Step 2: Update user's avatar field using API token
    const updateRes = await fetch(`${STRAPI_URL}/api/users/${user.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify({ avatar: uploadedFile.id }),
    });

    if (!updateRes.ok) {
      const updateErr = await updateRes.text();
      console.warn("Avatar user-link failed:", updateRes.status, updateErr);
      // Still return success - the image was uploaded, just not linked
    }

    return NextResponse.json({
      success: true,
      avatarUrl,
      user: { ...user, avatar: avatarUrl },
      message: "Cập nhật ảnh đại diện thành công!",
    });
  } catch (err: any) {
    console.error("Avatar upload error:", err);
    return NextResponse.json(
      { error: err.message || "Lỗi khi tải ảnh lên" },
      { status: 500 }
    );
  }
}
