import prisma from "../config/db.js";

export async function getDashboardStats() {
  const users = await prisma.user.count();
  const polls = await prisma.poll.count();
  const groups = await prisma.group.count();
  const messages = await prisma.message.count();

  return { users, polls, groups, messages };
}
