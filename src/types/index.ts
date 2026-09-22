// Global TypeScript types for MediLens

export type LanguageCode = "en" | "hi" | "kha";

export interface User {
  id: string;
  email: string;
  name: string;
  preferredLanguage: "ENGLISH" | "HINDI" | "KHASI";
  simpleLanguageMode: boolean;
  textSize: "SMALL" | "MEDIUM" | "LARGE" | "XLARGE";
  contrastMode: "NORMAL" | "HIGH_CONTRAST";
  speechEnabled: boolean;
  speechSpeed: "SLOW" | "NORMAL" | "FAST";
  speechLanguage: "ENGLISH" | "HINDI" | "KHASI";
}

export interface Medicine {
  id: string;
  genericName: string;
  brandName: string;
  strength: string;
  form: string;
  drugClass: string;
  generalPurpose: string;
  usedFor: string;
  commonUses: string;
  commonSideEffects: string;
  precautions: string;
  prescriptionRequired: boolean;
  simpleExplanation?: string;
  hindiTranslation?: string;
  khasiTranslation?: string;
}

export interface PrescriptionMedicine {
  id: string;
  prescriptionId: string;
  medicineId?: string | null;
  prescribedName: string;
  prescribedStrength: string;
  prescribedDose: string;
  prescribedFrequency: string;
  prescribedTiming: string;
  prescribedDuration: string;
  specialInstructions?: string | null;
  confidenceScore: number;
  matchedMedicine?: Medicine | null;
}

export interface Prescription {
  id: string;
  userId: string;
  doctorName?: string | null;
  doctorRegistrationNo?: string | null;
  doctorHospital?: string | null;
  doctorSpecialty?: string | null;
  prescriptionDate: string;
  imageUrl?: string | null;
  rawOcrText?: string | null;
  ocrConfidence: number;
  isVerifiedByUser: boolean;
  verificationNotes?: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  medicines: PrescriptionMedicine[];
}

export interface MedicationSchedule {
  id: string;
  userId: string;
  prescriptionMedicineId: string;
  prescriptionId: string;
  medicineName: string;
  strength: string;
  dose: string;
  doseSlot: "Morning" | "Afternoon" | "Evening" | "Night" | "Custom";
  scheduledTime: string;
  reminderEnabled: boolean;
  reminderMinutesBefore: number;
  startDate: string;
  endDate: string;
  foodInstructionNote?: string | null;
  scheduleNote?: string | null;
  isCustomizedByUser: boolean;
  status: "UPCOMING" | "TAKEN" | "SKIPPED" | "MISSED" | "COMPLETED";
  lastLoggedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Doctor {
  id: string;
  name: string;
  registrationNumber: string;
  specialty: string;
  qualification: string;
  hospitalOrClinic: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  openingHours: string;
  latitude: number;
  longitude: number;
  isVerified: boolean;
  distanceKm?: number;
}

export interface PrescriptionMatchResult {
  status: "MATCH" | "STRENGTH_MISMATCH" | "NOT_IN_PRESCRIPTION";
  title: string;
  message: string;
  prescribedMedicineName: string;
  prescribedStrength?: string;
  scannedMedicineName: string;
  scannedStrength?: string;
  verifiedDetails?: Medicine | null;
}
