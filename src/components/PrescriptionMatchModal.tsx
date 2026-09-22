import React from "react";
import { X, CheckCircle2, AlertTriangle, XCircle, ShieldAlert, Pill } from "lucide-react";
import { PrescriptionMatchResult } from "../types/index.js";
import { SpeechButton } from "./SpeechButton.js";

interface PrescriptionMatchModalProps {
  result: PrescriptionMatchResult | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PrescriptionMatchModal: React.FC<PrescriptionMatchModalProps> = ({
  result,
  isOpen,
  onClose
}) => {
  if (!isOpen || !result) return null;

  const isMatch = result.status === "MATCH";
  const isStrengthMismatch = result.status === "STRENGTH_MISMATCH";
  const isNotFound = result.status === "NOT_IN_PRESCRIPTION";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Pill className="w-5 h-5 text-teal-600" />
            <h3 className="font-bold text-base text-slate-900">Prescription Verification Match</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Card */}
        <div className="mt-4">
          {isMatch && (
            <div className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-2xl text-emerald-950">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-base text-emerald-900">{result.title}</h4>
                  <p className="text-xs text-emerald-800 mt-1 leading-relaxed">{result.message}</p>
                </div>
              </div>
            </div>
          )}

          {isStrengthMismatch && (
            <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-2xl text-amber-950">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-base text-amber-900">{result.title}</h4>
                  <p className="text-xs text-amber-800 mt-1 leading-relaxed">{result.message}</p>
                </div>
              </div>
            </div>
          )}

          {isNotFound && (
            <div className="p-4 bg-rose-50 border-2 border-rose-300 rounded-2xl text-rose-950">
              <div className="flex items-start gap-3">
                <XCircle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-base text-rose-900">{result.title}</h4>
                  <p className="text-xs text-rose-800 mt-1 leading-relaxed">{result.message}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Comparison Details */}
        <div className="mt-4 p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
          <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
            <span className="text-slate-500">Scanned Medicine:</span>
            <span className="font-bold text-slate-900">
              {result.scannedMedicineName} {result.scannedStrength || ""}
            </span>
          </div>

          <div className="flex justify-between items-center py-1">
            <span className="text-slate-500">Active Prescribed Medicine:</span>
            <span className="font-bold text-slate-900">
              {result.prescribedMedicineName} {result.prescribedStrength || ""}
            </span>
          </div>
        </div>

        {/* Verified Purpose if available */}
        {result.verifiedDetails && (
          <div className="mt-3 p-3 bg-teal-50 border border-teal-100 rounded-xl text-xs">
            <span className="font-bold text-teal-900 uppercase tracking-wider block mb-0.5">
              Verified Purpose:
            </span>
            <p className="text-teal-950 font-medium">
              {result.verifiedDetails.usedFor || result.verifiedDetails.generalPurpose}
            </p>
          </div>
        )}

        {/* Safety Disclaimer */}
        <div className="mt-4 flex items-start gap-2 text-2xs text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
          <ShieldAlert className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <p>
            MediLens does not recommend substitutions or alterations. Always check physical medicine strips and consult your doctor or pharmacist.
          </p>
        </div>

        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
          <SpeechButton
            text={`${result.title}. ${result.message}`}
            size="sm"
            label="Listen"
          />
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-teal-600 text-white hover:bg-teal-700 transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
