import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext.js";
import { LanguageProvider } from "./contexts/LanguageContext.js";
import { AccessibilityProvider } from "./contexts/AccessibilityContext.js";
import { Navbar } from "./components/Navbar.js";
import { Footer } from "./components/Footer.js";
import { GeminiChatDrawer } from "./components/GeminiChatDrawer.js";

// Pages
import { HomePage } from "./pages/HomePage.js";
import { DashboardPage } from "./pages/DashboardPage.js";
import { ScanPrescriptionPage } from "./pages/ScanPrescriptionPage.js";
import { MedicineIdentifierPage } from "./pages/MedicineIdentifierPage.js";
import { MedicineDetailPage } from "./pages/MedicineDetailPage.js";
import { MedicationSchedulePage } from "./pages/MedicationSchedulePage.js";
import { FindDoctorPage } from "./pages/FindDoctorPage.js";
import { PrescriptionDetailPage } from "./pages/PrescriptionDetailPage.js";
import { ProfilePage } from "./pages/ProfilePage.js";

export function App() {
  return (
    <Router>
      <AuthProvider>
        <LanguageProvider>
          <AccessibilityProvider>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/scan" element={<ScanPrescriptionPage />} />
                  <Route path="/medicines" element={<MedicineIdentifierPage />} />
                  <Route path="/medicines/:id" element={<MedicineDetailPage />} />
                  <Route path="/schedule" element={<MedicationSchedulePage />} />
                  <Route path="/doctors" element={<FindDoctorPage />} />
                  <Route path="/prescriptions/:id" element={<PrescriptionDetailPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
              <Footer />
              <GeminiChatDrawer />
            </div>
          </AccessibilityProvider>
        </LanguageProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
