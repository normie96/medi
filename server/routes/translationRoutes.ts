import { Router } from "express";
import { translateText } from "../controllers/translationController.js";
import { optionalAuth } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/", optionalAuth, translateText);

export default router;
