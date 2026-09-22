import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FileText,
  Pill,
  Clock,
  Stethoscope,
  Plus,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext.js";
import { useLanguage } from "../contexts/LanguageContext.js";
import { useAccessibility } from "../contexts/AccessibilityContext.js";
import { api } from "../services/api.js";
import { Prescription, MedicationSchedule, Medicine } from "../types/index.js";
import { MedicationTimeline } from "../components/MedicationTimeline.js";
import { PrescriptionCard } from "../components/PrescriptionCard.js";
import { MedicineCard } from "../components/MedicineCard.js";

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { simpleMode, contrastMode } = useAccessibility();
  const navigate = useNavigate();

  const [schedules, setSchedules] = useState<MedicationSchedule[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [schedData, rxData, medData] = await Promise.all([
        api.getSchedules(),
        api.getPrescriptions(),
        api.getMedicines()
      ]);
      setSchedules(schedData);
      setPrescriptions(rxData);
      setMedicines(medData);
    } catch (e) {
      console.error("Dashboard data load error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleMarkTaken = async (id: string) => {
    try {
      const res = await api.markTaken(id);
      setSchedules((prev) => prev.map((s) => (s.id === id ? res.schedule : s)));
    } catch (e) {
      console.error(e);
    }
  };

  const handleMarkSkipped = async (id: string) => {
    try {
      const res = await api.markSkipped(id);
      setSchedules((prev) => prev.map((s) => (s.id === id ? res.schedule : s)));
    } catch (e) {
      console.error(e);
    }
  };

  const handleScheduleUpdated = (updated: MedicationSchedule) => {
    setSchedules((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  };

  // Determine greeting based on time of day
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? t("goodMorning") : hour < 17 ? t("goodAfternoon") : t("goodEvening");

  const totalToday = schedules.length;
  const takenCount = schedules.filter((s) => s.status === "TAKEN").length;
  const remainingCount = schedules.filter((s) => s.status === "UPCOMING").length;
  const nextMedicine = schedules.find((s) => s.status === "UPCOMING");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Greeting & Quick Action Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {greeting}, {user?.name || "Patient"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Here is your daily medication overview and verified healthcare schedule.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/scan"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t("btnScanPrescription")}</span>
          </Link>

          <Link
            to="/medicines"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold text-xs shadow-2xs transition cursor-pointer"
          >
            <Pill className="w-4 h-4 text-teal-600" />
            <span>{t("btnIdentifyMedicine")}</span>
          </Link>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Metric 1: Today's Medicines */}
        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {t("todaysMedicines")}
            </span>
            <div className="p-2 rounded-xl bg-teal-50 text-teal-700">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-slate-900">{totalToday} doses</span>
            <span className="text-xs text-slate-500">
              ({takenCount} taken, {remainingCount} {t("remainingMedicines")})
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
            <div
              className="bg-teal-600 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${totalToday ? (takenCount / totalToday) * 100 : 0}%` }}
            />
          </div>
        </div>

        {/* Metric 2: Next Medicine */}
        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {t("nextMedicine")}
            </span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
              <Pill className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-1">
            {nextMedicine ? (
              <div>
                <p className="text-base font-bold text-slate-900 line-clamp-1">
                  {nextMedicine.medicineName} {nextMedicine.strength}
                </p>
                <p className="text-xs text-teal-700 font-semibold mt-0.5">
                  {nextMedicine.doseSlot} • {nextMedicine.scheduledTime}
                </p>
              </div>
            ) : (
              <p className="text-sm text-slate-500 font-medium">All doses completed today</p>
            )}
          </div>
        </div>

        {/* Metric 3: Active Prescriptions */}
        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {t("activePrescriptions")}
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-slate-900">{prescriptions.length}</span>
            <span className="text-xs text-emerald-700 font-semibold">Verified</span>
          </div>
          <p className="text-2xs text-slate-400 mt-0.5">Directly verified against medical registry</p>
        </div>
      </div>

      {/* Main Grid: Today's Schedule on Left, Prescriptions on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Today's Medication Timeline */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Today's Medication Timeline</h2>
              <p className="text-xs text-slate-500">
                Log doses, customize reminder timings, or listen to instructions.
              </p>
            </div>

            <Link
              to="/schedule"
              className="text-xs font-bold text-teal-700 hover:text-teal-900 inline-flex items-center gap-1"
            >
              <span>{t("btnViewSchedule")}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <MedicationTimeline
            schedules={schedules}
            onMarkTaken={handleMarkTaken}
            onMarkSkipped={handleMarkSkipped}
            onScheduleUpdated={handleScheduleUpdated}
          />
        </div>

        {/* Right Column: Active Prescriptions & Doctor Directory Shortcut */}
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Active Prescriptions</h3>
              <Link to="/scan" className="text-2xs font-bold text-teal-700 hover:underline">
                + Add
              </Link>
            </div>

            {prescriptions.length === 0 ? (
              <div className="p-6 bg-white rounded-2xl border border-slate-200 text-center">
                <FileText className="w-6 h-6 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-700">No prescriptions scanned yet</p>
                <Link
                  to="/scan"
                  className="mt-2 inline-block text-xs font-bold text-teal-600 hover:underline"
                >
                  Scan your first prescription →
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {prescriptions.map((rx) => (
                  <PrescriptionCard
                    key={rx.id}
                    prescription={rx}
                    onView={() => navigate(`/prescriptions/${rx.id}`)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Quick Doctor Directory Card */}
          <div className="p-5 bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-200 rounded-2xl space-y-3">
            <div className="flex items-center gap-2 text-teal-900 font-bold text-sm">
              <Stethoscope className="w-4 h-4 text-teal-600" />
              <span>Need a Doctor Consultation?</span>
            </div>
            <p className="text-xs text-teal-800 leading-relaxed">
              Find verified medical specialists (Pediatricians, Cardiologists, Dermatologists, Dentists) with direct contact and map directions.
            </p>
            <Link
              to="/doctors"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition shadow-2xs"
            >
              <span>{t("btnFindDoctor")}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
