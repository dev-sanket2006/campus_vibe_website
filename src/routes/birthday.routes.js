import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { 
  getTodayBirthdays, 
  getUpcomingBirthdays 
} from "../controllers/birthday.controller.js";

const router = express.Router();

// ✅ Any logged-in user can check birthdays
router.get("/today", authMiddleware, getTodayBirthdays);
router.get("/upcoming", authMiddleware, getUpcomingBirthdays); // /upcoming?days=10

export default router;
 