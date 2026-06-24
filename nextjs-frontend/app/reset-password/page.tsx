"use client";

import AuthLayout, { AuthInput, AuthError, AuthSubmit } from "@/components/AuthLayout";
import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/context/ToastContext";
import { useLanguage } from "@/context/LanguageContext";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { showToast } = useToast();
  const { t } = useLanguage();
  
  const code = searchParams.get("code");
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) {
      setError(t("auth_reset_invalid_code"));
      return;
    }

    if (password.length < 6) {
      setError(t("auth_reset_password_length"));
      return;
    }

    if (password !== confirmPassword) {
      setError(t("auth_passwords_mismatch"));
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          password,
          passwordConfirmation: confirmPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || t("auth_reset_error"));
      }

      setSuccess(true);
      showToast(t("auth_reset_success_toast"), "success");
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err: any) {
      setError(err.message || t("auth_login_failed_toast"));
    } finally {
      setLoading(false);
    }
  };

  if (!code) {
    return (
      <div className="flex flex-col gap-4 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-2xl text-red-500">
          ⚠️
        </div>
        <h3 className="text-lg font-bold text-slate-800">{t("auth_reset_missing_code")}</h3>
        <p className="text-sm leading-relaxed text-slate-500">
          {t("auth_reset_invalid_request")}
        </p>
        <Link
          href="/forgot-password"
          className="mt-4 rounded-2xl bg-green-50 py-3 text-sm font-semibold text-white shadow-md shadow-green-50/20 transition-all hover:bg-emerald-600 flex items-center justify-center"
        >
          {t("auth_reset_request_new")}
        </Link>
      </div>
    );
  }

  return (
    <>
      {success ? (
        <div className="flex flex-col gap-4 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-2xl text-emerald-600">
            ✓
          </div>
          <h3 className="text-lg font-bold text-slate-800">{t("auth_reset_success_title")}</h3>
          <p className="text-sm leading-relaxed text-slate-500">
            {t("auth_reset_success_desc")}
          </p>
          <Link
            href="/login"
            className="mt-4 rounded-2xl bg-green-50 py-3 text-sm font-semibold text-white shadow-md shadow-green-50/20 transition-all hover:bg-emerald-600 flex items-center justify-center"
          >
            {t("auth_login_now")}
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {error && <AuthError message={error} />}

          <AuthInput
            label={t("auth_reset_label_new_pass")}
            icon="lock"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t("auth_placeholder_password")}
          />

          <AuthInput
            label={t("auth_reset_label_confirm_new_pass")}
            icon="lock"
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder={t("auth_placeholder_confirm_password")}
          />

          <AuthSubmit
            loading={loading}
            label={t("auth_reset_confirm_btn")}
            loadingLabel={t("auth_loading_register")}
          />
        </form>
      )}
    </>
  );
}

export default function ResetPasswordPage() {
  const { t } = useLanguage();

  return (
    <AuthLayout
      title={t("auth_reset_title")}
      subtitle={t("auth_reset_desc")}
      footer={
        <div className="text-center text-[14px] text-slate-500">
          {t("auth_forgot_back")}{" "}
          <Link href="/login" className="font-semibold text-green-50 hover:underline">
            {t("auth_btn_login")}
          </Link>
        </div>
      }
    >
      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center py-10 gap-2">
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs text-slate-400">{t("auth_reset_processing_request")}</span>
          </div>
        }
      >
        <ResetPasswordForm />
      </Suspense>
    </AuthLayout>
  );
}
