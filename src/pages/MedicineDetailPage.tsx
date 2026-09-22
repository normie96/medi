import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Pill,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Globe,
  Info,
  Layers,
  Sparkles
} from "lucide-react";
import { api } from "../services/api.js";
import { Medicine, PrescriptionMatchResult } from "../types/index.js";
import { SpeechButton } from "../components/SpeechButton.js";
import { PrescriptionMatchModal } from "../components/PrescriptionMatchModal.js";
import { useLanguage } from "../contexts/LanguageContext.js";
import { useAccessibility } from "../contexts/AccessibilityContext.js";

export const MedicineDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { simpleMode, contrastMode } = useAccessibility();

  const [medicine, setMedicine] = useState<Medicine | null>(null);
  const [activeLangTab, setActiveLangTab] = useState<"en" | "hi" | "kha">("en");
  const [matchResult, setMatchResult] = useState<PrescriptionMatchResult | null>(null);
  const [isMatchModalOpen, setIsMatchModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      api.getMedicineById(id).then((med) => {
        setMedicine(med);
        setIsLoading(false);
      });
    }
  }, [id]);

  if (isLoading || !medicine) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-slate-500">
        Loading medicine details...
      </div>
    );
  }

  const handleMatch = async () => {
    try {
      const res = await api.matchPrescription(medicine.genericName, medicine.strength);
      setMatchResult(res);
      setIsMatchModalOpen(true);
    } catch (e) {
      console.error(e);
    }
  };

  // Build audio text
  const audioText = `${medicine.genericName} ${medicine.strength}. Used for: ${medicine.usedFor}. What does it do: ${
    medicine.simpleExplanation || medicine.generalPurpose
  }. Common uses: ${medicine.commonUses}. Side effects: ${medicine.commonSideEffects}. Precautions: ${
    medicine.precautions
  }.`;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Back Button */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to medicines</span>
      </button>

      {/* Main Header Card */}
      <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-4">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-start gap-3">
            <div className="p-3 bg-teal-50 text-teal-600 rounded-2xl shrink-0">
              <Pill className="w-7 h-7" />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-extrabold text-slate-900">{medicine.genericName}</h1>
                <span className="text-sm font-bold px-3 py-1 rounded-full bg-teal-100 text-teal-800">
                  {medicine.strength}
                </span>
                <span className="text-2xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  {medicine.form}
                </span>
              </div>

              {medicine.brandName && (
                <p className="text-xs text-slate-500 mt-1">
                  Common Brand: <span className="font-semibold text-slate-700">{medicine.brandName}</span>
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <SpeechButton
              text={audioText}
              language={activeLangTab}
              size="md"
              label={t("btnListen")}
            />

            <button
              type="button"
              onClick={handleMatch}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-2xs transition cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Match Prescription</span>
            </button>
          </div>
        </div>

        {/* CRITICAL REQUIREMENT: "Used for" prominently highlighted right below name */}
        <div className="p-4 bg-teal-50 border-2 border-teal-200 rounded-xl space-y-1">
          <span className="text-2xs font-extrabold text-teal-900 uppercase tracking-wider flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4 text-teal-600" />
            <span>{t("usedForLabel")}</span>
          </span>
          <p className="text-base font-bold text-teal-950 leading-relaxed">
            {medicine.usedFor}
          </p>
        </div>
      </div>

      {/* Language Switcher for Translation Tab */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mr-2">
          <Globe className="w-3.5 h-3.5" /> View in:
        </span>
        <button
          type="button"
          onClick={() => setActiveLangTab("en")}
          className={`px-3 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition ${
            activeLangTab === "en" ? "bg-teal-600 text-white" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          English
        </button>
        <button
          type="button"
          onClick={() => setActiveLangTab("hi")}
          className={`px-3 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition ${
            activeLangTab === "hi" ? "bg-teal-600 text-white" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          हिन्दी (Hindi)
        </button>
        <button
          type="button"
          onClick={() => setActiveLangTab("kha")}
          className={`px-3 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition ${
            activeLangTab === "kha" ? "bg-teal-600 text-white" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          Ka Ktien Khasi
        </button>
      </div>

      {/* Multilingual Translation Banner */}
      {activeLangTab !== "en" && (
        <div className="p-4 bg-slate-900 text-white rounded-2xl shadow-sm space-y-1">
          <span className="text-2xs font-bold uppercase tracking-wider text-teal-300">
            {activeLangTab === "hi" ? "हिन्दी अनुवाद (Hindi Translation)" : "Ka Jingpynkylla Khasi (Khasi Translation)"}
          </span>
          <p className="text-sm leading-relaxed font-medium">
            {activeLangTab === "hi"
              ? medicine.hindiTranslation || "हिंदी विवरण उपलब्ध नहीं है।"
              : medicine.khasiTranslation || "Jingthoh Khasi thikna la kynshew na ka bynta une u dawai."}
          </p>
        </div>
      )}

      {/* Detailed Pharmacology Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* What does it do? */}
        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
            <Info className="w-4 h-4 text-teal-600" />
            <span>{t("whatDoesItDoLabel")}</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            {medicine.simpleExplanation || medicine.generalPurpose}
          </p>
        </div>

        {/* Drug Class & Category */}
        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
            <Layers className="w-4 h-4 text-teal-600" />
            <span>Pharmacological Class</span>
          </div>
          <p className="text-xs text-slate-700 font-semibold">{medicine.drugClass}</p>
          <p className="text-2xs text-slate-400">
            Form: {medicine.form} • Requires Prescription: {medicine.prescriptionRequired ? "Yes (Rx)" : "No (OTC)"}
          </p>
        </div>

        {/* Common Uses */}
        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Common Prescribed Uses</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">{medicine.commonUses}</p>
        </div>

        {/* Common Side Effects */}
        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span>{t("sideEffectsLabel")}</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">{medicine.commonSideEffects}</p>
        </div>
      </div>

      {/* Important Precautions */}
      <div className="p-5 bg-amber-50/60 border border-amber-200 rounded-2xl space-y-2">
        <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
          <ShieldCheck className="w-4 h-4 text-amber-600" />
          <span>{t("precautionsLabel")}</span>
        </div>
        <p className="text-xs text-amber-950 leading-relaxed">{medicine.precautions}</p>
      </div>

      {/* Prescription Match Modal */}
      <PrescriptionMatchModal
        result={matchResult}
        isOpen={isMatchModalOpen}
        onClose={() => setIsMatchModalOpen(false)}
      />
    </div>
  );
};
