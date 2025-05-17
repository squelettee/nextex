"use client";

import { updateUser } from "@/actions/update-user";
import { useWallet } from "@solana/wallet-adapter-react";
import { redirect } from "next/navigation";
import { useState } from "react";
import type { User } from "../../../../generated/prisma";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Navbar } from "../DashboardClient";
import { useRouter } from "next/navigation";

const WalletDisconnectButton = dynamic(() => import("@solana/wallet-adapter-react-ui").then((mod) => mod.WalletDisconnectButton), { ssr: false });

export default function EditProfileForm({ user }: { user: User | null }) {
  const { publicKey, signMessage } = useWallet();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  if (!user) {
    redirect("/");
  }

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    const name = formData.get("name") as string;
    const bio = formData.get("bio") as string;
    let image = formData.get("image");
    if (image instanceof File && image.size === 0) {
      image = "";
    }
    if (!(image instanceof File) && typeof image !== "string") {
      image = "";
    }

    if (!publicKey || !signMessage) return;

    const message = `Update profile for ${publicKey.toBase58()} at ${Date.now()}`;
    const encodedMessage = new TextEncoder().encode(message);
    const signature = await signMessage(encodedMessage);

    await updateUser(
      publicKey.toBase58(),
      name,
      bio,
      image,
      message,
      Buffer.from(signature).toString("base64")
    );

    router.push("/dashboard");
  }

  return (
    <div className="flex h-screen max-w-sm min-w-sm flex-col mx-auto bg-[#462a0b] items-center justify-center gap-24 relative overflow-hidden">
      {/* Fond image + overlay */}
      <Image src="/takemeback.jpg" alt="background" fill className="object-cover object-center" />
      <div className="absolute inset-0 bg-black/70" />
      {/* Formulaire centré */}
      <form
        action={handleSubmit}
        className="relative z-10 flex flex-col items-center gap-6 w-full max-w-sm min-w-sm px-8 py-10 rounded-3xl bg-black/70 pb-32"
      >
        <h2 className="text-3xl font-bold text-[#ffaf23] mb-2 font-['Changa_One',Impact,sans-serif] text-center">Edit your profile</h2>
        {/* Photo de profil actuelle */}
        {user?.image && (
          <div className="mb-2 flex justify-center w-full">
            <Image
              src={user.image}
              alt="Profile"
              width={96}
              height={96}
              className="rounded-full object-cover border-4 border-[#ffaf23]"
            />
          </div>
        )}
        <div className="flex flex-col gap-2 w-full">
          <Label htmlFor="name" className="text-white">Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="Name"
            name="name"
            defaultValue={user?.name || ""}
            className="bg-black/60 text-white border-none focus:ring-2 focus:ring-[#ffaf23] rounded-lg"
          />
        </div>
        <div className="flex flex-col gap-2 w-full">
          <Label htmlFor="bio" className="text-white">Bio</Label>
          <Textarea
            id="bio"
            placeholder="Bio"
            name="bio"
            defaultValue={user?.bio || ""}
            className="bg-black/60 text-white border-none focus:ring-2 focus:ring-[#ffaf23] rounded-lg"
          />
        </div>
        <div className="flex flex-col gap-2 w-full">
          <Label htmlFor="image" className="text-white">Image</Label>
          <Input
            id="image"
            type="file"
            accept="image/*"
            name="image"
            className="bg-black/60 text-white border-none focus:ring-2 focus:ring-[#ffaf23] rounded-lg file:bg-[#ffaf23] file:text-black file:font-bold file:rounded file:px-3 file:py-1"
          />
        </div>
        <WalletDisconnectButton style={{ width: "100%", textAlign: "center", justifyContent: "center" }} onClick={() => router.push('/')} />
        <Button
          className="w-full mt-2 bg-[#ffaf23] text-black font-bold text-lg rounded-sm py-3 hover:bg-[#ffd966] transition-colors"
          type="submit"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save"}
        </Button>
      </form>
      {/* Navbar en fixed en bas */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-sm min-w-sm z-20">
        <Navbar user={user} publicKey={publicKey} />
      </div>
    </div>
  );
}