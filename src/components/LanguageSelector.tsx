import React from "react";
import { Globe } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext.js";
import { LanguageCode } from "../types/index.js";

interface LanguageSelectorProps {
  compact?: boolean;
  className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ compact = false, className = "" }) => {
  const { language, setLanguage } = useLanguage();

  const languages: { code: LanguageCode; label: string; native: string }[] = [
    { code: "en", label: "English", native: "English" },
    { code: "hi", label: "Hindi", native: "हिन्दी" },
    { code: "kha", label: "Khasi", native: "Khasi" }
  ];

  if (compact) {
    return (
      <div className={`flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200 ${className}`}>
        {languages.map((l) => (
          <button
            key={l.code}
            type="button"
            onClick={() => setLanguage(l.code)}
            className={`px-2 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              language === l.code
                ? "bg-white text-teal-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {l.native}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
        <Globe className="w-3.5 h-3.5 text-teal-600" /> Language:
      </span>
      <div className="inline-flex rounded-lg bg-slate-100 p-1 border border-slate-200 shadow-2xs">
        {languages.map((l) => (
          <button
            key={l.code}
            type="button"
            onClick={() => setLanguage(l.code)}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              language === l.code
                ? "bg-teal-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
            }`}
          >
            {l.native}
          </button>
        ))}
      </div>
    </div>
  );
};
