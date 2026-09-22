// Prescription Controller for MediLens

import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware.js";
import { prescriptionService } from "../services/prescriptionService.js";

export async function processUpload(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const userId = req.user?.id || "user-demo-01";
    const { imageBase64, sampleType } = req.body;

    if (!imageBase64 && !sampleType) {
      res.status(400).json({ error: "Please provide a prescription image or select a sample." });
      return;
    }

    const result = await prescriptionService.processUpload(userId, imageBase64, sampleType);
    res.json(result);
  } catch (err: any) {
    console.error("Prescription upload error:", err);
    res.status(500).json({ error: err?.message || "Failed to process prescription image." });
  }
}

export async function verifyAndSave(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const userId = req.user?.id || "user-demo-01";
    const {
      doctorName,
      doctorRegistrationNo,
      doctorHospital,
      doctorSpecialty,
      rawOcrText,
      ocrConfidence,
      verificationNotes,
      medicines
    } = req.body;

    if (!medicines || !Array.isArray(medicines) || medicines.length === 0) {
      res.status(400).json({ error: "At least one verified medicine is required." });
      return;
    }

    const result = await prescriptionService.saveVerifiedPrescription(userId, {
      doctorName,
      doctorRegistrationNo,
      doctorHospital,
      doctorSpecialty,
      rawOcrText,
      ocrConfidence,
      verificationNotes,
      medicines
    });

    res.status(201).json({
      message: "Prescription verified and saved successfully. Medication schedule generated.",
      prescription: result.prescription,
      schedules: result.schedules
    });
  } catch (err) {
    console.error("Prescription verify error:", err);
    res.status(500).json({ error: "Failed to save verified prescription." });
  }
}

export async function getPrescriptions(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const userId = req.user?.id || "user-demo-01";
    const list = await prescriptionService.getUserPrescriptions(userId);
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch prescriptions." });
  }
}

export async function getPrescriptionById(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const item = await prescriptionService.getPrescriptionById(id);

    if (!item) {
      res.status(404).json({ error: "Prescription not found." });
      return;
    }

    res.json(item);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch prescription." });
  }
}

export async function deletePrescription(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const success = await prescriptionService.deletePrescription(id);
    if (!success) {
      res.status(404).json({ error: "Prescription not found." });
      return;
    }
    res.json({ message: "Prescription removed successfully." });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete prescription." });
  }
}
