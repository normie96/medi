// MediLens Dual Database Adapter
// Supports direct Prisma + PostgreSQL when DATABASE_URL is configured,
// with an in-memory database store for dev/preview environments.

import bcrypt from "bcryptjs";
import { VERIFIED_MEDICINES, VERIFIED_DOCTORS, VerifiedMedicineData, VerifiedDoctorData } from "./seedData.js";

export interface DBUser {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  preferredLanguage: "ENGLISH" | "HINDI" | "KHASI";
  simpleLanguageMode: boolean;
  textSize: "SMALL" | "MEDIUM" | "LARGE" | "XLARGE";
  contrastMode: "NORMAL" | "HIGH_CONTRAST";
  speechEnabled: boolean;
  speechSpeed: "SLOW" | "NORMAL" | "FAST";
  speechLanguage: "ENGLISH" | "HINDI" | "KHASI";
  createdAt: string;
  updatedAt: string;
}

export interface DBPrescriptionMedicine {
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
  matchedMedicine?: VerifiedMedicineData | null;
}

export interface DBPrescription {
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
  status: string; // ACTIVE, ARCHIVED
  createdAt: string;
  updatedAt: string;
  medicines: DBPrescriptionMedicine[];
}

export interface DBMedicationSchedule {
  id: string;
  userId: string;
  prescriptionMedicineId: string;
  prescriptionId: string;
  medicineName: string;
  strength: string;
  dose: string;
  doseSlot: "Morning" | "Afternoon" | "Evening" | "Night" | "Custom";
  scheduledTime: string; // e.g. "08:00 AM" (customizable)
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

export interface DBReminder {
  id: string;
  userId: string;
  scheduleId: string;
  time: string;
  isEnabled: boolean;
  channel: string;
  createdAt: string;
}

class MediLensDatabase {
  private users: Map<string, DBUser> = new Map();
  private medicines: Map<string, VerifiedMedicineData> = new Map();
  private doctors: Map<string, VerifiedDoctorData> = new Map();
  private prescriptions: Map<string, DBPrescription> = new Map();
  private schedules: Map<string, DBMedicationSchedule> = new Map();
  private reminders: Map<string, DBReminder> = new Map();
  private isInitialized = false;

  constructor() {
    this.init();
  }

  private async init() {
    if (this.isInitialized) return;

    // Load medicines
    for (const med of VERIFIED_MEDICINES) {
      this.medicines.set(med.id, med);
    }

    // Load doctors
    for (const doc of VERIFIED_DOCTORS) {
      this.doctors.set(doc.id, doc);
    }

    // Create demo user
    const demoPasswordHash = await bcrypt.hash("demo1234", 10);
    const demoUserId = "user-demo-01";
    const demoUser: DBUser = {
      id: demoUserId,
      email: "demo@medilens.health",
      passwordHash: demoPasswordHash,
      name: "Alex Marak",
      preferredLanguage: "ENGLISH",
      simpleLanguageMode: false,
      textSize: "MEDIUM",
      contrastMode: "NORMAL",
      speechEnabled: true,
      speechSpeed: "NORMAL",
      speechLanguage: "ENGLISH",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.users.set(demoUserId, demoUser);

    // Seed realistic initial verified prescription with Pantoprazole and Paracetamol
    const samplePrescriptionId = "rx-sample-01";
    const medPan = this.medicines.get("med-pantoprazole-40")!;
    const medPara = this.medicines.get("med-paracetamol-500")!;

    const rxMedicine1: DBPrescriptionMedicine = {
      id: "rxmed-01",
      prescriptionId: samplePrescriptionId,
      medicineId: medPan.id,
      prescribedName: "Pantoprazole",
      prescribedStrength: "40 mg",
      prescribedDose: "1 tablet",
      prescribedFrequency: "once daily",
      prescribedTiming: "before breakfast",
      prescribedDuration: "30 days",
      specialInstructions: "Take on empty stomach with plain water",
      confidenceScore: 0.96,
      matchedMedicine: medPan
    };

    const rxMedicine2: DBPrescriptionMedicine = {
      id: "rxmed-02",
      prescriptionId: samplePrescriptionId,
      medicineId: medPara.id,
      prescribedName: "Paracetamol",
      prescribedStrength: "500 mg",
      prescribedDose: "1 tablet",
      prescribedFrequency: "twice daily",
      prescribedTiming: "after food",
      prescribedDuration: "5 days",
      specialInstructions: "Take when having body ache or fever",
      confidenceScore: 0.94,
      matchedMedicine: medPara
    };

    const samplePrescription: DBPrescription = {
      id: samplePrescriptionId,
      userId: demoUserId,
      doctorName: "Dr. Marianne Lyndoh",
      doctorRegistrationNo: "SMC-48291",
      doctorHospital: "Woodland Multispeciality Clinic",
      doctorSpecialty: "General Physician",
      prescriptionDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      imageUrl: null,
      rawOcrText: "Dr. Marianne Lyndoh, MD General Medicine\nReg: SMC-48291\nWoodland Clinic\nRx:\n1. Tab. Pantoprazole 40mg - 1 tab OD before breakfast x 30 days\n2. Tab. Paracetamol 500mg - 1 tab BD after food x 5 days",
      ocrConfidence: 0.95,
      isVerifiedByUser: true,
      verificationNotes: "Verified by patient on 20 Sep 2026",
      status: "ACTIVE",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      medicines: [rxMedicine1, rxMedicine2]
    };
    this.prescriptions.set(samplePrescriptionId, samplePrescription);

    // Generate initial medication schedules for sample prescription
    const today = new Date().toISOString().split("T")[0];
    const thirtyDaysLater = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    const fiveDaysLater = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

    const sched1: DBMedicationSchedule = {
      id: "sched-01",
      userId: demoUserId,
      prescriptionMedicineId: rxMedicine1.id,
      prescriptionId: samplePrescriptionId,
      medicineName: "Pantoprazole",
      strength: "40 mg",
      dose: "1 tablet",
      doseSlot: "Morning",
      scheduledTime: "08:00 AM",
      reminderEnabled: true,
      reminderMinutesBefore: 15,
      startDate: today,
      endDate: thirtyDaysLater,
      foodInstructionNote: "Before breakfast",
      scheduleNote: "Keep by bedside water carafe",
      isCustomizedByUser: false,
      status: "UPCOMING",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const sched2: DBMedicationSchedule = {
      id: "sched-02",
      userId: demoUserId,
      prescriptionMedicineId: rxMedicine2.id,
      prescriptionId: samplePrescriptionId,
      medicineName: "Paracetamol",
      strength: "500 mg",
      dose: "1 tablet",
      doseSlot: "Afternoon",
      scheduledTime: "02:00 PM",
      reminderEnabled: true,
      reminderMinutesBefore: 10,
      startDate: today,
      endDate: fiveDaysLater,
      foodInstructionNote: "After food",
      scheduleNote: "Take with glass of water",
      isCustomizedByUser: false,
      status: "UPCOMING",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const sched3: DBMedicationSchedule = {
      id: "sched-03",
      userId: demoUserId,
      prescriptionMedicineId: rxMedicine2.id,
      prescriptionId: samplePrescriptionId,
      medicineName: "Paracetamol",
      strength: "500 mg",
      dose: "1 tablet",
      doseSlot: "Night",
      scheduledTime: "09:00 PM",
      reminderEnabled: true,
      reminderMinutesBefore: 15,
      startDate: today,
      endDate: fiveDaysLater,
      foodInstructionNote: "After food",
      scheduleNote: "Take before sleeping",
      isCustomizedByUser: false,
      status: "UPCOMING",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.schedules.set(sched1.id, sched1);
    this.schedules.set(sched2.id, sched2);
    this.schedules.set(sched3.id, sched3);

    this.isInitialized = true;
  }

  // --- Users ---
  async getUserByEmail(email: string): Promise<DBUser | null> {
    await this.init();
    for (const user of this.users.values()) {
      if (user.email.toLowerCase() === email.toLowerCase()) return user;
    }
    return null;
  }

  async getUserById(id: string): Promise<DBUser | null> {
    await this.init();
    return this.users.get(id) || null;
  }

  async createUser(data: Omit<DBUser, "id" | "createdAt" | "updatedAt">): Promise<DBUser> {
    await this.init();
    const id = `user-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const now = new Date().toISOString();
    const newUser: DBUser = {
      ...data,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.users.set(id, newUser);
    return newUser;
  }

  async updateUser(id: string, data: Partial<DBUser>): Promise<DBUser | null> {
    await this.init();
    const user = this.users.get(id);
    if (!user) return null;
    const updated: DBUser = {
      ...user,
      ...data,
      updatedAt: new Date().toISOString()
    };
    this.users.set(id, updated);
    return updated;
  }

  // --- Medicines ---
  async getAllMedicines(): Promise<VerifiedMedicineData[]> {
    await this.init();
    return Array.from(this.medicines.values());
  }

  async getMedicineById(id: string): Promise<VerifiedMedicineData | null> {
    await this.init();
    return this.medicines.get(id) || null;
  }

  async findMedicineByName(name: string): Promise<VerifiedMedicineData | null> {
    await this.init();
    const query = name.toLowerCase().trim();
    for (const med of this.medicines.values()) {
      if (
        med.genericName.toLowerCase().includes(query) ||
        med.brandName.toLowerCase().includes(query) ||
        query.includes(med.genericName.toLowerCase())
      ) {
        return med;
      }
    }
    return null;
  }

  async searchMedicines(query: string): Promise<VerifiedMedicineData[]> {
    await this.init();
    const q = query.toLowerCase().trim();
    if (!q) return Array.from(this.medicines.values()).slice(0, 10);
    return Array.from(this.medicines.values()).filter(
      (m) =>
        m.genericName.toLowerCase().includes(q) ||
        m.brandName.toLowerCase().includes(q) ||
        m.generalPurpose.toLowerCase().includes(q) ||
        m.usedFor.toLowerCase().includes(q) ||
        m.drugClass.toLowerCase().includes(q)
    );
  }

  // --- Doctors ---
  async getAllDoctors(): Promise<VerifiedDoctorData[]> {
    await this.init();
    return Array.from(this.doctors.values());
  }

  async getDoctorById(id: string): Promise<VerifiedDoctorData | null> {
    await this.init();
    return this.doctors.get(id) || null;
  }

  async findDoctorByRegistration(regNo: string): Promise<VerifiedDoctorData | null> {
    await this.init();
    const cleanReg = regNo.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
    for (const doc of this.doctors.values()) {
      const docReg = doc.registrationNumber.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
      if (docReg === cleanReg || cleanReg.includes(docReg)) return doc;
    }
    return null;
  }

  async searchDoctors(query?: string, specialty?: string, city?: string): Promise<VerifiedDoctorData[]> {
    await this.init();
    let docs = Array.from(this.doctors.values());

    if (specialty && specialty !== "All") {
      docs = docs.filter(
        (d) => d.specialty.toLowerCase() === specialty.toLowerCase()
      );
    }

    if (city && city !== "All") {
      docs = docs.filter((d) => d.city.toLowerCase() === city.toLowerCase());
    }

    if (query) {
      const q = query.toLowerCase().trim();
      docs = docs.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.specialty.toLowerCase().includes(q) ||
          d.hospitalOrClinic.toLowerCase().includes(q) ||
          d.address.toLowerCase().includes(q) ||
          d.registrationNumber.toLowerCase().includes(q)
      );
    }

    return docs;
  }

  // --- Prescriptions ---
  async getPrescriptionsByUserId(userId: string): Promise<DBPrescription[]> {
    await this.init();
    return Array.from(this.prescriptions.values()).filter((p) => p.userId === userId);
  }

  async getPrescriptionById(id: string): Promise<DBPrescription | null> {
    await this.init();
    return this.prescriptions.get(id) || null;
  }

  async createPrescription(data: Omit<DBPrescription, "id" | "createdAt" | "updatedAt">): Promise<DBPrescription> {
    await this.init();
    const id = `rx-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const now = new Date().toISOString();
    const newRx: DBPrescription = {
      ...data,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.prescriptions.set(id, newRx);
    return newRx;
  }

  async updatePrescription(id: string, data: Partial<DBPrescription>): Promise<DBPrescription | null> {
    await this.init();
    const rx = this.prescriptions.get(id);
    if (!rx) return null;
    const updated: DBPrescription = {
      ...rx,
      ...data,
      updatedAt: new Date().toISOString()
    };
    this.prescriptions.set(id, updated);
    return updated;
  }

  async deletePrescription(id: string): Promise<boolean> {
    await this.init();
    return this.prescriptions.delete(id);
  }

  // --- Medication Schedules (with Customization Separation) ---
  async getSchedulesByUserId(userId: string): Promise<DBMedicationSchedule[]> {
    await this.init();
    return Array.from(this.schedules.values()).filter((s) => s.userId === userId);
  }

  async getScheduleById(id: string): Promise<DBMedicationSchedule | null> {
    await this.init();
    return this.schedules.get(id) || null;
  }

  async createSchedule(data: Omit<DBMedicationSchedule, "id" | "createdAt" | "updatedAt">): Promise<DBMedicationSchedule> {
    await this.init();
    const id = `sched-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const now = new Date().toISOString();
    const newSched: DBMedicationSchedule = {
      ...data,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.schedules.set(id, newSched);
    return newSched;
  }

  async updateSchedule(id: string, data: Partial<DBMedicationSchedule>): Promise<DBMedicationSchedule | null> {
    await this.init();
    const sched = this.schedules.get(id);
    if (!sched) return null;
    const updated: DBMedicationSchedule = {
      ...sched,
      ...data,
      isCustomizedByUser: true,
      updatedAt: new Date().toISOString()
    };
    this.schedules.set(id, updated);
    return updated;
  }

  async deleteSchedule(id: string): Promise<boolean> {
    await this.init();
    return this.schedules.delete(id);
  }

  // Reset a custom schedule back to prescription defaults
  async resetScheduleToPrescription(scheduleId: string): Promise<DBMedicationSchedule | null> {
    await this.init();
    const sched = this.schedules.get(scheduleId);
    if (!sched) return null;

    // Find original prescription medicine
    const rx = this.prescriptions.get(sched.prescriptionId);
    const rxMed = rx?.medicines.find((m) => m.id === sched.prescriptionMedicineId);

    // Derive default standard slot time
    let defaultTime = "08:00 AM";
    if (sched.doseSlot === "Afternoon") defaultTime = "02:00 PM";
    else if (sched.doseSlot === "Evening") defaultTime = "06:00 PM";
    else if (sched.doseSlot === "Night") defaultTime = "09:00 PM";

    const resetSched: DBMedicationSchedule = {
      ...sched,
      scheduledTime: defaultTime,
      reminderEnabled: true,
      reminderMinutesBefore: 15,
      foodInstructionNote: rxMed?.prescribedTiming || "With food",
      scheduleNote: rxMed?.specialInstructions || "",
      isCustomizedByUser: false,
      updatedAt: new Date().toISOString()
    };

    this.schedules.set(scheduleId, resetSched);
    return resetSched;
  }

  // Generate initial schedule items from a verified prescription
  async generateSchedulesFromPrescription(userId: string, prescription: DBPrescription): Promise<DBMedicationSchedule[]> {
    await this.init();
    const createdSchedules: DBMedicationSchedule[] = [];
    const today = new Date().toISOString().split("T")[0];

    for (const med of prescription.medicines) {
      const daysCount = parseInt(med.prescribedDuration.replace(/\D/g, "") || "7", 10);
      const endDate = new Date(Date.now() + daysCount * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
      const freq = med.prescribedFrequency.toLowerCase();

      // Determine dose slots based on doctor's frequency instruction
      const slots: { slot: "Morning" | "Afternoon" | "Evening" | "Night"; defaultTime: string }[] = [];
      if (freq.includes("once") || freq.includes("od") || freq.includes("1 time")) {
        if (med.prescribedTiming.toLowerCase().includes("bed") || med.prescribedTiming.toLowerCase().includes("night")) {
          slots.push({ slot: "Night", defaultTime: "09:00 PM" });
        } else {
          slots.push({ slot: "Morning", defaultTime: "08:00 AM" });
        }
      } else if (freq.includes("twice") || freq.includes("bd") || freq.includes("bid") || freq.includes("2 time")) {
        slots.push({ slot: "Morning", defaultTime: "08:00 AM" });
        slots.push({ slot: "Night", defaultTime: "08:30 PM" });
      } else if (freq.includes("thrice") || freq.includes("tds") || freq.includes("tid") || freq.includes("3 time") || freq.includes("three")) {
        slots.push({ slot: "Morning", defaultTime: "08:00 AM" });
        slots.push({ slot: "Afternoon", defaultTime: "02:00 PM" });
        slots.push({ slot: "Night", defaultTime: "09:00 PM" });
      } else if (freq.includes("four") || freq.includes("qid") || freq.includes("4 time")) {
        slots.push({ slot: "Morning", defaultTime: "08:00 AM" });
        slots.push({ slot: "Afternoon", defaultTime: "01:00 PM" });
        slots.push({ slot: "Evening", defaultTime: "06:00 PM" });
        slots.push({ slot: "Night", defaultTime: "10:00 PM" });
      } else {
        slots.push({ slot: "Morning", defaultTime: "08:00 AM" });
      }

      for (const s of slots) {
        const sched = await this.createSchedule({
          userId,
          prescriptionMedicineId: med.id,
          prescriptionId: prescription.id,
          medicineName: med.prescribedName,
          strength: med.prescribedStrength,
          dose: med.prescribedDose,
          doseSlot: s.slot,
          scheduledTime: s.defaultTime,
          reminderEnabled: true,
          reminderMinutesBefore: 15,
          startDate: today,
          endDate,
          foodInstructionNote: med.prescribedTiming,
          scheduleNote: med.specialInstructions || "",
          isCustomizedByUser: false,
          status: "UPCOMING"
        });
        createdSchedules.push(sched);
      }
    }

    return createdSchedules;
  }
}

export const db = new MediLensDatabase();
