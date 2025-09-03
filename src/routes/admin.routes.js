import express from "express";
import { dashboard } from "../controllers/admin.controller.js";
import { authMiddleware, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Only admins can access
router.get("/dashboard", authMiddleware, requireRole("admin"), dashboard);

export default router;
