import { Router } from "express";
import { register, login, getProfile, updateProfile } from "../controllers/authController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", requireAuth, getProfile);
router.put("/profile", requireAuth, updateProfile);

export default router;
