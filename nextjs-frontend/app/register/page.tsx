"use client";

import AuthLayout, {
  AuthError,
  AuthInput,
  AuthSubmit,
} from "@/components/AuthLayout";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function RegisterPage() {
  const { register, user, loading: authLoading } = useAuth();
  const { showToast } = useToast();
  const { t } = useLanguage();
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

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
    const password = formData.get("password") as string;
    const confirm = formData.get("confirmPassword") as string;

    if (password !== confirm) {
      setError(t("auth_passwords_mismatch"));
      showToast(t("auth_passwords_mismatch"), "error");
      setLoading(false);
      return;
    }

    const email = formData.get("email") as string;
    const username =
      (formData.get("username") as string) ||
      email.split("@")[0].replace(/[^a-zA-Z0-9_]/g, "");

    try {
      const data = await register({
        username,
        email,
        password,
        fullName: formData.get("fullName") as string,
        phone: (formData.get("phone") as string) || undefined,
      });
      
      if (data?.verifyEmailRequired) {
        setSuccessMessage(t("auth_register_success_email"));
        showToast(t("auth_verify_email_toast"), "info");
      } else {
        showToast(t("auth_register_success_auto"), "success");
        router.push("/profile");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : t("auth_register_failed_toast");
      setError(msg);
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      wide
      title={successMessage ? t("auth_check_email") : t("auth_register_title")}
      subtitle={successMessage ? t("auth_verify_desc") : ""}
      footer={
        <p className="text-center text-sm text-gray-30">
          {t("auth_have_account")}{" "}
          <Link
            href="/login"
            className="font-semibold text-green-50 transition-colors hover:text-emerald-600"
          >
            {t("auth_login_now")}
          </Link>
        </p>
      }
    >
      {successMessage ? (
        <div className="flex flex-col gap-4 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-2xl text-emerald-600">
            ✉️
          </div>
          <h3 className="text-lg font-bold text-gray-90">{t("auth_verify_account")}</h3>
          <p className="text-sm leading-relaxed text-gray-30">
            {successMessage}
          </p>
          <Link
            href="/login"
            className="mt-6 rounded-2xl bg-green-50 py-3.5 text-sm font-semibold text-white shadow-md shadow-green-50/20 transition-all hover:bg-emerald-600 flex items-center justify-center"
          >
            {t("auth_go_to_login")}
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Left Column */}
            <div className="flex flex-col gap-4">
              <AuthInput
                label={t("auth_fullname")}
                name="fullName"
                icon="user"
                required
                placeholder="Nguyễn Văn A"
                autoComplete="name"
              />
              <AuthInput
                label={t("auth_username")}
                name="username"
                icon="at"
                minLength={3}
                placeholder="username"
                autoComplete="username"
              />
              <AuthInput
                label={t("auth_phone")}
                name="phone"
                icon="phone"
                placeholder="0901234567"
                autoComplete="tel"
              />
            </div>

            {/* Right Column */}
            <div className="flex flex-col gap-4">
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
                placeholder={t("auth_placeholder_password")}
                autoComplete="new-password"
              />
              <AuthInput
                label={t("auth_confirm_password")}
                name="confirmPassword"
                type="password"
                icon="lock"
                required
                minLength={6}
                placeholder={t("auth_placeholder_confirm_password")}
                autoComplete="new-password"
              />
            </div>
          </div>

          {error && <AuthError message={error} />}
          <AuthSubmit
            loading={loading}
            label={t("auth_btn_register")}
            loadingLabel={t("auth_loading_register")}
          />
        </form>
      )}

      {!successMessage && (
        <>
          <div className="relative flex py-4 items-center">
            <div className="flex-grow border-t border-gray-200 dark:border-stone-850"></div>
            <span className="flex-shrink mx-4 text-gray-400 text-xs uppercase tracking-wider font-semibold">Hoặc đăng ký bằng</span>
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
        </>
      )}
    </AuthLayout>
  );
}
