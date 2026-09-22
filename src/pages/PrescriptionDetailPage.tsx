import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FileText,
  Calendar,
  Stethoscope,
  ArrowLeft,
  Trash2,
  ShieldCheck,
  Globe,
  Clock,
  Sparkles
} from "lucide-react";
import { api } from "../services/api.js";
import { Prescription } from "../types/index.js";
import { MedicineCard } from "../components/MedicineCard.js";
import { SpeechButton } from "../components/SpeechButton.js";
import { useLanguage } from "../contexts/LanguageContext.js";

export const PrescriptionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  const [prescription, setPrescription] = useState<Prescription | null>(null);
  const [showRawOcr, setShowRawOcr] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      api.getPrescriptionById(id).then((data) => {
        setPrescription(data);
        setIsLoading(false);
      });
    }
  }, [id]);

  if (isLoading || !prescription) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-slate-500">
        Loading prescription details...
      </div>
    );
  }

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this prescription record?")) {
      await api.deletePrescription(prescription.id);
      navigate("/dashboard");
    }
  };

  const audioSummary = `Prescription by ${prescription.doctorName || "Doctor"} from ${
    prescription.doctorHospital || "Clinic"
  }. Prescribed medicines: ${prescription.medicines
    .map(
      (m, i) =>
        `${m.prescribedName} ${m.prescribedStrength}, take ${m.prescribedDose} ${m.prescribedFrequency} ${m.prescribedTiming}.`
    )
    .join(" ")}`;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Back button */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to dashboard</span>
      </button>

      {/* Header Card */}
      <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-4">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-start gap-3">
            <div className="p-3 bg-teal-50 text-teal-600 rounded-2xl shrink-0">
              <FileText className="w-6 h-6" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-slate-900">
                  {prescription.doctorName || "Verified Prescription"}
                </h1>
                <span className="text-2xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Verified
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                <span>{prescription.doctorHospital || "Registered Clinic"}</span>
                {prescription.doctorRegistrationNo && (
                  <>
                    <span>•</span>
                    <span className="font-mono">Reg: {prescription.doctorRegistrationNo}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <SpeechButton
              text={audioSummary}
              language={language}
              size="sm"
              label="Listen"
            />

            <button
              type="button"
              onClick={handleDelete}
              className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer border border-rose-200"
              title="Delete Prescription"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>Prescription Date: {new Date(prescription.prescriptionDate).toLocaleDateString()}</span>
          </div>

          <button
            type="button"
            onClick={() => setShowRawOcr(!showRawOcr)}
            className="text-teal-700 font-semibold hover:underline cursor-pointer"
          >
            {showRawOcr ? "Hide Raw OCR Text" : "View Raw OCR Text"}
          </button>
        </div>

        {showRawOcr && prescription.rawOcrText && (
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-700 whitespace-pre-wrap">
            {prescription.rawOcrText}
          </div>
        )}
      </div>

      {/* Medicines with verified "Used for" */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900">
          Prescribed Medicines ({prescription.medicines.length})
        </h2>

        <div className="space-y-4">
          {prescription.medicines.map((m) => (
            <MedicineCard
              key={m.id}
              medicine={{
                genericName: m.prescribedName,
                strength: m.prescribedStrength,
                usedFor: m.matchedMedicine?.usedFor,
                dose: m.prescribedDose,
                frequency: m.prescribedFrequency,
                timing: m.prescribedTiming,
                duration: m.prescribedDuration
              }}
              onSelect={
                m.medicineId
                  ? () => navigate(`/medicines/${m.medicineId}`)
                  : undefined
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
};
