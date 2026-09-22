import { Router } from "express";
import {
  getDoctors,
  getDoctorById,
  identifyPrescriptionDoctor
} from "../controllers/doctorController.js";
import { optionalAuth } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", optionalAuth, getDoctors);
router.get("/:id", optionalAuth, getDoctorById);
router.post("/identify-prescription", optionalAuth, identifyPrescriptionDoctor);

export default router;
