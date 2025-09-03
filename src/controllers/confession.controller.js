import * as confessionsService from "../services/confession.service.js";

export const createConfession = async (req, res) => {
  try {
    const { text, isAnonymous = true } = req.body;
    const confession = await confessionsService.createConfession(
      req.user.id,
      text,
      isAnonymous
    );
    res.json(confession);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getConfessions = async (req, res) => {
  try {
    const confessions = await confessionsService.getConfessions();
    res.json(confessions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
