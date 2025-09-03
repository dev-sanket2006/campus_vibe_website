import prisma from "../config/db.js";

// ✅ Create poll with options
export async function createPoll(userId, question, options) {
  return await prisma.poll.create({
    data: {
      question,
      createdBy: userId,
      options: {
        create: options.map((text) => ({ text })),
      },
    },
    include: { options: true },
  });
}

// ✅ Vote (prevent duplicate + validate option)
export async function votePoll(userId, pollId, optionId) {
  // check if option belongs to poll
  const option = await prisma.pollOption.findUnique({
    where: { id: optionId },
    select: { pollId: true },
  });

  if (!option || option.pollId !== pollId) {
    throw new Error("Invalid option for this poll");
  }

  // check duplicate vote
  const existing = await prisma.pollVote.findUnique({
    where: {
      userId_pollId: { userId, pollId },
    },
  });

  if (existing) {
    throw new Error("You already voted on this poll");
  }

  return await prisma.pollVote.create({
    data: { userId, pollId, optionId },
    include: { option: true },
  });
}

// ✅ Get all polls with options & vote counts
export async function getPolls() {
  const polls = await prisma.poll.findMany({
    include: {
      options: {
        include: {
          _count: { select: { votes: true } }, // vote count
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return polls;
}
