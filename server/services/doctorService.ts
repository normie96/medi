// Doctor Service for MediLens
// Handles verified medical practitioners, specialty search, distance filtering, and prescription doctor identification

import { db } from "../db/database.js";
import { VerifiedDoctorData } from "../db/seedData.js";

export interface DoctorWithDistance extends VerifiedDoctorData {
  distanceKm?: number;
}

export class DoctorService {
  async getAll(): Promise<VerifiedDoctorData[]> {
    return db.getAllDoctors();
  }

  async getById(id: string): Promise<VerifiedDoctorData | null> {
    return db.getDoctorById(id);
  }

  async search(
    query?: string,
    specialty?: string,
    city?: string,
    userLat?: number,
    userLng?: number,
    maxDistanceKm?: number
  ): Promise<DoctorWithDistance[]> {
    let doctors = await db.searchDoctors(query, specialty, city);

    if (userLat !== undefined && userLng !== undefined) {
      doctors = doctors.map((doc) => {
        const distance = this.calculateDistanceKm(userLat, userLng, doc.latitude, doc.longitude);
        return {
          ...doc,
          distanceKm: Math.round(distance * 10) / 10
        };
      });

      // Filter by maxDistanceKm if specified
      if (maxDistanceKm) {
        doctors = doctors.filter((doc) => (doc as any).distanceKm <= maxDistanceKm);
      }

      // Sort by proximity
      doctors.sort((a, b) => ((a as any).distanceKm || 0) - ((b as any).distanceKm || 0));
    }

    return doctors;
  }

  // Prescription Doctor Identification
  // Uses Registration Number as the primary, highest-confidence identifier
  async identifyPrescriptionDoctor(
    registrationNumber?: string,
    doctorName?: string
  ): Promise<{
    matched: boolean;
    confidence: "HIGH" | "MEDIUM" | "NONE";
    doctor: VerifiedDoctorData | null;
    verificationNote: string;
  }> {
    if (registrationNumber && registrationNumber.trim()) {
      const doc = await db.findDoctorByRegistration(registrationNumber);
      if (doc) {
        return {
          matched: true,
          confidence: "HIGH",
          doctor: doc,
          verificationNote: `Verified in Medical Council Registry via Reg No: ${doc.registrationNumber}`
        };
      }
    }

    if (doctorName && doctorName.trim()) {
      const docs = await db.searchDoctors(doctorName);
      if (docs.length > 0) {
        return {
          matched: true,
          confidence: "MEDIUM",
          doctor: docs[0],
          verificationNote: `Matched in directory by name: ${docs[0].name} (${docs[0].hospitalOrClinic})`
        };
      }
    }

    return {
      matched: false,
      confidence: "NONE",
      doctor: null,
      verificationNote: "Doctor credentials could not be matched automatically in the verified directory."
    };
  }

  private calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth radius in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}

export const doctorService = new DoctorService();
