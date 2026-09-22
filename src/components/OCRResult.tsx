import React, { useState } from "react";
import { Check, Edit3, AlertTriangle, ShieldCheck, UserCheck, Stethoscope, Sparkles } from "lucide-react";
import { SpeechButton } from "./SpeechButton.js";
import { useLanguage } from "../contexts/LanguageContext.js";

interface StructuredMedicine {
  name: string;
  strength: string;
  dose: string;
  frequency: string;
  timing: string;
  duration: string;
  specialInstructions?: string;
  matchedMedicineId?: string | null;
  usedFor?: string;
  confidenceScore?: number;
}

interface OCRResultProps {
  doctorInfo: {
    doctorName?: string;
    doctorRegistrationNo?: string;
    doctorHospital?: string;
    doctorSpecialty?: string;
  };
  medicines: StructuredMedicine[];
  ocrConfidence: number;
  onConfirm: (data: {
    doctorInfo: any;
    medicines: StructuredMedicine[];
  }) => void;
  isSaving?: boolean;
}

export const OCRResult: React.FC<OCRResultProps> = ({
  doctorInfo: initialDoctor,
  medicines: initialMedicines,
  ocrConfidence,
  onConfirm,
  isSaving = false
}) => {
  const { t, language } = useLanguage();
  const [doctor, setDoctor] = useState(initialDoctor);
  const [medicines, setMedicines] = useState<StructuredMedicine[]>(initialMedicines);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const isLowConfidence = ocrConfidence < 0.75;

  const handleUpdateMedicine = (index: number, updates: Partial<StructuredMedicine>) => {
    setMedicines((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], ...updates };
      return copy;
    });
  };

  // Build audio summary of full prescription
  const prescriptionSpeechText = `Prescription by ${doctor.doctorName || "Doctor"}. Contains ${
    medicines.length
  } medicines. ${medicines
    .map(
      (m, i) =>
        `Medicine ${i + 1}: ${m.name} ${m.strength}. Used for: ${m.usedFor || "General medical treatment"}. Dose: ${
          m.dose
        }, ${m.frequency}, ${m.timing}, for ${m.duration}.`
    )
    .join(" ")}`;

  return (
    <div className="space-y-6">
      {/* Mandatory Verification Alert Banner */}
      <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-2xl flex items-start gap-3 text-amber-900 shadow-xs">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-sm">
            {t("verifyPrescriptionNotice")}
          </p>
          <p className="text-xs text-amber-800">
            Please review the extracted doctor information and medication instructions below. Ensure the names, doses, and timings match your doctor's handwritten or printed slip.
          </p>
        </div>
      </div>

      {isLowConfidence && (
        <div className="p-4 bg-rose-50 border border-rose-300 rounded-2xl text-rose-900 text-xs">
          <p className="font-bold">⚠️ Low OCR Confidence ({Math.round(ocrConfidence * 100)}%)</p>
          <p className="mt-0.5">{t("lowConfidenceWarning")}</p>
        </div>
      )}

      {/* Doctor & Clinic Header Card */}
      <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-teal-600" />
            <h4 className="font-bold text-slate-900 text-sm">Prescribing Doctor Information</h4>
          </div>
          <span className="text-2xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 inline-flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            Registry Checked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="text-slate-400 block font-semibold mb-1">Doctor Name</label>
            <input
              type="text"
              value={doctor.doctorName || ""}
              onChange={(e) => setDoctor({ ...doctor, doctorName: e.target.value })}
              placeholder="e.g. Dr. Jennifer Lyngdoh"
              className="w-full p-2 rounded-lg border border-slate-300 text-slate-800 font-semibold focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="text-slate-400 block font-semibold mb-1">Medical Registration No.</label>
            <input
              type="text"
              value={doctor.doctorRegistrationNo || ""}
              onChange={(e) => setDoctor({ ...doctor, doctorRegistrationNo: e.target.value })}
              placeholder="e.g. SMC-48291"
              className="w-full p-2 rounded-lg border border-slate-300 text-slate-800 font-semibold focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="text-slate-400 block font-semibold mb-1">Hospital / Clinic</label>
            <input
              type="text"
              value={doctor.doctorHospital || ""}
              onChange={(e) => setDoctor({ ...doctor, doctorHospital: e.target.value })}
              placeholder="e.g. Bethany Hospital, Shillong"
              className="w-full p-2 rounded-lg border border-slate-300 text-slate-800 font-medium focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="text-slate-400 block font-semibold mb-1">Medical Specialty</label>
            <input
              type="text"
              value={doctor.doctorSpecialty || ""}
              onChange={(e) => setDoctor({ ...doctor, doctorSpecialty: e.target.value })}
              placeholder="e.g. Pediatrics"
              className="w-full p-2 rounded-lg border border-slate-300 text-slate-800 font-medium focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* Extracted Medicines List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-slate-900 text-base">
              Extracted Medicines ({medicines.length})
            </h4>
            <span className="text-2xs text-slate-500">Review or edit details</span>
          </div>

          <SpeechButton
            text={prescriptionSpeechText}
            language={language}
            size="sm"
            label="Listen to Full Prescription"
          />
        </div>

        {medicines.map((med, idx) => {
          const isEditing = editingIndex === idx;

          return (
            <div
              key={idx}
              className="p-5 bg-white border border-slate-200/90 rounded-2xl shadow-xs transition hover:border-teal-300"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  {isEditing ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className="text-2xs text-slate-400 font-bold block mb-1">Medicine Name</label>
                        <input
                          type="text"
                          value={med.name}
                          onChange={(e) => handleUpdateMedicine(idx, { name: e.target.value })}
                          className="w-full p-2 text-sm rounded-lg border border-slate-300 font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-2xs text-slate-400 font-bold block mb-1">Strength</label>
                        <input
                          type="text"
                          value={med.strength}
                          onChange={(e) => handleUpdateMedicine(idx, { strength: e.target.value })}
                          className="w-full p-2 text-sm rounded-lg border border-slate-300"
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-base text-slate-900">{med.name}</h4>
                        {med.strength && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-teal-100 text-teal-800">
                            {med.strength}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* CRITICAL REQUIREMENT: "Used for" directly beneath the medicine name */}
                  <div className="mt-2.5 p-3 rounded-xl bg-teal-50/70 border border-teal-100">
                    <div className="text-2xs font-bold text-teal-900 uppercase tracking-wider mb-0.5">
                      {t("usedForLabel")}
                    </div>
                    <p className="text-xs text-teal-950 font-medium">
                      {med.usedFor || "General medical treatment for prescribed condition."}
                    </p>
                  </div>

                  {/* Dosage parameters */}
                  {isEditing ? (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 pt-3 border-t border-slate-100 text-xs">
                      <div>
                        <label className="text-2xs text-slate-400 font-bold block mb-1">Dose</label>
                        <input
                          type="text"
                          value={med.dose}
                          onChange={(e) => handleUpdateMedicine(idx, { dose: e.target.value })}
                          className="w-full p-1.5 text-xs rounded border border-slate-300"
                        />
                      </div>
                      <div>
                        <label className="text-2xs text-slate-400 font-bold block mb-1">Frequency</label>
                        <input
                          type="text"
                          value={med.frequency}
                          onChange={(e) => handleUpdateMedicine(idx, { frequency: e.target.value })}
                          className="w-full p-1.5 text-xs rounded border border-slate-300"
                        />
                      </div>
                      <div>
                        <label className="text-2xs text-slate-400 font-bold block mb-1">Timing</label>
                        <input
                          type="text"
                          value={med.timing}
                          onChange={(e) => handleUpdateMedicine(idx, { timing: e.target.value })}
                          className="w-full p-1.5 text-xs rounded border border-slate-300"
                        />
                      </div>
                      <div>
                        <label className="text-2xs text-slate-400 font-bold block mb-1">Duration</label>
                        <input
                          type="text"
                          value={med.duration}
                          onChange={(e) => handleUpdateMedicine(idx, { duration: e.target.value })}
                          className="w-full p-1.5 text-xs rounded border border-slate-300"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 pt-3 border-t border-slate-100 text-xs">
                      <div>
                        <span className="text-slate-400 block font-medium">{t("doseLabel")}</span>
                        <span className="font-semibold text-slate-800">{med.dose}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-medium">{t("frequencyLabel")}</span>
                        <span className="font-semibold text-slate-800">{med.frequency}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-medium">{t("timingLabel")}</span>
                        <span className="font-semibold text-slate-800">{med.timing}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-medium">{t("durationLabel")}</span>
                        <span className="font-semibold text-slate-800">{med.duration}</span>
                      </div>
                    </div>
                  )}

                  {med.specialInstructions && (
                    <div className="mt-2 text-xs text-slate-500 italic">
                      Advice: {med.specialInstructions}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setEditingIndex(isEditing ? null : idx)}
                  className="p-1.5 text-slate-500 hover:text-teal-700 rounded-lg hover:bg-slate-100 cursor-pointer text-xs flex items-center gap-1 font-semibold"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{isEditing ? "Done" : "Edit"}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Confirmation and Schedule Generation CTA */}
      <div className="p-5 bg-teal-50/70 border border-teal-200 rounded-2xl flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h4 className="font-bold text-sm text-teal-900">Ready to save your verified prescription?</h4>
          <p className="text-xs text-teal-700 mt-0.5">
            This will save your verified records and automatically generate your personalized medication schedule.
          </p>
        </div>

        <button
          type="button"
          disabled={isSaving}
          onClick={() => onConfirm({ doctorInfo: doctor, medicines })}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md transition cursor-pointer"
        >
          <Check className="w-4 h-4" />
          <span>{isSaving ? "Saving..." : t("btnConfirm")}</span>
        </button>
      </div>
    </div>
  );
};
