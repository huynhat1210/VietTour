import {
  getReviewsByTourSlug,
  createReview,
  publishReview,
  deleteReview,
  getAllTestimonialsAdmin,
  getTourBySlug,
} from "@/lib/strapi";
import { AUTH_COOKIE, strapiGetMe } from "@/lib/auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  // If a slug is specified, fetch public reviews for this tour (unauthenticated)
  if (slug) {
    try {
      const reviews = await getReviewsByTourSlug(slug);
      return NextResponse.json({ reviews });
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || "Failed to fetch reviews" },
        { status: 500 }
      );
    }
  }

  // Otherwise, fetch all reviews for Admin moderation (requires manager role)
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

    const reviews = await getAllTestimonialsAdmin();
    return NextResponse.json({ reviews });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch reviews for admin" },
      { status: 500 }
    );
  }
}

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const jwt = cookieStore.get(AUTH_COOKIE)?.value;

  if (!jwt) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await strapiGetMe(jwt);
    const formData = await request.formData();

    const name = formData.get("name") as string;
    const content = formData.get("content") as string;
    const rating = formData.get("rating") as string;
    const tourSlug = formData.get("tourSlug") as string;
    const files = formData.getAll("images") as File[];

    if (!content || !rating || !tourSlug) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Process file uploads directly to Strapi Media Library
    const savedUrls: string[] = [];
    if (files && files.length > 0) {
      const strapiFormData = new FormData();
      let hasFiles = false;

      for (const file of files) {
        if (!file.name || file.size === 0) continue;
        const blob = new Blob([await file.arrayBuffer()], { type: file.type });
        strapiFormData.append("files", blob, file.name);
        hasFiles = true;
      }

      if (hasFiles) {
        const uploadRes = await fetch(`${STRAPI_URL}/api/upload`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${STRAPI_TOKEN}`,
          },
          body: strapiFormData,
        });

        if (!uploadRes.ok) {
          const errText = await uploadRes.text();
          console.error("Strapi upload error:", errText);
          throw new Error("Failed to upload images to Strapi backend");
        }

        const uploadedFiles = await uploadRes.json();
        if (Array.isArray(uploadedFiles)) {
          for (const uFile of uploadedFiles) {
            const rawUrl = uFile.url;
            const fullUrl = rawUrl.startsWith("http") ? rawUrl : `${STRAPI_URL}${rawUrl}`;
            savedUrls.push(fullUrl);
          }
        }
      }
    }

    // Look up the tour by slug to get its documentId
    const tour = await getTourBySlug(tourSlug);
    if (!tour || !tour.documentId) {
      return NextResponse.json({ error: "Tour not found" }, { status: 404 });
    }

    const displayName = name || user.fullName || user.username || user.email;

    // Serialize media links into the content field
    let finalContent = content.trim();
    if (savedUrls.length > 0) {
      finalContent = `${finalContent} [[media:${savedUrls.join(",")}]]`;
    }

    const result = await createReview({
      name: displayName,
      content: finalContent,
      rating: Number(rating),
      tour: tour.documentId,
      user: user.documentId,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create review" },
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

    const { documentId } = await request.json();
    if (!documentId) {
      return NextResponse.json({ error: "Missing documentId" }, { status: 400 });
    }

    const result = await publishReview(documentId);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to publish review" },
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
    const user = await strapiGetMe(jwt);
    if (user.role?.type !== "manager") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Read from body first, fallback to query param
    let documentId = "";
    try {
      const body = await request.json();
      documentId = body.documentId;
    } catch {
      const { searchParams } = new URL(request.url);
      documentId = searchParams.get("documentId") || "";
    }

    if (!documentId) {
      return NextResponse.json({ error: "Missing documentId" }, { status: 400 });
    }

    const result = await deleteReview(documentId);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to delete review" },
      { status: 500 }
    );
  }
}
