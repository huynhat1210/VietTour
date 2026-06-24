"use client";

import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useEffect, useRef, Suspense } from "react";

function RedirectHandler() {
  const { provider } = useParams() as { provider: string };
  const searchParams = useSearchParams();
  const router = useRouter();
  const { showToast } = useToast();
  const { refreshUser } = useAuth();
  const initiatedRef = useRef(false);

  useEffect(() => {
    if (initiatedRef.current) return;
    initiatedRef.current = true;

    const code = searchParams.get("code");
    const accessToken = searchParams.get("access_token");

    if (!code && !accessToken) {
      showToast("Không tìm thấy thông tin đăng nhập từ nhà cung cấp", "error");
      router.replace("/login");
      return;
    }

    const handleCallback = async () => {
      try {
        let url = `/api/auth/callback?provider=${provider}`;
        if (code) url += `&code=${encodeURIComponent(code)}`;
        if (accessToken) url += `&access_token=${encodeURIComponent(accessToken)}`;

        const res = await fetch(url);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Đăng nhập thất bại");
        }

        await refreshUser();
        showToast("Đăng nhập thành công!", "success");
        router.replace("/profile");
      } catch (err: any) {
        showToast(err.message || "Có lỗi xảy ra trong quá trình đăng nhập mạng xã hội", "error");
        router.replace("/login");
      }
    };

    handleCallback();
  }, [provider, searchParams, router, showToast, refreshUser]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-900 text-white">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-400 border-t-transparent" />
      <p className="text-sm text-slate-300 font-medium animate-pulse">Đang xác thực thông tin đăng nhập...</p>
    </div>
  );
}

export default function SocialRedirectPage() {
  return (
    <Suspense 
      fallback={
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-900 text-white">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-400 border-t-transparent" />
          <p className="text-sm text-slate-300 font-medium">Đang tải...</p>
        </div>
      }
    >
      <RedirectHandler />
    </Suspense>
  );
}
