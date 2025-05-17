"use client";
import type { Message } from "../../../../../../generated/prisma";
import { useEffect, useRef, useState } from "react";
import { pusherClient } from "@/lib/pusher-client";
import { sendMessage } from "@/actions/send-message";
import Image from "next/image";
import { Navbar } from "../../../DashboardClient";
import { useWallet } from "@solana/wallet-adapter-react";

export default function PrivateChatClient({ myUserId, otherUserId, messages: initialMessages }: { myUserId: string; otherUserId: string; messages: Message[] }) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const { publicKey } = useWallet();

  // Channel public pour la conversation (ordre stable)
  const ids = [myUserId, otherUserId].sort();
  const channel = `chat-${ids[0]}-${ids[1]}`;

  useEffect(() => {
    const pusher = pusherClient;
    pusher.subscribe(channel);
    const handler = (data: { message: Message }) => {
      setMessages((prev) => [...prev, data.message]);
    };
    pusher.bind("new-message", handler);
    return () => {
      pusher.unbind("new-message", handler);
      pusher.unsubscribe(channel);
    };
  }, [channel]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    await sendMessage(myUserId, otherUserId, input.trim());
    setInput("");
  }

  return (
    <div className="min-h-screen w-full max-w-sm min-w-sm mx-auto flex flex-col items-center justify-start relative pb-32 overflow-hidden">
      {/* Fond image + overlay */}
      <Image src="/takemeback.jpg" alt="background" fill className="object-cover object-center -z-10" />
      <div className="absolute inset-0 bg-black/70 -z-10" />
      <h1 className="text-2xl font-bold text-[#ffaf23] mb-2 mt-8 font-['Changa_One',Impact,sans-serif] text-center">Private Chat</h1>
      <div className="w-full flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto bg-black/70 rounded-2xl p-2 mb-2">
          <ul className="flex flex-col gap-2">
            {messages.map((msg: Message) => (
              <li key={msg.id} className={msg.fromUserId === myUserId ? "text-right" : "text-left"}>
                <span className={msg.fromUserId === myUserId ? "bg-[#ffaf23] text-black px-3 py-1 rounded-xl inline-block" : "bg-white/80 text-black px-3 py-1 rounded-xl inline-block"}>
                  {msg.content}
                </span>
                <span className="ml-2 text-xs text-gray-400 align-bottom">{new Date(msg.createdAt).toLocaleTimeString()}</span>
              </li>
            ))}
            <div ref={bottomRef} />
          </ul>
        </div>
        <form onSubmit={handleSend} className="flex gap-2 mt-2 w-full">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Message..."
            className="flex-1 rounded-lg px-3 py-2 border border-[#ffaf23] focus:outline-none"
          />
          <button type="submit" className="bg-[#ffaf23] text-black font-bold px-4 py-2 rounded-lg hover:bg-[#ffd966] transition-colors">Envoyer</button>
        </form>
      </div>
      {/* Navbar en fixed en bas */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-sm min-w-sm z-20">
        <Navbar user={null} publicKey={publicKey} />
      </div>
    </div>
  );
} 