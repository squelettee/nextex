"use server";

import prisma from "@/lib/prisma";

export async function dislikeUser(fromId: string, toId: string) {
  // Prevent self-like
  if (fromId === toId) return;
  // Prevent duplicate likes
  const exists = await prisma.userDislikes.findUnique({
    where: { fromId_toId: { fromId, toId } },
  });
  if (exists) return;
  await prisma.userDislikes.create({
    data: { fromId, toId },
  });
}

