// Speech Controller for MediLens

import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware.js";
import { textToSpeechService } from "../services/textToSpeechService.js";

export async function synthesizeSpeech(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { text, language } = req.body;

    if (!text) {
      res.status(400).json({ error: "Text is required for speech synthesis." });
      return;
    }

    const result = await textToSpeechService.synthesize(text, language || "en");
    res.json(result);
  } catch (err) {
    console.error("Speech synthesis error:", err);
    res.status(500).json({ error: "Failed to generate speech." });
  }
}
