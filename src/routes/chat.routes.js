import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  createGroup,
  sendMessage,
  getGroupMessages,
  getUserGroups,
} from "../controllers/chat.controller.js";

const router = express.Router();

// ✅ Admin-only: create a group
router.post("/group", authMiddleware, createGroup);

// ✅ User: fetch groups they belong to
router.get("/my-groups", authMiddleware, getUserGroups);

// ✅ User: send a message
router.post("/message", authMiddleware, sendMessage);

// ✅ User: get messages from a group
router.get("/group/:groupId/messages", authMiddleware, getGroupMessages);

export default router;
