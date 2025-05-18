"use client";
import { Button } from "@/components/ui/button";
import { useWallet } from "@solana/wallet-adapter-react";
import { Navbar } from "../DashboardClient";
import { User } from "@/../generated/prisma";
import Link from "next/link";

export default function ChallengeTokenClient({ user }: { user: User | null }) {
  const { publicKey } = useWallet();
  const affiliateLink = publicKey ? `https://localhost3000?referral=${publicKey.toBase58()}` : '';

  return (
    <div className="min-h-screen w-full max-w-sm min-w-sm mx-auto flex flex-col items-center justify-start relative pb-32 overflow-hidden bg-background text-foreground">
      <div className="inline-flex items-center border focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 mb-4 rounded-full px-4 py-1.5 text-sm font-medium shadow-sm transition-none mt-8"><span className="mr-1 text-primary">✦</span>Earn tokens</div>
      <div className="w-full flex flex-col gap-4 px-2">
        <div className="rounded-2xl p-4 bg-card/70 text-card-foreground">
          <h2 className="text-xl font-semibold mb-2 text-primary">Complete your profile</h2>
          <p className="text-muted-foreground mb-4">Complete your profile to earn 30 tokens</p>
          {user?.onboarded ? (
            <Button className="w-full bg-primary/20 text-primary-foreground font-bold rounded-xl py-2 cursor-not-allowed" disabled>
              Done
            </Button>
          ) : (
            <Link href={`/dashboard/edit-profile?wallet=${publicKey?.toBase58()}`}>
              <Button className="w-full bg-primary text-primary-foreground font-bold rounded-xl py-2 hover:bg-primary/80 transition-colors">
                Complete my profile
              </Button>
            </Link>
          )}
        </div>
        <div className="rounded-2xl p-4 bg-card/70 text-card-foreground">
          <h2 className="text-xl font-semibold mb-2 text-primary">Connect your wallet</h2>
          <p className="text-muted-foreground mb-4">Connect your Solana wallet to earn 10 tokens</p>
          <Button className="w-full bg-primary text-primary-foreground font-bold rounded-xl py-2 hover:bg-primary/80 transition-colors">Connect wallet</Button>
        </div>
        <div className="rounded-2xl p-4 bg-card/70 text-card-foreground">
          <h2 className="text-xl font-semibold mb-2 text-primary">Invite friends</h2>
          <p className="text-muted-foreground mb-4">Earn 3 tokens for each friend who joins using your link</p>
          {publicKey ? (
            <div className="flex flex-col gap-2">
              <input
                type="text"
                value={affiliateLink}
                readOnly
                className="p-2 border rounded bg-card/40 text-card-foreground border-primary"
              />
              <Button
                className="w-full bg-primary text-primary-foreground font-bold rounded-xl py-2 hover:bg-primary/80 transition-colors"
                onClick={() => navigator.clipboard.writeText(affiliateLink)}
              >
                Copy link
              </Button>
            </div>
          ) : (
            <p className="text-sm text-destructive">Connect your wallet to get your affiliate link</p>
          )}
        </div>
        <div className="rounded-2xl p-4 bg-card/70 text-card-foreground">
          <h2 className="text-xl font-semibold mb-2 text-primary">Daily activity</h2>
          <p className="text-muted-foreground mb-4">Log in daily to earn 1 token</p>
          <Button className="w-full bg-primary text-primary-foreground font-bold rounded-xl py-2 hover:bg-primary/80 transition-colors">Log in</Button>
        </div>
      </div>
      <div className="mt-4 p-4 bg-card/60 rounded-lg w-full max-w-sm text-center text-muted-foreground">
        <p className="text-sm">
          Tokens allow you to send messages and interact with other users.<br />
          The more active you are on the platform, the more tokens you earn!
        </p>
      </div>
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-sm min-w-sm z-20">
        <Navbar user={user} publicKey={publicKey} />
      </div>
    </div>
  );
} 