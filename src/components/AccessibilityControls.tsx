import React from "react";
import { X, Type, Eye, Volume2, Sparkles, Sliders } from "lucide-react";
import { useAccessibility, TextSize, ContrastMode, SpeechSpeed } from "../contexts/AccessibilityContext.js";

interface AccessibilityControlsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccessibilityControls: React.FC<AccessibilityControlsProps> = ({ isOpen, onClose }) => {
  const {
    textSize,
    setTextSize,
    contrastMode,
    setContrastMode,
    simpleMode,
    setSimpleMode,
    speechEnabled,
    setSpeechEnabled,
    speechSpeed,
    setSpeechSpeed
  } = useAccessibility();

  if (!isOpen) return null;

  const textSizes: { id: TextSize; label: string }[] = [
    { id: "SMALL", label: "Small" },
    { id: "MEDIUM", label: "Medium" },
    { id: "LARGE", label: "Large" },
    { id: "XLARGE", label: "Extra Large" }
  ];

  const speechSpeeds: { id: SpeechSpeed; label: string; rate: string }[] = [
    { id: "SLOW", label: "Slow", rate: "0.75x" },
    { id: "NORMAL", label: "Normal", rate: "1.0x" },
    { id: "FAST", label: "Fast", rate: "1.25x" }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2 text-teal-800">
            <Sliders className="w-5 h-5 text-teal-600" />
            <h3 className="font-bold text-lg">Accessibility & Display Preferences</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6 pt-5">
          {/* Simple Language Mode */}
          <div className="flex items-center justify-between p-3.5 bg-teal-50/70 border border-teal-200/80 rounded-xl">
            <div className="space-y-0.5 pr-2">
              <div className="flex items-center gap-1.5 font-semibold text-teal-900 text-sm">
                <Sparkles className="w-4 h-4 text-teal-600" />
                Simple Language Mode
              </div>
              <p className="text-xs text-teal-700">
                Short sentences, larger text, intuitive medical icons, and voice guidance.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSimpleMode(!simpleMode)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                simpleMode ? "bg-teal-600" : "bg-slate-300"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  simpleMode ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Text Size */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              <Type className="w-3.5 h-3.5 text-slate-500" /> Text Size
            </label>
            <div className="grid grid-cols-4 gap-2">
              {textSizes.map((size) => (
                <button
                  key={size.id}
                  type="button"
                  onClick={() => setTextSize(size.id)}
                  className={`py-2 px-1 text-xs font-semibold rounded-lg border text-center transition-all cursor-pointer ${
                    textSize === size.id
                      ? "bg-teal-600 text-white border-teal-600 shadow-xs"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {size.label}
                </button>
              ))}
            </div>
          </div>

          {/* High Contrast Mode */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              <Eye className="w-3.5 h-3.5 text-slate-500" /> Contrast Mode
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setContrastMode("NORMAL")}
                className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center transition-all cursor-pointer ${
                  contrastMode === "NORMAL"
                    ? "bg-teal-600 text-white border-teal-600 shadow-xs"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                Normal Contrast
              </button>
              <button
                type="button"
                onClick={() => setContrastMode("HIGH_CONTRAST")}
                className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center transition-all cursor-pointer ${
                  contrastMode === "HIGH_CONTRAST"
                    ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                High Contrast (Dark)
              </button>
            </div>
          </div>

          {/* Speech Settings */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-600 uppercase tracking-wider">
                <Volume2 className="w-3.5 h-3.5 text-slate-500" /> Text-to-Speech Voice
              </label>
              <button
                type="button"
                onClick={() => setSpeechEnabled(!speechEnabled)}
                className="text-xs text-teal-700 font-semibold hover:underline cursor-pointer"
              >
                {speechEnabled ? "Disable" : "Enable"}
              </button>
            </div>

            {speechEnabled && (
              <div className="grid grid-cols-3 gap-2 mt-2">
                {speechSpeeds.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSpeechSpeed(s.id)}
                    className={`py-1.5 px-2 text-xs font-semibold rounded-lg border text-center transition-all cursor-pointer ${
                      speechSpeed === s.id
                        ? "bg-teal-600 text-white border-teal-600"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {s.label} ({s.rate})
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-sm font-semibold rounded-xl bg-teal-600 text-white hover:bg-teal-700 transition cursor-pointer shadow-xs"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};
