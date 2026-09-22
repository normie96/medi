import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ShieldAlert,
  Sliders,
  Sparkles,
  Menu,
  X,
  FileText,
  Pill,
  Clock,
  UserCheck,
  Stethoscope,
  LayoutDashboard,
  Radio
} from "lucide-react";
import { LanguageSelector } from "./LanguageSelector.js";
import { AccessibilityControls } from "./AccessibilityControls.js";
import { LiveVoiceModal } from "./LiveVoiceModal.js";
import { useAccessibility } from "../contexts/AccessibilityContext.js";
import { useLanguage } from "../contexts/LanguageContext.js";
import { useAuth } from "../contexts/AuthContext.js";

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { t } = useLanguage();
  const { user } = useAuth();
  const { simpleMode, setSimpleMode, contrastMode } = useAccessibility();
  const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);
  const [isLiveVoiceOpen, setIsLiveVoiceOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isHighContrast = contrastMode === "HIGH_CONTRAST";

  const navLinks = [
    { to: "/dashboard", label: t("navDashboard"), icon: LayoutDashboard },
    { to: "/scan", label: t("navScan"), icon: FileText },
    { to: "/medicines", label: t("navMedicine"), icon: Pill },
    { to: "/schedule", label: t("navSchedule"), icon: Clock },
    { to: "/doctors", label: t("navDoctors"), icon: Stethoscope }
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-40 border-b backdrop-blur-md transition-colors ${
          isHighContrast
            ? "bg-slate-900/95 border-slate-700 text-white"
            : "bg-white/95 border-slate-200/90 text-slate-800"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-xs group-hover:bg-teal-700 transition">
                <span className="font-bold text-lg tracking-tight">M</span>
              </div>
              <div>
                <span className="font-extrabold text-lg tracking-tight text-teal-900 group-hover:text-teal-700 transition">
                  MediLens
                </span>
                <span className="hidden sm:inline-block text-2xs text-teal-700 font-semibold ml-2 px-2 py-0.5 rounded-full bg-teal-50 border border-teal-200">
                  Healthcare Clarity
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.to;

                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg transition-colors ${
                      isActive
                        ? "bg-teal-50 text-teal-800"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Right Controls: Simple Mode Toggle, Language, Accessibility, User */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Gemini Live Voice Conversation Button */}
              <button
                type="button"
                onClick={() => setIsLiveVoiceOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer bg-teal-600 hover:bg-teal-700 text-white shadow-xs"
                title="Start real-time voice conversation with gemini-3.8-live"
              >
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                <span>Live Voice</span>
              </button>

              {/* Simple Mode Toggle */}
              <button
                type="button"
                onClick={() => setSimpleMode(!simpleMode)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  simpleMode
                    ? "bg-teal-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
                }`}
                title="Toggle Simple Language and High Readability"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Simple Mode: {simpleMode ? "ON" : "OFF"}</span>
              </button>

              {/* Language Selector */}
              <LanguageSelector compact />

              {/* Accessibility Settings */}
              <button
                type="button"
                onClick={() => setIsAccessModalOpen(true)}
                className="p-2 rounded-lg text-slate-600 hover:text-teal-700 hover:bg-slate-100 border border-slate-200 cursor-pointer transition"
                title="Accessibility Preferences (Text Size, Contrast, Voice)"
              >
                <Sliders className="w-4 h-4" />
              </button>

              {/* User Link */}
              <Link
                to="/profile"
                className="flex items-center gap-2 pl-2 border-l border-slate-200 text-xs font-bold text-slate-700 hover:text-teal-800"
              >
                <div className="w-7 h-7 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-xs font-bold">
                  {user?.name ? user.name[0] : "U"}
                </div>
                <span className="hidden xl:inline">{user?.name || "Demo User"}</span>
              </Link>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                type="button"
                onClick={() => setIsLiveVoiceOpen(true)}
                className="p-1.5 rounded-lg bg-teal-600 text-white"
                title="Live Voice"
              >
                <Radio className="w-4 h-4" />
              </button>
              <LanguageSelector compact />
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white p-4 space-y-3">
            <div className="grid grid-cols-1 gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.to;

                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2 p-2.5 rounded-lg text-sm font-semibold ${
                      isActive ? "bg-teal-50 text-teal-800" : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsLiveVoiceOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-teal-600 text-white flex items-center gap-1.5"
              >
                <Radio className="w-3.5 h-3.5" />
                <span>Live Voice</span>
              </button>

              <button
                type="button"
                onClick={() => setSimpleMode(!simpleMode)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                  simpleMode ? "bg-teal-600 text-white" : "bg-slate-100 text-slate-700"
                }`}
              >
                Simple Mode: {simpleMode ? "ON" : "OFF"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsAccessModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="p-2 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Accessibility</span>
              </button>
            </div>
          </div>
        )}
      </header>

      <AccessibilityControls
        isOpen={isAccessModalOpen}
        onClose={() => setIsAccessModalOpen(false)}
      />

      <LiveVoiceModal
        isOpen={isLiveVoiceOpen}
        onClose={() => setIsLiveVoiceOpen(false)}
      />
    </>
  );
};
