"use client";

import AuthLayout, {
  AuthError,
  AuthInput,
  AuthSubmit,
} from "@/components/AuthLayout";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { useLanguage } from "@/context/LanguageContext";

function LoginMessageChecker() {
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const { t } = useLanguage();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (checked) return;
    const confirmed = searchParams.get("confirmed");
    if (confirmed === "true") {
      showToast(t("auth_verify_success_toast"), "success");
    }
    setChecked(true);
  }, [searchParams, showToast, checked, t]);

  return null;
}

export default function LoginPage() {
  const { login, user, loading: authLoading } = useAuth();
  const { showToast } = useToast();
  const { t } = useLanguage();
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

  const handleSocialLogin = (provider: "google" | "facebook") => {
    window.location.href = `${STRAPI_URL}/api/connect/${provider}`;
  };

  useEffect(() => {
    if (!authLoading && user) router.replace("/profile");
  }, [user, authLoading, router]);

  if (authLoading || user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-90">
        <div className="h-9 w-9 animate-spin rounded-full border-2 border-green-50 border-t-transparent" />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    try {
      await login(
        formData.get("email") as string,
        formData.get("password") as string
      );
      showToast(t("auth_login_success_toast"), "success");
      router.push("/profile");
    } catch (err) {
      const msg = err instanceof Error ? err.message : t("auth_login_failed_toast");
      setError(msg);
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title={t("auth_login_welcome")}
      subtitle={t("auth_login_subtitle")}
      footer={
        <p className="text-center text-sm text-gray-30">
          {t("auth_no_account")}{" "}
          <Link
            href="/register"
            className="font-semibold text-green-50 transition-colors hover:text-emerald-600"
          >
            {t("auth_register_free")}
          </Link>
        </p>
      }
    >
      <Suspense fallback={null}>
        <LoginMessageChecker />
      </Suspense>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <AuthInput
          label={t("auth_email")}
          name="email"
          type="email"
          icon="email"
          required
          placeholder="ban@email.com"
          autoComplete="email"
        />
        <AuthInput
          label={t("auth_password")}
          name="password"
          type="password"
          icon="lock"
          required
          minLength={6}
          placeholder="••••••••"
          autoComplete="current-password"
        />
        <div className="text-right -mt-2">
          <Link
            href="/forgot-password"
            className="text-xs font-semibold text-green-50 hover:underline"
          >
            {t("auth_forgot_link")}
          </Link>
        </div>

        {error && <AuthError message={error} />}
        <AuthSubmit
          loading={loading}
          label={t("auth_btn_login")}
          loadingLabel={t("auth_loading_login")}
        />
      </form>

      <div className="relative flex py-4 items-center">
        <div className="flex-grow border-t border-gray-200 dark:border-stone-850"></div>
        <span className="flex-shrink mx-4 text-gray-400 text-xs uppercase tracking-wider font-semibold">Hoặc đăng nhập bằng</span>
        <div className="flex-grow border-t border-gray-200 dark:border-stone-850"></div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => handleSocialLogin("google")}
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-stone-750 bg-white dark:bg-stone-850 py-3 text-xs font-bold text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-stone-800 transition-all duration-200 active:scale-95 cursor-pointer shadow-sm"
        >
          <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582l3.51-3.51C17.645 1.09 14.973 0 12 0 7.354 0 3.373 2.667 1.418 6.564l3.848 3.201z"
            />
            <path
              fill="#4285F4"
              d="M23.455 12.273c0-.818-.082-1.609-.227-2.373H12v4.582h6.427a5.52 5.52 0 0 1-2.396 3.618l3.714 2.882c2.173-2 3.71-4.945 3.71-8.709z"
            />
            <path
              fill="#FBBC05"
              d="M5.266 14.235A7.09 7.09 0 0 1 4.909 12c0-.79.136-1.545.357-2.235L1.418 6.564A11.968 11.968 0 0 0 0 12c0 1.92.455 3.73 1.259 5.345l4.007-3.11z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.955-1.073 7.945-2.918l-3.714-2.882c-1.028.69-2.35.109-4.231.109-3.082 0-5.7-2.082-6.632-4.918L1.52 16.51c1.955 3.9 5.936 6.564 10.48 6.564z"
            />
          </svg>
          Google
        </button>
        <button
          type="button"
          onClick={() => handleSocialLogin("facebook")}
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-stone-750 bg-white dark:bg-stone-850 py-3 text-xs font-bold text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-stone-800 transition-all duration-200 active:scale-95 cursor-pointer shadow-sm"
        >
          <svg className="h-5 w-5 shrink-0 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          Facebook
        </button>
      </div>
    </AuthLayout>
  );
}
