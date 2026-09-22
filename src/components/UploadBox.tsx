import React, { useState, useRef } from "react";
import { UploadCloud, Camera, Image as ImageIcon, X, FileText, Sparkles } from "lucide-react";
import { SAMPLE_PRESCRIPTIONS } from "../data/samples.js";

interface UploadBoxProps {
  onImageSelected: (base64OrSample: string, sampleType?: string) => void;
  isLoading?: boolean;
}

export const UploadBox: React.FC<UploadBoxProps> = ({ onImageSelected, isLoading = false }) => {
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedSampleName, setSelectedSampleName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    setSelectedSampleName(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setPreviewUrl(base64);
      onImageSelected(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectSample = (sample: typeof SAMPLE_PRESCRIPTIONS[0]) => {
    setSelectedSampleName(sample.name);
    setPreviewUrl(null);
    onImageSelected("", sample.id);
  };

  const handleClear = () => {
    setPreviewUrl(null);
    setSelectedSampleName(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-4">
      {/* Upload Dropzone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 ${
          dragActive
            ? "border-teal-500 bg-teal-50/50"
            : previewUrl || selectedSampleName
            ? "border-teal-300 bg-white"
            : "border-slate-300 hover:border-teal-400 bg-white"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleChange}
          className="hidden"
          id="prescription-file-input"
        />

        {previewUrl ? (
          <div className="relative inline-block max-w-full">
            <img
              src={previewUrl}
              alt="Prescription preview"
              className="max-h-72 rounded-xl object-contain shadow-md mx-auto border border-slate-200"
            />
            <button
              type="button"
              onClick={handleClear}
              className="absolute -top-3 -right-3 p-1.5 bg-rose-600 text-white rounded-full hover:bg-rose-700 shadow-md cursor-pointer"
              title="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : selectedSampleName ? (
          <div className="py-4 text-center">
            <div className="inline-flex p-3 rounded-2xl bg-teal-100 text-teal-700 mb-2">
              <FileText className="w-8 h-8" />
            </div>
            <p className="font-bold text-slate-800 text-base">{selectedSampleName}</p>
            <p className="text-xs text-teal-600 font-medium mt-1">Sample prescription loaded & ready to extract</p>
            <button
              type="button"
              onClick={handleClear}
              className="mt-3 text-xs text-rose-600 hover:underline font-semibold cursor-pointer"
            >
              Choose a different prescription
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <UploadCloud className="w-7 h-7" />
            </div>

            <div>
              <p className="font-bold text-slate-800 text-base">
                Drag and drop your prescription image here
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Supports JPG, PNG, WEBP, or take a clear photo of the prescription slip
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <label
                htmlFor="prescription-file-input"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold hover:bg-teal-700 cursor-pointer shadow-xs transition"
              >
                <ImageIcon className="w-4 h-4" />
                <span>Upload from Device</span>
              </label>

              <label
                htmlFor="prescription-file-input"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-bold cursor-pointer transition border border-slate-200"
              >
                <Camera className="w-4 h-4 text-slate-600" />
                <span>Use Camera</span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Preset Sample Prescriptions for Instant Testing */}
      <div>
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          <span>Or test with verified sample prescriptions</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {SAMPLE_PRESCRIPTIONS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => handleSelectSample(s)}
              className={`p-3 text-left rounded-xl border transition-all cursor-pointer ${
                selectedSampleName === s.name
                  ? "bg-teal-50 border-teal-500 text-teal-900 shadow-xs"
                  : "bg-white border-slate-200 hover:border-teal-300 text-slate-800"
              }`}
            >
              <div className="font-bold text-xs leading-tight line-clamp-1">{s.name}</div>
              <div className="text-2xs text-slate-500 mt-1 line-clamp-1">{s.doctor}</div>
              <div className="text-2xs text-teal-700 font-semibold mt-0.5">
                {s.text.split("\n")[2]}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
