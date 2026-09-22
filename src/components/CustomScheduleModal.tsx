import React, { useState } from "react";
import { X, Clock, Bell, AlertTriangle, RotateCcw, Calendar, Check, ShieldAlert } from "lucide-react";
import { MedicationSchedule } from "../types/index.js";
import { useLanguage } from "../contexts/LanguageContext.js";
import { api } from "../services/api.js";

interface CustomScheduleModalProps {
  schedule: MedicationSchedule;
  isOpen: boolean;
  onClose: () => void;
  onUpdated: (updated: MedicationSchedule) => void;
}

export const CustomScheduleModal: React.FC<CustomScheduleModalProps> = ({
  schedule,
  isOpen,
  onClose,
  onUpdated
}) => {
  const { t } = useLanguage();

  const [scheduledTime, setScheduledTime] = useState(schedule.scheduledTime || "08:00 AM");
  const [doseSlot, setDoseSlot] = useState(schedule.doseSlot || "Morning");
  const [reminderEnabled, setReminderEnabled] = useState(schedule.reminderEnabled);
  const [reminderMinutesBefore, setReminderMinutesBefore] = useState(schedule.reminderMinutesBefore || 15);
  const [startDate, setStartDate] = useState(schedule.startDate || "");
  const [endDate, setEndDate] = useState(schedule.endDate || "");
  const [scheduleNote, setScheduleNote] = useState(schedule.scheduleNote || "");
  const [foodInstructionNote, setFoodInstructionNote] = useState(schedule.foodInstructionNote || "");

  // Medically significant change check
  const [attemptedMedicalChange, setAttemptedMedicalChange] = useState(false);
  const [medicalWarningDismissed, setMedicalWarningDismissed] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  if (!isOpen) return null;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await api.updateSchedule(schedule.id, {
        scheduledTime,
        doseSlot,
        reminderEnabled,
        reminderMinutesBefore: Number(reminderMinutesBefore),
        startDate,
        endDate,
        scheduleNote,
        foodInstructionNote
      });
      onUpdated(res.schedule);
      onClose();
    } catch (e) {
      console.error("Save schedule error:", e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    if (!confirm("Are you sure you want to restore the doctor's original prescribed timings?")) {
      return;
    }
    setIsResetting(true);
    try {
      const res = await api.resetSchedule(schedule.id);
      onUpdated(res.schedule);
      onClose();
    } catch (e) {
      console.error("Reset schedule error:", e);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-lg text-slate-900">Customize Medication Schedule</h3>
            <p className="text-xs text-slate-500">
              Personalize reminders to match your daily routine without modifying the doctor's prescription.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Doctor Prescribed Summary (Read-Only) */}
        <div className="mt-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">
              Verified Prescribed Medicine
            </span>
            <span className="text-2xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
              Doctor Prescribed
            </span>
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <h4 className="font-bold text-base text-slate-900">{schedule.medicineName}</h4>
            {schedule.strength && (
              <span className="text-xs font-semibold text-slate-600 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                {schedule.strength}
              </span>
            )}
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-slate-600">
            <div>
              <span className="text-slate-400">Prescribed Dose:</span>{" "}
              <span className="font-semibold">{schedule.dose}</span>
            </div>
            <div>
              <span className="text-slate-400">Verified Advice:</span>{" "}
              <span className="font-semibold">{schedule.foodInstructionNote || "With water"}</span>
            </div>
          </div>
        </div>

        {/* Customization Form */}
        <div className="space-y-4 mt-5">
          {/* Slot & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Time Slot
              </label>
              <select
                value={doseSlot}
                onChange={(e) => setDoseSlot(e.target.value as any)}
                className="w-full text-sm rounded-lg border border-slate-300 p-2.5 bg-white focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
              >
                <option value="Morning">Morning</option>
                <option value="Afternoon">Afternoon</option>
                <option value="Evening">Evening</option>
                <option value="Night">Night</option>
                <option value="Custom">Custom</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Preferred Reminder Time
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  placeholder="e.g. 07:30 AM"
                  className="w-full text-sm rounded-lg border border-slate-300 p-2.5 pl-8 bg-white focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                />
                <Clock className="w-4 h-4 text-slate-400 absolute left-2.5 top-3" />
              </div>
            </div>
          </div>

          {/* Reminder Toggle */}
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-teal-600" />
              <div>
                <span className="text-xs font-bold text-slate-800 block">Medication Reminders</span>
                <span className="text-2xs text-slate-500">Alert me before scheduled time</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setReminderEnabled(!reminderEnabled)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                reminderEnabled ? "bg-teal-600" : "bg-slate-300"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  reminderEnabled ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {reminderEnabled && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Remind Me In Advance
              </label>
              <select
                value={reminderMinutesBefore}
                onChange={(e) => setReminderMinutesBefore(Number(e.target.value))}
                className="w-full text-sm rounded-lg border border-slate-300 p-2.5 bg-white focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
              >
                <option value={0}>At the exact scheduled time</option>
                <option value={5}>5 minutes before</option>
                <option value={15}>15 minutes before</option>
                <option value={30}>30 minutes before</option>
                <option value={60}>1 hour before</option>
              </select>
            </div>
          )}

          {/* Start & End Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full text-sm rounded-lg border border-slate-300 p-2 bg-white focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full text-sm rounded-lg border border-slate-300 p-2 bg-white focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Routine Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Personal Routine Note (Optional)
            </label>
            <input
              type="text"
              value={scheduleNote}
              onChange={(e) => setScheduleNote(e.target.value)}
              placeholder="e.g. Keep on bedside table; take before morning walk"
              className="w-full text-sm rounded-lg border border-slate-300 p-2.5 bg-white focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
            />
          </div>

          {/* Separate data assurance banner */}
          <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-xs text-teal-900">
            <p className="font-semibold">{t("scheduleSeparateNote")}</p>
          </div>
        </div>

        {/* Safety Warning if attempting to alter medically significant fields */}
        {attemptedMedicalChange && !medicalWarningDismissed && (
          <div className="mt-4 p-4 bg-amber-50 border-2 border-amber-300 rounded-xl text-amber-950">
            <div className="flex items-start gap-2.5">
              <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1.5 text-xs">
                <p className="font-bold text-sm text-amber-900">Medical Safety Warning</p>
                <p>{t("scheduleWarningMedicalChange")}</p>
                <div className="pt-1 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setMedicalWarningDismissed(true)}
                    className="px-3 py-1 bg-amber-600 text-white rounded-lg font-bold hover:bg-amber-700 cursor-pointer"
                  >
                    I Understand
                  </button>
                  <button
                    type="button"
                    onClick={() => setAttemptedMedicalChange(false)}
                    className="px-3 py-1 bg-white border border-amber-300 text-amber-800 rounded-lg font-bold hover:bg-amber-100 cursor-pointer"
                  >
                    Cancel Change
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-3 flex-wrap">
          {schedule.isCustomizedByUser && (
            <button
              type="button"
              onClick={handleReset}
              disabled={isResetting}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl cursor-pointer transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t("btnResetPrescription")}</span>
            </button>
          )}

          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl cursor-pointer transition shadow-xs"
            >
              <Check className="w-4 h-4" />
              <span>{isSaving ? "Saving..." : t("btnSaveSchedule")}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
