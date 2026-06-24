"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { TRANSLATIONS, Locale, TranslationKey } from "@/constants/translations";

interface LanguageContextProps {
  language: Locale;
  setLanguage: (lang: Locale) => void;
  t: (key: TranslationKey, variables?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Locale>("vi");

  useEffect(() => {
    const savedLang = localStorage.getItem("language") as Locale;
    if (savedLang === "vi" || savedLang === "en") {
      setLanguageState(savedLang);
      document.cookie = `locale=${savedLang}; path=/; max-age=31536000; SameSite=Lax`;
    } else {
      document.cookie = `locale=vi; path=/; max-age=31536000; SameSite=Lax`;
    }
  }, []);

  const setLanguage = (lang: Locale) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
    document.cookie = `locale=${lang}; path=/; max-age=31536000; SameSite=Lax`;
    window.location.reload();
  };

  const t = (key: TranslationKey, variables?: Record<string, string | number>): string => {
    const dictionary = TRANSLATIONS[language] || TRANSLATIONS.vi;
    let translation = (dictionary as any)[key] || (TRANSLATIONS.vi as any)[key] || key;

    if (variables) {
      Object.entries(variables).forEach(([k, v]) => {
        translation = translation.replace(`{${k}}`, String(v));
      });
    }

    return translation;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
