// src/actions/create-user.ts
"use server";

import { PublicKey } from "@solana/web3.js";
import prisma from "@/lib/prisma";

export async function createUser(publicKeyString: string, referral?: string) {
  const publicKey = new PublicKey(publicKeyString);

  const user = await prisma.user.findUnique({
    where: { wallet: publicKey.toBase58() },
  });

  if (user) {
    return { success: true, onboarded: user.onboarded };
  }


  if (referral && referral !== "undefined") {
    const referralUser = await prisma.user.findFirst({
      where: { personalReferral: referral },
    });

    if (referralUser) {
      await prisma.user.update({
        where: { id: referralUser.id },
        data: {
          tokens: {
            increment: 100,
          },
        },
      });
    } else {
      console.warn("Referral code not found:", referral);
    }
  }


  await prisma.user.create({
    data: { wallet: publicKey.toBase58(), lastSeen: new Date(), refferal: referral },
  });

  return { success: true, onboarded: false };
}