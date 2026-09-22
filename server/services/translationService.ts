// Translation Service for MediLens
// Supports English, Hindi, and Khasi with verified medical phrase dictionaries and safe AI fallback

import { KHASI_PHRASE_DICTIONARY, HINDI_PHRASE_DICTIONARY } from "../db/seedData.js";
import { getGeminiClient, generateWithFallback } from "./geminiClient.js";

export interface TranslationResponse {
  originalText: string;
  translatedText: string;
  sourceLanguage: "en" | "hi" | "kha";
  targetLanguage: "en" | "hi" | "kha";
  isVerifiedPhrase: boolean;
  status: "SUCCESS" | "FALLBACK_ENGLISH" | "PARTIAL";
  notice?: string;
}

export class TranslationService {
  private cache: Map<string, string> = new Map();

  async translate(
    text: string,
    targetLanguage: "en" | "hi" | "kha",
    sourceLanguage: "en" | "hi" | "kha" = "en"
  ): Promise<TranslationResponse> {
    const trimmed = text.trim();
    if (!trimmed || targetLanguage === sourceLanguage) {
      return {
        originalText: text,
        translatedText: text,
        sourceLanguage,
        targetLanguage,
        isVerifiedPhrase: true,
        status: "SUCCESS"
      };
    }

    const cacheKey = `${sourceLanguage}_${targetLanguage}_${trimmed}`;
    if (this.cache.has(cacheKey)) {
      return {
        originalText: text,
        translatedText: this.cache.get(cacheKey)!,
        sourceLanguage,
        targetLanguage,
        isVerifiedPhrase: true,
        status: "SUCCESS"
      };
    }

    // 1. Check curated verified medical dictionaries first
    if (targetLanguage === "kha") {
      if (KHASI_PHRASE_DICTIONARY[trimmed]) {
        const trans = KHASI_PHRASE_DICTIONARY[trimmed];
        this.cache.set(cacheKey, trans);
        return {
          originalText: text,
          translatedText: trans,
          sourceLanguage,
          targetLanguage,
          isVerifiedPhrase: true,
          status: "SUCCESS"
        };
      }

      // Check substring matches for compound instructions like "1 tablet before breakfast"
      let reconstructed = trimmed;
      let matchedCount = 0;
      for (const [enPhrase, khaPhrase] of Object.entries(KHASI_PHRASE_DICTIONARY)) {
        if (reconstructed.toLowerCase().includes(enPhrase.toLowerCase())) {
          reconstructed = reconstructed.replace(new RegExp(enPhrase, "gi"), khaPhrase);
          matchedCount++;
        }
      }

      if (matchedCount > 0) {
        this.cache.set(cacheKey, reconstructed);
        return {
          originalText: text,
          translatedText: reconstructed,
          sourceLanguage,
          targetLanguage,
          isVerifiedPhrase: true,
          status: "SUCCESS"
        };
      }
    }

    if (targetLanguage === "hi") {
      if (HINDI_PHRASE_DICTIONARY[trimmed]) {
        const trans = HINDI_PHRASE_DICTIONARY[trimmed];
        this.cache.set(cacheKey, trans);
        return {
          originalText: text,
          translatedText: trans,
          sourceLanguage,
          targetLanguage,
          isVerifiedPhrase: true,
          status: "SUCCESS"
        };
      }

      let reconstructed = trimmed;
      let matchedCount = 0;
      for (const [enPhrase, hiPhrase] of Object.entries(HINDI_PHRASE_DICTIONARY)) {
        if (reconstructed.toLowerCase().includes(enPhrase.toLowerCase())) {
          reconstructed = reconstructed.replace(new RegExp(enPhrase, "gi"), hiPhrase);
          matchedCount++;
        }
      }

      if (matchedCount > 0) {
        this.cache.set(cacheKey, reconstructed);
        return {
          originalText: text,
          translatedText: reconstructed,
          sourceLanguage,
          targetLanguage,
          isVerifiedPhrase: true,
          status: "SUCCESS"
        };
      }
    }

    // 2. For Hindi and English, try Gemini AI translation
    const ai = getGeminiClient();
    if (ai && (targetLanguage === "hi" || targetLanguage === "en")) {
      try {
        const langName = targetLanguage === "hi" ? "Hindi (हिन्दी)" : "English";
        const prompt = `Translate this patient healthcare instruction into plain, accessible ${langName}.
CRITICAL SAFETY RULES:
- Never alter medicine generic names, dosages (e.g., 500 mg, 40 mg), quantities, or frequency numbers.
- Translate patient instructions clearly so an elderly or rural patient easily understands.
- Return ONLY the translated string without quotes or preamble.

Text:
${trimmed}`;

        const res = await generateWithFallback(
          { contents: prompt },
          "gemini-3.8-flash"
        );

        const translated = res.text?.trim() || "";
        if (translated) {
          this.cache.set(cacheKey, translated);
          return {
            originalText: text,
            translatedText: translated,
            sourceLanguage,
            targetLanguage,
            isVerifiedPhrase: false,
            status: "SUCCESS"
          };
        }
      } catch (err) {
        console.warn("AI translation error:", err);
      }
    }

    // 3. For Khasi: If it is not in the curated verified medical dictionary, provide honest fallback
    if (targetLanguage === "kha") {
      return {
        originalText: text,
        translatedText: text,
        sourceLanguage,
        targetLanguage,
        isVerifiedPhrase: false,
        status: "FALLBACK_ENGLISH",
        notice: "Khasi translation is currently unavailable for this specific custom text. You can continue in English."
      };
    }

    return {
      originalText: text,
      translatedText: text,
      sourceLanguage,
      targetLanguage,
      isVerifiedPhrase: false,
      status: "FALLBACK_ENGLISH",
      notice: "Translation service temporarily unavailable. Displaying original text."
    };
  }
}

export const translationService = new TranslationService();
