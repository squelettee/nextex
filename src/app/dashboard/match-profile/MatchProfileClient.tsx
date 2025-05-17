"use client";
import type { User } from "../../../../generated/prisma";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "../DashboardClient";
import { useWallet } from "@solana/wallet-adapter-react";

export default function MatchProfileClient({ matches, myUserId }: { matches: User[]; myUserId: string }) {
  const { publicKey } = useWallet();

  return (
    <div className="min-h-screen w-full max-w-sm min-w-sm mx-auto flex flex-col items-center justify-start relative py-8 px-2 overflow-hidden pb-32">
      {/* Fond image + overlay */}
      <Image src="/god.jpg" alt="background" fill className="object-cover object-center -z-10" />
      <div className="absolute inset-0 bg-black/70 -z-10" />
      <h1 className="text-3xl font-bold text-[#ffaf23] mb-6 font-['Changa_One',Impact,sans-serif] text-center">Matches</h1>
      {matches.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-white text-lg opacity-70">
          <p>No matches yet…</p>
          <p className="text-[#ffaf23] mt-2">Like more profiles to get matches!</p>
        </div>
      ) : (
        <ul className="w-full flex flex-col gap-4">
          {matches.map((user) => (
            <li key={user.id} className="w-full">
              <div className="flex flex-row items-center gap-4 bg-black/70 rounded-2xl p-4 shadow-lg">
                {user.image && (
                  <Image src={user.image} alt="profile" width={56} height={56} className="rounded-full object-cover border-2 border-[#ffaf23]" />
                )}
                <div className="flex-1">
                  <p className="font-bold text-lg text-white font-['Changa_One',Impact,sans-serif]">{user.name}</p>
                </div>
                <Link
                  href={`/dashboard/match-profile/${user.id}/private-chat?me=${myUserId}`}
                  className="bg-[#ffaf23] text-black font-bold rounded-xl px-4 py-2 hover:bg-[#ffd966] transition-colors text-sm"
                >
                  Chat
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
      {/* Navbar en fixed en bas */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-sm min-w-sm z-20">
        <Navbar user={null} publicKey={publicKey} />
      </div>
    </div>
  );
}
