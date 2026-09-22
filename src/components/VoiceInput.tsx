import React, { useState, useRef } from "react";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { api } from "../services/api.js";

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  className?: string;
  buttonLabel?: string;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({
  onTranscript,
  className = "",
  buttonLabel
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      audioChunksRef.current = [];
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });

        // Convert blob to base64
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64 = reader.result as string;
          setIsTranscribing(true);
          try {
            const res = await api.transcribeAudio(base64, "audio/webm");
            if (res.transcription) {
              onTranscript(res.transcription);
            }
          } catch (err) {
            console.error("Transcription error:", err);
          } finally {
            setIsTranscribing(false);
          }
        };
        reader.readAsDataURL(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Mic access denied or error:", err);
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <button
      type="button"
      title={isRecording ? "Stop recording and transcribe with gemini-3.5-transcribe" : "Speak to transcribe with gemini-3.5-transcribe"}
      onClick={isRecording ? stopRecording : startRecording}
      disabled={isTranscribing}
      className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer disabled:opacity-50 ${
        isRecording
          ? "bg-rose-500 text-white animate-pulse shadow-xs"
          : "bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-200"
      } ${className}`}
    >
      {isTranscribing ? (
        <>
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span>Transcribing...</span>
        </>
      ) : isRecording ? (
        <>
          <MicOff className="w-3.5 h-3.5" />
          <span>Stop (gemini-3.5-transcribe)</span>
        </>
      ) : (
        <>
          <Mic className="w-3.5 h-3.5" />
          <span>{buttonLabel || "Voice Input"}</span>
        </>
      )}
    </button>
  );
};
