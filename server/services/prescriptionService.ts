// Prescription Service for MediLens
// Handles prescription lifecycle, verification, and schedule generation

import { db, DBPrescription, DBPrescriptionMedicine } from "../db/database.js";
import { ocrService } from "./ocrService.js";
import { aiService, StructuredPrescriptionResult } from "./aiService.js";

export class PrescriptionService {
  async processUpload(
    userId: string,
    imageBase64OrSample: string,
    sampleType?: string
  ): Promise<{
    ocrRaw: string;
    ocrConfidence: number;
    structuredResult: StructuredPrescriptionResult;
  }> {
    // 1. OCR Step
    const ocrResult = await ocrService.processImage(imageBase64OrSample, sampleType);

    // 2. AI Structuring Step
    const structuredResult = await aiService.structurePrescription(ocrResult.rawText);

    const doc = structuredResult.doctor;
    const enrichedStructuredResult = {
      ...structuredResult,
      doctorInfo: {
        doctorName: doc.name,
        doctorRegistrationNo: doc.registrationNumber,
        doctorHospital: doc.hospital,
        doctorSpecialty: doc.specialty
      }
    };

    return {
      ocrRaw: ocrResult.rawText,
      ocrConfidence: ocrResult.confidence,
      structuredResult: enrichedStructuredResult as any
    };
  }

  async saveVerifiedPrescription(
    userId: string,
    payload: {
      doctorName?: string;
      doctorRegistrationNo?: string;
      doctorHospital?: string;
      doctorSpecialty?: string;
      rawOcrText?: string;
      ocrConfidence?: number;
      verificationNotes?: string;
      medicines: {
        name: string;
        strength: string;
        dose: string;
        frequency: string;
        timing: string;
        duration: string;
        specialInstructions?: string;
        matchedMedicineId?: string | null;
      }[];
    }
  ): Promise<{
    prescription: DBPrescription;
    schedules: any[];
  }> {
    const rxMedicines: DBPrescriptionMedicine[] = [];
    const tempPrescriptionId = `rx-${Date.now()}`;

    for (let i = 0; i < payload.medicines.length; i++) {
      const med = payload.medicines[i];
      const verifiedMed = med.matchedMedicineId
        ? await db.getMedicineById(med.matchedMedicineId)
        : await db.findMedicineByName(med.name);

      rxMedicines.push({
        id: `rxmed-${Date.now()}-${i}`,
        prescriptionId: tempPrescriptionId,
        medicineId: verifiedMed ? verifiedMed.id : null,
        prescribedName: verifiedMed ? verifiedMed.genericName : med.name,
        prescribedStrength: med.strength || (verifiedMed ? verifiedMed.strength : ""),
        prescribedDose: med.dose || "1 tablet",
        prescribedFrequency: med.frequency || "Once daily",
        prescribedTiming: med.timing || "After food",
        prescribedDuration: med.duration || "5 days",
        specialInstructions: med.specialInstructions || "",
        confidenceScore: 0.95,
        matchedMedicine: verifiedMed
      });
    }

    const prescription = await db.createPrescription({
      userId,
      doctorName: payload.doctorName || null,
      doctorRegistrationNo: payload.doctorRegistrationNo || null,
      doctorHospital: payload.doctorHospital || null,
      doctorSpecialty: payload.doctorSpecialty || null,
      prescriptionDate: new Date().toISOString(),
      imageUrl: null,
      rawOcrText: payload.rawOcrText || null,
      ocrConfidence: payload.ocrConfidence || 0.92,
      isVerifiedByUser: true,
      verificationNotes: payload.verificationNotes || "Verified by patient",
      status: "ACTIVE",
      medicines: rxMedicines
    });

    // Update the prescriptionId on each medicine
    for (const m of prescription.medicines) {
      m.prescriptionId = prescription.id;
    }

    // Automatically generate initial medication schedule items from verified prescription
    const schedules = await db.generateSchedulesFromPrescription(userId, prescription);

    return {
      prescription,
      schedules
    };
  }

  async getUserPrescriptions(userId: string): Promise<DBPrescription[]> {
    return db.getPrescriptionsByUserId(userId);
  }

  async getPrescriptionById(id: string): Promise<DBPrescription | null> {
    return db.getPrescriptionById(id);
  }

  async updatePrescription(id: string, data: Partial<DBPrescription>): Promise<DBPrescription | null> {
    return db.updatePrescription(id, data);
  }

  async deletePrescription(id: string): Promise<boolean> {
    return db.deletePrescription(id);
  }
}

export const prescriptionService = new PrescriptionService();
