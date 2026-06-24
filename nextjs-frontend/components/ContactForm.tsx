"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

const ContactForm = () => {
  const { t } = useLanguage();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");

    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.get("fullName"),
          email: formData.get("email"),
          subject: formData.get("subject"),
          message: formData.get("message"),
        }),
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.message);
      setStatus("success");
      setMessage(result.message);
      (e.target as HTMLFormElement).reset();
    } catch {
      setStatus("error");
      setMessage(t("contact_error"));
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 rounded-3xl border border-gray-10 dark:border-stone-700 bg-white dark:bg-stone-800 p-8 shadow-sm"
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="regular-14 text-gray-30 dark:text-stone-400">{t("contact_fullname")} *</span>
          <input
            name="fullName"
            required
            className="rounded-xl border border-gray-10 dark:border-stone-600 px-4 py-3 regular-16 outline-none focus:border-green-50 bg-white dark:bg-stone-700 text-gray-90 dark:text-stone-100 placeholder:text-gray-20 dark:placeholder:text-stone-500"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="regular-14 text-gray-30 dark:text-stone-400">{t("contact_email")} *</span>
          <input
            name="email"
            type="email"
            required
            className="rounded-xl border border-gray-10 dark:border-stone-600 px-4 py-3 regular-16 outline-none focus:border-green-50 bg-white dark:bg-stone-700 text-gray-90 dark:text-stone-100 placeholder:text-gray-20 dark:placeholder:text-stone-500"
          />
        </label>
      </div>

      <label className="flex flex-col gap-2">
        <span className="regular-14 text-gray-30 dark:text-stone-400">{t("contact_subject")} *</span>
        <input
          name="subject"
          required
          placeholder={t("contact_subject_placeholder")}
          className="rounded-xl border border-gray-10 dark:border-stone-600 px-4 py-3 regular-16 outline-none focus:border-green-50 placeholder:text-gray-20 dark:placeholder:text-stone-500 bg-white dark:bg-stone-700 text-gray-90 dark:text-stone-100"
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className="regular-14 text-gray-30 dark:text-stone-400">{t("contact_message")} *</span>
        <textarea
          name="message"
          rows={5}
          required
          placeholder={t("contact_message_placeholder")}
          className="rounded-xl border border-gray-10 dark:border-stone-600 px-4 py-3 regular-16 outline-none focus:border-green-50 placeholder:text-gray-20 dark:placeholder:text-stone-500 bg-white dark:bg-stone-700 text-gray-90 dark:text-stone-100"
        />
      </label>

      {status === "success" && (
        <p className="regular-14 rounded-xl bg-green-50/10 p-4 text-green-50">
          {message}
        </p>
      )}
      {status === "error" && (
        <p className="regular-14 rounded-xl bg-red-50/10 p-4 text-red-600">
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="btn_green rounded-full py-4 bold-16 disabled:opacity-60"
      >
        {status === "loading" ? t("contact_sending") : t("contact_submit")}
      </button>
    </form>
  );
};

export default ContactForm;
