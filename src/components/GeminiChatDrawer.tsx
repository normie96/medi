import React, { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  Send,
  Bot,
  User,
  X,
  Minimize2,
  Maximize2,
  Sparkles,
  Loader2,
  Cpu,
  RefreshCw,
  ExternalLink
} from "lucide-react";
import { api } from "../services/api.js";
import { VoiceInput } from "./VoiceInput.js";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  modelUsed?: string;
}

export const GeminiChatDrawer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  // Model Selection
  // gemini-3.1-pro-preview: complex clinical reasoning
  // gemini-3.5-flash: general tasks
  // gemini-3.1-flash-lite: fast tasks
  const [selectedModel, setSelectedModel] = useState<
    "gemini-3.5-flash" | "gemini-3.1-flash-lite" | "gemini-3.1-pro-preview"
  >("gemini-3.5-flash");

  // System role persona
  const [systemRole, setSystemRole] = useState<string>("Clinical Prescription & Medication Assistant");

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hello! I am your MediLens clinical AI assistant powered by Gemini. Ask me any question about your medications, prescription instructions, dosage directions, or potential drug interactions.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      modelUsed: "gemini-3.5-flash"
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized]);

  const handleSend = async (textToSend = input) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput("");
    setIsLoading(true);

    try {
      // Build system prompt based on role
      const systemInstruction = `You are playing the role of: "${systemRole}". Provide helpful, accurate, accessible clinical answers about medicines, healthcare clarity, and prescriptions. Keep replies concise and easy to understand for elderly or visually impaired patients. Include a gentle safety note when discussing high-risk pharmaceuticals.`;

      // Format payload for multi-turn Gemini API
      const apiMessages = newHistory.map((m) => ({
        role: m.role,
        content: m.content
      }));

      const res = await api.sendChatMessage(apiMessages, systemInstruction, selectedModel);

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        modelUsed: res.modelUsed || selectedModel
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error("Chat error:", err);
      const errMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Error: ${err?.message || "Failed to communicate with Gemini."} Please try again.`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: "welcome-" + Date.now(),
        role: "assistant",
        content: "Conversation cleared. How can I assist you with your prescriptions and medical schedule?",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        modelUsed: selectedModel
      }
    ]);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer group"
        >
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold text-xs tracking-wide">Gemini Chatbot</span>
          <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
        </button>
      )}

      {/* Chat Drawer / Window */}
      {isOpen && (
        <div
          className={`fixed bottom-6 right-6 z-50 bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col transition-all duration-200 ${
            isMinimized ? "w-80 h-16" : "w-96 sm:w-[420px] h-[580px] max-h-[85vh]"
          }`}
        >
          {/* Header */}
          <div className="p-3.5 bg-gradient-to-r from-teal-700 to-teal-800 text-white rounded-t-3xl flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-xs font-bold leading-tight flex items-center gap-1.5">
                  Gemini Clinical Chat
                  <span className="text-3xs px-1.5 py-0.5 rounded-full bg-teal-900/60 text-teal-200 font-mono">
                    Multi-turn
                  </span>
                </h3>
                <p className="text-3xs text-teal-100 font-medium">Healthcare clarity with Gemini</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleResetChat}
                title="Reset conversation"
                className="p-1 rounded-lg hover:bg-white/10 text-teal-200 hover:text-white transition cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsMinimized(!isMinimized)}
                title={isMinimized ? "Maximize" : "Minimize"}
                className="p-1 rounded-lg hover:bg-white/10 text-teal-200 hover:text-white transition cursor-pointer"
              >
                {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Close chat"
                className="p-1 rounded-lg hover:bg-white/10 text-teal-200 hover:text-white transition cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Controls bar: Model Selection & Role Specification */}
              <div className="px-3 py-2 bg-slate-50 border-b border-slate-200 text-xs flex flex-wrap items-center justify-between gap-2">
                {/* Model Selector */}
                <div className="flex items-center gap-1">
                  <Cpu className="w-3.5 h-3.5 text-teal-700" />
                  <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value as any)}
                    className="text-2xs font-semibold bg-white border border-slate-300 rounded-lg px-2 py-1 text-slate-700 focus:outline-hidden"
                  >
                    <option value="gemini-3.5-flash">gemini-3.5-flash (General)</option>
                    <option value="gemini-3.1-pro-preview">gemini-3.1-pro-preview (Complex)</option>
                    <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite (Fast)</option>
                  </select>
                </div>

                {/* Role Selector */}
                <select
                  value={systemRole}
                  onChange={(e) => setSystemRole(e.target.value)}
                  className="text-2xs font-medium bg-white border border-slate-300 rounded-lg px-2 py-1 text-slate-700 focus:outline-hidden max-w-[170px] truncate"
                >
                  <option value="Clinical Prescription & Medication Assistant">Role: Clinical Assistant</option>
                  <option value="Geriatric Medication Guide (Ultra Simple & Patient)">Role: Patient Geriatric Guide</option>
                  <option value="Pharmacist & Drug Interaction Specialist">Role: Pharmacist Specialist</option>
                </select>
              </div>

              {/* Scrollable Message Thread */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50">
                {messages.map((m) => {
                  const isUser = m.role === "user";
                  return (
                    <div
                      key={m.id}
                      className={`flex gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}
                    >
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-white ${
                          isUser ? "bg-slate-700" : "bg-teal-600"
                        }`}
                      >
                        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                      </div>

                      <div className={`max-w-[80%] space-y-1 ${isUser ? "items-end text-right" : "items-start text-left"}`}>
                        <div
                          className={`p-3 rounded-2xl text-xs leading-relaxed shadow-2xs whitespace-pre-wrap ${
                            isUser
                              ? "bg-teal-600 text-white rounded-tr-xs"
                              : "bg-white text-slate-800 border border-slate-200/90 rounded-tl-xs"
                          }`}
                        >
                          {m.content}
                        </div>
                        <div className="flex items-center gap-1.5 px-1 text-3xs text-slate-400">
                          <span>{m.timestamp}</span>
                          {m.modelUsed && (
                            <>
                              <span>•</span>
                              <span className="font-mono text-teal-600">{m.modelUsed}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {isLoading && (
                  <div className="flex gap-2.5 items-center">
                    <div className="w-7 h-7 rounded-xl bg-teal-600 text-white flex items-center justify-center">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="p-3 bg-white border border-slate-200 rounded-2xl rounded-tl-xs flex items-center gap-2 text-xs text-slate-500">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-teal-600" />
                      <span>Thinking with {selectedModel}...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input & Audio Transcription Integration */}
              <div className="p-3 bg-white border-t border-slate-200 rounded-b-3xl space-y-2">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask MediLens clinical questions..."
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                  />
                  <VoiceInput
                    onTranscript={(transcribed) => {
                      setInput((prev) => (prev ? `${prev} ${transcribed}` : transcribed));
                    }}
                    buttonLabel=""
                    className="px-2.5 py-2.5"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="p-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white disabled:opacity-50 transition cursor-pointer shadow-xs"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};
