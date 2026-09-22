import React, { useState } from "react";
import { Pill, AlertCircle, ChevronRight, CheckCircle2, Clock, Calendar } from "lucide-react";
import { Medicine } from "../types/index.js";
import { SpeechButton } from "./SpeechButton.js";
import { useLanguage } from "../contexts/LanguageContext.js";
import { useAccessibility } from "../contexts/AccessibilityContext.js";

interface MedicineCardProps {
  medicine: Partial<Medicine> & {
    dose?: string;
    frequency?: string;
    timing?: string;
    duration?: string;
  };
  onSelect?: () => void;
  showScheduleInfo?: boolean;
  className?: string;
}

export const MedicineCard: React.FC<MedicineCardProps> = ({
  medicine,
  onSelect,
  showScheduleInfo = false,
  className = ""
}) => {
  const { language, t } = useLanguage();
  const { simpleMode, contrastMode } = useAccessibility();
  const [showTranslated, setShowTranslated] = useState(false);

  const isHighContrast = contrastMode === "HIGH_CONTRAST";

  // Verified "Used for" field
  const verifiedUsedFor =
    medicine.usedFor ||
    medicine.generalPurpose ||
    "Medicine use information is currently unavailable.";

  // Determine localized used for text if available
  let displayUsedFor = verifiedUsedFor;
  if (showTranslated || language !== "en") {
    if (language === "hi" && medicine.hindiTranslation) {
      displayUsedFor = medicine.hindiTranslation;
    } else if (language === "kha" && medicine.khasiTranslation) {
      displayUsedFor = medicine.khasiTranslation;
    }
  }

  // Construct audio text
  const speechText = `${medicine.genericName || medicine.brandName || "Medicine"} ${medicine.strength || ""}. Used for: ${displayUsedFor}. ${
    medicine.dose ? `Dose: ${medicine.dose}.` : ""
  } ${medicine.timing ? `Timing: ${medicine.timing}.` : ""}`;

  return (
    <div
      className={`rounded-2xl transition-all duration-200 border p-5 ${
        isHighContrast
          ? "bg-slate-800 border-slate-600 text-white shadow-md"
          : "bg-white border-slate-200/90 shadow-xs hover:shadow-md hover:border-teal-300"
      } ${className}`}
    >
      {/* Top Header: Medicine Name & Strength */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div
            className={`p-2.5 rounded-xl shrink-0 ${
              isHighContrast ? "bg-teal-900/60 text-teal-300" : "bg-teal-50 text-teal-600"
            }`}
          >
            <Pill className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className={`font-bold text-lg leading-tight ${isHighContrast ? "text-white" : "text-slate-900"}`}>
                {medicine.genericName || medicine.brandName}
              </h3>
              {medicine.strength && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-100/90 text-teal-800">
                  {medicine.strength}
                </span>
              )}
            </div>

            {medicine.brandName && medicine.brandName !== medicine.genericName && (
              <p className="text-xs text-slate-500 mt-0.5">
                Brand: <span className="font-medium text-slate-600">{medicine.brandName}</span>
              </p>
            )}
          </div>
        </div>

        {/* Prescription badge */}
        {medicine.prescriptionRequired !== undefined && (
          <span
            className={`text-2xs font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${
              medicine.prescriptionRequired
                ? "bg-amber-50 text-amber-800 border border-amber-200"
                : "bg-emerald-50 text-emerald-800 border border-emerald-200"
            }`}
          >
            {medicine.prescriptionRequired ? "Rx Only" : "OTC"}
          </span>
        )}
      </div>

      {/* CRITICAL REQUIREMENT: "Used for" directly beneath the medicine name */}
      <div className="mt-3.5 p-3 rounded-xl bg-teal-50/60 border border-teal-100">
        <div className="text-xs font-bold text-teal-900 uppercase tracking-wider flex items-center gap-1 mb-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
          <span>{t("usedForLabel")}</span>
        </div>
        <p className={`text-sm leading-relaxed ${isHighContrast ? "text-slate-100 font-medium" : "text-teal-950 font-medium"}`}>
          {displayUsedFor}
        </p>
      </div>

      {/* Prescribed details if available */}
      {(medicine.dose || medicine.frequency || medicine.timing || medicine.duration) && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-3 pt-3 border-t border-slate-100 text-xs">
          {medicine.dose && (
            <div>
              <span className="text-slate-400 block font-medium">{t("doseLabel")}</span>
              <span className="font-semibold text-slate-800">{medicine.dose}</span>
            </div>
          )}
          {medicine.frequency && (
            <div>
              <span className="text-slate-400 block font-medium">{t("frequencyLabel")}</span>
              <span className="font-semibold text-slate-800">{medicine.frequency}</span>
            </div>
          )}
          {medicine.timing && (
            <div>
              <span className="text-slate-400 block font-medium">{t("timingLabel")}</span>
              <span className="font-semibold text-slate-800">{medicine.timing}</span>
            </div>
          )}
          {medicine.duration && (
            <div>
              <span className="text-slate-400 block font-medium">{t("durationLabel")}</span>
              <span className="font-semibold text-slate-800">{medicine.duration}</span>
            </div>
          )}
        </div>
      )}

      {/* Action Row: [View Details] [Listen] [Translate] */}
      <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-100 flex-wrap">
        <div className="flex items-center gap-2">
          {/* Reusable SpeechButton */}
          <SpeechButton
            text={speechText}
            language={language}
            size="sm"
            label={t("btnListen")}
          />

          {/* Translation button */}
          <button
            type="button"
            onClick={() => setShowTranslated(!showTranslated)}
            className="px-2.5 py-1 text-xs font-medium rounded-full border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            {showTranslated ? "Original" : t("btnTranslate")}
          </button>
        </div>

        {onSelect && (
          <button
            type="button"
            onClick={onSelect}
            className="inline-flex items-center gap-1 text-xs font-semibold text-teal-700 hover:text-teal-900 cursor-pointer hover:underline"
          >
            <span>{t("btnViewDetails")}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
