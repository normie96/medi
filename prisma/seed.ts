// Prisma Seed script for MediLens
// Run with: npm run seed or npx tsx prisma/seed.ts

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { VERIFIED_MEDICINES, VERIFIED_DOCTORS } from "../server/db/seedData.js";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding MediLens database with verified medical records...");

  // Seed Default Demo User
  const defaultPassword = await bcrypt.hash("MediLens2026!", 10);
  const user = await prisma.user.upsert({
    where: { email: "demo@medilens.health" },
    update: {},
    create: {
      email: "demo@medilens.health",
      name: "Alex Marak",
      passwordHash: defaultPassword,
      preferredLanguage: "ENGLISH",
      textSize: "MEDIUM",
      contrastMode: "NORMAL",
      speechEnabled: true,
      speechSpeed: "NORMAL",
      speechLanguage: "ENGLISH"
    }
  });

  console.log(`Seeded default demo user: ${user.email}`);

  // Seed Medicines
  for (const med of VERIFIED_MEDICINES) {
    await prisma.medicine.upsert({
      where: { id: med.id },
      update: {
        usedFor: med.usedFor,
        generalPurpose: med.generalPurpose,
        commonUses: med.commonUses,
        commonSideEffects: med.commonSideEffects,
        precautions: med.precautions
      },
      create: {
        id: med.id,
        genericName: med.genericName,
        brandName: med.brandName,
        strength: med.strength,
        form: med.form,
        drugClass: med.drugClass,
        generalPurpose: med.generalPurpose,
        usedFor: med.usedFor,
        commonUses: med.commonUses,
        commonSideEffects: med.commonSideEffects,
        precautions: med.precautions,
        prescriptionRequired: med.prescriptionRequired,
        simpleExplanation: med.simpleExplanation,
        hindiTranslation: med.hindiTranslation,
        khasiTranslation: med.khasiTranslation
      }
    });
  }
  console.log(`Seeded ${VERIFIED_MEDICINES.length} verified medicines.`);

  // Seed Doctors
  for (const doc of VERIFIED_DOCTORS) {
    await prisma.doctor.upsert({
      where: { registrationNumber: doc.registrationNumber },
      update: {
        name: doc.name,
        specialty: doc.specialty,
        hospitalOrClinic: doc.hospitalOrClinic,
        address: doc.address,
        phone: doc.phone
      },
      create: {
        id: doc.id,
        name: doc.name,
        registrationNumber: doc.registrationNumber,
        specialty: doc.specialty,
        qualification: doc.qualification,
        hospitalOrClinic: doc.hospitalOrClinic,
        address: doc.address,
        city: doc.city,
        state: doc.state,
        phone: doc.phone,
        openingHours: doc.openingHours,
        latitude: doc.latitude,
        longitude: doc.longitude,
        isVerified: doc.isVerified
      }
    });
  }
  console.log(`Seeded ${VERIFIED_DOCTORS.length} verified doctors.`);

  console.log("Database seed completed successfully.");
}

main()
  .catch((e) => {
    console.error("Error during Prisma seed:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
