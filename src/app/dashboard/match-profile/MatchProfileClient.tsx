"use client";
import type { User } from "../../../../generated/prisma";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "../DashboardClient";
import { useWallet } from "@solana/wallet-adapter-react";

export default function MatchProfileClient({ matches, myUserId }: { matches: User[]; myUserId: string }) {
  const { publicKey } = useWallet();

  return (
    <div className="min-h-screen w-full max-w-sm min-w-sm mx-auto flex flex-col items-center justify-start relative py-8 px-2 overflow-hidden pb-32 bg-background text-foreground">
      {/* Fond image + overlay */}
      <Image src="/god.jpg" alt="background" fill className="object-cover object-center -z-10" />
      <div className="absolute inset-0 bg-background/70 -z-10" />
      <div className="inline-flex items-center border focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 mb-8 rounded-full px-4 py-1.5 text-sm  font-medium shadow-sm transition-none mt-8"><span className="mr-1 text-primary">✦</span>Matches</div>
      <ul className="w-full flex flex-col gap-4">
        {matches.map((user) => (
          <li key={user.id} className="w-full">
            <div className="flex flex-row items-center gap-4 bg-card/70 rounded-2xl p-4 shadow-lg border border-black">
              {user.image && (
                <Image src={user.image} alt="profile" width={56} height={56} className="rounded-full object-cover border-2 border-primary" />
              )}
              <div className="flex-1">
                <p className="font-bold text-lg text-card-foreground">{user.name}</p>
              </div>
              <Link
                href={`/dashboard/match-profile/${user.id}/private-chat?me=${myUserId}`}
                className="bg-primary text-primary-foreground font-bold rounded-xl px-4 py-2 hover:bg-primary/80 transition-colors text-sm"
              >
                Chat
              </Link>
            </div>
          </li>
        ))}
      </ul>
      {/* Navbar en fixed en bas */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-sm min-w-sm z-20">
        <Navbar user={null} publicKey={publicKey} />
      </div>
    </div>
  );
}
