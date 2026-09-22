import { Router } from "express";
import {
  getSchedule,
  createScheduleItem,
  updateScheduleItem,
  markTaken,
  markSkipped,
  resetSchedule,
  deleteScheduleItem
} from "../controllers/scheduleController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", requireAuth, getSchedule);
router.post("/", requireAuth, createScheduleItem);
router.put("/:id", requireAuth, updateScheduleItem);
router.post("/:id/taken", requireAuth, markTaken);
router.post("/:id/skipped", requireAuth, markSkipped);
router.post("/:id/reset", requireAuth, resetSchedule);
router.delete("/:id", requireAuth, deleteScheduleItem);

export default router;
