// Medicine Service for MediLens
// Handles medicine identification, search, verified purpose lookup, and prescription matching

import { db } from "../db/database.js";
import { VerifiedMedicineData } from "../db/seedData.js";
import { getGeminiClient, generateWithFallback } from "./geminiClient.js";

export interface MedicineIdentificationResult {
  detectedText: string;
  detectedName: string;
  detectedStrength: string;
  confidence: number;
  isLowConfidence: boolean;
  medicine: VerifiedMedicineData | null;
  warningNotice?: string;
}

export interface PrescriptionMatchResult {
  status: "MATCH" | "STRENGTH_MISMATCH" | "NOT_IN_PRESCRIPTION";
  title: string;
  message: string;
  prescribedMedicineName: string;
  prescribedStrength?: string;
  scannedMedicineName: string;
  scannedStrength?: string;
  verifiedDetails?: VerifiedMedicineData | null;
}

export class MedicineService {
  async getAll(): Promise<VerifiedMedicineData[]> {
    return db.getAllMedicines();
  }

  async getById(id: string): Promise<VerifiedMedicineData | null> {
    return db.getMedicineById(id);
  }

  async search(query: string): Promise<VerifiedMedicineData[]> {
    return db.searchMedicines(query);
  }

  // Identify medicine from strip/box image or manual name
  async identify(nameOrImage: string, isImage = false): Promise<MedicineIdentificationResult> {
    let detectedText = nameOrImage;
    let detectedName = nameOrImage;
    let detectedStrength = "";
    let confidence = 0.95;
    let isLowConfidence = false;

    const ai = getGeminiClient();
    if (isImage && nameOrImage.startsWith("data:image") && ai) {
      try {
        const matches = nameOrImage.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
        if (matches) {
          const mimeType = matches[1];
          const base64Data = matches[2];

          const response = await generateWithFallback(
            {
              contents: {
                parts: [
                  { inlineData: { mimeType, data: base64Data } },
                  {
                    text: `Analyze this medicine strip or box package image.
Identify:
1. Exact medicine / active ingredient name (e.g. Pantoprazole, Paracetamol, Amoxicillin, Azithromycin)
2. Strength (e.g. 40 mg, 500 mg, 650 mg, 5 mg)
3. Confidence score (0.0 to 1.0)
Reply in format: Name | Strength | Confidence`
                  }
                ]
              }
            },
            "gemini-3.8-flash"
          );

          const reply = response.text || "";
          detectedText = reply;
          const parts = reply.split("|").map((p) => p.trim());
          if (parts.length >= 2) {
            detectedName = parts[0];
            detectedStrength = parts[1];
            confidence = parts[2] ? parseFloat(parts[2]) : 0.92;
          }
        }
      } catch (e) {
        console.warn("AI strip identification fallback:", e);
      }
    } else {
      // Manual name parse (e.g. "Pantoprazole 40mg" or "Dolo 650")
      const strengthMatch = nameOrImage.match(/(\d+\s*(?:mg|mcg|ml|g))/i);
      if (strengthMatch) {
        detectedStrength = strengthMatch[1];
        detectedName = nameOrImage.replace(strengthMatch[0], "").trim();
      }
    }

    // Lookup in verified database
    const matched = await db.findMedicineByName(detectedName);
    if (!matched) {
      isLowConfidence = true;
      confidence = 0.55;
    }

    return {
      detectedText,
      detectedName: matched ? matched.genericName : detectedName,
      detectedStrength: detectedStrength || (matched ? matched.strength : ""),
      confidence,
      isLowConfidence,
      medicine: matched,
      warningNotice: isLowConfidence
        ? "We couldn't confidently identify this medicine. Please verify the information manually or search by name."
        : undefined
    };
  }

  // Prescription <-> Medicine Matching
  async matchAgainstPrescription(
    userId: string,
    scannedMedicineName: string,
    scannedStrength: string
  ): Promise<PrescriptionMatchResult> {
    const prescriptions = await db.getPrescriptionsByUserId(userId);
    const activePrescriptions = prescriptions.filter((p) => p.status === "ACTIVE");

    const cleanScanned = scannedMedicineName.toLowerCase().trim();
    const cleanScannedStrength = scannedStrength.toLowerCase().replace(/\s/g, "");

    let foundMedicineInRx: any = null;

    for (const rx of activePrescriptions) {
      for (const med of rx.medicines) {
        const prescribedClean = med.prescribedName.toLowerCase().trim();
        if (
          cleanScanned.includes(prescribedClean) ||
          prescribedClean.includes(cleanScanned)
        ) {
          foundMedicineInRx = med;
          break;
        }
      }
      if (foundMedicineInRx) break;
    }

    const verifiedDetails = await db.findMedicineByName(scannedMedicineName);

    if (!foundMedicineInRx) {
      return {
        status: "NOT_IN_PRESCRIPTION",
        title: "⚠️ Not Found in Active Prescription",
        message: "This medicine does not appear in your verified active prescriptions. Please consult your doctor or pharmacist before taking this medication.",
        prescribedMedicineName: "None in active prescriptions",
        scannedMedicineName,
        scannedStrength,
        verifiedDetails
      };
    }

    const cleanPrescribedStrength = foundMedicineInRx.prescribedStrength.toLowerCase().replace(/\s/g, "");

    // Check strength
    if (
      cleanScannedStrength &&
      cleanPrescribedStrength &&
      cleanScannedStrength !== cleanPrescribedStrength
    ) {
      return {
        status: "STRENGTH_MISMATCH",
        title: "⚠️ Strength Mismatch Detected",
        message: "The scanned medicine has a different strength from your verified prescription. Taking an altered strength can lead to under-dosing or overdosing. Please confirm with your doctor or pharmacist.",
        prescribedMedicineName: foundMedicineInRx.prescribedName,
        prescribedStrength: foundMedicineInRx.prescribedStrength,
        scannedMedicineName,
        scannedStrength,
        verifiedDetails
      };
    }

    return {
      status: "MATCH",
      title: "✓ Verified Prescription Match",
      message: "This medicine appears to match both the medicine name and prescribed strength in your verified prescription.",
      prescribedMedicineName: foundMedicineInRx.prescribedName,
      prescribedStrength: foundMedicineInRx.prescribedStrength,
      scannedMedicineName,
      scannedStrength: scannedStrength || foundMedicineInRx.prescribedStrength,
      verifiedDetails
    };
  }
}

export const medicineService = new MedicineService();
