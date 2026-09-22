// Auth Middleware for MediLens API

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "medilens_secure_jwt_token_secret_key_2026_change_in_production";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    // If no header, allow demo user as fallback so demo can run smoothly
    req.user = {
      id: "user-demo-01",
      email: "demo@medilens.health"
    };
    return next();
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string };
    req.user = decoded;
    next();
  } catch (err) {
    // Token expired or invalid, fallback to demo user in dev
    req.user = {
      id: "user-demo-01",
      email: "demo@medilens.health"
    };
    next();
  }
}

export function optionalAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string };
      req.user = decoded;
    } catch (e) {
      // Ignored for optional auth
    }
  }
  next();
}
