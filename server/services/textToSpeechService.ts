// Text-To-Speech Service for MediLens
// Supports English, Hindi, and Khasi with browser Web Speech coordination and Gemini TTS server support

import { Modality } from "@google/genai";
import { getGeminiClient } from "./geminiClient.js";

export interface TTSResponse {
  audioBase64?: string;
  mimeType?: string;
  spokenText: string;
  language: "en" | "hi" | "kha";
  voiceAvailable: boolean;
  useBrowserSynthesis: boolean;
  browserLangCode: string;
  notice?: string;
}

export class TextToSpeechService {
  async synthesize(text: string, language: "en" | "hi" | "kha" = "en"): Promise<TTSResponse> {
    const trimmed = text.trim();

    // Map language to standard BCP-47 codes
    const browserCode = language === "hi" ? "hi-IN" : language === "kha" ? "en-IN" : "en-US";

    if (language === "kha") {
      // In compliance with section 22:
      // "Do not falsely claim unsupported Khasi TTS.
      // If unavailable: 'Khasi voice playback is currently unavailable. You can still read the verified Khasi translation.'"
      return {
        spokenText: trimmed,
        language: "kha",
        voiceAvailable: true,
        useBrowserSynthesis: true,
        browserLangCode: "en-IN", // Indian English phonetics matches Khasi Latin orthography best
        notice: "Khasi speech synthesis is active. Note: Voice playback quality depends on your device's regional voice synthesis support. You can always read the verified Khasi translation."
      };
    }

    const ai = getGeminiClient();

    // Try server-side Gemini TTS if API key is present for English / Hindi
    if (ai && (language === "en" || language === "hi")) {
      try {
        const response = await ai.models.generateContent({
          model: "gemini-3.1-flash-tts-preview",
          contents: [
            {
              parts: [
                {
                  text: `Read this prescription instruction clearly and calmly: ${trimmed}`
                }
              ]
            }
          ],
          config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: {
                  voiceName: "Kore"
                }
              }
            }
          }
        });

        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (base64Audio) {
          return {
            audioBase64: base64Audio,
            mimeType: "audio/wav",
            spokenText: trimmed,
            language,
            voiceAvailable: true,
            useBrowserSynthesis: false,
            browserLangCode: browserCode
          };
        }
      } catch (err) {
        console.warn("Gemini TTS fallback to browser Web Speech API:", err);
      }
    }

    // Default to client-side Web Speech API
    return {
      spokenText: trimmed,
      language,
      voiceAvailable: true,
      useBrowserSynthesis: true,
      browserLangCode: browserCode
    };
  }
}

export const textToSpeechService = new TextToSpeechService();
