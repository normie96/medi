import { GoogleGenAI, GenerateContentParameters, GenerateContentResponse } from "@google/genai";

let aiInstance: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI | null {
  if (!aiInstance && process.env.GEMINI_API_KEY) {
    try {
      aiInstance = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build"
          }
        }
      });
    } catch (err) {
      console.warn("Failed to initialize GoogleGenAI client:", err);
    }
  }
  return aiInstance;
}

// Robust model failover sequence
// When spikes occur on newer models (e.g. 503 high demand), immediately fall over to reliable models
const MODEL_PRIORITY = [
  "gemini-3.5-flash",
  "gemini-3.8-flash",
  "gemini-3.1-flash-lite",
  "gemini-flash-latest"
];

const REQUEST_TIMEOUT_MS = 15000;

export async function generateWithFallback(
  params: Omit<GenerateContentParameters, "model">,
  preferredModel?: string,
  _maxRetries = 1
): Promise<GenerateContentResponse> {
  const ai = getGeminiClient();
  if (!ai) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const modelsToTry = preferredModel 
    ? [preferredModel, ...MODEL_PRIORITY.filter((m) => m !== preferredModel)]
    : MODEL_PRIORITY;

  let lastError: any = null;

  for (const model of modelsToTry) {
    try {
      const response = await Promise.race([
        ai.models.generateContent({
          ...params,
          model
        }),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error(`Model ${model} timed out after ${REQUEST_TIMEOUT_MS}ms`)), REQUEST_TIMEOUT_MS)
        )
      ]);
      return response;
    } catch (err: any) {
      lastError = err;
      const errMsg = err?.message || String(err);
      const is503 = errMsg.includes("503") || errMsg.includes("UNAVAILABLE") || errMsg.includes("high demand");
      
      if (is503) {
        // High demand spike on this model - silently switch to next model in priority without throwing
        console.info(`Model ${model} is experiencing temporary high demand (503). Smoothly switching to backup model...`);
      } else {
        console.warn(`Model ${model} failed, switching to backup model:`, errMsg.slice(0, 120));
      }
      continue;
    }
  }

  throw lastError || new Error("All Gemini model attempts failed.");
}
