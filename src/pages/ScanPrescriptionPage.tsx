import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Loader2, Sparkles, CheckCircle2, ArrowLeft } from "lucide-react";
import { UploadBox } from "../components/UploadBox.js";
import { OCRResult } from "../components/OCRResult.js";
import { api } from "../services/api.js";
import { useLanguage } from "../contexts/LanguageContext.js";

export const ScanPrescriptionPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [step, setStep] = useState<"UPLOAD" | "PROCESSING" | "VERIFY" | "COMPLETED">("UPLOAD");
  const [processingStage, setProcessingStage] = useState<string>("Reading prescription...");
  const [rawOcrText, setRawOcrText] = useState("");
  const [ocrConfidence, setOcrConfidence] = useState(0.92);
  const [doctorInfo, setDoctorInfo] = useState<any>({});
  const [medicines, setMedicines] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleImageSelected = async (base64OrEmpty: string, sampleId?: string) => {
    setErrorMessage(null);
    setStep("PROCESSING");

    // Realistic progressive status steps
    setProcessingStage("Reading prescription image...");
    const stageTimer1 = setTimeout(() => setProcessingStage("Extracting medicines and dosages..."), 800);
    const stageTimer2 = setTimeout(() => setProcessingStage("Structuring dosage instructions & timings..."), 1600);
    const stageTimer3 = setTimeout(() => setProcessingStage("Checking extracted information with verified directory..."), 2400);

    try {
      const res = await api.processPrescriptionUpload(base64OrEmpty, sampleId);
      clearTimeout(stageTimer1);
      clearTimeout(stageTimer2);
      clearTimeout(stageTimer3);

      setRawOcrText(res.ocrRaw);
      setOcrConfidence(res.ocrConfidence);
      const doc = res.structuredResult?.doctorInfo || res.structuredResult?.doctor || {};
      setDoctorInfo({
        doctorName: doc.doctorName || doc.name || "",
        doctorRegistrationNo: doc.doctorRegistrationNo || doc.registrationNumber || "",
        doctorHospital: doc.doctorHospital || doc.hospital || "",
        doctorSpecialty: doc.doctorSpecialty || doc.specialty || ""
      });
      setMedicines(res.structuredResult?.medicines || []);
      setStep("VERIFY");
    } catch (err: any) {
      clearTimeout(stageTimer1);
      clearTimeout(stageTimer2);
      clearTimeout(stageTimer3);
      setErrorMessage(err.message || "Failed to process prescription. Please try again.");
      setStep("UPLOAD");
    }
  };

  const handleConfirmAndSave = async (verifiedData: { doctorInfo: any; medicines: any[] }) => {
    setIsSaving(true);
    try {
      await api.saveVerifiedPrescription({
        doctorName: verifiedData.doctorInfo.doctorName,
        doctorRegistrationNo: verifiedData.doctorInfo.doctorRegistrationNo,
        doctorHospital: verifiedData.doctorInfo.doctorHospital,
        doctorSpecialty: verifiedData.doctorInfo.doctorSpecialty,
        rawOcrText,
        ocrConfidence,
        verificationNotes: "Verified by patient via MediLens Scanner",
        medicines: verifiedData.medicines
      });

      setStep("COMPLETED");
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to save verified prescription.");
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => (step === "VERIFY" ? setStep("UPLOAD") : navigate(-1))}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{step === "VERIFY" ? "Upload another prescription" : "Back"}</span>
        </button>

        <div className="text-xs font-bold text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
          Step {step === "UPLOAD" ? "1: Upload" : step === "PROCESSING" ? "2: Analyze" : "3: Patient Verification"}
        </div>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Prescription Scanner & Schedule Generator
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Upload a doctor's slip or photo. MediLens extracts medicines, checks verified medical purposes, and builds your schedule.
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-300 rounded-xl text-rose-800 text-xs font-semibold">
          {errorMessage}
        </div>
      )}

      {/* Step 1: Upload */}
      {step === "UPLOAD" && (
        <div className="space-y-6">
          <UploadBox onImageSelected={handleImageSelected} />
        </div>
      )}

      {/* Step 2: Processing Animation */}
      {step === "PROCESSING" && (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4 my-8">
          <div className="relative inline-block">
            <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto shadow-inner animate-pulse">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
            <Sparkles className="w-5 h-5 text-amber-500 absolute -top-1 -right-1" />
          </div>

          <div className="space-y-1">
            <h3 className="font-bold text-lg text-slate-900">{processingStage}</h3>
            <p className="text-xs text-slate-500">
              Cross-referencing with verified medical registry and pharmacology database...
            </p>
          </div>
        </div>
      )}

      {/* Step 3: Verification & Review */}
      {step === "VERIFY" && (
        <OCRResult
          doctorInfo={doctorInfo}
          medicines={medicines}
          ocrConfidence={ocrConfidence}
          onConfirm={handleConfirmAndSave}
          isSaving={isSaving}
        />
      )}

      {/* Step 4: Success */}
      {step === "COMPLETED" && (
        <div className="p-12 text-center bg-white rounded-3xl border border-emerald-200 shadow-md space-y-4 my-8 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-xl text-slate-900">Prescription Verified & Saved!</h3>
            <p className="text-xs text-slate-500">
              Your medication schedule has been created. Redirecting to your dashboard...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
