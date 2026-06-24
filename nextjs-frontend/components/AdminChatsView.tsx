"use client";

import { useToast } from "@/context/ToastContext";
import { useEffect, useRef, useState } from "react";

interface ChatSession {
  sessionToken: string;
  senderName: string;
  senderEmail?: string;
  senderPhone?: string;
  latestMessage: string;
  latestMessageTime: string;
  unreadCount: number;
}

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

export default function AdminChatsView() {
  const { showToast } = useToast();
  
  // Dashboard states
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeToken, setActiveToken] = useState<string | null>(null);
  const [activeSession, setActiveSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  
  // Status states
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const sessionsPollRef = useRef<NodeJS.Timeout | null>(null);
  const messagesPollRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-scroll helper
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  // Scroll to bottom when messages update
  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  // 1. Fetch active sessions list
  const loadSessions = async (silent = false) => {
    if (!silent) setSessionsLoading(true);
    try {
      const res = await fetch("/api/chat/admin");
      if (res.ok) {
        const data = await res.json();
        setSessions(data.sessions || []);
      } else {
        const errData = await res.json().catch(() => ({}));
        if (!silent) {
          showToast(errData.error || "Không thể tải danh sách chat", "error");
        }
      }
    } catch (err) {
      console.error("Error loading sessions:", err);
      if (!silent) {
        showToast("Lỗi kết nối khi tải danh sách chat", "error");
      }
    } finally {
      if (!silent) setSessionsLoading(false);
    }
  };

  // 2. Fetch messages for active session
  const loadMessages = async (token: string, silent = false) => {
    if (!silent) setMessagesLoading(true);
    try {
      const res = await fetch(`/api/chat?sessionToken=${encodeURIComponent(token)}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch (err) {
      console.error("Error loading messages:", err);
    } finally {
      if (!silent) setMessagesLoading(false);
    }
  };

  // 3. Mark messages as read by admin
  const markAsRead = async (token: string) => {
    try {
      await fetch("/api/chat", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionToken: token,
          readByAdmin: true, // read by manager
        }),
      });
      // Silent reload sessions to clear badge locally
      loadSessions(true);
    } catch (err) {
      console.error("Error marking as read:", err);
    }
  };

  // Poll sessions list
  useEffect(() => {
    loadSessions();
    sessionsPollRef.current = setInterval(() => {
      loadSessions(true);
    }, 4000);

    return () => {
      if (sessionsPollRef.current) {
        clearInterval(sessionsPollRef.current);
      }
    };
  }, []);

  // Poll active session messages and mark as read
  useEffect(() => {
    if (messagesPollRef.current) {
      clearInterval(messagesPollRef.current);
    }

    if (!activeToken) {
      setMessages([]);
      setActiveSession(null);
      return;
    }

    // Set active session details
    const currentSession = sessions.find((s) => s.sessionToken === activeToken);
    if (currentSession) {
      setActiveSession(currentSession);
    }

    loadMessages(activeToken);
    markAsRead(activeToken);

    messagesPollRef.current = setInterval(() => {
      loadMessages(activeToken, true);
    }, 3000);

    return () => {
      if (messagesPollRef.current) {
        clearInterval(messagesPollRef.current);
      }
    };
  }, [activeToken, sessions]);

  // 4. Send response message
  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeToken || sending) return;

    const currentText = replyText.trim();
    setReplyText("");
    setSending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionToken: activeToken,
          message: currentText,
          senderName: "VietTour Manager",
          isAdmin: true,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.message) {
          setMessages((prev) => [...prev, data.message]);
          // Instant reload session list
          loadSessions(true);
        }
      } else {
        const errData = await res.json().catch(() => ({}));
        showToast(errData.error || "Gửi phản hồi thất bại", "error");
      }
    } catch (err) {
      console.error("Error sending reply:", err);
      showToast("Lỗi kết nối khi gửi tin nhắn", "error");
    } finally {
      setSending(false);
    }
  };

  // Keyboard shortcut: Send on Enter (without Shift)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendReply(e);
    }
  };

  // Filter sessions by search query
  const filteredSessions = sessions.filter((s) => {
    const query = searchQuery.toLowerCase();
    return (
      s.senderName.toLowerCase().includes(query) ||
      (s.senderEmail && s.senderEmail.toLowerCase().includes(query)) ||
      (s.senderPhone && s.senderPhone.toLowerCase().includes(query))
    );
  });

  const formatDateTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "2-digit",
      });
    } catch {
      return "";
    }
  };

  const getInitials = (name: string) => {
    return name ? name.substring(0, 1).toUpperCase() : "?";
  };

  return (
    <div className="flex bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm h-[600px] md:h-[650px] max-w-full animate-in fade-in duration-200">
      {/* 1. Left Sidebar: Active Sessions */}
      <div className={`w-full md:w-[320px] border-r border-slate-200 flex flex-col bg-slate-50 min-h-0 ${activeToken ? "hidden md:flex" : "flex"}`}>
        {/* Search */}
        <div className="p-4 border-b border-slate-200 bg-white">
          <h3 className="font-bold text-slate-800 text-[16px] mb-3">Khách hàng đang chat</h3>
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo tên, SĐT, Email..."
              className="w-full text-xs border border-slate-200 bg-slate-100/60 rounded-xl pl-9 pr-3 py-2.5 outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all placeholder:text-slate-400"
            />
            <span className="absolute left-3 top-3 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </span>
          </div>
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto divide-y divide-gray-100/60 p-2 space-y-1 select-none">
          {sessionsLoading ? (
            <div className="flex flex-col items-center justify-center h-48 gap-2">
              <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-[11px] text-gray-400">Đang tải cuộc trò chuyện...</span>
            </div>
          ) : filteredSessions.length === 0 ? (
            <div className="text-center py-12 text-gray-400 px-4">
              <div className="text-3xl mb-2">💬</div>
              <p className="text-xs font-medium">Không có cuộc trò chuyện nào</p>
              <p className="text-[10px] text-gray-400 mt-1">Các tin nhắn hỗ trợ từ khách hàng sẽ xuất hiện tại đây.</p>
            </div>
          ) : (
            filteredSessions.map((sessionItem) => {
              const isActive = activeToken === sessionItem.sessionToken;
              return (
                <div
                  key={sessionItem.sessionToken}
                  onClick={() => setActiveToken(sessionItem.sessionToken)}
                  className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                    isActive
                      ? "bg-emerald-50/70 border-l-4 border-l-emerald-600 shadow-sm"
                      : "hover:bg-white hover:shadow-sm border-l-4 border-l-transparent"
                  }`}
                >
                  {/* Initials Avatar */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-sm ${
                    isActive ? "bg-emerald-600 text-white" : "bg-gray-200 text-gray-600"
                  }`}>
                    {getInitials(sessionItem.senderName)}
                  </div>
                  
                  {/* Session Text Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="font-semibold text-gray-800 text-[13px] truncate">
                        {sessionItem.senderName}
                      </span>
                      <span className="text-[9px] text-gray-400 shrink-0">
                        {formatDateTime(sessionItem.latestMessageTime).split(" ")[0]}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 truncate leading-tight">
                      {sessionItem.latestMessage}
                    </p>
                  </div>

                  {/* Unread Count Badge */}
                  {sessionItem.unreadCount > 0 && !isActive && (
                    <span className="min-w-[18px] h-[18px] px-1 bg-amber-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                      {sessionItem.unreadCount}
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 2. Right Column: Conversation detail */}
      <div className={`flex-1 flex flex-col bg-white min-h-0 ${!activeToken ? "hidden md:flex" : "flex"}`}>
        {activeSession ? (
          <>
            {/* Header: User Contact Info */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-white shadow-sm z-10">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setActiveToken(null)}
                  className="md:hidden p-1.5 -ml-1 text-slate-500 hover:bg-slate-100 rounded-lg mr-1 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </button>
                <div>
                  <h4 className="font-bold text-gray-800 text-[15px]">{activeSession.senderName}</h4>
                <div className="flex items-center gap-4 mt-1 text-[11px] text-gray-500">
                  {activeSession.senderPhone && (
                    <span className="flex items-center gap-1">
                      📞 SĐT: <strong>{activeSession.senderPhone}</strong>
                    </span>
                  )}
                  {activeSession.senderEmail && (
                    <span className="flex items-center gap-1">
                      ✉️ Email: <strong>{activeSession.senderEmail}</strong>
                    </span>
                  )}
                  <span className="text-gray-300">|</span>
                  <span className="text-gray-400">Phiên: {activeSession.sessionToken.startsWith("user_") ? "Thành viên" : "Khách"}</span>
                </div>
              </div>
            </div>
          </div>

            {/* Messages Area */}
            <div
              ref={messagesContainerRef}
              className="flex-1 min-h-0 overflow-y-auto p-6 bg-slate-50 flex flex-col space-y-4"
            >
              {messagesLoading && messages.length === 0 ? (
                <div className="m-auto flex flex-col items-center gap-2">
                  <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-xs text-gray-400">Đang tải lịch sử chat...</span>
                </div>
              ) : (
                <>
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${msg.isAdmin ? "items-end" : "items-start"}`}
                    >
                      {/* Name of sender */}
                      <span className="text-[10px] text-gray-400 mb-1 px-1.5">
                        {msg.isAdmin ? "Bạn (VietTour Manager)" : msg.senderName}
                      </span>
                      {/* Text Bubble */}
                      <div
                        className={`px-4 py-2.5 rounded-2xl text-[13px] max-w-[70%] shadow-sm leading-relaxed ${
                          msg.isAdmin
                            ? "bg-emerald-600 text-white rounded-tr-none"
                            : "bg-white text-gray-800 border border-gray-200/80 rounded-tl-none"
                        }`}
                      >
                        {msg.message}
                      </div>
                      {/* Time */}
                      <span className="text-[9px] text-gray-400 mt-1 px-1.5">
                        {formatDateTime(msg.createdAt)}
                      </span>
                    </div>
                  ))}
                </>
              )}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendReply} className="p-4 border-t border-gray-200 bg-white flex items-end gap-3 shadow-md">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Nhập nội dung trả lời khách hàng (Enter để gửi, Shift+Enter xuống dòng)..."
                rows={2}
                className="flex-1 bg-slate-50 border border-slate-200 text-xs rounded-xl px-4 py-3 outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 resize-none transition-all placeholder:text-slate-400"
                disabled={sending}
              />
              <button
                type="submit"
                disabled={!replyText.trim() || sending}
                className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/15 disabled:opacity-45 transition-all select-none self-stretch shrink-0"
              >
                {sending ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Gửi</span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                      <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925H9a.75.75 0 010 1.5H3.693l-1.414 4.926a.75.75 0 00.95.95l15-6.5a.75.75 0 000-1.378l-15-6.5z" />
                    </svg>
                  </>
                )}
              </button>
            </form>
          </>
        ) : (
          // Placeholder when no session is selected
          <div className="m-auto text-center px-6 py-12 text-gray-400 max-w-sm">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 text-2xl shadow-sm">
              💬
            </div>
            <h4 className="font-bold text-gray-700 text-sm">Hộp thư hỗ trợ trực tuyến</h4>
            <p className="text-xs text-gray-400 mt-2 leading-relaxed">
              Chọn một phiên hội thoại của khách hàng ở cột bên trái để đọc lịch sử và phản hồi trực tiếp.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
