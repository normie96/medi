// Schedule Controller for MediLens
// Handles medication schedule tracking, user customization, and resetting

import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware.js";
import { db } from "../db/database.js";

export async function getSchedule(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const userId = req.user?.id || "user-demo-01";
    const items = await db.getSchedulesByUserId(userId);
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch medication schedule." });
  }
}

export async function createScheduleItem(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const userId = req.user?.id || "user-demo-01";
    const {
      prescriptionMedicineId,
      prescriptionId,
      medicineName,
      strength,
      dose,
      doseSlot,
      scheduledTime,
      reminderEnabled,
      reminderMinutesBefore,
      startDate,
      endDate,
      foodInstructionNote,
      scheduleNote
    } = req.body;

    const today = new Date().toISOString().split("T")[0];
    const item = await db.createSchedule({
      userId,
      prescriptionMedicineId: prescriptionMedicineId || `custom-${Date.now()}`,
      prescriptionId: prescriptionId || "rx-custom",
      medicineName,
      strength: strength || "",
      dose: dose || "1 tablet",
      doseSlot: doseSlot || "Morning",
      scheduledTime: scheduledTime || "08:00 AM",
      reminderEnabled: reminderEnabled !== false,
      reminderMinutesBefore: reminderMinutesBefore || 15,
      startDate: startDate || today,
      endDate: endDate || today,
      foodInstructionNote: foodInstructionNote || "With food",
      scheduleNote: scheduleNote || "",
      isCustomizedByUser: true,
      status: "UPCOMING"
    });

    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: "Failed to create schedule item." });
  }
}

export async function updateScheduleItem(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const {
      scheduledTime,
      doseSlot,
      reminderEnabled,
      reminderMinutesBefore,
      startDate,
      endDate,
      foodInstructionNote,
      scheduleNote
    } = req.body;

    const updated = await db.updateSchedule(id, {
      scheduledTime,
      doseSlot,
      reminderEnabled,
      reminderMinutesBefore,
      startDate,
      endDate,
      foodInstructionNote,
      scheduleNote
    });

    if (!updated) {
      res.status(404).json({ error: "Schedule item not found." });
      return;
    }

    res.json({
      message: "Medication schedule customized successfully. Verified prescription remains intact.",
      schedule: updated
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to customize schedule item." });
  }
}

export async function markTaken(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const updated = await db.updateSchedule(id, {
      status: "TAKEN",
      lastLoggedAt: new Date().toISOString()
    });

    if (!updated) {
      res.status(404).json({ error: "Schedule item not found." });
      return;
    }

    res.json({
      message: `Marked ${updated.medicineName} as taken.`,
      schedule: updated
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to update status." });
  }
}

export async function markSkipped(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const updated = await db.updateSchedule(id, {
      status: "SKIPPED",
      lastLoggedAt: new Date().toISOString()
    });

    if (!updated) {
      res.status(404).json({ error: "Schedule item not found." });
      return;
    }

    res.json({
      message: `Marked ${updated.medicineName} as skipped.`,
      schedule: updated
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to update status." });
  }
}

export async function resetSchedule(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const reset = await db.resetScheduleToPrescription(id);

    if (!reset) {
      res.status(404).json({ error: "Schedule item not found." });
      return;
    }

    res.json({
      message: "Schedule reset to original doctor prescription timings.",
      schedule: reset
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to reset schedule." });
  }
}

export async function deleteScheduleItem(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const success = await db.deleteSchedule(id);
    if (!success) {
      res.status(404).json({ error: "Schedule item not found." });
      return;
    }
    res.json({ message: "Schedule item deleted." });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete schedule." });
  }
}
