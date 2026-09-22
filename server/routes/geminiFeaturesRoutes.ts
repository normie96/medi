import { Router, Request, Response } from "express";
import { getGeminiClient, generateWithFallback } from "../services/geminiClient.js";

const router = Router();

// 1. Google Search Grounding with gemini-3.5-flash
router.post("/search-grounding", async (req: Request, res: Response): Promise<void> => {
  try {
    const { query } = req.body;
    if (!query || typeof query !== "string") {
      res.status(400).json({ error: "Query string is required" });
      return;
    }

    const ai = getGeminiClient();
    if (!ai) {
      res.status(500).json({ error: "Gemini API client not initialized" });
      return;
    }

    const prompt = `You are a clinical and medical information assistant. Provide up-to-date, reliable, and evidence-grounded health/medicine information for this query:\n\n${query}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });

    const text = response.text || "";
    const rawChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    // Extract web search sources
    const sources = rawChunks
      .filter((chunk: any) => chunk.web && chunk.web.uri)
      .map((chunk: any) => ({
        title: chunk.web.title || "Web Source",
        uri: chunk.web.uri
      }));

    res.json({
      text,
      sources
    });
  } catch (err: any) {
    console.error("Search grounding error:", err);
    res.status(500).json({ error: err.message || "Failed to search with Google grounding" });
  }
});

// 2. Google Maps Grounding with gemini-3.5-flash
router.post("/maps-grounding", async (req: Request, res: Response): Promise<void> => {
  try {
    const { query, latitude, longitude } = req.body;
    if (!query || typeof query !== "string") {
      res.status(400).json({ error: "Query is required" });
      return;
    }

    const ai = getGeminiClient();
    if (!ai) {
      res.status(500).json({ error: "Gemini API client not initialized" });
      return;
    }

    const config: any = {
      tools: [{ googleMaps: {} }]
    };

    if (latitude !== undefined && longitude !== undefined) {
      config.toolConfig = {
        retrievalConfig: {
          latLng: {
            latitude: Number(latitude),
            longitude: Number(longitude)
          }
        }
      };
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: query,
      config
    });

    const text = response.text || "";
    const rawChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    // Extract map places and review links
    const places = rawChunks
      .filter((chunk: any) => chunk.maps && chunk.maps.uri)
      .map((chunk: any) => ({
        title: chunk.maps.title || "Google Maps Place",
        uri: chunk.maps.uri,
        reviewSnippets: chunk.maps.placeAnswerSources?.reviewSnippets || []
      }));

    res.json({
      text,
      places
    });
  } catch (err: any) {
    console.error("Maps grounding error:", err);
    res.status(500).json({ error: err.message || "Failed to query Google Maps grounding" });
  }
});

// 3. Audio Transcription with gemini-3.5-transcribe
router.post("/transcribe-audio", async (req: Request, res: Response): Promise<void> => {
  try {
    const { audioBase64, mimeType = "audio/webm" } = req.body;
    if (!audioBase64 || typeof audioBase64 !== "string") {
      res.status(400).json({ error: "audioBase64 string is required" });
      return;
    }

    const ai = getGeminiClient();
    if (!ai) {
      res.status(500).json({ error: "Gemini API client not initialized" });
      return;
    }

    // Clean base64 data prefix if present
    const cleanBase64 = audioBase64.replace(/^data:audio\/[^;]+;base64,/, "");

    const audioPart = {
      inlineData: {
        mimeType,
        data: cleanBase64
      }
    };

    const response = await ai.models.generateContent({
      model: "gemini-3.5-transcribe",
      contents: {
        parts: [
          audioPart,
          { text: "Transcribe this audio precisely. Return only the verbatim transcription text without conversational commentary." }
        ]
      }
    });

    const transcription = response.text?.trim() || "";
    res.json({ transcription });
  } catch (err: any) {
    console.error("Transcription error:", err);
    res.status(500).json({ error: err.message || "Failed to transcribe audio" });
  }
});

// 4. Multi-turn Gemini Chatbot with selectable models:
// - gemini-3.1-pro-preview (complex clinical tasks)
// - gemini-3.5-flash (general tasks)
// - gemini-3.1-flash-lite (fast tasks)
router.post("/chat", async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      messages,
      systemInstruction,
      model = "gemini-3.5-flash"
    } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({ error: "Messages array is required" });
      return;
    }

    const ai = getGeminiClient();
    if (!ai) {
      res.status(500).json({ error: "Gemini API client not initialized" });
      return;
    }

    // Validate supported model
    const allowedModels = [
      "gemini-3.8-flash",
      "gemini-3.5-flash",
      "gemini-3.1-flash-lite",
      "gemini-3.1-pro-preview"
    ];
    const targetModel = allowedModels.includes(model) ? model : "gemini-3.5-flash";

    // Format chat history into Gemini contents structure
    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === "assistant" || m.role === "model" ? "model" : "user",
      parts: [{ text: m.content }]
    }));

    const defaultRole = "You are MediLens Assistant, a compassionate, accurate, accessible clinical healthcare helper. You explain medical terminology simply, clarify prescription directions, support patients, and always include a sensible reminder to consult licensed physicians for critical emergencies.";

    const response = await generateWithFallback(
      {
        contents,
        config: {
          systemInstruction: systemInstruction || defaultRole
        }
      },
      targetModel
    );

    const reply = response.text || "";
    res.json({
      reply,
      modelUsed: targetModel
    });
  } catch (err: any) {
    console.error("Chat error:", err);
    res.status(500).json({ error: err.message || "Chat generation failed" });
  }
});

export default router;
