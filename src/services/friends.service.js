import prisma from "../config/db.js";

// ✅ Send request (check self + duplicate)
export async function sendRequest(senderId, receiverId) {
  if (senderId === receiverId) {
    throw new Error("You cannot send a friend request to yourself");
  }

  // Check if request already exists
  const existing = await prisma.friendRequest.findFirst({
    where: {
      OR: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    },
  });

  if (existing) {
    throw new Error("Friend request already exists between these users");
  }

  return await prisma.friendRequest.create({
    data: { senderId, receiverId, status: "pending" },
    include: {
      receiver: { select: { id: true, name: true, email: true } },
      sender: { select: { id: true, name: true, email: true } },
    },
  });
}

// ✅ Accept or reject request
export async function respondRequest(requestId, status, userId) {
  const request = await prisma.friendRequest.findUnique({ where: { id: requestId } });

  if (!request) {
    throw new Error("Friend request not found");
  }

  if (request.receiverId !== userId) {
    throw new Error("You are not authorized to respond to this request");
  }

  return await prisma.friendRequest.update({
    where: { id: requestId },
    data: { status },
    include: {
      sender: { select: { id: true, name: true } },
      receiver: { select: { id: true, name: true } },
    },
  });
}

// ✅ Requests I received
export async function getMyRequests(userId) {
  return await prisma.friendRequest.findMany({
    where: { receiverId: userId, status: "pending" },
    include: {
      sender: { select: { id: true, name: true, email: true } },
    },
  });
}

// ✅ Requests I sent
export async function getSentRequests(userId) {
  return await prisma.friendRequest.findMany({
    where: { senderId: userId },
    include: {
      receiver: { select: { id: true, name: true, email: true } },
    },
  });
}
