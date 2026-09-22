import React, { useEffect, useState } from "react";
import { Clock, Filter, Plus, CheckCircle2, RotateCcw, Volume2, ShieldAlert } from "lucide-react";
import { api } from "../services/api.js";
import { MedicationSchedule } from "../types/index.js";
import { MedicationTimeline } from "../components/MedicationTimeline.js";
import { SpeechButton } from "../components/SpeechButton.js";
import { useLanguage } from "../contexts/LanguageContext.js";

export const MedicationSchedulePage: React.FC = () => {
  const { t, language } = useLanguage();
  const [schedules, setSchedules] = useState<MedicationSchedule[]>([]);
  const [filter, setFilter] = useState<"ALL" | "UPCOMING" | "TAKEN" | "SKIPPED">("ALL");
  const [isLoading, setIsLoading] = useState(true);

  const fetchSchedules = async () => {
    setIsLoading(true);
    try {
      const data = await api.getSchedules();
      setSchedules(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
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

  const filtered = schedules.filter((s) => {
    if (filter === "ALL") return true;
    return s.status === filter;
  });

  const total = schedules.length;
  const taken = schedules.filter((s) => s.status === "TAKEN").length;

  const audioSummary = `Medication schedule summary: ${total} total doses scheduled. ${taken} taken so far. ${
    schedules
      .map(
        (s) =>
          `${s.doseSlot} at ${s.scheduledTime}: ${s.medicineName} ${s.strength}, ${s.dose}. Status: ${s.status}.`
      )
      .join(" ")
  }`;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {t("navSchedule")}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Personalize dose timings and reminder alerts. Verified prescriptions remain untouched.
          </p>
        </div>

        <SpeechButton
          text={audioSummary}
          language={language}
          size="md"
          label="Listen to Full Schedule"
        />
      </div>

      {/* Progress & Stat Bar */}
      <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
          <span>Today's Completion Progress</span>
          <span className="font-bold text-teal-700">{total ? Math.round((taken / total) * 100) : 0}%</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2">
          <div
            className="bg-teal-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${total ? (taken / total) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mr-2">
          <Filter className="w-3.5 h-3.5" /> Filter:
        </span>

        {(["ALL", "UPCOMING", "TAKEN", "SKIPPED"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setFilter(tab)}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
              filter === tab
                ? "bg-teal-600 text-white shadow-2xs"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {tab === "ALL"
              ? "All Doses"
              : tab === "UPCOMING"
              ? t("statusUpcoming")
              : tab === "TAKEN"
              ? t("statusTaken")
              : t("statusSkipped")}
          </button>
        ))}
      </div>

      {/* Medication Timeline */}
      <MedicationTimeline
        schedules={filtered}
        onMarkTaken={handleMarkTaken}
        onMarkSkipped={handleMarkSkipped}
        onScheduleUpdated={handleScheduleUpdated}
      />
    </div>
  );
};
