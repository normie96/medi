// Medicine Controller for MediLens

import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware.js";
import { medicineService } from "../services/medicineService.js";

export async function getMedicines(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { q } = req.query;
    if (q && typeof q === "string") {
      const results = await medicineService.search(q);
      res.json(results);
    } else {
      const all = await medicineService.getAll();
      res.json(all);
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch medicines." });
  }
}

export async function getMedicineById(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const med = await medicineService.getById(id);

    if (!med) {
      res.status(404).json({ error: "Medicine not found in verified database." });
      return;
    }

    res.json(med);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch medicine details." });
  }
}

export async function identifyMedicine(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { imageBase64, medicineName } = req.body;

    if (!imageBase64 && !medicineName) {
      res.status(400).json({ error: "Please provide a medicine strip image or enter a medicine name." });
      return;
    }

    const isImage = Boolean(imageBase64);
    const input = imageBase64 || medicineName;
    const result = await medicineService.identify(input, isImage);

    res.json(result);
  } catch (err) {
    console.error("Medicine identification error:", err);
    res.status(500).json({ error: "Failed to identify medicine." });
  }
}

export async function matchPrescription(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const userId = req.user?.id || "user-demo-01";
    const { medicineName, strength } = req.body;

    if (!medicineName) {
      res.status(400).json({ error: "Medicine name is required for prescription matching." });
      return;
    }

    const matchResult = await medicineService.matchAgainstPrescription(userId, medicineName, strength || "");
    res.json(matchResult);
  } catch (err) {
    console.error("Prescription match error:", err);
    res.status(500).json({ error: "Failed to match medicine with prescription." });
  }
}
