"use server";

import prisma from "@/lib/prisma";

export async function likeUser(fromId: string, toId: string): Promise<boolean> {
  // Prevent self-like
  if (fromId === toId) return false;
  // Prevent duplicate likes
  const exists = await prisma.userLikes.findUnique({
    where: { fromId_toId: { fromId, toId } },
  });
  if (exists) return false;

  await prisma.userLikes.create({
    data: { fromId, toId },
  });

  // Check if there's a match (the other user already liked this user)
  const mutualLike = await prisma.userLikes.findUnique({
    where: { fromId_toId: { fromId: toId, toId: fromId } },
  });

  return !!mutualLike; // Return true if it's a match
}

