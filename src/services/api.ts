// Client API service for MediLens

import { Medicine, Prescription, MedicationSchedule, Doctor, PrescriptionMatchResult } from "../types/index.js";

const TOKEN_KEY = "medilens_auth_token";

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem(TOKEN_KEY);
  const headers: HeadersInit = {
    "Content-Type": "application/json"
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

export const api = {
  // Auth
  async login(email: string, password: string) {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Login failed");
    }
    const data = await res.json();
    if (data.token) localStorage.setItem(TOKEN_KEY, data.token);
    return data;
  },

  async register(name: string, email: string, password: string, preferredLanguage = "ENGLISH") {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, preferredLanguage })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Registration failed");
    }
    const data = await res.json();
    if (data.token) localStorage.setItem(TOKEN_KEY, data.token);
    return data;
  },

  async getProfile() {
    const res = await fetch("/api/auth/me", { headers: getAuthHeaders() });
    if (!res.ok) throw new Error("Failed to load profile");
    return res.json();
  },

  async updateProfile(updates: any) {
    const res = await fetch("/api/auth/profile", {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error("Failed to update profile");
    return res.json();
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY);
  },

  // Prescriptions
  async processPrescriptionUpload(imageBase64?: string, sampleType?: string) {
    const res = await fetch("/api/prescriptions/upload", {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ imageBase64, sampleType })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to process prescription image");
    }
    return res.json();
  },

  async saveVerifiedPrescription(payload: any) {
    const res = await fetch("/api/prescriptions/verify", {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to save verified prescription");
    }
    return res.json();
  },

  async getPrescriptions(): Promise<Prescription[]> {
    const res = await fetch("/api/prescriptions", { headers: getAuthHeaders() });
    if (!res.ok) throw new Error("Failed to load prescriptions");
    return res.json();
  },

  async getPrescriptionById(id: string): Promise<Prescription> {
    const res = await fetch(`/api/prescriptions/${id}`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error("Prescription not found");
    return res.json();
  },

  async deletePrescription(id: string) {
    const res = await fetch(`/api/prescriptions/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders()
    });
    return res.json();
  },

  // Schedules
  async getSchedules(): Promise<MedicationSchedule[]> {
    const res = await fetch("/api/schedule", { headers: getAuthHeaders() });
    if (!res.ok) throw new Error("Failed to load medication schedule");
    return res.json();
  },

  async updateSchedule(id: string, updates: any) {
    const res = await fetch(`/api/schedule/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error("Failed to update schedule");
    return res.json();
  },

  async markTaken(id: string) {
    const res = await fetch(`/api/schedule/${id}/taken`, {
      method: "POST",
      headers: getAuthHeaders()
    });
    return res.json();
  },

  async markSkipped(id: string) {
    const res = await fetch(`/api/schedule/${id}/skipped`, {
      method: "POST",
      headers: getAuthHeaders()
    });
    return res.json();
  },

  async resetSchedule(id: string) {
    const res = await fetch(`/api/schedule/${id}/reset`, {
      method: "POST",
      headers: getAuthHeaders()
    });
    return res.json();
  },

  // Medicines
  async getMedicines(query?: string): Promise<Medicine[]> {
    const url = query ? `/api/medicines?q=${encodeURIComponent(query)}` : "/api/medicines";
    const res = await fetch(url, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error("Failed to load medicines");
    return res.json();
  },

  async getMedicineById(id: string): Promise<Medicine> {
    const res = await fetch(`/api/medicines/${id}`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error("Medicine not found");
    return res.json();
  },

  async identifyMedicine(medicineName?: string, imageBase64?: string) {
    const res = await fetch("/api/medicines/identify", {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ medicineName, imageBase64 })
    });
    if (!res.ok) throw new Error("Failed to identify medicine");
    return res.json();
  },

  async matchPrescription(medicineName: string, strength?: string): Promise<PrescriptionMatchResult> {
    const res = await fetch("/api/medicines/match", {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ medicineName, strength })
    });
    if (!res.ok) throw new Error("Failed to match prescription");
    return res.json();
  },

  // Doctors
  async getDoctors(params?: {
    q?: string;
    specialty?: string;
    city?: string;
    lat?: number;
    lng?: number;
    maxDistance?: number;
  }): Promise<Doctor[]> {
    const sp = new URLSearchParams();
    if (params?.q) sp.append("q", params.q);
    if (params?.specialty) sp.append("specialty", params.specialty);
    if (params?.city) sp.append("city", params.city);
    if (params?.lat !== undefined) sp.append("lat", params.lat.toString());
    if (params?.lng !== undefined) sp.append("lng", params.lng.toString());
    if (params?.maxDistance) sp.append("maxDistance", params.maxDistance.toString());

    const res = await fetch(`/api/doctors?${sp.toString()}`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error("Failed to load doctors");
    return res.json();
  },

  async getDoctorById(id: string): Promise<Doctor> {
    const res = await fetch(`/api/doctors/${id}`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error("Doctor not found");
    return res.json();
  },

  // Translation
  async translateText(text: string, targetLanguage: "en" | "hi" | "kha") {
    const res = await fetch("/api/translate", {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ text, targetLanguage })
    });
    return res.json();
  },

  // Speech
  async synthesizeSpeech(text: string, language: "en" | "hi" | "kha") {
    const res = await fetch("/api/text-to-speech", {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ text, language })
    });
    return res.json();
  },

  // Gemini Features
  async searchWithGrounding(query: string): Promise<{
    text: string;
    sources: Array<{ title: string; uri: string }>;
  }> {
    const res = await fetch("/api/gemini/search-grounding", {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ query })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Search grounding request failed");
    }
    return res.json();
  },

  async searchMapsWithGrounding(query: string, latitude?: number, longitude?: number): Promise<{
    text: string;
    places: Array<{ title: string; uri: string; reviewSnippets?: string[] }>;
  }> {
    const res = await fetch("/api/gemini/maps-grounding", {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ query, latitude, longitude })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Maps grounding request failed");
    }
    return res.json();
  },

  async transcribeAudio(audioBase64: string, mimeType = "audio/webm"): Promise<{ transcription: string }> {
    const res = await fetch("/api/gemini/transcribe-audio", {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ audioBase64, mimeType })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Audio transcription failed");
    }
    return res.json();
  },

  async sendChatMessage(
    messages: Array<{ role: "user" | "assistant" | "model"; content: string }>,
    systemInstruction?: string,
    model: "gemini-3.1-pro-preview" | "gemini-3.5-flash" | "gemini-3.1-flash-lite" = "gemini-3.5-flash"
  ): Promise<{ reply: string; modelUsed: string }> {
    const res = await fetch("/api/gemini/chat", {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ messages, systemInstruction, model })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Chat message request failed");
    }
    return res.json();
  }
};
