import prisma from "../config/db.js";

export async function createConfession(userId, text, isAnonymous = true) {
  return await prisma.confession.create({
    data: { userId, text, isAnonymous },
    include: {
      user: { select: { id: true, name: true } }, // only safe fields
    },
  });
}

export async function getConfessions() {
  const confessions = await prisma.confession.findMany({
    include: { user: { select: { id: true, name: true } } }, // hide sensitive data
    orderBy: { createdAt: "desc" },
  });

  // Mask user info if anonymous
  return confessions.map(conf => {
    if (conf.isAnonymous) {
      return {
        ...conf,
        user: { id: null, name: "Anonymous" },
      };
    }
    return conf;
  });
}
