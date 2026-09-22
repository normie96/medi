import React, { useState } from "react";
import { Volume2, VolumeX, Loader2 } from "lucide-react";
import { speechService } from "../services/speechService.js";
import { useAccessibility } from "../contexts/AccessibilityContext.js";
import { LanguageCode } from "../types/index.js";

interface SpeechButtonProps {
  text: string;
  language?: LanguageCode;
  className?: string;
  size?: "sm" | "md" | "lg";
  label?: string;
}

export const SpeechButton: React.FC<SpeechButtonProps> = ({
  text,
  language = "en",
  className = "",
  size = "md",
  label = "Listen"
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const { speechEnabled, speechSpeed } = useAccessibility();

  if (!speechEnabled) return null;

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isPlaying) {
      speechService.stop();
      setIsPlaying(false);
      return;
    }

    setIsSynthesizing(true);
    setNotice(null);

    speechService.speak(
      text,
      language,
      speechSpeed,
      () => {
        setIsSynthesizing(false);
        setIsPlaying(true);
      },
      () => {
        setIsPlaying(false);
        setIsSynthesizing(false);
      },
      (errMsg) => {
        setIsPlaying(false);
        setIsSynthesizing(false);
        setNotice(errMsg || "Voice playback unavailable");
        setTimeout(() => setNotice(null), 4000);
      }
    );
  };

  const sizeClasses =
    size === "sm"
      ? "px-2.5 py-1 text-xs"
      : size === "lg"
      ? "px-4 py-2.5 text-base"
      : "px-3 py-1.5 text-sm";

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={handleSpeak}
        title={isPlaying ? "Stop listening" : "Listen to audio instructions"}
        aria-label="Listen to audio instructions"
        className={`inline-flex items-center gap-1.5 font-medium rounded-full transition-all duration-200 cursor-pointer ${
          isPlaying
            ? "bg-teal-600 text-white shadow-md animate-pulse"
            : "bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-200"
        } ${sizeClasses} ${className}`}
      >
        {isSynthesizing ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : isPlaying ? (
          <VolumeX className="w-3.5 h-3.5" />
        ) : (
          <Volume2 className="w-3.5 h-3.5" />
        )}
        <span>{isPlaying ? "Stop" : label}</span>
      </button>

      {notice && (
        <div className="absolute left-0 bottom-full mb-1 z-30 w-56 p-2 text-xs bg-slate-800 text-slate-100 rounded-lg shadow-lg border border-slate-700">
          {notice}
        </div>
      )}
    </div>
  );
};
