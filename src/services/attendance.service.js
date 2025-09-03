import prisma from "../config/db.js";

export async function markAttendance(userId, status) {
  return await prisma.attendance.create({
    data: { userId, status },
  });
}

export async function getAttendanceByUser(userId) {
  return await prisma.attendance.findMany({
    where: { userId },
    orderBy: { date: "desc" }, // ✅ newest first
  });
}

export async function getAllAttendance() {
  return await prisma.attendance.findMany({
    include: { user: true },
    orderBy: { date: "desc" },
  });
}
