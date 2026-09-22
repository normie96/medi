// Multi-lingual UI translations for MediLens
// Supports English, Hindi, and Khasi

export interface TranslationDictionary {
  [key: string]: {
    en: string;
    hi: string;
    kha: string;
  };
}

export const UI_TRANSLATIONS: TranslationDictionary = {
  // Brand & Navigation
  appTitle: {
    en: "MediLens",
    hi: "मेडीलेन्स",
    kha: "MediLens"
  },
  tagline: {
    en: "Understand your prescription. Understand your medicines.",
    hi: "अपनी पर्ची को समझें। अपनी दवाइयों को समझें।",
    kha: "Sngewthuh ia ka kot dawai. Sngewthuh ia ki dawai jong phi."
  },
  subtitle: {
    en: "Turn confusing prescriptions into simple, accessible medication instructions in the language you understand.",
    hi: "कठिन डॉक्टर की पर्चियों को सरल, सुगम और अपनी भाषा में समझने योग्य दवा निर्देशों में बदलें।",
    kha: "Pynkylla ia ki kot dawai kiba eh ban sngewthuh sha ki jingbthah kiba shai ha ka ktien kaba phi sngewthuh."
  },
  navHome: {
    en: "Home",
    hi: "होम",
    kha: "Ing"
  },
  navDashboard: {
    en: "Dashboard",
    hi: "डैशबोर्ड",
    kha: "Dashboard"
  },
  navScan: {
    en: "Scan Prescription",
    hi: "पर्ची स्कैन करें",
    kha: "Scan Kot Dawai"
  },
  navMedicine: {
    en: "Identify Medicine",
    hi: "दवा पहचानें",
    kha: "Ithuh ia u Dawai"
  },
  navSchedule: {
    en: "Medication Schedule",
    hi: "दवा समय-सारणी",
    kha: "Por Bam Dawai"
  },
  navDoctors: {
    en: "Find a Doctor",
    hi: "डॉक्टर खोजें",
    kha: "Wad Doktor"
  },
  navProfile: {
    en: "Profile & Settings",
    hi: "प्रोफ़ाइल और सेटिंग्स",
    kha: "Profile & Settings"
  },

  // Common Actions & Badges
  btnScanPrescription: {
    en: "Scan Prescription",
    hi: "पर्ची स्कैन करें",
    kha: "Scan Kot Dawai"
  },
  btnIdentifyMedicine: {
    en: "Identify Medicine",
    hi: "दवा पहचानें",
    kha: "Ithuh ia u Dawai"
  },
  btnFindDoctor: {
    en: "Find a Doctor",
    hi: "डॉक्टर खोजें",
    kha: "Wad Doktor"
  },
  btnViewSchedule: {
    en: "View Schedule",
    hi: "समय-सारणी देखें",
    kha: "Peit Por Bam Dawai"
  },
  btnCustomizeSchedule: {
    en: "Customize Schedule",
    hi: "शेड्यूल कस्टमाइज़ करें",
    kha: "Pynbeit Por La Jong"
  },
  btnViewDetails: {
    en: "View Details",
    hi: "विवरण देखें",
    kha: "Peit Bniah"
  },
  btnListen: {
    en: "Listen",
    hi: "सुनें",
    kha: "Sngap"
  },
  btnTranslate: {
    en: "Translate",
    hi: "अनुवाद करें",
    kha: "Pynkylla Ktien"
  },
  btnEdit: {
    en: "Edit",
    hi: "संपादित करें",
    kha: "Pynbeit"
  },
  btnConfirm: {
    en: "Confirm & Save",
    hi: "पुष्टि करें और सहेजें",
    kha: "Pynskhem & Kynshew"
  },
  btnSaveSchedule: {
    en: "Save Schedule",
    hi: "शेड्यूल सहेजें",
    kha: "Kynshew ka Por"
  },
  btnResetPrescription: {
    en: "Reset to Prescription Schedule",
    hi: "मूल डॉक्टर शेड्यूल पर रीसेट करें",
    kha: "Pynbna biang kum ha ka kot dawai"
  },
  btnMarkTaken: {
    en: "Mark as Taken",
    hi: "ले लिया गया",
    kha: "La dep bam"
  },
  btnMarkSkipped: {
    en: "Mark as Skipped",
    hi: "छोड़ दिया",
    kha: "La pynklet"
  },

  // Medicine Details Labels
  usedForLabel: {
    en: "Used for:",
    hi: "उपयोग:",
    kha: "Ka jingpyndonkam:"
  },
  doseLabel: {
    en: "Dose:",
    hi: "मात्रा (खुराक):",
    kha: "Khyllup:"
  },
  frequencyLabel: {
    en: "Frequency:",
    hi: "बारंबारता:",
    kha: "Kaei ka por:"
  },
  timingLabel: {
    en: "Timing:",
    hi: "समय:",
    kha: "Ka por bam:"
  },
  durationLabel: {
    en: "Duration:",
    hi: "अवधि:",
    kha: "Katno sngi:"
  },
  sideEffectsLabel: {
    en: "Common side effects:",
    hi: "सामान्य दुष्प्रभाव:",
    kha: "Ki jingshitom ba lah ban mih:"
  },
  precautionsLabel: {
    en: "Important precautions:",
    hi: "महत्वपूर्ण सावधानियां:",
    kha: "Ki jingiada ba dei ban sumar:"
  },
  whatDoesItDoLabel: {
    en: "What does it do?",
    hi: "यह दवा क्या करती है?",
    kha: "Utrei aiu une u dawai?"
  },

  // Schedule Statuses
  statusUpcoming: {
    en: "Upcoming",
    hi: "आगामी",
    kha: "Ban sa wan"
  },
  statusTaken: {
    en: "Taken",
    hi: "ले ली गई",
    kha: "La dep bam"
  },
  statusSkipped: {
    en: "Skipped",
    hi: "छोड़ दी",
    kha: "La pynklet"
  },
  statusMissed: {
    en: "Missed",
    hi: "छूट गई",
    kha: "La lait"
  },
  statusCompleted: {
    en: "Completed",
    hi: "समाप्त",
    kha: "La dep baroh"
  },

  // Dashboard Greetings & Summary
  goodMorning: {
    en: "Good morning",
    hi: "शुभ प्रभात",
    kha: "Khublei mynstep"
  },
  goodAfternoon: {
    en: "Good afternoon",
    hi: "शुभ दोपहर",
    kha: "Khublei mynsngi"
  },
  goodEvening: {
    en: "Good evening",
    hi: "शुभ संध्या",
    kha: "Khublei janmiet"
  },
  todaysMedicines: {
    en: "Today's medicines",
    hi: "आज की दवाइयां",
    kha: "Ki dawai ban bam mynta ka sngi"
  },
  remainingMedicines: {
    en: "remaining",
    hi: "शेष हैं",
    kha: "kiba dang sah"
  },
  nextMedicine: {
    en: "Next medicine",
    hi: "अगली दवा",
    kha: "U dawai uba bud"
  },
  activePrescriptions: {
    en: "Active prescriptions",
    hi: "सक्रिय पर्चियां",
    kha: "Ki kot dawai kiba dang treikam"
  },

  // Verification & Safety Warnings
  verifyPrescriptionNotice: {
    en: "Please verify the extracted prescription before continuing.",
    hi: "कृपया जारी रखने से पहले निकाली गई पर्ची की जानकारी सत्यापित करें।",
    kha: "Sngewbha pynskhem shwa ia ki jingthoh kiba la pule shwa ban bteng."
  },
  lowConfidenceWarning: {
    en: "We couldn't confidently read this medicine. Please verify the information manually.",
    hi: "हम इस दवा को पूरी तरह स्पष्ट रूप से नहीं पढ़ सके। कृपया जानकारी की मैन्युअल रूप से जांच करें।",
    kha: "Ngim lah ban pule thikna ia une u dawai. Sngewbha peit bad pynbeit hi da lade."
  },
  medicalSafetyDisclaimer: {
    en: "Medical information is provided for educational purposes only. Do not change, stop, or start medication based solely on this application. Follow your doctor's prescription and consult a qualified healthcare professional for medical decisions.",
    hi: "चिकित्सा जानकारी केवल शैक्षिक उद्देश्यों के लिए प्रदान की जाती है। केवल इस एप्लिकेशन के आधार पर दवा को न बदलें, न रोकें और न ही शुरू करें। अपने डॉक्टर के पर्चे का पालन करें और चिकित्सीय निर्णयों के लिए योग्य स्वास्थ्य पेशेवर से परामर्श लें।",
    kha: "Kine ki jingtip shaphang ki dawai ki long tang na ka bynta ban sngewthuh. Wat pynsangeh, wat pynkylla lane bam dawai tang halor kane ka app. Bud thik ia ka jingbthah u doktor bad thoh pyrto bad ki nongtrei ka koit ka khiah."
  },
  scheduleWarningMedicalChange: {
    en: "Changing this information may affect your prescribed treatment. Please confirm with your doctor or pharmacist before changing the prescription.",
    hi: "इस जानकारी को बदलने से आपका निर्धारित उपचार प्रभावित हो सकता है। पर्चे में बदलाव करने से पहले कृपया अपने डॉक्टर या फार्मासिस्ट से पुष्टि करें।",
    kha: "Ka jingpynkylla ia kane ka lah ban ktah ia ka jingpynkoit jong phi. Sngewbha kylli shwa na u doktor lane u nongdie dawai shwa ban pynkylla."
  },
  scheduleSeparateNote: {
    en: "Your customized reminder times are saved separately. The original verified doctor prescription remains permanently intact.",
    hi: "आपके अनुकूलित रिमाइंडर समय अलग से सहेजे जाते हैं। डॉक्टर का मूल सत्यापित पर्चा हमेशा सुरक्षित रहता है।",
    kha: "Ka por ba phi pynbeit la jong ka kynshew kyrpang. Ka jingthoh thikna u doktor ka neh beit kumjuh."
  }
};
