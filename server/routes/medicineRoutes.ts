import { Router } from "express";
import {
  getMedicines,
  getMedicineById,
  identifyMedicine,
  matchPrescription
} from "../controllers/medicineController.js";
import { optionalAuth, requireAuth } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", optionalAuth, getMedicines);
router.get("/:id", optionalAuth, getMedicineById);
router.post("/identify", optionalAuth, identifyMedicine);
router.post("/match", requireAuth, matchPrescription);

export default router;
