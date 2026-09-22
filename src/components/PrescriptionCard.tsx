import React from "react";
import { FileText, Calendar, Stethoscope, ChevronRight, Trash2, CheckCircle2 } from "lucide-react";
import { Prescription } from "../types/index.js";
import { useAccessibility } from "../contexts/AccessibilityContext.js";

interface PrescriptionCardProps {
  prescription: Prescription;
  onView: () => void;
  onDelete?: () => void;
  className?: string;
}

export const PrescriptionCard: React.FC<PrescriptionCardProps> = ({
  prescription,
  onView,
  onDelete,
  className = ""
}) => {
  const { contrastMode } = useAccessibility();
  const isHighContrast = contrastMode === "HIGH_CONTRAST";

  const formattedDate = new Date(prescription.prescriptionDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });

  return (
    <div
      className={`rounded-2xl p-5 border transition-all duration-200 ${
        isHighContrast
          ? "bg-slate-800 border-slate-600 text-white shadow-md"
          : "bg-white border-slate-200/90 shadow-xs hover:shadow-md hover:border-teal-300"
      } ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-teal-50 text-teal-600 shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base text-slate-900">
                {prescription.doctorName || "Verified Prescription"}
              </h3>
              <span className="text-2xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                Verified
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{formattedDate}</span>
              </div>
              {prescription.doctorHospital && (
                <>
                  <span>•</span>
                  <span>{prescription.doctorHospital}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {onDelete && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 cursor-pointer transition"
            title="Delete Prescription"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Prescribed Medicines Summary */}
      <div className="mt-4 pt-3 border-t border-slate-100">
        <span className="text-2xs font-bold uppercase text-slate-400 tracking-wider block mb-2">
          Prescribed Medicines ({prescription.medicines.length})
        </span>

        <div className="space-y-2">
          {prescription.medicines.map((m) => (
            <div
              key={m.id}
              className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs flex items-center justify-between gap-2"
            >
              <div>
                <span className="font-bold text-slate-800">{m.prescribedName}</span>{" "}
                <span className="text-slate-500">{m.prescribedStrength}</span>
                {m.matchedMedicine?.usedFor && (
                  <p className="text-2xs text-teal-700 line-clamp-1 mt-0.5">
                    Used for: {m.matchedMedicine.usedFor}
                  </p>
                )}
              </div>
              <span className="text-2xs font-semibold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200 shrink-0">
                {m.prescribedFrequency}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
        <button
          type="button"
          onClick={onView}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-900 cursor-pointer"
        >
          <span>View Prescription Details</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
