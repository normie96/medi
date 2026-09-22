import { Router } from "express";
import { synthesizeSpeech } from "../controllers/speechController.js";
import { optionalAuth } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/", optionalAuth, synthesizeSpeech);

export default router;
