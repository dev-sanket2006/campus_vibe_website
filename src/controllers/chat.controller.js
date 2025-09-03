import * as chatService from "../services/chat.service.js";
import { io } from "../server.js";

// ✅ Admin creates group
export const createGroup = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Admins only." });
    }

    const { year, branch, section } = req.body;
    const group = await chatService.createGroup(year, branch, section);

    res.json(group);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ Get user groups
export const getUserGroups = async (req, res) => {
  try {
    const groups = await chatService.getUserGroups(req.user.id);
    res.json(groups);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ Send message + socket broadcast
export const sendMessage = async (req, res) => {
  try {
    const { groupId, message, isAnonymous } = req.body;

    const msg = await chatService.sendMessage(
      req.user.id,
      groupId,
      message,
      isAnonymous
    );

    io.to(`group_${groupId}`).emit("newMessage", msg);

    res.json(msg);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ Fetch group messages
export const getGroupMessages = async (req, res) => {
  try {
    const { groupId } = req.params;
    const messages = await chatService.getGroupMessages(Number(groupId));
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
