import express from "express";
import { authMiddleware, requireRole } from "../middleware/authMiddleware.js";
import {
  markAttendance,
  getMyAttendance,
  getAllAttendance,
} from "../controllers/attendance.controller.js";

const router = express.Router();

// ✅ Student routes
router.post("/", authMiddleware, requireRole("student"), markAttendance);
router.get("/me", authMiddleware, requireRole("student"), getMyAttendance);

// ✅ Admin route
router.get("/all", authMiddleware, requireRole("admin"), getAllAttendance);

export default router;
