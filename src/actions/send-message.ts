"use server";

import prisma from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher-server";

export async function sendMessage(fromUserId: string, toUserId: string, content: string) {
  // Enregistre le message en base
  const message = await prisma.message.create({
    data: {
      fromUserId,
      toUserId,
      content,
    },
  });

  // Channel public pour la conversation (ordre stable)
  const ids = [fromUserId, toUserId].sort();
  const channel = `chat-${ids[0]}-${ids[1]}`;

  // Envoie l'événement Pusher
  await pusherServer.trigger(channel, "new-message", {
    message,
  });

  return message;
}