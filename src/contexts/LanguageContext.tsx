import React, { createContext, useContext, useState, useEffect } from "react";
import { LanguageCode } from "../types/index.js";
import { UI_TRANSLATIONS } from "../i18n/translations.js";
import { api } from "../services/api.js";

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;
  translateDynamic: (text: string) => Promise<string>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    const saved = localStorage.getItem("medilens_language");
    return (saved as LanguageCode) || "en";
  });

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    localStorage.setItem("medilens_language", lang);
  };

  const t = (key: string): string => {
    const entry = UI_TRANSLATIONS[key];
    if (!entry) return key;
    return entry[language] || entry.en || key;
  };

  const translateDynamic = async (text: string): Promise<string> => {
    if (language === "en" || !text) return text;
    try {
      const res = await api.translateText(text, language);
      return res.translatedText || text;
    } catch (e) {
      return text;
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, translateDynamic }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};
