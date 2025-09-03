import * as pollsService from "../services/polls.service.js";

// ✅ Create a new poll
export const createPoll = async (req, res) => {
  try {
    const { question, options } = req.body;

    if (!question || !options || !Array.isArray(options) || options.length < 2) {
      return res.status(400).json({ success: false, error: "Question and at least 2 options are required" });
    }

    const poll = await pollsService.createPoll(req.user.id, question, options);
    res.status(201).json({ success: true, message: "Poll created", data: poll });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// ✅ Vote on a poll
export const votePoll = async (req, res) => {
  try {
    const { pollId, optionId } = req.body;

    if (!pollId || !optionId) {
      return res.status(400).json({ success: false, error: "pollId and optionId are required" });
    }

    const vote = await pollsService.votePoll(req.user.id, parseInt(pollId), parseInt(optionId));
    res.json({ success: true, message: "Vote recorded", data: vote });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// ✅ Get all polls
export const getPolls = async (req, res) => {
  try {
    const polls = await pollsService.getPolls();
    res.json({ success: true, data: polls });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
