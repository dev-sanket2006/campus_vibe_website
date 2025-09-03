import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { sendRequest, respondRequest, getMyRequests, getSentRequests } from "../controllers/friends.controller.js";

const router = express.Router();

// 🔒 Protected routes
router.post("/send", authMiddleware, sendRequest);        // Send request
router.post("/respond", authMiddleware, respondRequest);  // Accept / Reject
router.get("/received", authMiddleware, getMyRequests);   // My received requests
router.get("/sent", authMiddleware, getSentRequests);     // My sent requests

export default router;
