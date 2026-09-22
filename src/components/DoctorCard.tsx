import React from "react";
import { Doctor } from "../types/index.js";
import { ShieldCheck, MapPin, Phone, Clock, Award, Navigation } from "lucide-react";
import { useAccessibility } from "../contexts/AccessibilityContext.js";

interface DoctorCardProps {
  doctor: Doctor;
  onSelect?: () => void;
  className?: string;
}

export const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, onSelect, className = "" }) => {
  const { contrastMode } = useAccessibility();
  const isHighContrast = contrastMode === "HIGH_CONTRAST";

  return (
    <div
      className={`rounded-2xl p-5 border transition-all duration-200 ${
        isHighContrast
          ? "bg-slate-800 border-slate-600 text-white shadow-md"
          : "bg-white border-slate-200/90 shadow-xs hover:shadow-md hover:border-teal-300"
      } ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className={`font-bold text-base ${isHighContrast ? "text-white" : "text-slate-900"}`}>
              {doctor.name}
            </h3>
            {doctor.isVerified && (
              <span className="inline-flex items-center gap-1 text-2xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                Verified Doctor
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-xs text-teal-700 font-semibold mt-0.5">
            <Award className="w-3.5 h-3.5" />
            <span>{doctor.specialty}</span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-600 font-normal">{doctor.qualification}</span>
          </div>

          <div className="text-2xs text-slate-500 font-mono mt-1">
            Reg No: <span className="font-semibold text-slate-700">{doctor.registrationNumber}</span>
          </div>
        </div>

        {doctor.distanceKm !== undefined && (
          <div className="text-right shrink-0">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-teal-100/90 text-teal-800">
              <Navigation className="w-3 h-3" />
              {doctor.distanceKm} km
            </span>
          </div>
        )}
      </div>

      <div className="mt-3.5 space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <span>
            <strong className="text-slate-800">{doctor.hospitalOrClinic}</strong>, {doctor.address}, {doctor.city}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-400 shrink-0" />
          <span>{doctor.openingHours}</span>
        </div>

        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-slate-400 shrink-0" />
          <a
            href={`tel:${doctor.phone}`}
            className="text-teal-700 hover:underline font-semibold"
          >
            {doctor.phone}
          </a>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            `${doctor.name} ${doctor.hospitalOrClinic} ${doctor.city}`
          )}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
        >
          <MapPin className="w-3.5 h-3.5 text-slate-500" />
          <span>View on Map</span>
        </a>

        <a
          href={`tel:${doctor.phone}`}
          className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition shadow-xs"
        >
          <Phone className="w-3.5 h-3.5" />
          <span>Call Clinic</span>
        </a>
      </div>
    </div>
  );
};
