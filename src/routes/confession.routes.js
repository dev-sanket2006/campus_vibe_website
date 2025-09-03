import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { createConfession, getConfessions } from "../controllers/confession.controller.js";

const router = express.Router();

// Logged-in users only
router.post("/", authMiddleware, createConfession);
router.get("/", authMiddleware, getConfessions);

export default router;
