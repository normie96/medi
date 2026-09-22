import React, { useState } from "react";
import { UserCheck, Globe, Type, Eye, Volume2, Sparkles, LogOut, Check, Sliders } from "lucide-react";
import { useAuth } from "../contexts/AuthContext.js";
import { useLanguage } from "../contexts/LanguageContext.js";
import { useAccessibility, TextSize, ContrastMode, SpeechSpeed } from "../contexts/AccessibilityContext.js";
import { SpeechButton } from "../components/SpeechButton.js";

export const ProfilePage: React.FC = () => {
  const { user, logout, refreshProfile } = useAuth();
  const { language, setLanguage, t } = useLanguage();
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

  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {t("navProfile")}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your language, accessibility, and voice assistance preferences.
          </p>
        </div>

        <button
          type="button"
          onClick={logout}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-rose-700 hover:bg-rose-50 rounded-xl border border-rose-200 cursor-pointer transition"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

      {savedNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Preferences saved successfully!</span>
        </div>
      )}

      {/* Account Info */}
      <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-lg">
            {user?.name ? user.name[0] : "A"}
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900">{user?.name || "Alex Marak"}</h3>
            <p className="text-xs text-slate-500">{user?.email || "demo@medilens.health"}</p>
          </div>
        </div>
      </div>

      {/* Language Preferences */}
      <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
          <Globe className="w-5 h-5 text-teal-600" />
          <h3>Primary Healthcare Language</h3>
        </div>
        <p className="text-xs text-slate-500">
          Choose the language for medicine instructions, schedule labels, and voice synthesis.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { id: "en", label: "English", sub: "Accessible Plain English" },
            { id: "hi", label: "हिन्दी (Hindi)", sub: "Hindi Medical Translations" },
            { id: "kha", label: "Ka Ktien Khasi", sub: "Verified Khasi Phrases" }
          ].map((l) => (
            <button
              key={l.id}
              type="button"
              onClick={() => setLanguage(l.id as any)}
              className={`p-4 rounded-xl border text-left transition cursor-pointer ${
                language === l.id
                  ? "bg-teal-50 border-teal-500 text-teal-900 shadow-xs"
                  : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
              }`}
            >
              <div className="font-bold text-sm">{l.label}</div>
              <div className="text-2xs text-slate-500 mt-1">{l.sub}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Accessibility & Display Preferences */}
      <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-6">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
          <Sliders className="w-5 h-5 text-teal-600" />
          <h3>Accessibility & Display</h3>
        </div>

        {/* Simple Mode */}
        <div className="flex items-center justify-between p-4 bg-teal-50/70 border border-teal-200 rounded-xl">
          <div className="space-y-0.5 pr-4">
            <span className="font-bold text-sm text-teal-950 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-teal-600" />
              Simple Language Mode
            </span>
            <p className="text-xs text-teal-800">
              Simplifies medical terminology into plain patient explanations with high legibility.
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
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
            Text Size
          </label>
          <div className="grid grid-cols-4 gap-2">
            {(["SMALL", "MEDIUM", "LARGE", "XLARGE"] as TextSize[]).map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setTextSize(size)}
                className={`py-2.5 text-xs font-bold rounded-xl border text-center transition cursor-pointer ${
                  textSize === size
                    ? "bg-teal-600 text-white border-teal-600 shadow-xs"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Contrast */}
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
            Contrast Mode
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setContrastMode("NORMAL")}
              className={`py-2.5 text-xs font-bold rounded-xl border text-center transition cursor-pointer ${
                contrastMode === "NORMAL"
                  ? "bg-teal-600 text-white border-teal-600 shadow-xs"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
              }`}
            >
              Normal Contrast (Light)
            </button>
            <button
              type="button"
              onClick={() => setContrastMode("HIGH_CONTRAST")}
              className={`py-2.5 text-xs font-bold rounded-xl border text-center transition cursor-pointer ${
                contrastMode === "HIGH_CONTRAST"
                  ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
              }`}
            >
              High Contrast (Dark)
            </button>
          </div>
        </div>

        {/* Voice Speech */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Speech Voice Speed
            </label>
            <SpeechButton
              text="This is a test of the MediLens text to speech voice."
              language={language}
              size="sm"
              label="Test Voice"
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            {(["SLOW", "NORMAL", "FAST"] as SpeechSpeed[]).map((speed) => (
              <button
                key={speed}
                type="button"
                onClick={() => setSpeechSpeed(speed)}
                className={`py-2 text-xs font-bold rounded-xl border text-center transition cursor-pointer ${
                  speechSpeed === speed
                    ? "bg-teal-600 text-white border-teal-600 shadow-xs"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {speed} ({speed === "SLOW" ? "0.75x" : speed === "FAST" ? "1.25x" : "1.0x"})
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
