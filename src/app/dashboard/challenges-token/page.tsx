"use client";
import { Button } from "@/components/ui/button";
import { useWallet } from "@solana/wallet-adapter-react";
import Image from "next/image";
import { Navbar } from "../DashboardClient";

export default function ChallengesTokenPage() {
  const { publicKey } = useWallet();
  const affiliateLink = publicKey ? `https://localhost3000?referral=${publicKey.toBase58()}` : '';

  return (
    <div className="min-h-screen w-full max-w-sm min-w-sm mx-auto flex flex-col items-center justify-start relative pb-32 overflow-hidden">
      {/* Fond image + overlay */}
      <Image src="/takemeback.jpg" alt="background" fill className="object-cover object-center -z-10" />
      <div className="absolute inset-0 bg-black/70 -z-10" />
      <h1 className="text-3xl font-bold text-[#ffaf23] mb-6 mt-8 font-['Changa_One',Impact,sans-serif] text-center">Earn tokens</h1>
      <div className="w-full flex flex-col gap-4 px-2">
        <div className="rounded-2xl p-4 bg-black/70 text-white">
          <h2 className="text-xl font-semibold mb-2 text-[#ffaf23]">Complete your profile</h2>
          <p className="text-gray-200 mb-4">Add a photo and bio to earn 5 tokens</p>
          <Button className="w-full bg-[#ffaf23] text-black font-bold rounded-xl py-2 hover:bg-[#ffd966] transition-colors">Complete my profile</Button>
        </div>
        <div className="rounded-2xl p-4 bg-black/70 text-white">
          <h2 className="text-xl font-semibold mb-2 text-[#ffaf23]">Connect your wallet</h2>
          <p className="text-gray-200 mb-4">Connect your Solana wallet to earn 10 tokens</p>
          <Button className="w-full bg-[#ffaf23] text-black font-bold rounded-xl py-2 hover:bg-[#ffd966] transition-colors">Connect wallet</Button>
        </div>
        <div className="rounded-2xl p-4 bg-black/70 text-white">
          <h2 className="text-xl font-semibold mb-2 text-[#ffaf23]">Invite friends</h2>
          <p className="text-gray-200 mb-4">Earn 3 tokens for each friend who joins using your link</p>
          {publicKey ? (
            <div className="flex flex-col gap-2">
              <input
                type="text"
                value={affiliateLink}
                readOnly
                className="p-2 border rounded bg-black/40 text-white border-[#ffaf23]"
              />
              <Button
                className="w-full bg-[#ffaf23] text-black font-bold rounded-xl py-2 hover:bg-[#ffd966] transition-colors"
                onClick={() => navigator.clipboard.writeText(affiliateLink)}
              >
                Copy link
              </Button>
            </div>
          ) : (
            <p className="text-sm text-red-500">Connect your wallet to get your affiliate link</p>
          )}
        </div>
        <div className="rounded-2xl p-4 bg-black/70 text-white">
          <h2 className="text-xl font-semibold mb-2 text-[#ffaf23]">Daily activity</h2>
          <p className="text-gray-200 mb-4">Log in daily to earn 1 token</p>
          <Button className="w-full bg-[#ffaf23] text-black font-bold rounded-xl py-2 hover:bg-[#ffd966] transition-colors">Log in</Button>
        </div>
      </div>
      <div className="mt-4 p-4 bg-black/60 rounded-lg w-full max-w-sm text-center text-gray-200">
        <p className="text-sm">
          Tokens allow you to send messages and interact with other users.<br />
          The more active you are on the platform, the more tokens you earn!
        </p>
      </div>
      {/* Navbar en fixed en bas */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-sm min-w-sm z-20">
        <Navbar user={null} publicKey={publicKey} />
      </div>
    </div>
  );
}
