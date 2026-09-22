import React, { createContext, useContext, useState, useEffect } from "react";
import { LanguageCode } from "../types/index.js";

export type TextSize = "SMALL" | "MEDIUM" | "LARGE" | "XLARGE";
export type ContrastMode = "NORMAL" | "HIGH_CONTRAST";
export type SpeechSpeed = "SLOW" | "NORMAL" | "FAST";

interface AccessibilityContextType {
  textSize: TextSize;
  setTextSize: (size: TextSize) => void;
  contrastMode: ContrastMode;
  setContrastMode: (mode: ContrastMode) => void;
  simpleMode: boolean;
  setSimpleMode: (enabled: boolean) => void;
  speechEnabled: boolean;
  setSpeechEnabled: (enabled: boolean) => void;
  speechSpeed: SpeechSpeed;
  setSpeechSpeed: (speed: SpeechSpeed) => void;
  speechLanguage: LanguageCode;
  setSpeechLanguage: (lang: LanguageCode) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [textSize, setTextSizeState] = useState<TextSize>(() => {
    return (localStorage.getItem("medilens_text_size") as TextSize) || "MEDIUM";
  });

  const [contrastMode, setContrastModeState] = useState<ContrastMode>(() => {
    return (localStorage.getItem("medilens_contrast") as ContrastMode) || "NORMAL";
  });

  const [simpleMode, setSimpleModeState] = useState<boolean>(() => {
    return localStorage.getItem("medilens_simple_mode") === "true";
  });

  const [speechEnabled, setSpeechEnabledState] = useState<boolean>(() => {
    return localStorage.getItem("medilens_speech_enabled") !== "false";
  });

  const [speechSpeed, setSpeechSpeedState] = useState<SpeechSpeed>(() => {
    return (localStorage.getItem("medilens_speech_speed") as SpeechSpeed) || "NORMAL";
  });

  const [speechLanguage, setSpeechLanguageState] = useState<LanguageCode>(() => {
    return (localStorage.getItem("medilens_speech_lang") as LanguageCode) || "en";
  });

  const setTextSize = (size: TextSize) => {
    setTextSizeState(size);
    localStorage.setItem("medilens_text_size", size);
  };

  const setContrastMode = (mode: ContrastMode) => {
    setContrastModeState(mode);
    localStorage.setItem("medilens_contrast", mode);
  };

  const setSimpleMode = (enabled: boolean) => {
    setSimpleModeState(enabled);
    localStorage.setItem("medilens_simple_mode", enabled ? "true" : "false");
  };

  const setSpeechEnabled = (enabled: boolean) => {
    setSpeechEnabledState(enabled);
    localStorage.setItem("medilens_speech_enabled", enabled ? "true" : "false");
  };

  const setSpeechSpeed = (speed: SpeechSpeed) => {
    setSpeechSpeedState(speed);
    localStorage.setItem("medilens_speech_speed", speed);
  };

  const setSpeechLanguage = (lang: LanguageCode) => {
    setSpeechLanguageState(lang);
    localStorage.setItem("medilens_speech_lang", lang);
  };

  // Sync HTML root styling
  useEffect(() => {
    const root = document.documentElement;
    // Remove old classes
    root.classList.remove("text-size-small", "text-size-medium", "text-size-large", "text-size-xlarge", "high-contrast");

    if (textSize === "SMALL") root.classList.add("text-size-small");
    else if (textSize === "LARGE") root.classList.add("text-size-large");
    else if (textSize === "XLARGE") root.classList.add("text-size-xlarge");
    else root.classList.add("text-size-medium");

    if (contrastMode === "HIGH_CONTRAST") {
      root.classList.add("high-contrast");
    }
  }, [textSize, contrastMode]);

  return (
    <AccessibilityContext.Provider
      value={{
        textSize,
        setTextSize,
        contrastMode,
        setContrastMode,
        simpleMode,
        setSimpleMode,
        speechEnabled,
        setSpeechEnabled,
        speechSpeed,
        setSpeechSpeed,
        speechLanguage,
        setSpeechLanguage
      }}
    >
      <div
        className={`${
          contrastMode === "HIGH_CONTRAST" ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-800"
        } ${textSize === "XLARGE" ? "text-lg" : textSize === "LARGE" ? "text-base" : "text-sm"} min-h-screen transition-colors duration-200`}
      >
        {children}
      </div>
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = (): AccessibilityContextType => {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) throw new Error("useAccessibility must be used within AccessibilityProvider");
  return ctx;
};
