import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { createPoll, votePoll, getPolls } from "../controllers/polls.controller.js";

const router = express.Router();

// 🔒 Protected routes
router.post("/", authMiddleware, createPoll);      // Create poll
router.post("/vote", authMiddleware, votePoll);   // Vote on poll
router.get("/", authMiddleware, getPolls);        // View polls

export default router;
