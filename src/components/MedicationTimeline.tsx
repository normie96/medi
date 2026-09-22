import React, { useState } from "react";
import { Clock, CheckCircle2, XCircle, Settings, Sun, Sunset, Moon, Coffee, Sparkles } from "lucide-react";
import { MedicationSchedule } from "../types/index.js";
import { SpeechButton } from "./SpeechButton.js";
import { CustomScheduleModal } from "./CustomScheduleModal.js";
import { useLanguage } from "../contexts/LanguageContext.js";
import { useAccessibility } from "../contexts/AccessibilityContext.js";

interface MedicationTimelineProps {
  schedules: MedicationSchedule[];
  onMarkTaken: (id: string) => void;
  onMarkSkipped: (id: string) => void;
  onScheduleUpdated: (updated: MedicationSchedule) => void;
}

export const MedicationTimeline: React.FC<MedicationTimelineProps> = ({
  schedules,
  onMarkTaken,
  onMarkSkipped,
  onScheduleUpdated
}) => {
  const { t, language } = useLanguage();
  const { contrastMode } = useAccessibility();
  const isHighContrast = contrastMode === "HIGH_CONTRAST";

  const [activeCustomizingItem, setActiveCustomizingItem] = useState<MedicationSchedule | null>(null);

  const slotIcons: Record<string, React.ReactNode> = {
    Morning: <Sun className="w-4 h-4 text-amber-500" />,
    Afternoon: <Coffee className="w-4 h-4 text-orange-500" />,
    Evening: <Sunset className="w-4 h-4 text-indigo-500" />,
    Night: <Moon className="w-4 h-4 text-blue-500" />,
    Custom: <Clock className="w-4 h-4 text-teal-500" />
  };

  if (schedules.length === 0) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
        <Clock className="w-8 h-8 text-slate-300 mx-auto mb-2" />
        <p className="text-sm font-bold text-slate-700">No medication scheduled for today</p>
        <p className="text-xs text-slate-500 mt-1">
          Scan or upload a prescription to automatically generate your medication timeline.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {schedules.map((item) => {
        const isTaken = item.status === "TAKEN";
        const isSkipped = item.status === "SKIPPED";

        const audioSpeech = `Time for ${item.medicineName} ${item.strength}. Dose: ${item.dose}. Take ${
          item.foodInstructionNote || "as directed"
        } at ${item.scheduledTime}.`;

        return (
          <div
            key={item.id}
            className={`p-4 rounded-2xl border transition-all duration-200 ${
              isHighContrast
                ? "bg-slate-800 border-slate-600 text-white"
                : isTaken
                ? "bg-emerald-50/40 border-emerald-200"
                : isSkipped
                ? "bg-slate-50 border-slate-200 opacity-75"
                : "bg-white border-slate-200 shadow-xs hover:border-teal-300"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-slate-100 shrink-0">
                  {slotIcons[item.doseSlot] || slotIcons.Morning}
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      {item.doseSlot} ({item.scheduledTime})
                    </span>

                    {item.isCustomizedByUser && (
                      <span className="text-2xs font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                        Customized Time
                      </span>
                    )}

                    {isTaken && (
                      <span className="inline-flex items-center gap-1 text-2xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        <CheckCircle2 className="w-3 h-3" />
                        {t("statusTaken")}
                      </span>
                    )}

                    {isSkipped && (
                      <span className="inline-flex items-center gap-1 text-2xs font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                        <XCircle className="w-3 h-3" />
                        {t("statusSkipped")}
                      </span>
                    )}
                  </div>

                  <div className="mt-1 flex items-baseline gap-2">
                    <h4 className="font-bold text-base text-slate-900">{item.medicineName}</h4>
                    {item.strength && (
                      <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-100">
                        {item.strength}
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-slate-600 mt-1 flex items-center gap-3">
                    <span>
                      Dose: <strong className="text-slate-800">{item.dose}</strong>
                    </span>
                    <span>•</span>
                    <span>{item.foodInstructionNote || "With food"}</span>
                  </div>

                  {item.scheduleNote && (
                    <div className="mt-1 text-2xs text-slate-500 italic">
                      Note: {item.scheduleNote}
                    </div>
                  )}
                </div>
              </div>

              {/* Speech */}
              <SpeechButton
                text={audioSpeech}
                language={language}
                size="sm"
                label={t("btnListen")}
              />
            </div>

            {/* Bottom Action Row */}
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                {!isTaken && (
                  <button
                    type="button"
                    onClick={() => onMarkTaken(item.id)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition cursor-pointer shadow-2xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{t("btnMarkTaken")}</span>
                  </button>
                )}

                {!isSkipped && !isTaken && (
                  <button
                    type="button"
                    onClick={() => onMarkSkipped(item.id)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition cursor-pointer"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>{t("btnMarkSkipped")}</span>
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => setActiveCustomizingItem(item)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-teal-700 cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>{t("btnCustomizeSchedule")}</span>
              </button>
            </div>
          </div>
        );
      })}

      {activeCustomizingItem && (
        <CustomScheduleModal
          schedule={activeCustomizingItem}
          isOpen={true}
          onClose={() => setActiveCustomizingItem(null)}
          onUpdated={(updated) => {
            onScheduleUpdated(updated);
            setActiveCustomizingItem(null);
          }}
        />
      )}
    </div>
  );
};
