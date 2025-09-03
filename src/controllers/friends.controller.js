import * as friendsService from "../services/friends.service.js";

// ✅ Send friend request
export const sendRequest = async (req, res) => {
  try {
    const { receiverId } = req.body;

    if (!receiverId) {
      return res.status(400).json({ success: false, error: "Receiver ID is required" });
    }

    const request = await friendsService.sendRequest(req.user.id, parseInt(receiverId));
    res.status(201).json({ success: true, message: "Friend request sent", data: request });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// ✅ Accept / Reject request
export const respondRequest = async (req, res) => {
  try {
    const { requestId, status } = req.body; // "accepted" | "rejected"

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ success: false, error: "Invalid status" });
    }

    const updated = await friendsService.respondRequest(parseInt(requestId), status, req.user.id);
    res.json({ success: true, message: `Request ${status}`, data: updated });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// ✅ Requests I received
export const getMyRequests = async (req, res) => {
  try {
    const requests = await friendsService.getMyRequests(req.user.id);
    res.json({ success: true, data: requests });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ✅ Requests I sent
export const getSentRequests = async (req, res) => {
  try {
    const requests = await friendsService.getSentRequests(req.user.id);
    res.json({ success: true, data: requests });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}; 
