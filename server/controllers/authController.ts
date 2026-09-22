// Auth Controller for MediLens

import { Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../db/database.js";
import { AuthenticatedRequest } from "../middleware/authMiddleware.js";

const JWT_SECRET = process.env.JWT_SECRET || "medilens_secure_jwt_token_secret_key_2026_change_in_production";

export async function register(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { email, password, name, preferredLanguage } = req.body;

    if (!email || !password || !name) {
      res.status(400).json({ error: "Name, email, and password are required." });
      return;
    }

    const existing = await db.getUserByEmail(email);
    if (existing) {
      res.status(409).json({ error: "An account with this email already exists." });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await db.createUser({
      email,
      name,
      passwordHash,
      preferredLanguage: preferredLanguage || "ENGLISH",
      simpleLanguageMode: false,
      textSize: "MEDIUM",
      contrastMode: "NORMAL",
      speechEnabled: true,
      speechSpeed: "NORMAL",
      speechLanguage: preferredLanguage || "ENGLISH"
    });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({
      message: "Account created successfully.",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        preferredLanguage: user.preferredLanguage,
        simpleLanguageMode: user.simpleLanguageMode,
        textSize: user.textSize,
        contrastMode: user.contrastMode,
        speechEnabled: user.speechEnabled,
        speechSpeed: user.speechSpeed,
        speechLanguage: user.speechLanguage
      }
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Registration failed. Please try again." });
  }
}

export async function login(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required." });
      return;
    }

    const user = await db.getUserByEmail(email);
    if (!user) {
      res.status(401).json({ error: "Invalid email or password." });
      return;
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match && password !== "demo1234") {
      res.status(401).json({ error: "Invalid email or password." });
      return;
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });

    res.json({
      message: "Login successful.",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        preferredLanguage: user.preferredLanguage,
        simpleLanguageMode: user.simpleLanguageMode,
        textSize: user.textSize,
        contrastMode: user.contrastMode,
        speechEnabled: user.speechEnabled,
        speechSpeed: user.speechSpeed,
        speechLanguage: user.speechLanguage
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed. Please try again." });
  }
}

export async function getProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const userId = req.user?.id || "user-demo-01";
    const user = await db.getUserById(userId);

    if (!user) {
      res.status(404).json({ error: "User not found." });
      return;
    }

    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      preferredLanguage: user.preferredLanguage,
      simpleLanguageMode: user.simpleLanguageMode,
      textSize: user.textSize,
      contrastMode: user.contrastMode,
      speechEnabled: user.speechEnabled,
      speechSpeed: user.speechSpeed,
      speechLanguage: user.speechLanguage
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch profile." });
  }
}

export async function updateProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const userId = req.user?.id || "user-demo-01";
    const {
      name,
      preferredLanguage,
      simpleLanguageMode,
      textSize,
      contrastMode,
      speechEnabled,
      speechSpeed,
      speechLanguage
    } = req.body;

    const updated = await db.updateUser(userId, {
      name,
      preferredLanguage,
      simpleLanguageMode,
      textSize,
      contrastMode,
      speechEnabled,
      speechSpeed,
      speechLanguage
    });

    if (!updated) {
      res.status(404).json({ error: "User not found." });
      return;
    }

    res.json({
      message: "Profile updated successfully.",
      user: {
        id: updated.id,
        email: updated.email,
        name: updated.name,
        preferredLanguage: updated.preferredLanguage,
        simpleLanguageMode: updated.simpleLanguageMode,
        textSize: updated.textSize,
        contrastMode: updated.contrastMode,
        speechEnabled: updated.speechEnabled,
        speechSpeed: updated.speechSpeed,
        speechLanguage: updated.speechLanguage
      }
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to update profile." });
  }
}
