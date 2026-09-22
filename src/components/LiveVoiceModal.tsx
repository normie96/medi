import React, { useState, useRef, useEffect } from "react";
import {
  Mic,
  MicOff,
  Radio,
  Volume2,
  X,
  Sparkles,
  AlertCircle,
  Loader2,
  CheckCircle2
} from "lucide-react";

interface LiveVoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LiveVoiceModal: React.FC<LiveVoiceModalProps> = ({ isOpen, onClose }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isTalking, setIsTalking] = useState(false);
  const [isModelSpeaking, setIsModelSpeaking] = useState(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);
  const [liveTranscript, setLiveTranscript] = useState<string[]>([]);

  const wsRef = useRef<WebSocket | null>(null);
  const audioContextInRef = useRef<AudioContext | null>(null);
  const audioContextOutRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const nextStartTimeRef = useRef<number>(0);

  // Convert Float32Array to 16-bit PCM little-endian Base64
  const pcmToBase64 = (float32Array: Float32Array): string => {
    const buffer = new ArrayBuffer(float32Array.length * 2);
    const view = new DataView(buffer);
    for (let i = 0; i < float32Array.length; i++) {
      const s = Math.max(-1, Math.min(1, float32Array[i]));
      view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    }
    let binary = "";
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  // Convert Base64 24kHz PCM to AudioBuffer and play back scheduled
  const playPcmChunk = (base64Audio: string) => {
    try {
      const audioCtx = audioContextOutRef.current;
      if (!audioCtx) return;

      const binaryStr = window.atob(base64Audio);
      const len = binaryStr.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryStr.charCodeAt(i);
      }

      const pcm16 = new Int16Array(bytes.buffer);
      const float32 = new Float32Array(pcm16.length);
      for (let i = 0; i < pcm16.length; i++) {
        float32[i] = pcm16[i] / 32768.0;
      }

      const audioBuffer = audioCtx.createBuffer(1, float32.length, 24000);
      audioBuffer.getChannelData(0).set(float32);

      const source = audioCtx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioCtx.destination);

      const currentTime = audioCtx.currentTime;
      if (nextStartTimeRef.current < currentTime) {
        nextStartTimeRef.current = currentTime;
      }

      source.start(nextStartTimeRef.current);
      nextStartTimeRef.current += audioBuffer.duration;

      setIsModelSpeaking(true);
      source.onended = () => {
        if (audioCtx.currentTime >= nextStartTimeRef.current - 0.05) {
          setIsModelSpeaking(false);
        }
      };
    } catch (e) {
      console.warn("Error playing PCM audio:", e);
    }
  };

  const startLiveSession = async () => {
    try {
      setIsConnecting(true);
      setErrorNotice(null);

      // Create Audio Contexts
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const inCtx = new AudioCtx({ sampleRate: 16000 });
      const outCtx = new AudioCtx({ sampleRate: 24000 });
      audioContextInRef.current = inCtx;
      audioContextOutRef.current = outCtx;

      // Microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Connect WebSocket to /live
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}/live`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        setIsConnecting(false);

        // Setup microphone processor
        const source = inCtx.createMediaStreamSource(stream);
        const processor = inCtx.createScriptProcessor(4096, 1, 1);
        processorRef.current = processor;

        source.connect(processor);
        processor.connect(inCtx.destination);

        processor.onaudioprocess = (e) => {
          if (ws.readyState === WebSocket.OPEN) {
            const inputChannel = e.inputBuffer.getChannelData(0);
            const base64 = pcmToBase64(inputChannel);
            ws.send(JSON.stringify({ audio: base64 }));
            setIsTalking(true);
          }
        };
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.error) {
            setErrorNotice(msg.error);
          }
          if (msg.audio) {
            playPcmChunk(msg.audio);
          }
          if (msg.text) {
            setLiveTranscript((prev) => [...prev.slice(-8), `Assistant: ${msg.text}`]);
          }
          if (msg.interrupted) {
            // Cut playback
            if (audioContextOutRef.current) {
              nextStartTimeRef.current = audioContextOutRef.current.currentTime;
            }
            setIsModelSpeaking(false);
          }
        } catch (e) {
          console.warn("WS message parse error:", e);
        }
      };

      ws.onerror = (err) => {
        console.error("WS error:", err);
        setErrorNotice("Connection to Live API failed. Check your internet or API key.");
        setIsConnecting(false);
      };

      ws.onclose = () => {
        setIsConnected(false);
        setIsConnecting(false);
      };
    } catch (err: any) {
      console.error("Live start error:", err);
      setErrorNotice(err?.message || "Failed to initialize microphone or live connection.");
      setIsConnecting(false);
      cleanup();
    }
  };

  const cleanup = () => {
    if (processorRef.current) {
      try {
        processorRef.current.disconnect();
      } catch (e) {}
      processorRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (audioContextInRef.current) {
      try {
        audioContextInRef.current.close();
      } catch (e) {}
      audioContextInRef.current = null;
    }
    if (audioContextOutRef.current) {
      try {
        audioContextOutRef.current.close();
      } catch (e) {}
      audioContextOutRef.current = null;
    }
    if (wsRef.current) {
      try {
        wsRef.current.close();
      } catch (e) {}
      wsRef.current = null;
    }
    setIsConnected(false);
    setIsConnecting(false);
    setIsTalking(false);
    setIsModelSpeaking(false);
  };

  useEffect(() => {
    if (!isOpen) {
      cleanup();
    }
    return () => cleanup();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 flex flex-col space-y-5 animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-xs">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                Gemini Live Voice Conversation
                <span className="text-2xs font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                  gemini-3.8-live
                </span>
              </h2>
              <p className="text-xs text-slate-500">Real-time two-way spoken conversation with low latency</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Audio Visualizer / Status Pulse */}
        <div className="flex flex-col items-center justify-center py-6 px-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
          <div className="relative flex items-center justify-center">
            {/* Animated Pulses */}
            {isConnected && (
              <>
                <div
                  className={`absolute w-28 h-28 rounded-full ${
                    isModelSpeaking
                      ? "bg-teal-400/30 animate-ping"
                      : isTalking
                      ? "bg-blue-400/30 animate-pulse"
                      : "bg-slate-200/50"
                  }`}
                />
                <div
                  className={`absolute w-20 h-20 rounded-full ${
                    isModelSpeaking ? "bg-teal-500/40" : "bg-blue-500/20"
                  }`}
                />
              </>
            )}

            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center z-10 transition-colors shadow-md ${
                isConnected
                  ? isModelSpeaking
                    ? "bg-teal-600 text-white"
                    : "bg-blue-600 text-white"
                  : "bg-slate-200 text-slate-600"
              }`}
            >
              {isConnecting ? (
                <Loader2 className="w-7 h-7 animate-spin" />
              ) : isConnected ? (
                isModelSpeaking ? (
                  <Volume2 className="w-7 h-7 animate-bounce" />
                ) : (
                  <Mic className="w-7 h-7" />
                )
              ) : (
                <MicOff className="w-7 h-7" />
              )}
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm font-bold text-slate-800">
              {isConnecting
                ? "Connecting to Gemini Live..."
                : isConnected
                ? isModelSpeaking
                  ? "Gemini is speaking..."
                  : "Listening to your voice..."
                : "Ready to start live conversation"}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              {isConnected
                ? "Speak naturally about your medications, symptoms, or prescriptions."
                : "Click below to connect your microphone to gemini-3.8-live."}
            </p>
          </div>
        </div>

        {/* Error notice */}
        {errorNotice && (
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>{errorNotice}</span>
          </div>
        )}

        {/* Transcript snippets */}
        {liveTranscript.length > 0 && (
          <div className="max-h-28 overflow-y-auto p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
            {liveTranscript.map((t, idx) => (
              <p key={idx} className="leading-relaxed">
                {t}
              </p>
            ))}
          </div>
        )}

        {/* Action Controls */}
        <div className="flex gap-2">
          {!isConnected ? (
            <button
              type="button"
              disabled={isConnecting}
              onClick={startLiveSession}
              className="flex-1 py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isConnecting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  <Radio className="w-4 h-4" />
                  <span>Start Live Voice Conversation</span>
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={cleanup}
              className="flex-1 py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <MicOff className="w-4 h-4" />
              <span>End Voice Conversation</span>
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
