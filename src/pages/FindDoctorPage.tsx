import React, { useEffect, useState } from "react";
import {
  Stethoscope,
  Search,
  MapPin,
  Phone,
  Navigation,
  ShieldCheck,
  CheckCircle2,
  Filter,
  Sparkles,
  Award,
  ExternalLink,
  Loader2,
  Compass
} from "lucide-react";
import { api } from "../services/api.js";
import { Doctor } from "../types/index.js";
import { DoctorCard } from "../components/DoctorCard.js";
import { VoiceInput } from "../components/VoiceInput.js";
import { useLanguage } from "../contexts/LanguageContext.js";

export const FindDoctorPage: React.FC = () => {
  const { t } = useLanguage();

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Google Maps Grounding State (gemini-3.5-flash with googleMaps)
  const [mapsGroundingQuery, setMapsGroundingQuery] = useState("");
  const [isMapsSearching, setIsMapsSearching] = useState(false);
  const [mapsResult, setMapsResult] = useState<{
    text: string;
    places: Array<{ title: string; uri: string; reviewSnippets?: string[] }>;
  } | null>(null);

  // Doctor Verification by Registration No
  const [regSearchInput, setRegSearchInput] = useState("");
  const [verificationResult, setVerificationResult] = useState<any>(null);

  const specialties = [
    "Child Specialist",
    "Pediatrician",
    "Cardiologist",
    "Dermatologist",
    "Dentist",
    "Gynecologist",
    "Orthopedic",
    "Neurologist",
    "General Physician"
  ];

  const cities = ["Shillong", "Guwahati", "Delhi", "Mumbai", "Bangalore"];

  const loadDoctors = async (
    query = searchQuery,
    specialty = selectedSpecialty,
    city = selectedCity,
    loc = userLocation
  ) => {
    setIsLoading(true);
    try {
      const data = await api.getDoctors({
        q: query || undefined,
        specialty: specialty || undefined,
        city: city || undefined,
        lat: loc?.lat,
        lng: loc?.lng
      });
      setDoctors(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDoctors();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadDoctors(searchQuery, selectedSpecialty, selectedCity, userLocation);
  };

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(loc);
        setIsLocating(false);
        loadDoctors(searchQuery, selectedSpecialty, selectedCity, loc);
      },
      (err) => {
        console.warn("Using default coordinates:", err.message);
        const defaultLoc = { lat: 25.5788, lng: 91.8933 };
        setUserLocation(defaultLoc);
        setIsLocating(false);
        loadDoctors(searchQuery, selectedSpecialty, selectedCity, defaultLoc);
      }
    );
  };

  const handleVerifyRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regSearchInput.trim()) return;

    try {
      const res = await fetch("/api/doctors/identify-prescription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registrationNumber: regSearchInput, doctorName: regSearchInput })
      });
      const data = await res.json();
      setVerificationResult(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleMapsGroundingSearch = async (queryText = mapsGroundingQuery) => {
    if (!queryText.trim()) return;
    setIsMapsSearching(true);
    try {
      const res = await api.searchMapsWithGrounding(
        queryText,
        userLocation?.lat || 25.5788,
        userLocation?.lng || 91.8933
      );
      setMapsResult(res);
    } catch (err) {
      console.error("Maps grounding failed:", err);
    } finally {
      setIsMapsSearching(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {t("navDoctors")} & Medical Registry
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Search verified medical practitioners by specialty, find nearby clinics with Google Maps grounding, or check doctor registration credentials.
        </p>
      </div>

      {/* Google Maps Grounding Feature (gemini-3.5-flash with googleMaps) */}
      <div className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50/70 border border-blue-200 rounded-3xl space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-blue-950 flex items-center gap-1.5">
                Google Maps Grounding
                <span className="text-2xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                  gemini-3.5-flash
                </span>
              </h3>
              <p className="text-2xs text-blue-700">Find real-world clinics, pharmacies, and specialists with verified Google Maps URLs</p>
            </div>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleMapsGroundingSearch();
          }}
          className="flex gap-2 flex-wrap"
        >
          <input
            type="text"
            value={mapsGroundingQuery}
            onChange={(e) => setMapsGroundingQuery(e.target.value)}
            placeholder="E.g. What paediatricians and 24hr pharmacies are near Laitumkhrah or Woodland Hospital?"
            className="flex-1 min-w-[280px] px-3.5 py-2.5 text-xs rounded-xl bg-white border border-blue-200 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
          />
          <VoiceInput
            onTranscript={(transcribed) => {
              setMapsGroundingQuery(transcribed);
              handleMapsGroundingSearch(transcribed);
            }}
            buttonLabel="Voice"
            className="bg-white border-blue-200 text-blue-700"
          />
          <button
            type="submit"
            disabled={isMapsSearching || !mapsGroundingQuery.trim()}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
          >
            {isMapsSearching ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Searching Maps...</span>
              </>
            ) : (
              <>
                <MapPin className="w-3.5 h-3.5" />
                <span>Search Maps Grounding</span>
              </>
            )}
          </button>
        </form>

        {/* Maps Grounding Output & Links */}
        {mapsResult && (
          <div className="p-4 bg-white rounded-2xl border border-blue-200/80 space-y-3">
            <div className="text-xs text-slate-800 leading-relaxed whitespace-pre-wrap">
              {mapsResult.text}
            </div>

            {mapsResult.places && mapsResult.places.length > 0 && (
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <span className="text-2xs font-bold text-slate-400 uppercase tracking-wider block">
                  Grounding Sources & Google Maps Locations:
                </span>
                <div className="flex flex-wrap gap-2">
                  {mapsResult.places.map((place, idx) => (
                    <a
                      key={idx}
                      href={place.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 text-xs font-bold transition"
                    >
                      <MapPin className="w-3.5 h-3.5 text-blue-600" />
                      <span>{place.title}</span>
                      <ExternalLink className="w-3 h-3 text-blue-400" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Doctor Registration Number Verification Bar */}
      <div className="p-4 bg-teal-50/70 border border-teal-200 rounded-2xl space-y-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-teal-700" />
          <h3 className="font-bold text-xs uppercase tracking-wider text-teal-900">
            Verify Doctor Prescription Credentials
          </h3>
        </div>
        <form onSubmit={handleVerifyRegistration} className="flex gap-2 flex-wrap">
          <input
            type="text"
            value={regSearchInput}
            onChange={(e) => setRegSearchInput(e.target.value)}
            placeholder="Enter Registration No (e.g. SMC-48291, GMC-91823) or Doctor Name..."
            className="flex-1 min-w-[240px] px-3.5 py-2 text-xs rounded-xl bg-white border border-slate-300 font-semibold focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
          />
          <VoiceInput
            onTranscript={(transcribed) => setRegSearchInput(transcribed)}
            buttonLabel="Voice"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
          >
            Verify in Registry
          </button>
        </form>

        {verificationResult && (
          <div
            className={`p-3 rounded-xl border text-xs ${
              verificationResult.matched
                ? "bg-white border-emerald-300 text-emerald-900"
                : "bg-white border-amber-300 text-amber-900"
            }`}
          >
            <div className="flex items-center gap-2 font-bold">
              {verificationResult.matched ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <ShieldCheck className="w-4 h-4 text-amber-600" />
              )}
              <span>{verificationResult.verificationNote}</span>
            </div>
            {verificationResult.doctor && (
              <p className="mt-1 text-slate-600">
                <strong>{verificationResult.doctor.name}</strong> • {verificationResult.doctor.specialty} • {verificationResult.doctor.hospitalOrClinic}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Main Search & Filters */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Query input with voice transcribe */}
          <div className="md:col-span-2 relative flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                loadDoctors(e.target.value, selectedSpecialty, selectedCity, userLocation);
              }}
              placeholder="Search by doctor name or clinic..."
              className="w-full pl-10 pr-24 py-3 rounded-xl bg-white border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <div className="absolute right-2">
              <VoiceInput
                onTranscript={(transcribed) => {
                  setSearchQuery(transcribed);
                  loadDoctors(transcribed, selectedSpecialty, selectedCity, userLocation);
                }}
                buttonLabel=""
                className="py-1 px-2 border-0 bg-transparent text-slate-500"
              />
            </div>
          </div>

          {/* Specialty filter */}
          <div>
            <select
              value={selectedSpecialty}
              onChange={(e) => {
                setSelectedSpecialty(e.target.value);
                loadDoctors(searchQuery, e.target.value, selectedCity, userLocation);
              }}
              className="w-full p-3 rounded-xl bg-white border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
            >
              <option value="">All Specialties</option>
              {specialties.map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
          </div>

          {/* City filter */}
          <div>
            <select
              value={selectedCity}
              onChange={(e) => {
                setSelectedCity(e.target.value);
                loadDoctors(searchQuery, selectedSpecialty, e.target.value, userLocation);
              }}
              className="w-full p-3 rounded-xl bg-white border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
            >
              <option value="">All Cities</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Location & Quick Pill Row */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-2xs font-bold text-slate-400 uppercase tracking-wider mr-1">
              Popular:
            </span>
            {["Child Specialist", "Pediatrician", "Cardiologist", "General Physician"].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  setSelectedSpecialty(selectedSpecialty === s ? "" : s);
                  loadDoctors(searchQuery, selectedSpecialty === s ? "" : s, selectedCity, userLocation);
                }}
                className={`px-2.5 py-1 rounded-full text-xs font-semibold transition cursor-pointer ${
                  selectedSpecialty === s
                    ? "bg-teal-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleUseLocation}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-200 text-xs font-bold transition cursor-pointer"
          >
            <Navigation className="w-3.5 h-3.5 text-teal-600" />
            <span>{isLocating ? "Locating..." : userLocation ? "Doctors Near You" : "Find Doctors Near Me"}</span>
          </button>
        </div>
      </div>

      {/* Doctor Cards Directory */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">
            Verified Doctors ({doctors.length})
          </h2>
          <span className="text-2xs text-slate-500">Sorted by relevance and proximity</span>
        </div>

        {doctors.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
            <Stethoscope className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">No doctors found for this search</p>
            <p className="text-xs text-slate-500 mt-1">Try clearing filters or selecting another specialty.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {doctors.map((doc) => (
              <DoctorCard key={doc.id} doctor={doc} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

