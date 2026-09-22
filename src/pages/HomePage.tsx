import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  Pill,
  Clock,
  Stethoscope,
  ShieldCheck,
  CheckCircle2,
  Volume2,
  Globe,
  Sparkles,
  ArrowRight,
  HeartHandshake
} from "lucide-react";
import { MedicineCard } from "../components/MedicineCard.js";
import { Medicine } from "../types/index.js";
import { api } from "../services/api.js";
import { useLanguage } from "../contexts/LanguageContext.js";
import { useAccessibility } from "../contexts/AccessibilityContext.js";

export const HomePage: React.FC = () => {
  const { t } = useLanguage();
  const { simpleMode } = useAccessibility();
  const [featuredMedicines, setFeaturedMedicines] = useState<Medicine[]>([]);

  useEffect(() => {
    api.getMedicines().then((meds) => {
      // Pick 3 representative medicines (e.g. Pantoprazole, Paracetamol, Amoxicillin)
      setFeaturedMedicines(meds.slice(0, 3));
    });
  }, []);

  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto px-4 space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200/90 text-teal-800 text-xs font-bold shadow-2xs">
          <Sparkles className="w-4 h-4 text-teal-600" />
          <span>Inclusive Healthcare Accessibility Platform</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          {t("tagline")}
        </h1>

        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          {t("subtitle")}
        </p>

        {/* Primary Action Buttons */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap pt-2">
          <Link
            to="/scan"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md transition transform hover:-translate-y-0.5 cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>{t("btnScanPrescription")}</span>
          </Link>

          <Link
            to="/medicines"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm border border-slate-300 shadow-xs transition transform hover:-translate-y-0.5 cursor-pointer"
          >
            <Pill className="w-4 h-4 text-teal-600" />
            <span>{t("btnIdentifyMedicine")}</span>
          </Link>

          <Link
            to="/doctors"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm border border-slate-200 shadow-2xs transition cursor-pointer"
          >
            <Stethoscope className="w-4 h-4 text-teal-700" />
            <span>{t("btnFindDoctor")}</span>
          </Link>
        </div>
      </section>

      {/* Feature Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Prescription OCR</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Extract handwriting, doctor registration credentials, and dosage timings with verified medicine cross-checks.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
              <Pill className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">"Used For" Clarity</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Never guess what a medicine does. Every medicine shows verified medical purpose directly underneath the name.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Customizable Schedule</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Personalize reminders to your lifestyle while keeping the doctor's verified prescription completely intact.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
              <Globe className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">English, Hindi & Khasi</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Curated medical lexicons and voice playback support for elderly patients and multilingual communities.
            </p>
          </div>
        </div>
      </section>

      {/* Verified Medicines Section showcasing CRITICAL FEATURE 1 ("Used for" right under name) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
              Verified Medical Catalog
            </span>
            <h2 className="text-2xl font-bold text-slate-900 mt-1">
              Know Exactly What Each Medicine Does
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified purposes are displayed right on the card so you never have to search blindly.
            </p>
          </div>

          <Link
            to="/medicines"
            className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-teal-700 hover:text-teal-900"
          >
            <span>Browse All Verified Medicines</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {featuredMedicines.map((med) => (
            <MedicineCard
              key={med.id}
              medicine={med}
              onSelect={() => (window.location.href = `/medicines/${med.id}`)}
            />
          ))}
        </div>
      </section>

      {/* Multilingual & Safety Commitment */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 bg-teal-900 text-white rounded-3xl shadow-xl space-y-6">
          <div className="max-w-2xl space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-800 text-teal-200">
              <ShieldCheck className="w-3.5 h-3.5" />
              Safety & Verification Guarantee
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Designed for Patient Dignity & Safety
            </h2>
            <p className="text-sm text-teal-100 leading-relaxed">
              MediLens never substitutes medications, alters medical dosages, or invents unsupported medical advice. When handwriting is unclear, we flag it immediately for your verification.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-teal-800 text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
              <span>Verified Medical Council registry IDs</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
              <span>Curated Khasi & Hindi medical phrases</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
              <span>Audio speech playback for all instructions</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
