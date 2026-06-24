import { AUTH_COOKIE, strapiGetMe } from "@/lib/auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

function getAuthHeader() {
  return STRAPI_TOKEN ? `Bearer ${STRAPI_TOKEN}` : "";
}

function unwrapChatMessage(item: any) {
  if (!item) return null;
  const id = item.id;
  const attributes = item.attributes || item;
  return {
    id,
    documentId: item.documentId || attributes.documentId || String(id),
    sessionToken: attributes.sessionToken,
    senderName: attributes.senderName,
    senderEmail: attributes.senderEmail,
    senderPhone: attributes.senderPhone,
    message: attributes.message,
    isAdmin: !!attributes.isAdmin,
    read: !!attributes.read,
    createdAt: attributes.createdAt || item.createdAt,
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionToken = searchParams.get("sessionToken");

  if (!sessionToken) {
    return NextResponse.json({ error: "Missing sessionToken" }, { status: 400 });
  }

  try {
    const res = await fetch(
      `${STRAPI_URL}/api/chat-messages?filters[sessionToken][$eq]=${encodeURIComponent(sessionToken)}&sort[0]=createdAt:asc&pagination[pageSize]=100`,
      {
        headers: {
          Authorization: getAuthHeader(),
        },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch from Strapi: ${res.status}`);
    }

    const data = await res.json();
    const rawMessages = data.data || [];
    const messages = rawMessages.map(unwrapChatMessage).filter(Boolean);

    return NextResponse.json({ success: true, messages });
  } catch (error: any) {
    console.error("GET /api/chat error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sessionToken, message, senderName, senderEmail, senderPhone, isAdmin } = body;

    if (!sessionToken || !message || !senderName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Security check: if sending as admin, verify manager role
    if (isAdmin) {
      const cookieStore = await cookies();
      const jwt = cookieStore.get(AUTH_COOKIE)?.value;
      if (!jwt) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      const me = await strapiGetMe(jwt);
      if (me.role?.type !== "manager") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    const res = await fetch(`${STRAPI_URL}/api/chat-messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: getAuthHeader(),
      },
      body: JSON.stringify({
        data: {
          sessionToken,
          message,
          senderName,
          senderEmail,
          senderPhone,
          isAdmin: !!isAdmin,
          read: false,
        },
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Failed to save message in Strapi: ${res.status} - ${errText}`);
    }

    const data = await res.json();
    const savedMsg = unwrapChatMessage(data.data);

    return NextResponse.json({ success: true, message: savedMsg });
  } catch (error: any) {
    console.error("POST /api/chat error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { sessionToken, readByAdmin } = body;

    if (!sessionToken) {
      return NextResponse.json({ error: "Missing sessionToken" }, { status: 400 });
    }

    // If read by admin, verify role first
    if (readByAdmin) {
      const cookieStore = await cookies();
      const jwt = cookieStore.get(AUTH_COOKIE)?.value;
      if (!jwt) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      const me = await strapiGetMe(jwt);
      if (me.role?.type !== "manager") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    // 1. Fetch unread messages for this session
    // If readByAdmin is true, we mark messages where isAdmin is false as read.
    // If readByAdmin is false (customer reading), we mark messages where isAdmin is true as read.
    const senderFilter = readByAdmin ? "filters[isAdmin][$eq]=false" : "filters[isAdmin][$eq]=true";
    const res = await fetch(
      `${STRAPI_URL}/api/chat-messages?filters[sessionToken][$eq]=${encodeURIComponent(sessionToken)}&${senderFilter}&filters[read][$eq]=false&pagination[pageSize]=100`,
      {
        headers: {
          Authorization: getAuthHeader(),
        },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to query unread messages: ${res.status}`);
    }

    const data = await res.json();
    const unreadMessages = data.data || [];

    // 2. Mark them as read in parallel
    const updatePromises = unreadMessages.map(async (msg: any) => {
      const identifier = msg.documentId || msg.id;
      const updateRes = await fetch(`${STRAPI_URL}/api/chat-messages/${identifier}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: getAuthHeader(),
        },
        body: JSON.stringify({
          data: {
            read: true,
          },
        }),
      });
      return updateRes.ok;
    });

    await Promise.all(updatePromises);

    return NextResponse.json({ success: true, count: unreadMessages.length });
  } catch (error: any) {
    console.error("PUT /api/chat error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
