"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { messages, translate, type Language } from "@/lib/translations";

type LanguageContextValue = { language: Language; setLanguage: (language: Language) => void; t: (key: string) => string };
const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setSelectedLanguage] = useState<Language>("uz");
  useEffect(() => {
    const saved = localStorage.getItem("quickstay:language");
    if (saved === "uz" || saved === "ru" || saved === "en") setSelectedLanguage(saved);
  }, []);
  const setLanguage = useCallback((selected: Language) => {
    setSelectedLanguage(selected);
    localStorage.setItem("quickstay:language", selected);
    document.documentElement.lang = selected;
  }, []);
  const value = useMemo(() => ({
    language,
    setLanguage,
    t: (key: string) => translate(messages[language], key),
  }), [language, setLanguage]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used inside LanguageProvider.");
  return context;
}
