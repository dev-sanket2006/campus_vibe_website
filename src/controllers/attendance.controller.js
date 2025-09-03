import * as attendanceService from "../services/attendance.service.js";

// ✅ Student marks own attendance
export const markAttendance = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }

    const record = await attendanceService.markAttendance(req.user.id, status);
    res.status(201).json({ message: "Attendance marked successfully", record });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ Student gets their own attendance
export const getMyAttendance = async (req, res) => {
  try {
    const data = await attendanceService.getAttendanceByUser(req.user.id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Admin gets all attendance
export const getAllAttendance = async (req, res) => {
  try {
    const data = await attendanceService.getAllAttendance();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
