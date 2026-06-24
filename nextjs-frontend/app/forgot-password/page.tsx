"use client";

import AuthLayout, { AuthInput, AuthError, AuthSubmit } from "@/components/AuthLayout";
import { useState } from "react";
import Link from "next/link";
import { useToast } from "@/context/ToastContext";
import { useLanguage } from "@/context/LanguageContext";

export default function ForgotPasswordPage() {
  const { showToast } = useToast();
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || t("auth_forgot_error"));
      }

      setSuccess(true);
      showToast(t("auth_forgot_success_toast"), "success");
    } catch (err: any) {
      setError(err.message || t("auth_login_failed_toast"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title={t("auth_forgot_title")}
      subtitle={t("auth_forgot_desc")}
      footer={
        <div className="text-center text-[14px] text-slate-500">
          {t("auth_forgot_back")}{" "}
          <Link href="/login" className="font-semibold text-green-50 hover:underline">
            {t("auth_btn_login")}
          </Link>
        </div>
      }
    >
      {success ? (
        <div className="flex flex-col gap-4 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-2xl text-emerald-600">
            ✉️
          </div>
          <h3 className="text-lg font-bold text-slate-800">{t("auth_check_inbox")}</h3>
          <p className="text-sm leading-relaxed text-slate-500">
            {t("auth_check_inbox_desc").replace("{email}", email)}
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {error && <AuthError message={error} />}
          
          <AuthInput
            label={t("auth_email")}
            icon="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@example.com"
          />

          <AuthSubmit
            loading={loading}
            label={t("auth_forgot_btn")}
            loadingLabel={t("contact_sending")}
          />
        </form>
      )}
    </AuthLayout>
  );
}
