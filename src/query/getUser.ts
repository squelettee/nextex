import prisma from "@/lib/prisma";

export default async function getUser(wallet: string) {
  return prisma.user.findUnique({
    where: { wallet },
  });
} 