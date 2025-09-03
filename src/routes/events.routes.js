import express from "express";
import { authMiddleware, requireRole } from "../middleware/authMiddleware.js";
import {
  createEvent,
  getEvents,
  deleteEvent,
} from "../controllers/events.controller.js";

const router = express.Router();

// 🔒 Protected routes
router.post("/", authMiddleware, requireRole("admin"), createEvent); // Admin only
router.delete("/:eventId", authMiddleware, requireRole("admin"), deleteEvent); // Admin only
router.get("/", authMiddleware, getEvents); // Any logged-in user

export default router;
