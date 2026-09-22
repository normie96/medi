import React from "react";
import { ShieldCheck, Heart, AlertTriangle } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext.js";

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-white border-t border-slate-200 mt-20 pt-12 pb-16 text-slate-600 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Medical Safety Disclaimer Banner */}
        <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl flex items-start gap-3 text-amber-950">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-xs uppercase tracking-wider text-amber-900">
              Important Medical Safety Disclaimer
            </h4>
            <p className="text-xs leading-relaxed text-amber-900">
              {t("medicalSafetyDisclaimer")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-sm">
                M
              </div>
              <span className="font-extrabold text-base text-slate-900">MediLens</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed max-w-md">
              A comprehensive healthcare accessibility platform helping patients understand complex prescriptions, verify medicines, customize reminder schedules safely, and access medical guidance in English, Hindi, and Khasi.
            </p>
            <div className="flex items-center gap-2 text-2xs text-teal-800 font-semibold">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>Verified Medical Council Directory & Phrase Database</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="font-bold text-slate-900 uppercase tracking-wider text-2xs mb-3">
              Core Modules
            </h5>
            <ul className="space-y-2 text-slate-600">
              <li>
                <a href="/scan" className="hover:text-teal-700">Prescription OCR Scanner</a>
              </li>
              <li>
                <a href="/medicines" className="hover:text-teal-700">Medicine Purpose Directory</a>
              </li>
              <li>
                <a href="/schedule" className="hover:text-teal-700">Medication Timelines</a>
              </li>
              <li>
                <a href="/doctors" className="hover:text-teal-700">Verified Doctor Directory</a>
              </li>
            </ul>
          </div>

          {/* Languages & Accessibility */}
          <div>
            <h5 className="font-bold text-slate-900 uppercase tracking-wider text-2xs mb-3">
              Supported Languages
            </h5>
            <ul className="space-y-1.5 text-slate-600">
              <li>• English (Accessible Plain English)</li>
              <li>• हिन्दी (Hindi Medical Phrases)</li>
              <li>• Ka Ktien Khasi (Curated Verified Lexicon)</li>
            </ul>
            <div className="mt-4 pt-3 border-t border-slate-100 text-2xs text-slate-400">
              WCAG 2.1 AA Compliant • Screen Reader Friendly
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 flex items-center justify-between text-2xs text-slate-400 flex-wrap gap-2">
          <p>© {new Date().getFullYear()} MediLens Healthcare Accessibility. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built for inclusive patient care and accessibility
          </p>
        </div>
      </div>
    </footer>
  );
};
