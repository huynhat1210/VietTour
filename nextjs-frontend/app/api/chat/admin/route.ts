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

    // Fetch up to 1000 latest chat messages to group into sessions
    const res = await fetch(
      `${STRAPI_URL}/api/chat-messages?sort[0]=createdAt:desc&pagination[pageSize]=1000`,
      {
        headers: {
          Authorization: getAuthHeader(),
        },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch chat messages from Strapi: ${res.status}`);
    }

    const data = await res.json();
    const rawMessages = data.data || [];
    const messages = rawMessages.map(unwrapChatMessage).filter(Boolean);

    const sessionsMap = new Map<string, any>();

    for (const msg of messages) {
      const token = msg.sessionToken;
      if (!sessionsMap.has(token)) {
        sessionsMap.set(token, {
          sessionToken: token,
          senderName: msg.senderName,
          senderEmail: msg.senderEmail,
          senderPhone: msg.senderPhone,
          latestMessage: msg.message,
          latestMessageTime: msg.createdAt,
          unreadCount: 0,
        });
      }
      
      // If this message is from the customer, overwrite the contact details
      // to make sure we display the customer's name, not the manager's.
      if (!msg.isAdmin) {
        const sessionObj = sessionsMap.get(token);
        sessionObj.senderName = msg.senderName;
        sessionObj.senderEmail = msg.senderEmail || sessionObj.senderEmail;
        sessionObj.senderPhone = msg.senderPhone || sessionObj.senderPhone;
      }
      
      // Count unread customer messages (where isAdmin is false)
      if (!msg.isAdmin && !msg.read) {
        sessionsMap.get(token).unreadCount += 1;
      }
    }

    const sessionsList = Array.from(sessionsMap.values());
    // Sort sessions by latestMessageTime descending
    sessionsList.sort(
      (a: any, b: any) =>
        new Date(b.latestMessageTime).getTime() - new Date(a.latestMessageTime).getTime()
    );

    return NextResponse.json({ success: true, sessions: sessionsList });
  } catch (error: any) {
    console.error("GET /api/chat/admin error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
