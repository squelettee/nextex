"use client";

import { createUser } from "@/actions/create-user";
import { useWallet } from "@solana/wallet-adapter-react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import FlamingNextex from "@/app/components/FlamingNextex";
import { useRouter } from "next/navigation";
import Image from "next/image";
const WalletMultiButton = dynamic(
  () => import("@solana/wallet-adapter-react-ui").then((mod) => mod.WalletMultiButton),
  {
    ssr: false,
  }
);

export default function Home() {
  const searchParams = useSearchParams();
  const referral = searchParams.get("referral");
  const { connected, publicKey } = useWallet();
  const router = useRouter();
  const [showAnimation, setShowAnimation] = useState(false);
  const [animationStep, setAnimationStep] = useState(0); // 0: rien, 1: logo, 2: texte

  useEffect(() => {
    async function fetchAccount() {
      try {
        if (publicKey) {
          setShowAnimation(true);
          setAnimationStep(1);
          const user = await createUser(publicKey.toBase58(), referral || undefined);
          if (!user.onboarded) {
            router.push("/dashboard/edit-profile?wallet=" + publicKey.toBase58());
          } else {
            router.push("/dashboard");
          }
          setTimeout(() => setAnimationStep(2), 700); // Après 0.7s, affiche le texte
          setTimeout(() => {
            setShowAnimation(false);
          }, 1500); // Après 1.5s, redirige
        }
      } catch (error) {
        console.error(error);
      }
    }
    fetchAccount();
  }, [connected, publicKey, referral, router]);

  return (
    <div className="flex h-screen max-w-md flex-col mx-auto bg-[#462a0b] items-center justify-center gap-24 relative">
      <Image src="/bgimage.jpg" alt="background" fill className="object-cover object-bottom-left" />
      <div className="relative">
        <FlamingNextex />
      </div>
      <div className="relative z-10 flex flex-col items-center gap-8 px-12">
        <div className="relative">
          <h1 className="text-center tracking-wide font-['Changa_One',Impact,sans-serif] text-[30px] sm:text-[40px] md:text-[50px] lg:text-[60px] leading-[0.8] sm:leading-[0.8] md:leading-[0.8] lg:leading-[0.8] transform -skew-y-6 absolute top-0 left-0 w-full bg-gradient-to-t from-orange-600 via-yellow-400 to-red-600 bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(255,115,0,0.7)]">The dating app for your next (not your ex)</h1>
          <h1 className="text-center tracking-wide font-['Changa_One',Impact,sans-serif] text-[30px] sm:text-[40px] md:text-[50px] lg:text-[60px] leading-[0.8] sm:leading-[0.8] md:leading-[0.8] lg:leading-[0.8] transform -skew-y-6 relative text-[#ffaf23] opacity-70">The dating app for your next (not your ex)</h1>
        </div>
      </div>
      <WalletMultiButton />
      {showAnimation && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 animate-fadein">
          <style>{`
            @keyframes pulse {
              0% { transform: scale(1); }
              50% { transform: scale(1.15); }
              100% { transform: scale(1); }
            }
            .pulse {
              animation: pulse 0.7s cubic-bezier(.4,0,.2,1) 1;
            }
            @keyframes fadein {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            .animate-fadein { animation: fadein 0.3s; }
            .fadein-text {
              opacity: 0;
              animation: fadein 0.5s 0.1s forwards;
            }
          `}</style>
          <div className={animationStep >= 1 ? "pulse" : ""}>
            <FlamingNextex />
          </div>
          {animationStep >= 2 && (
            <div className="mt-8 text-3xl text-[#ffaf23] font-bold fadein-text font-['Changa_One',Impact,sans-serif]">
              Beta
            </div>
          )}
        </div>
      )}
    </div>
  );
}
