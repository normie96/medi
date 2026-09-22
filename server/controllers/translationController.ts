// Translation Controller for MediLens

import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware.js";
import { translationService } from "../services/translationService.js";

export async function translateText(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { text, targetLanguage, sourceLanguage } = req.body;

    if (!text || !targetLanguage) {
      res.status(400).json({ error: "Text and targetLanguage ('en' | 'hi' | 'kha') are required." });
      return;
    }

    const result = await translationService.translate(
      text,
      targetLanguage,
      sourceLanguage || "en"
    );

    res.json(result);
  } catch (err) {
    console.error("Translation error:", err);
    res.status(500).json({ error: "Failed to process translation." });
  }
}
