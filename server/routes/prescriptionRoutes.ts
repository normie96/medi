import { Router } from "express";
import {
  processUpload,
  verifyAndSave,
  getPrescriptions,
  getPrescriptionById,
  deletePrescription
} from "../controllers/prescriptionController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/upload", requireAuth, processUpload);
router.post("/verify", requireAuth, verifyAndSave);
router.get("/", requireAuth, getPrescriptions);
router.get("/:id", requireAuth, getPrescriptionById);
router.delete("/:id", requireAuth, deletePrescription);

export default router;
