import http from "http";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { WebSocketServer } from "ws";
import { Modality, LiveServerMessage } from "@google/genai";
import { getGeminiClient } from "./server/services/geminiClient.js";

import authRoutes from "./server/routes/authRoutes.js";
import prescriptionRoutes from "./server/routes/prescriptionRoutes.js";
import medicineRoutes from "./server/routes/medicineRoutes.js";
import doctorRoutes from "./server/routes/doctorRoutes.js";
import scheduleRoutes from "./server/routes/scheduleRoutes.js";
import translationRoutes from "./server/routes/translationRoutes.js";
import speechRoutes from "./server/routes/speechRoutes.js";
import geminiFeaturesRoutes from "./server/routes/geminiFeaturesRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = http.createServer(app);
  const PORT = 3000;

  // Middleware
  app.use(cors());
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));

  // API Routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      service: "MediLens Healthcare Accessibility API",
      timestamp: new Date().toISOString()
    });
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/prescriptions", prescriptionRoutes);
  app.use("/api/medicines", medicineRoutes);
  app.use("/api/doctors", doctorRoutes);
  app.use("/api/schedule", scheduleRoutes);
  app.use("/api/translate", translationRoutes);
  app.use("/api/text-to-speech", speechRoutes);
  app.use("/api/gemini", geminiFeaturesRoutes);

  // WebSocket Server for Live Voice Conversations (gemini-3.8-live)
  const wss = new WebSocketServer({ server, path: "/live" });

  wss.on("connection", async (clientWs) => {
    console.log("[Live API] Client connected to /live");
    let session: any = null;

    try {
      const ai = getGeminiClient();
      if (!ai) {
        clientWs.send(JSON.stringify({ error: "Gemini API client not initialized" }));
        clientWs.close();
        return;
      }

      session = await ai.live.connect({
        model: "gemini-3.8-live",
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: "Zephyr" } }
          },
          systemInstruction:
            "You are MediLens Voice Assistant. You speak with clarity, compassion, and brevity to help patients understand prescriptions, medications, and general healthcare questions. Speak in warm, accessible language."
        },
        callbacks: {
          onmessage: (message: LiveServerMessage) => {
            const parts = message.serverContent?.modelTurn?.parts;
            if (parts && parts.length > 0) {
              for (const part of parts) {
                if (part.inlineData?.data) {
                  clientWs.send(JSON.stringify({ audio: part.inlineData.data }));
                }
                if (part.text) {
                  clientWs.send(JSON.stringify({ text: part.text }));
                }
              }
            }
            if (message.serverContent?.interrupted) {
              clientWs.send(JSON.stringify({ interrupted: true }));
            }
          },
          onerror: (err: any) => {
            console.error("[Live API] Session error:", err);
            clientWs.send(JSON.stringify({ error: err?.message || "Live API error" }));
          },
          onclose: () => {
            console.log("[Live API] Gemini session closed");
            clientWs.send(JSON.stringify({ closed: true }));
          }
        }
      });

      clientWs.on("message", (data: any) => {
        try {
          const parsed = JSON.parse(data.toString());
          if (parsed.audio) {
            session.sendRealtimeInput({
              audio: { data: parsed.audio, mimeType: "audio/pcm;rate=16000" }
            });
          } else if (parsed.text) {
            session.sendRealtimeInput({
              text: parsed.text
            });
          }
        } catch (e) {
          console.error("[Live API] Failed to parse client message:", e);
        }
      });

      clientWs.on("close", () => {
        console.log("[Live API] Client disconnected");
        if (session && typeof session.close === "function") {
          try {
            session.close();
          } catch (e) {
            // ignore
          }
        }
      });
    } catch (err: any) {
      console.error("[Live API] Setup failed:", err);
      clientWs.send(JSON.stringify({ error: err?.message || "Failed to start Live API session" }));
      clientWs.close();
    }
  });

  // Vite development middleware or static production serving
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`MediLens server with Live API running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start MediLens server:", err);
});
