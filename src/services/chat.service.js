import prisma from "../config/db.js";

// ✅ Create group (Admins only, with duplicate check)
export async function createGroup(year, branch, section) {
  const existing = await prisma.group.findFirst({
    where: { year, branch, section },
  });

  if (existing) throw new Error("Group already exists for this class.");

  return prisma.group.create({
    data: { year, branch, section },
  });
}

// ✅ Get groups for a user
export async function getUserGroups(userId) {
  return prisma.group.findMany({
    where: { members: { some: { userId } } },
    include: {
      members: { include: { user: true } },
    },
  });
}

// ✅ Send message in group
export async function sendMessage(userId, groupId, message, isAnonymous) {
  const isMember = await prisma.groupMember.findFirst({
    where: { userId, groupId },
  });

  if (!isMember) throw new Error("User is not part of this group.");

  return prisma.message.create({
    data: { senderId: userId, groupId, message, isAnonymous },
    include: {
      sender: { select: { id: true, name: true, role: true } },
      group: true,
    },
  });
}

// ✅ Get all messages for a group
export async function getGroupMessages(groupId) {
  return prisma.message.findMany({
    where: { groupId },
    include: {
      sender: { select: { id: true, name: true, role: true } },
    },
    orderBy: { createdAt: "asc" },
  });
}

// ✅ Auto-add student to their class group
export async function autoJoinGroup(userId) {
  const profile = await prisma.studentProfile.findUnique({ where: { userId } });
  if (!profile) return;

  let group = await prisma.group.findFirst({
    where: {
      year: profile.year,
      branch: profile.branch,
      section: profile.section,
    },
  });

  if (!group) {
    group = await prisma.group.create({
      data: {
        year: profile.year,
        branch: profile.branch,
        section: profile.section,
      },
    });
  }

  await prisma.groupMember.upsert({
    where: { groupId_userId: { groupId: group.id, userId } },
    update: {},
    create: { groupId: group.id, userId },
  });

  return group;
}
