// Client-safe sample prescription presets for instant testing

export interface SamplePrescriptionPreset {
  id: string;
  name: string;
  doctor: string;
  text: string;
}

export const SAMPLE_PRESCRIPTIONS: SamplePrescriptionPreset[] = [
  {
    id: "pediatric",
    name: "Pediatric Prescription (Fever & Cough)",
    doctor: "Dr. Jennifer Lyngdoh (Bethany Hospital)",
    text: `Dr. Jennifer Lyngdoh, MBBS, MD (Pediatrics)
Bethany Hospital, Shillong
Reg: SMC-48291
1. Amoxicillin 250 mg - 1 tablet - Three times daily - After food - 5 days
2. Paracetamol 250 mg - 1 tablet - Twice daily - After food - 3 days`
  },
  {
    id: "cardio",
    name: "Cardiology Prescription (Hypertension)",
    doctor: "Dr. Rajesh Sharma (Apex Heart Clinic)",
    text: `Dr. Rajesh Sharma, MD, DM (Cardiology)
Apex Heart Clinic, Guwahati
Reg: NMC-83921
1. Metoprolol 25 mg - 1 tablet - Twice daily - With food - 30 days
2. Atorvastatin 10 mg - 1 tablet - Once daily - At bedtime - 30 days`
  },
  {
    id: "gastro",
    name: "Gastroenterology Prescription (Acid Reflux)",
    doctor: "Dr. Patricia Nongrum (Woodland Hospital)",
    text: `Dr. Patricia Nongrum, MBBS, MD (Internal Medicine)
Woodland Hospital, Shillong
Reg: SMC-39182
1. Pantoprazole 40 mg - 1 tablet - Once daily - 30 mins before breakfast - 14 days
2. Domperidone 10 mg - 1 tablet - Twice daily - Before meals - 7 days`
  }
];
