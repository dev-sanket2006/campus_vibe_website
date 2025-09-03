import prisma from "../config/db.js";

export async function createEvent(userId, title, description, date) {
  return await prisma.event.create({
    data: {
      title,
      description,
      date,
      creator: { connect: { id: userId } }, // ✅ relation instead of raw FK
    },
    include: {
      creator: { select: { id: true, name: true, email: true, role: true } },
    },
  });
}

export async function getEvents() {
  return await prisma.event.findMany({
    include: {
      creator: { select: { id: true, name: true, email: true, role: true } },
    },
    orderBy: { date: "asc" },
  });
}

export async function deleteEvent(eventId) {
  // Check if event exists before deleting
  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event) {
    throw new Error("Event not found");
  }

  return await prisma.event.delete({
    where: { id: eventId },
    include: {
      creator: { select: { id: true, name: true } },
    },
  });
}
