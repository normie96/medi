// Client Speech Service for MediLens
// Plays audio using Web Speech API synthesis or server Gemini audio

import { api } from "./api.js";

class SpeechService {
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private currentAudio: HTMLAudioElement | null = null;

  stop() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
  }

  async speak(
    text: string,
    language: "en" | "hi" | "kha" = "en",
    speed: "SLOW" | "NORMAL" | "FAST" = "NORMAL",
    onStart?: () => void,
    onEnd?: () => void,
    onError?: (msg: string) => void
  ): Promise<void> {
    this.stop();

    if (!text || text.trim() === "") return;

    const rate = speed === "SLOW" ? 0.75 : speed === "FAST" ? 1.25 : 1.0;

    // Check if browser Web Speech API is supported
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      // First check server for Gemini TTS audio (if enabled)
      try {
        const serverRes = await api.synthesizeSpeech(text, language);
        if (serverRes.audioBase64) {
          const audio = new Audio(`data:${serverRes.mimeType || "audio/wav"};base64,${serverRes.audioBase64}`);
          this.currentAudio = audio;
          audio.playbackRate = rate;
          if (onStart) audio.onplay = () => onStart();
          if (onEnd) audio.onended = () => onEnd();
          if (onError) audio.onerror = () => onError("Audio playback error");
          await audio.play();
          return;
        }
      } catch (e) {
        // Fall back to Web Speech API
      }

      const utterance = new SpeechSynthesisUtterance(text);
      this.currentUtterance = utterance;
      utterance.rate = rate;
      utterance.pitch = 1.0;

      // Select matching voice
      const voices = window.speechSynthesis.getVoices();
      if (language === "hi") {
        utterance.lang = "hi-IN";
        const hiVoice = voices.find((v) => v.lang.includes("hi"));
        if (hiVoice) utterance.voice = hiVoice;
      } else if (language === "kha") {
        // Khasi Latin alphabet matches Indian English phonetics best
        utterance.lang = "en-IN";
        const inVoice = voices.find((v) => v.lang.includes("en-IN") || v.lang.includes("hi"));
        if (inVoice) utterance.voice = inVoice;
      } else {
        utterance.lang = "en-US";
        const enVoice = voices.find((v) => v.lang.includes("en-US") || v.lang.includes("en-GB"));
        if (enVoice) utterance.voice = enVoice;
      }

      if (onStart) utterance.onstart = () => onStart();
      if (onEnd) utterance.onend = () => onEnd();
      if (onError) utterance.onerror = (e) => onError(e.error);

      window.speechSynthesis.speak(utterance);
    } else {
      if (onError) onError("Voice speech playback is not supported in this browser.");
    }
  }
}

export const speechService = new SpeechService();
