// Seed and default data for MediLens
// Verified medicines, doctors directory, and patient instructions

export interface VerifiedMedicineData {
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
  simpleExplanation: string;
  hindiTranslation?: string;
  khasiTranslation?: string;
}

export interface VerifiedDoctorData {
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
}

export const VERIFIED_MEDICINES: VerifiedMedicineData[] = [
  {
    id: "med-pantoprazole-40",
    genericName: "Pantoprazole",
    brandName: "Pan 40 / Pantocid",
    strength: "40 mg",
    form: "Tablet",
    drugClass: "Proton Pump Inhibitor (PPI)",
    generalPurpose: "Reduces stomach acid production.",
    usedFor: "Reducing excess stomach acid and commonly used for acid-related stomach problems.",
    commonUses: "Gastroesophageal reflux disease (GERD), stomach ulcers, heartburn, and stomach protection when taking pain relievers.",
    commonSideEffects: "Headache, diarrhea, mild stomach pain, flatulence.",
    precautions: "Best taken on an empty stomach 30-60 minutes before morning breakfast. Swallow whole; do not chew or crush. Consult your doctor if taken long term.",
    prescriptionRequired: true,
    simpleExplanation: "What does it do? It reduces the amount of acid produced by your stomach so your food pipe and stomach can heal comfortably.",
    hindiTranslation: "पेट में अतिरिक्त एसिड को कम करने और एसिडिटी, सीने में जलन और छालों के इलाज के लिए उपयोग किया जाता है।",
    khasiTranslation: "Pyndonkam ban pynduna ia ka acid ha ka kpoh bad ban pynkoit ia ka jingpisa kpoh, jingsyit shadem bad ki prum kpoh."
  },
  {
    id: "med-paracetamol-500",
    genericName: "Paracetamol",
    brandName: "Crocin / Calpol / Dolo",
    strength: "500 mg",
    form: "Tablet",
    drugClass: "Analgesic & Antipyretic",
    generalPurpose: "Relieves pain and reduces fever.",
    usedFor: "Relieving pain and reducing fever.",
    commonUses: "Headaches, body aches, toothache, muscle sprains, post-vaccination fever, and common cold symptoms.",
    commonSideEffects: "Nausea, allergic skin rash (rare when taken within prescribed limits).",
    precautions: "Do not exceed 4,000 mg (8 tablets of 500mg) per day. Avoid drinking alcohol. Take with water after food.",
    prescriptionRequired: false,
    simpleExplanation: "What does it do? It blocks chemical messengers in the brain that tell us we have pain and regulates the body's internal thermostat to bring down a high fever.",
    hindiTranslation: "हल्के से मध्यम दर्द से राहत पाने और बुखार को सुरक्षित रूप से कम करने के लिए उपयोग किया जाता है।",
    khasiTranslation: "Pyndonkam ban pynjem ia ka jingshitom met, khlieh sawñ bad ban pynduna ia ka khieshoh."
  },
  {
    id: "med-paracetamol-650",
    genericName: "Paracetamol",
    brandName: "Dolo 650 / Calpol 650",
    strength: "650 mg",
    form: "Tablet",
    drugClass: "Analgesic & Antipyretic",
    generalPurpose: "Relieves moderate pain and high fever.",
    usedFor: "Relieving moderate pain and bringing down persistent high fever.",
    commonUses: "High viral fever, dengue/chikungunya body aches, severe joint pain, post-surgical discomfort.",
    commonSideEffects: "Mild stomach discomfort, rare allergic rash.",
    precautions: "Do not take concurrently with other paracetamol-containing cough syrups or cold tablets. Maintain at least 6 hours gap between doses.",
    prescriptionRequired: true,
    simpleExplanation: "What does it do? A stronger pain and fever relief tablet designed for persistent high fevers and heavy muscle aches.",
    hindiTranslation: "तेज बुखार और गंभीर बदन दर्द को कम करने के लिए इस्तेमाल किया जाता है।",
    khasiTranslation: "Pyndonkam ban pynrit ia ka khieshoh kaba jur bad ban pynjem ia ka jingpang met kaba jur."
  },
  {
    id: "med-amoxicillin-500",
    genericName: "Amoxicillin",
    brandName: "Mox 500 / Novamox",
    strength: "500 mg",
    form: "Capsule",
    drugClass: "Penicillin Antibiotic",
    generalPurpose: "Fights bacterial infections.",
    usedFor: "Treating bacterial infections such as chest infections, ear infections, throat infections, and dental abscesses.",
    commonUses: "Streptococcal pharyngitis, sinusitis, otitis media, bronchitis, and urinary tract infections.",
    commonSideEffects: "Loose stools, nausea, mild skin rash.",
    precautions: "Always finish the complete prescribed course even if you feel better earlier. Do not use for viral infections like flu or common colds. Inform doctor if allergic to penicillin.",
    prescriptionRequired: true,
    simpleExplanation: "What does it do? It stops bacteria from building protective cell walls, which destroys the infection-causing bacteria.",
    hindiTranslation: "गले, कान, छाती और दांतों में जीवाणु (बैक्टीरिया) संक्रमण का इलाज करने के लिए उपयोग किया जाता है।",
    khasiTranslation: "Pyndonkam ban pynkoit ia ki jingpang ba wan na ki khniang bacteria ha u pdot, ka shkor, ka shadem bad ki bniat."
  },
  {
    id: "med-azithromycin-500",
    genericName: "Azithromycin",
    brandName: "Azithral 500 / Azee",
    strength: "500 mg",
    form: "Tablet",
    drugClass: "Macrolide Antibiotic",
    generalPurpose: "Eliminates respiratory and throat bacterial infections.",
    usedFor: "Treating bacterial chest infections, tonsillitis, sinus infections, and skin infections.",
    commonUses: "Bacterial pneumonia, acute tonsillitis, chronic bronchitis flare-ups, and genital bacterial infections.",
    commonSideEffects: "Abdominal cramping, diarrhea, temporary change in taste.",
    precautions: "Usually taken once daily for 3 to 5 days. Take either 1 hour before a meal or 2 hours after food. Finish all tablets prescribed.",
    prescriptionRequired: true,
    simpleExplanation: "What does it do? It stops bacteria from producing the essential proteins they need to survive and multiply.",
    hindiTranslation: "छाती, गले और साइनस के बैक्टीरिया जनित संक्रमण को समाप्त करने के लिए निर्धारित किया जाता है।",
    khasiTranslation: "Pyndonkam ban pynkoit ia ka jingpang shadem, jingpang pdot bad ka jingpang kaba wan na ki khniang bacteria."
  },
  {
    id: "med-metformin-500",
    genericName: "Metformin",
    brandName: "Glycomet 500 / Glucophage",
    strength: "500 mg",
    form: "Tablet",
    drugClass: "Biguanide Antidiabetic",
    generalPurpose: "Lowers blood glucose levels in diabetes.",
    usedFor: "Lowering blood glucose levels in adults with type 2 diabetes.",
    commonUses: "Type 2 diabetes mellitus management, polycystic ovary syndrome (PCOS) insulin resistance.",
    commonSideEffects: "Upset stomach, metallic taste, nausea, gas (typically subsides after the first 2 weeks).",
    precautions: "Take with or right after meals to minimize stomach upset. Stay well hydrated. Inform your physician before any contrast dye scans.",
    prescriptionRequired: true,
    simpleExplanation: "What does it do? It helps your body respond normally to its own insulin and decreases the amount of sugar produced by your liver.",
    hindiTranslation: "टाइप 2 मधुमेह में रक्त शर्करा (ब्लड शुगर) के स्तर को नियंत्रित करने में मदद करता है।",
    khasiTranslation: "Pyndonkam ban pynduna ia ka shini (blood sugar) ha ka snam na ka bynta kito kiba don jingpang shini (diabetes)."
  },
  {
    id: "med-amlodipine-5",
    genericName: "Amlodipine",
    brandName: "Amlong 5 / Stamlo",
    strength: "5 mg",
    form: "Tablet",
    drugClass: "Calcium Channel Blocker (CCB)",
    generalPurpose: "Lowers high blood pressure and improves blood flow.",
    usedFor: "Lowering high blood pressure and preventing chest pain (angina).",
    commonUses: "Essential hypertension, chronic stable angina, coronary artery vasospasm.",
    commonSideEffects: "Swelling in ankles/feet, dizziness, flushing, fatigue.",
    precautions: "Do not stop taking abruptly even if you feel completely healthy. Rise slowly from sitting or lying positions. Avoid excessive grapefruit consumption.",
    prescriptionRequired: true,
    simpleExplanation: "What does it do? It relaxes and widens your blood vessels so your heart does not have to pump so hard against resistance.",
    hindiTranslation: "उच्च रक्तचाप को सामान्य करने और दिल के दौरे के जोखिम को कम करने के लिए उपयोग किया जाता है।",
    khasiTranslation: "Pyndonkam ban pynduna ia ka high blood pressure bad ban iada na ka jingthut u klongsnam."
  },
  {
    id: "med-atorvastatin-10",
    genericName: "Atorvastatin",
    brandName: "Atorva 10 / Lipitor",
    strength: "10 mg",
    form: "Tablet",
    drugClass: "HMG-CoA Reductase Inhibitor (Statin)",
    generalPurpose: "Lowers bad cholesterol (LDL) and triglycerides.",
    usedFor: "Lowering harmful cholesterol and reducing the risk of heart attacks and stroke.",
    commonUses: "Hypercholesterolemia, mixed dyslipidemia, coronary prevention in cardiovascular patients.",
    commonSideEffects: "Mild muscle ache, joint stiffness, slight digestive changes.",
    precautions: "Best taken once daily at night. Report unexplained muscle soreness or tenderness promptly to your physician. Avoid heavy alcohol intake.",
    prescriptionRequired: true,
    simpleExplanation: "What does it do? It blocks the liver enzyme that makes cholesterol, clearing out fatty deposits from your arteries.",
    hindiTranslation: "हानिकारक कोलेस्ट्रॉल (एलडीएल) को घटाने और हृदय को स्वस्थ रखने के लिए उपयोग किया जाता है।",
    khasiTranslation: "Pyndonkam ban pynduna ia ka khlein (cholesterol) ha ka snam bad ban iada ia u klongsnam."
  },
  {
    id: "med-cetirizine-10",
    genericName: "Cetirizine",
    brandName: "Cetzine 10 / Zyrtec / Okacet",
    strength: "10 mg",
    form: "Tablet",
    drugClass: "Second-Generation Antihistamine",
    generalPurpose: "Relieves allergy symptoms and itching.",
    usedFor: "Relieving allergy symptoms such as sneezing, runny nose, watery eyes, and allergic skin hives.",
    commonUses: "Allergic rhinitis, seasonal hay fever, chronic idiopathic urticaria, insect bite reactions.",
    commonSideEffects: "Mild drowsiness, dry mouth, headache.",
    precautions: "Best taken in the evening or before bed. Avoid driving or operating machinery if you experience drowsiness. Avoid alcohol.",
    prescriptionRequired: false,
    simpleExplanation: "What does it do? It blocks histamine, a natural compound your immune system releases when exposed to allergens like pollen or dust.",
    hindiTranslation: "एलर्जी के लक्षणों जैसे छींकने, नाक बहने, खुजली और चकत्तों से राहत दिलाने के लिए प्रयुक्त होती है।",
    khasiTranslation: "Pyndonkam ban pynjem ia ka jingsymphlen, jingjaw u khmut, jingshitom khmat bad jingthnam sniehdoh na ka allergy."
  },
  {
    id: "med-omeprazole-20",
    genericName: "Omeprazole",
    brandName: "Omez 20 / Prilosec",
    strength: "20 mg",
    form: "Capsule",
    drugClass: "Proton Pump Inhibitor (PPI)",
    generalPurpose: "Suppresses gastric acid secretions.",
    usedFor: "Treating acid reflux, persistent heartburn, and healing peptic stomach ulcers.",
    commonUses: "Acid indigestion, erosive esophagitis, Zollinger-Ellison syndrome, H. pylori eradication therapy.",
    commonSideEffects: "Mild nausea, headache, constipation or diarrhea.",
    precautions: "Take 30 minutes before your first meal of the day. Swallow capsules whole with a full glass of plain water.",
    prescriptionRequired: true,
    simpleExplanation: "What does it do? It turns down the acid pumps in your stomach lining to allow your digestive tract to soothe and recover.",
    hindiTranslation: "पेट में जलन, खट्टी डकार और अल्सर को ठीक करने के लिए पेट के एसिड को घटाता है।",
    khasiTranslation: "Pyndonkam ban pynduna ia ka acid ha ka kpoh bad ban pynkoit ia ka jingshit shadem bad prum kpoh."
  },
  {
    id: "med-ibuprofen-400",
    genericName: "Ibuprofen",
    brandName: "Brufen 400 / Advil",
    strength: "400 mg",
    form: "Tablet",
    drugClass: "Non-Steroidal Anti-Inflammatory Drug (NSAID)",
    generalPurpose: "Reduces inflammation, swelling, and acute pain.",
    usedFor: "Relieving inflammation, swelling, dental pain, arthritis, and menstrual cramps.",
    commonUses: "Osteoarthritis, rheumatoid arthritis, sprains, dental pain, menstrual pain (dysmenorrhea).",
    commonSideEffects: "Stomach burning, mild nausea, fluid retention.",
    precautions: "ALWAYS take with food or milk to safeguard stomach lining. Avoid if you have active stomach ulcers or severe kidney disease.",
    prescriptionRequired: true,
    simpleExplanation: "What does it do? It reduces the body's inflammatory chemicals that trigger localized swelling, heat, and pain.",
    hindiTranslation: "शरीर में सूजन, जोड़ों के दर्द और दांतों के दर्द को कम करने के लिए उपयोग किया जाता है।",
    khasiTranslation: "Pyndonkam ban pynduna ia ka jingswell, jingpang khrum bad jingpang bniat."
  },
  {
    id: "med-salbutamol-100",
    genericName: "Salbutamol",
    brandName: "Asthalin Inhaler / Ventolin",
    strength: "100 mcg",
    form: "Inhaler",
    drugClass: "Short-Acting Beta-2 Agonist (Bronchodilator)",
    generalPurpose: "Opens airways during asthma attacks.",
    usedFor: "Relieving sudden shortness of breath, wheezing, and chest tightness in asthma or bronchitis.",
    commonUses: "Acute asthma bronchospasm, exercise-induced asthma, chronic obstructive pulmonary disease (COPD).",
    commonSideEffects: "Temporary hand tremors, elevated heart rate, nervous jitteriness.",
    precautions: "Keep inhaler with you at all times for quick rescue relief. Rinse mouth with water after use. Seek emergency care if symptoms do not improve after 2-4 puffs.",
    prescriptionRequired: true,
    simpleExplanation: "What does it do? It relaxes tight muscles surrounding the breathing passages in your lungs within 3-5 minutes.",
    hindiTranslation: "अस्थमा और सांस की तकलीफ के दौरान सांस की नलियों को खोलकर सांस लेना आसान बनाता है।",
    khasiTranslation: "Pyndonkam ban plie ia ki thied ring-mynsiem ban pynsuk ia ka jingring-mynsiem ha ka por asthma."
  },
  {
    id: "med-losartan-50",
    genericName: "Losartan",
    brandName: "Losar 50 / Cozaar",
    strength: "50 mg",
    form: "Tablet",
    drugClass: "Angiotensin II Receptor Blocker (ARB)",
    generalPurpose: "Controls hypertension and protects kidneys.",
    usedFor: "Treating high blood pressure and protecting kidney health in diabetic patients.",
    commonUses: "Hypertension, diabetic nephropathy, stroke prevention in hypertensive patients with left ventricular hypertrophy.",
    commonSideEffects: "Dizziness, nasal congestion, fatigue.",
    precautions: "Take consistently at the same time each day. Have blood potassium and kidney tests checked periodically. Do not use during pregnancy.",
    prescriptionRequired: true,
    simpleExplanation: "What does it do? It blocks angiotensin hormone signals that cause blood vessels to constrict, keeping blood flow smooth.",
    hindiTranslation: "उच्च रक्तचाप को नियंत्रित करने और गुर्दे (किडनी) की रक्षा के लिए उपयोग किया जाता है।",
    khasiTranslation: "Pyndonkam ban tehlakam ia ka high blood pressure bad ban iada ia ki khyllai."
  },
  {
    id: "med-montelukast-10",
    genericName: "Montelukast",
    brandName: "Montair 10 / Singulair",
    strength: "10 mg",
    form: "Tablet",
    drugClass: "Leukotriene Receptor Antagonist",
    generalPurpose: "Prevents asthma attacks and manages seasonal allergies.",
    usedFor: "Preventing asthma symptoms, exercise-induced wheezing, and persistent allergic rhinitis.",
    commonUses: "Maintenance asthma management, allergic runny nose, night-time coughing.",
    commonSideEffects: "Headache, vivid dreams, mild gastrointestinal upset.",
    precautions: "Take once daily in the evening. Not intended for immediate relief of sudden severe asthma attacks (use rescue inhaler instead).",
    prescriptionRequired: true,
    simpleExplanation: "What does it do? It blocks leukotrienes, inflammatory substances that cause swelling and mucus in the lungs and airways.",
    hindiTranslation: "दमा (अस्थमा) के दौरों को रोकने और मौसमी एलर्जी के लक्षणों को नियंत्रित करने में सहायक है।",
    khasiTranslation: "Pyndonkam ban iada na ka jingthut ka asthma bad ban tehlakam ia ka allergy kaba jur."
  }
];

export const VERIFIED_DOCTORS: VerifiedDoctorData[] = [
  {
    id: "doc-1",
    name: "Dr. Marianne Lyndoh",
    registrationNumber: "SMC-48291",
    specialty: "General Physician",
    qualification: "MBBS, MD (General Medicine)",
    hospitalOrClinic: "Woodland Multispeciality Clinic",
    address: "Laitumkhrah Main Road, Near Cathedral",
    city: "Shillong",
    state: "Meghalaya",
    phone: "+91 364 222 4910",
    openingHours: "Mon-Sat: 09:00 AM - 04:30 PM",
    latitude: 25.5788,
    longitude: 91.8933,
    isVerified: true
  },
  {
    id: "doc-2",
    name: "Dr. Wanbha Kharkongor",
    registrationNumber: "SMC-59302",
    specialty: "Pediatrician",
    qualification: "MBBS, DCH, MD (Pediatrics)",
    hospitalOrClinic: "Bethany Children's Care Centre",
    address: "Nongrim Hills, Block 4",
    city: "Shillong",
    state: "Meghalaya",
    phone: "+91 364 250 1882",
    openingHours: "Mon-Fri: 10:00 AM - 05:00 PM, Sat: 10:00 AM - 01:00 PM",
    latitude: 25.5721,
    longitude: 91.9012,
    isVerified: true
  },
  {
    id: "doc-3",
    name: "Dr. Rajesh Sharma",
    registrationNumber: "NMC-83921",
    specialty: "Cardiologist",
    qualification: "MBBS, MD, DM (Cardiology)",
    hospitalOrClinic: "Apex Heart & Vascular Institute",
    address: "GS Road, Khanapara",
    city: "Guwahati",
    state: "Assam",
    phone: "+91 361 234 8900",
    openingHours: "Mon-Sat: 09:30 AM - 06:00 PM",
    latitude: 26.1158,
    longitude: 91.8080,
    isVerified: true
  },
  {
    id: "doc-4",
    name: "Dr. Priya Sengupta",
    registrationNumber: "WBC-31940",
    specialty: "Dermatologist",
    qualification: "MBBS, MD (Dermatology, Venereology & Leprosy)",
    hospitalOrClinic: "DermaCare Skin & Laser Clinic",
    address: "14 Park Street, Suite 3B",
    city: "Kolkata",
    state: "West Bengal",
    phone: "+91 33 2229 5411",
    openingHours: "Mon-Fri: 11:00 AM - 07:00 PM",
    latitude: 22.5512,
    longitude: 88.3533,
    isVerified: true
  },
  {
    id: "doc-5",
    name: "Dr. Arindam Das",
    registrationNumber: "DCI-72183",
    specialty: "Dentist",
    qualification: "BDS, MDS (Conservative Dentistry)",
    hospitalOrClinic: "SmileCraft Dental & Implant Care",
    address: "Police Bazar, Centre Point Mall",
    city: "Shillong",
    state: "Meghalaya",
    phone: "+91 364 222 7102",
    openingHours: "Mon-Sat: 10:00 AM - 06:30 PM",
    latitude: 25.5760,
    longitude: 91.8830,
    isVerified: true
  },
  {
    id: "doc-6",
    name: "Dr. Sunita Deshmukh",
    registrationNumber: "MMC-66291",
    specialty: "Gynecologist",
    qualification: "MBBS, MS (Obstetrics & Gynecology), DNB",
    hospitalOrClinic: "MatruCare Women's Specialty Hospital",
    address: "Bandra West, Linking Road",
    city: "Mumbai",
    state: "Maharashtra",
    phone: "+91 22 2640 1928",
    openingHours: "Mon-Sat: 09:00 AM - 05:00 PM",
    latitude: 19.0596,
    longitude: 72.8295,
    isVerified: true
  },
  {
    id: "doc-7",
    name: "Dr. Kevin Nongbri",
    registrationNumber: "SMC-91024",
    specialty: "Orthopedic",
    qualification: "MBBS, MS (Orthopedics), M.Ch",
    hospitalOrClinic: "Nongbri Bone, Joint & Spine Clinic",
    address: "Mawkhar Main Road, Near Presbyterian Church",
    city: "Shillong",
    state: "Meghalaya",
    phone: "+91 364 254 3918",
    openingHours: "Mon-Fri: 09:30 AM - 04:00 PM",
    latitude: 25.5815,
    longitude: 91.8790,
    isVerified: true
  },
  {
    id: "doc-8",
    name: "Dr. Vivek Chawla",
    registrationNumber: "DMC-44910",
    specialty: "Neurologist",
    qualification: "MBBS, MD (Medicine), DM (Neurology)",
    hospitalOrClinic: "NeuroLife Brain & Spine Center",
    address: "Pusa Road, Karol Bagh",
    city: "New Delhi",
    state: "Delhi",
    phone: "+91 11 4155 8820",
    openingHours: "Mon-Fri: 10:00 AM - 06:00 PM",
    latitude: 28.6448,
    longitude: 77.1906,
    isVerified: true
  },
  {
    id: "doc-9",
    name: "Dr. Amanda Roy",
    registrationNumber: "AMC-19284",
    specialty: "Child Specialist",
    qualification: "MBBS, MD (Pediatrics)",
    hospitalOrClinic: "LittleSteps Child & Infant Care",
    address: "Uzan Bazar, Near High Court",
    city: "Guwahati",
    state: "Assam",
    phone: "+91 361 251 4099",
    openingHours: "Mon-Sat: 10:00 AM - 05:30 PM",
    latitude: 26.1925,
    longitude: 91.7580,
    isVerified: true
  },
  {
    id: "doc-10",
    name: "Dr. Arthur Syiem",
    registrationNumber: "SMC-38192",
    specialty: "General Physician",
    qualification: "MBBS, DNB (Family Medicine)",
    hospitalOrClinic: "Syiem Community Family Health Center",
    address: "Mawlai Phudmuri, Block B",
    city: "Shillong",
    state: "Meghalaya",
    phone: "+91 364 259 8812",
    openingHours: "Mon-Sat: 08:30 AM - 03:00 PM",
    latitude: 25.6010,
    longitude: 91.8690,
    isVerified: true
  }
];

export const KHASI_PHRASE_DICTIONARY: Record<string, string> = {
  // Timings and Instructions
  "Take once daily": "Bam shisien ha ka shisngi",
  "Take twice daily": "Bam arsien ha ka shisngi",
  "Take three times daily": "Bam laisien ha ka shisngi",
  "Before breakfast": "Shwa ban bam ja step",
  "After food": "Hadien ba ladep bam ja",
  "Before food": "Shwa ban bam ja",
  "At bedtime": "Shwa ban thiah mynmiet",
  "With water": "Bad ka um",
  "Morning": "Mynstep",
  "Afternoon": "Mynsngi",
  "Evening": "Mynstep / Janmiet",
  "Night": "Mynmiet",
  "Take 1 tablet": "Bam 1 tylli u dawai",
  "Take 2 tablets": "Bam 2 tylli ki dawai",
  "Take 1 capsule": "Bam 1 tylli ka capsule",
  "1 tablet": "1 tylli u dawai",
  "2 tablets": "2 tylli ki dawai",
  "For 3 days": "Ia 3 sngi",
  "For 5 days": "Ia 5 sngi",
  "For 7 days": "Ia 7 sngi",
  "For 14 days": "Ia 14 sngi",
  "For 30 days": "Ia 30 sngi",
  "Upcoming": "Ban sa wan",
  "Taken": "La dep bam",
  "Skipped": "La pynklet",
  "Missed": "La lait",
  "Completed": "La dep baroh",
  "Used for:": "Pyndonkam na ka bynta:",
  "Common uses:": "Ki jingpyndonkam kiba kongsan:",
  "Common side effects:": "Ki jingshitom ba lah ban mih:",
  "Precautions:": "Ki jingiada ba dei ban sumar:"
};

export const HINDI_PHRASE_DICTIONARY: Record<string, string> = {
  "Take once daily": "दिन में एक बार लें",
  "Take twice daily": "दिन में दो बार लें",
  "Take three times daily": "दिन में तीन बार लें",
  "Before breakfast": "नाश्ते से पहले",
  "After food": "भोजन के बाद",
  "Before food": "भोजन से पहले",
  "At bedtime": "सोते समय",
  "With water": "पानी के साथ",
  "Morning": "सुबह",
  "Afternoon": "दोपहर",
  "Evening": "शाम",
  "Night": "रात",
  "Take 1 tablet": "1 गोली लें",
  "Take 2 tablets": "2 गोलियां लें",
  "Take 1 capsule": "1 कैप्सूल लें",
  "1 tablet": "1 गोली",
  "2 tablets": "2 गोलियां",
  "For 3 days": "3 दिनों के लिए",
  "For 5 days": "5 दिनों के लिए",
  "For 7 days": "7 दिनों के लिए",
  "For 14 days": "14 दिनों के लिए",
  "For 30 days": "30 दिनों के लिए",
  "Upcoming": "आगामी",
  "Taken": "ले ली गई",
  "Skipped": "छोड़ दी गई",
  "Missed": "छूट गई",
  "Completed": "समाप्त",
  "Used for:": "उपयोग:",
  "Common uses:": "सामान्य उपयोग:",
  "Common side effects:": "सामान्य दुष्प्रभाव:",
  "Precautions:": "सावधानियां:"
};
