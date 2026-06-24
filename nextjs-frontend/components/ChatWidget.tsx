"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

interface ChatMessage {
  id: number;
  documentId?: string;
  sessionToken: string;
  senderName: string;
  senderEmail?: string;
  senderPhone?: string;
  message: string;
  isAdmin: boolean;
  read: boolean;
  createdAt: string;
}

interface ChatSession {
  sessionToken: string;
  name: string;
  email?: string;
  phone?: string;
}

export default function ChatWidget() {
  const { user } = useAuth();
  const { language } = useLanguage();
  
  // UI states
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  
  // Chat session states
  const [session, setSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [hasHistory, setHasHistory] = useState<boolean | null>(null);
  const hasHistoryInitializedRef = useRef(false);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  
  // Registration form for guests
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [formError, setFormError] = useState("");

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastMessageCountRef = useRef<number>(0);

  // 1. Sync session with logged-in user, or check localStorage for guest session
  useEffect(() => {
    if (user) {
      const userSession: ChatSession = {
        sessionToken: `user_${user.id}`,
        name: user.fullName || user.username,
        email: user.email,
        phone: user.phone || "",
      };
      setSession(userSession);
    } else {
      const stored = localStorage.getItem("viettour_chat_session");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setSession(parsed);
        } catch {
          setSession(null);
        }
      } else {
        setSession(null);
      }
    }
  }, [user]);

  // Scroll to bottom helper
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  // Scroll to bottom when messages list changes or widget is opened
  const displayMessages = [...messages];
  if (hasHistory === false && session) {
    displayMessages.unshift({
      id: -1,
      sessionToken: session.sessionToken,
      senderName: "VietTour Hỗ Trợ",
      message: language === "vi"
        ? "Xin chào! Bạn cần VietTour hỗ trợ thông tin gì ạ?"
        : "Hello! How can VietTour assist you today?",
      isAdmin: true,
      read: true,
      createdAt: new Date().toISOString(),
    });
  }

  useEffect(() => {
    if (isOpen && displayMessages.length > 0) {
      setTimeout(scrollToBottom, 100);
    }
  }, [displayMessages.length, isOpen]);

  // 2. Clear unread messages count when widget is opened
  useEffect(() => {
    if (isOpen && session?.sessionToken) {
      setUnreadCount(0);
      // Call API to mark admin messages as read in the DB
      fetch("/api/chat", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionToken: session.sessionToken,
          readByAdmin: false, // marked as read by customer
        }),
      }).catch((err) => console.error("Error marking messages as read:", err));
    }
  }, [isOpen, session?.sessionToken]);

  // 3. Polling messages
  const fetchMessages = async (currentToken: string) => {
    try {
      const res = await fetch(`/api/chat?sessionToken=${encodeURIComponent(currentToken)}`);
      if (res.ok) {
        const data = await res.json();
        const newMessages: ChatMessage[] = data.messages || [];
        setMessages(newMessages);

        if (!hasHistoryInitializedRef.current) {
          hasHistoryInitializedRef.current = true;
          setHasHistory(newMessages.length > 0);
        }

        // Handle unread counts if chat widget is closed
        if (!isOpen && lastMessageCountRef.current > 0 && newMessages.length > lastMessageCountRef.current) {
          const addedMessages = newMessages.slice(lastMessageCountRef.current);
          const unreadAdminMsgs = addedMessages.filter((m) => m.isAdmin && !m.read);
          if (unreadAdminMsgs.length > 0) {
            setUnreadCount((prev) => prev + unreadAdminMsgs.length);
          }
        }
        lastMessageCountRef.current = newMessages.length;
      }
    } catch (err) {
      console.error("Failed to poll chat messages:", err);
    }
  };

  useEffect(() => {
    if (!session?.sessionToken) {
      setMessages([]);
      return;
    }

    // Initial fetch
    setLoading(true);
    fetchMessages(session.sessionToken).finally(() => setLoading(false));

    // Setup polling
    const intervalTime = isOpen ? 3000 : 10000; // Poll faster when chat is open
    pollIntervalRef.current = setInterval(() => {
      fetchMessages(session.sessionToken);
    }, intervalTime);

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [session?.sessionToken, isOpen]);

  // Adjust poll frequency on open/close
  useEffect(() => {
    if (!session?.sessionToken) return;

    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
    }

    const intervalTime = isOpen ? 3000 : 10000;
    pollIntervalRef.current = setInterval(() => {
      fetchMessages(session.sessionToken);
    }, intervalTime);

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [isOpen, session?.sessionToken]);

  // 4. Handle Guest Registration
  const handleStartGuestChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) {
      setFormError("Vui lòng nhập tên của bạn");
      return;
    }

    const randomId = Math.random().toString(36).substring(2, 11);
    const guestSession: ChatSession = {
      sessionToken: `guest_${randomId}`,
      name: guestName.trim(),
      email: guestEmail.trim() || undefined,
      phone: guestPhone.trim() || undefined,
    };

    localStorage.setItem("viettour_chat_session", JSON.stringify(guestSession));
    setSession(guestSession);
    setFormError("");
  };

  // 5. Send message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !session || sending) return;

    const messageText = inputMessage.trim();
    setInputMessage("");
    setSending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionToken: session.sessionToken,
          message: messageText,
          senderName: session.name,
          senderEmail: session.email,
          senderPhone: session.phone,
          isAdmin: false,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.message) {
          setMessages((prev) => [...prev, data.message]);
          lastMessageCountRef.current += 1;
        }
      }
    } catch (err) {
      console.error("Error sending message:", err);
    } finally {
      setSending(false);
    }
  };

  // Format time (HH:MM)
  const formatTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "";
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] font-sans">
      {/* 1. Chat Window */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[380px] max-w-[calc(100vw-2rem)] h-[520px] max-h-[calc(100vh-7rem)] bg-white dark:bg-stone-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-100 dark:border-stone-700 transition-all duration-300 transform scale-100 origin-bottom-right">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-4 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-bold text-lg text-white">
                V
              </div>
              <div>
                <h3 className="font-semibold text-[15px] leading-tight">VietTour Hỗ Trợ</h3>
                <span className="text-xs text-emerald-100 flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
                  Trực tuyến 24/7
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-colors p-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto p-4 bg-slate-50 dark:bg-stone-800 flex flex-col"
          >
            {!session ? (
              // Start Guest Form
              <div className="my-auto bg-white dark:bg-stone-800 p-5 rounded-xl border border-slate-100 dark:border-stone-700 shadow-sm">
                <h4 className="font-bold text-slate-800 dark:text-stone-100 text-[16px] text-center mb-1">Bắt đầu trò chuyện</h4>
                <p className="text-xs text-slate-500 dark:text-stone-400 text-center mb-5">
                  Vui lòng cung cấp tên để VietTour có thể gọi và hỗ trợ bạn chu đáo nhất.
                </p>
                <form onSubmit={handleStartGuestChat} className="space-y-4">
                  {formError && (
                    <div className="text-xs text-red-500 bg-red-50 dark:bg-red-900/30 p-2 rounded-lg border border-red-100 dark:border-red-800">
                      {formError}
                    </div>
                  )}
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-stone-300 mb-1">Tên của bạn *</label>
                    <input
                      type="text"
                      required
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="Nguyễn Văn A"
                      className="w-full text-sm border border-slate-200 dark:border-stone-600 rounded-lg px-3 py-2 outline-none focus:border-emerald-500 transition-colors bg-white dark:bg-stone-700 text-slate-800 dark:text-stone-100 placeholder:text-slate-400 dark:placeholder:text-stone-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-stone-300 mb-1">Số điện thoại (tùy chọn)</label>
                    <input
                      type="tel"
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      placeholder="0912345678"
                      className="w-full text-sm border border-slate-200 dark:border-stone-600 rounded-lg px-3 py-2 outline-none focus:border-emerald-500 transition-colors bg-white dark:bg-stone-700 text-slate-800 dark:text-stone-100 placeholder:text-slate-400 dark:placeholder:text-stone-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-stone-300 mb-1">Email (tùy chọn)</label>
                    <input
                      type="email"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      placeholder="email@example.com"
                      className="w-full text-sm border border-slate-200 dark:border-stone-600 rounded-lg px-3 py-2 outline-none focus:border-emerald-500 transition-colors bg-white dark:bg-stone-700 text-slate-800 dark:text-stone-100 placeholder:text-slate-400 dark:placeholder:text-stone-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-lg py-2.5 mt-2 transition-all shadow-md shadow-emerald-600/10"
                  >
                    Bắt đầu chat
                  </button>
                </form>
              </div>
            ) : (
              // Message List
              <>
                {loading ? (
                  <div className="m-auto flex flex-col items-center gap-2">
                    <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-xs text-slate-400 dark:text-stone-500">Đang tải tin nhắn...</span>
                  </div>
                ) : displayMessages.length === 0 ? (
                  <div className="my-auto text-center px-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                      💬
                    </div>
                    <p className="font-semibold text-slate-700 dark:text-stone-200 text-sm">Xin chào {session.name}!</p>
                    <p className="text-xs text-slate-400 dark:text-stone-500 mt-1 max-w-[200px] mx-auto leading-relaxed">
                      Bạn có câu hỏi gì cần giải đáp? Hãy gửi tin nhắn dưới đây, VietTour sẽ phản hồi bạn ngay.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3.5 pb-2">
                    {displayMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${msg.isAdmin ? "items-start" : "items-end"}`}
                      >
                        <div
                          className={`px-3.5 py-2 rounded-2xl text-[13.5px] max-w-[82%] shadow-sm leading-relaxed ${
                            msg.isAdmin
                              ? "bg-white dark:bg-stone-700 text-slate-800 dark:text-stone-100 rounded-tl-none border border-slate-100 dark:border-stone-600"
                              : "bg-emerald-600 text-white rounded-tr-none"
                          }`}
                        >
                          {msg.message}
                        </div>
                        <span className="text-[10px] text-slate-400 dark:text-stone-500 mt-1 px-1.5">
                          {formatTime(msg.createdAt)}
                        </span>
                    </div>
                  ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer Input */}
          {session && (
            <form onSubmit={handleSendMessage} className="p-3 bg-white dark:bg-stone-900 border-t border-slate-100 dark:border-stone-700 flex items-center gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Nhập câu hỏi của bạn..."
                className="flex-1 bg-slate-50 dark:bg-stone-800 border border-slate-200 dark:border-stone-600 text-sm text-slate-800 dark:text-stone-100 rounded-xl px-4 py-2.5 outline-none focus:bg-white dark:focus:bg-stone-700 focus:border-emerald-500 transition-all placeholder:text-slate-400 dark:placeholder:text-stone-500"
                disabled={sending}
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || sending}
                className="w-10 h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center transition-all disabled:opacity-40 shadow-md shadow-emerald-600/10"
              >
                {sending ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M3.478 2.404a.75.75 0 00-.926.941l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.404z" />
                  </svg>
                )}
              </button>
            </form>
          )}
        </div>
      )}

      {/* 2. Floating Bubble Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-[60px] h-[60px] rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 border border-emerald-500/20 active:scale-95"
        aria-label="VietTour Chat Support"
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        ) : (
          <div className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute -top-3.5 -right-3.5 bg-red-500 text-white text-[11px] font-bold h-5 w-5 rounded-full flex items-center justify-center border-2 border-emerald-600 animate-pulse shadow-md">
                {unreadCount}
              </span>
            )}
          </div>
        )}
      </button>
    </div>
  );
}
