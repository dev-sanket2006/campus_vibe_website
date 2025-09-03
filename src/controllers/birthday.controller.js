import * as birthdaysService from "../services/birthday.service.js";

export const getTodayBirthdays = async (req, res) => {
  try {
    const birthdays = await birthdaysService.getTodayBirthdays();
    res.json({ today: birthdays });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUpcomingBirthdays = async (req, res) => {
  try {
    const { days = 7 } = req.query; // default next 7 days
    const birthdays = await birthdaysService.getUpcomingBirthdays(Number(days));
    res.json({ upcoming: birthdays });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
