"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface Toast {
  id: number;
  message: string;
  type: "success" | "error" | "info";
}

interface ToastContextType {
  showToast: (message: string, type: "success" | "error" | "info") => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: "success" | "error" | "info" = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, 3000);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Toast Portal Container */}
      <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto toast-animate-in relative flex items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-white/90 p-4 pl-5 pr-4 shadow-[0_12px_40px_rgba(0,0,0,0.06)] backdrop-blur-md overflow-hidden transition-all duration-300"
          >
            <div className="flex items-center gap-3.5">
              {t.type === "success" && (
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 shadow-sm shadow-emerald-500/10">
                  <svg className="h-5.5 w-5.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
              )}
              {t.type === "error" && (
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600 shadow-sm shadow-rose-500/10">
                  <svg className="h-5.5 w-5.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </span>
              )}
              {t.type === "info" && (
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 shadow-sm shadow-blue-500/10">
                  <svg className="h-5.5 w-5.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
              )}
              <div className="flex flex-col gap-0.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {t.type === "success" ? "Thành công" : t.type === "error" ? "Đã xảy ra lỗi" : "Thông báo"}
                </p>
                <p className="text-xs font-semibold text-slate-700 leading-normal">{t.message}</p>
              </div>
            </div>
            
            <button
              onClick={() => removeToast(t.id)}
              className="text-slate-400 hover:text-slate-700 transition-colors p-1.5 rounded-lg hover:bg-slate-50"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Lifetime progress bar */}
            <div 
              className={`absolute bottom-0 left-0 h-[3px] toast-progress-bar bg-gradient-to-r ${
                t.type === "success" 
                  ? "from-emerald-500 to-teal-400" 
                  : t.type === "error" 
                  ? "from-rose-500 to-red-500" 
                  : "from-blue-500 to-indigo-500"
              }`}
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
