// Doctor Controller for MediLens

import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware.js";
import { doctorService } from "../services/doctorService.js";

export async function getDoctors(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { q, specialty, city, lat, lng, maxDistance } = req.query;

    const userLat = lat ? parseFloat(lat as string) : undefined;
    const userLng = lng ? parseFloat(lng as string) : undefined;
    const maxDist = maxDistance ? parseFloat(maxDistance as string) : undefined;

    const results = await doctorService.search(
      q as string,
      specialty as string,
      city as string,
      userLat,
      userLng,
      maxDist
    );

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: "Failed to search doctors." });
  }
}

export async function getDoctorById(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const doc = await doctorService.getById(id);

    if (!doc) {
      res.status(404).json({ error: "Doctor not found in directory." });
      return;
    }

    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch doctor details." });
  }
}

export async function identifyPrescriptionDoctor(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { registrationNumber, doctorName } = req.body;
    const result = await doctorService.identifyPrescriptionDoctor(registrationNumber, doctorName);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to identify doctor." });
  }
}
