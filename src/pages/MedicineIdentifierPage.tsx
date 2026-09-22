import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Pill,
  Camera,
  Upload,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Globe,
  ExternalLink,
  Loader2
} from "lucide-react";
import { api } from "../services/api.js";
import { Medicine, PrescriptionMatchResult } from "../types/index.js";
import { MedicineCard } from "../components/MedicineCard.js";
import { PrescriptionMatchModal } from "../components/PrescriptionMatchModal.js";
import { VoiceInput } from "../components/VoiceInput.js";
import { useLanguage } from "../contexts/LanguageContext.js";

export const MedicineIdentifierPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [searchQuery, setSearchQuery] = useState("");
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isIdentifying, setIsIdentifying] = useState(false);

  // Google Search Grounding State (gemini-3.5-flash with googleSearch)
  const [searchGroundingQuery, setSearchGroundingQuery] = useState("");
  const [isGroundingSearching, setIsGroundingSearching] = useState(false);
  const [groundingResult, setGroundingResult] = useState<{
    text: string;
    sources: Array<{ title: string; uri: string }>;
  } | null>(null);

  // Strip Identification Result
  const [stripResult, setStripResult] = useState<any>(null);

  // Prescription Match Modal state
  const [matchModalResult, setMatchModalResult] = useState<PrescriptionMatchResult | null>(null);
  const [isMatchModalOpen, setIsMatchModalOpen] = useState(false);
  const [isMatching, setIsMatching] = useState(false);

  // Load all medicines on init
  useEffect(() => {
    loadMedicines();
  }, []);

  const loadMedicines = async (q?: string) => {
    setIsLoading(true);
    try {
      const data = await api.getMedicines(q);
      setMedicines(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadMedicines(searchQuery);
  };

  const handleSearchGrounding = async (queryText = searchGroundingQuery) => {
    if (!queryText.trim()) return;
    setIsGroundingSearching(true);
    try {
      const res = await api.searchWithGrounding(queryText);
      setGroundingResult(res);
    } catch (err) {
      console.error("Grounding search failed:", err);
    } finally {
      setIsGroundingSearching(false);
    }
  };

  const handleStripImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = async (evt) => {
        const base64 = evt.target?.result as string;
        setIsIdentifying(true);
        try {
          const res = await api.identifyMedicine(undefined, base64);
          setStripResult(res);
        } catch (err) {
          console.error(err);
        } finally {
          setIsIdentifying(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMatchWithPrescriptions = async (medicineName: string, strength?: string) => {
    setIsMatching(true);
    try {
      const result = await api.matchPrescription(medicineName, strength);
      setMatchModalResult(result);
      setIsMatchModalOpen(true);
    } catch (e) {
      console.error("Match error:", e);
    } finally {
      setIsMatching(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {t("navMedicine")} & Purpose Directory
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Search any medicine, scan a strip, or verify up-to-date medical knowledge using Google Search Grounding.
        </p>
      </div>

      {/* Google Search Grounding Bar (gemini-3.5-flash with googleSearch) */}
      <div className="p-5 bg-gradient-to-br from-emerald-50 to-teal-50/60 border border-emerald-200 rounded-3xl space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-xs">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-teal-950 flex items-center gap-1.5">
                Google Search Grounding
                <span className="text-2xs font-semibold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 border border-teal-200">
                  gemini-3.5-flash
                </span>
              </h3>
              <p className="text-2xs text-teal-700">Live clinical search grounding for new medicines, drug interactions, recalls, and warnings</p>
            </div>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearchGrounding();
          }}
          className="flex gap-2 flex-wrap"
        >
          <input
            type="text"
            value={searchGroundingQuery}
            onChange={(e) => setSearchGroundingQuery(e.target.value)}
            placeholder="E.g. What are the latest FDA/CDSCO warnings for Pantoprazole combined with Clopidogrel?"
            className="flex-1 min-w-[280px] px-3.5 py-2.5 text-xs rounded-xl bg-white border border-teal-200 font-medium focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
          />
          <VoiceInput
            onTranscript={(transcribed) => {
              setSearchGroundingQuery(transcribed);
              handleSearchGrounding(transcribed);
            }}
            buttonLabel="Voice"
            className="bg-white border-teal-200 text-teal-700"
          />
          <button
            type="submit"
            disabled={isGroundingSearching || !searchGroundingQuery.trim()}
            className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
          >
            {isGroundingSearching ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Searching Google...</span>
              </>
            ) : (
              <>
                <Search className="w-3.5 h-3.5" />
                <span>Search with Google Data</span>
              </>
            )}
          </button>
        </form>

        {/* Search Grounding Output & Web Sources */}
        {groundingResult && (
          <div className="p-4 bg-white rounded-2xl border border-teal-200/80 space-y-3">
            <div className="text-xs text-slate-800 leading-relaxed whitespace-pre-wrap">
              {groundingResult.text}
            </div>

            {groundingResult.sources && groundingResult.sources.length > 0 && (
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <span className="text-2xs font-bold text-slate-400 uppercase tracking-wider block">
                  Grounding Sources & Citations:
                </span>
                <div className="flex flex-wrap gap-2">
                  {groundingResult.sources.map((src, idx) => (
                    <a
                      key={idx}
                      href={src.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-bold transition"
                    >
                      <span>{src.title}</span>
                      <ExternalLink className="w-3 h-3 text-teal-500" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Dual Input: Search Box + Strip Camera Scanner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search Bar with Audio Transcription */}
        <form onSubmit={handleSearchSubmit} className="md:col-span-2 relative flex items-center">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              loadMedicines(e.target.value);
            }}
            placeholder="Search by generic or brand name (e.g. Pantoprazole, Paracetamol, Dolo 650, Amoxicillin)..."
            className="w-full pl-11 pr-24 py-3.5 rounded-2xl bg-white border border-slate-300 text-sm font-medium shadow-xs focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
          />
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-4" />
          <div className="absolute right-2">
            <VoiceInput
              onTranscript={(transcribed) => {
                setSearchQuery(transcribed);
                loadMedicines(transcribed);
              }}
              buttonLabel=""
              className="py-1 px-2 border-0 bg-transparent text-slate-500"
            />
          </div>
        </form>

        {/* Scan Strip / Package Box */}
        <div className="relative">
          <input
            type="file"
            accept="image/*"
            capture="environment"
            id="strip-file-input"
            onChange={handleStripImage}
            className="hidden"
          />
          <label
            htmlFor="strip-file-input"
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold shadow-xs cursor-pointer transition text-center"
          >
            <Camera className="w-4 h-4" />
            <span>{isIdentifying ? "Analyzing Strip..." : "Scan Medicine Strip"}</span>
          </label>
        </div>
      </div>

      {/* Strip Identification Box if active */}
      {stripResult && (
        <div className="p-6 bg-teal-50/70 border-2 border-teal-300 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-teal-600" />
              <h3 className="font-bold text-teal-950 text-base">Identified Medicine Strip</h3>
            </div>
            <span className="text-2xs font-bold text-teal-800 bg-white px-2.5 py-1 rounded-full border border-teal-200">
              Confidence: {Math.round(stripResult.confidence * 100)}%
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div>
              <div className="flex items-baseline gap-2">
                <h4 className="text-xl font-extrabold text-slate-900">{stripResult.detectedName}</h4>
                {stripResult.detectedStrength && (
                  <span className="text-sm font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded-md">
                    {stripResult.detectedStrength}
                  </span>
                )}
              </div>

              {/* CRITICAL REQUIREMENT: "Used for" displayed directly below identified name */}
              <div className="mt-2 p-3 bg-white rounded-xl border border-teal-200 text-xs">
                <span className="text-2xs font-bold uppercase text-teal-800 block mb-0.5">
                  {t("usedForLabel")}
                </span>
                <p className="font-semibold text-teal-950">
                  {stripResult.medicine?.usedFor || "General medical treatment for prescribed condition."}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:items-end">
              <button
                type="button"
                onClick={() =>
                  handleMatchWithPrescriptions(stripResult.detectedName, stripResult.detectedStrength)
                }
                disabled={isMatching}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 text-white text-xs font-bold hover:bg-teal-700 shadow-xs cursor-pointer transition"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Verify Against My Prescriptions</span>
              </button>

              {stripResult.medicine && (
                <button
                  type="button"
                  onClick={() => navigate(`/medicines/${stripResult.medicine.id}`)}
                  className="w-full sm:w-auto text-xs text-teal-700 hover:underline font-semibold text-center"
                >
                  View full pharmacology details →
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Verified Medicines Catalog */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900">
              Verified Medicines ({medicines.length})
            </h2>
            <span className="text-2xs text-slate-500">Every card shows medical purpose</span>
          </div>

          <span className="text-2xs text-emerald-800 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 inline-flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Verified Medical Database
          </span>
        </div>

        {medicines.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
            <Pill className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">No medicines found</p>
            <p className="text-xs text-slate-500 mt-1">Try searching by generic active ingredient or brand name.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {medicines.map((med) => (
              <MedicineCard
                key={med.id}
                medicine={med}
                onSelect={() => navigate(`/medicines/${med.id}`)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Prescription Match Verification Modal */}
      <PrescriptionMatchModal
        result={matchModalResult}
        isOpen={isMatchModalOpen}
        onClose={() => setIsMatchModalOpen(false)}
      />
    </div>
  );
};
