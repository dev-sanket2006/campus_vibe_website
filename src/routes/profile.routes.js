import express from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "../middleware/auth.js"; // verifies JWT

const prisma = new PrismaClient();
const router = express.Router();

/**
 * GET /profile/me
 * Get logged-in user profile (student or admin)
 */
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id; // from JWT payload
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        studentProfile: true,
        adminProfile: true,
      },
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /profile/student
 * Create or update student profile
 */
router.post("/student", authMiddleware, async (req, res) => {
  try {
    const { year, branch, section } = req.body;
    const userId = req.user.id;

    if (req.user.role !== "student") {
      return res.status(403).json({ error: "Only students can update student profile" });
    }

    const profile = await prisma.studentProfile.upsert({
      where: { userId },
      update: { year, branch, section },
      create: { year, branch, section, userId },
    });

    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /profile/admin
 * Create or update admin profile
 */
router.post("/admin", authMiddleware, async (req, res) => {
  try {
    const { department, position } = req.body;
    const userId = req.user.id;

    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Only admins can update admin profile" });
    }

    const profile = await prisma.adminProfile.upsert({
      where: { userId },
      update: { department, position },
      create: { department, position, userId },
    });

    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
