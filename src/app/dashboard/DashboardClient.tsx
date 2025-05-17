"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { User } from "../../../generated/prisma";
import { likeUser } from "@/actions/like-user";
import Image from "next/image";
import { CoinsIcon, HeartIcon, MessageCircleIcon, PencilIcon, XIcon } from "lucide-react";
import { PublicKey } from "@solana/web3.js";
import { dislikeUser } from "@/actions/dislike";

type UserWithRelations = User & {
  dislikes: { toId: string }[],
  likes: { toId: string }[],
  likedBy: { fromId: string }[]
};

export default function DashboardClient({ usersProps }: { usersProps: UserWithRelations[] }) {
  const { connected, publicKey } = useWallet();
  const [users, setUsers] = useState<UserWithRelations[]>(usersProps);
  const router = useRouter();
  const [likeAnimation, setLikeAnimation] = useState<{ id: string | null, type: 'like' | 'dislike' | null }>({ id: null, type: null });
  const [currentUser, setCurrentUser] = useState<UserWithRelations | null>(null);

  useEffect(() => {
    if (!connected) {
      router.push("/");
    }
    setUsers(usersProps);
    setCurrentUser(usersProps.find(u => u.wallet === publicKey?.toBase58()) || null);
  }, [connected, router, usersProps, publicKey]);

  // Liste des IDs dislikés par l'utilisateur courant
  const dislikedIds = currentUser?.dislikes?.map((d: { toId: string }) => d.toId) ?? [];
  // Liste des IDs likés et qui m'ont liké (matchs)
  const likedIds = currentUser?.likes?.map(l => l.toId) ?? [];
  const likedByIds = currentUser?.likedBy?.map(l => l.fromId) ?? [];
  const matchedIds = likedIds.filter(id => likedByIds.includes(id));

  async function handleLike(userId: string, type: 'like' | 'dislike') {
    if (!publicKey) return;

    const currentUser = users.find(u => u.wallet === publicKey.toBase58());
    if (!currentUser) return;
    if (currentUser.id === userId) return;

    setLikeAnimation({ id: userId, type });
    if (type === 'like') {
      await likeUser(currentUser.id, userId);
    } else if (type === 'dislike') {
      await dislikeUser(currentUser.id, userId);
    }
    setTimeout(() => setLikeAnimation({ id: null, type: null }), 1000);
  }

  return (
    <div className="flex max-w-sm min-w-sm flex-col h-screen w-full bg-[#ffaf23] items-center justify-between mx-auto">
      <div className="flex flex-row justify-end items-center gap-2 p-2 fixed top-0 ">
        <p className="text-black font-bold">{currentUser?.tokens}</p>
        <CoinsIcon className="w-4 h-4" />
      </div>

      <div className="w-full h-full flex items-center justify-center">
        <div className="w-full h-[80vh]">
          {(!currentUser?.image || !currentUser?.name || !currentUser?.bio) ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <p className="text-xl font-bold text-[#462a0b]">Update your profile to swipe</p>
              <Link href={`/dashboard/edit-profile?wallet=${publicKey?.toBase58()}`} className="mt-4 px-6 py-2 bg-[#ffaf23] text-black font-bold rounded-lg shadow hover:bg-[#ffd966] transition-colors">
                Edit Profile
              </Link>
            </div>
          ) : (
            users
              .filter(user =>
                user.wallet !== publicKey?.toBase58() &&
                !dislikedIds.includes(user.id) &&
                !matchedIds.includes(user.id)
              )
              .map((user) => (
                <div
                  key={user.id}
                  className="relative flex flex-col items-center rounded-2xl shadow h-full overflow-hidden"
                >
                  {likeAnimation.id === user.id && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center">
                      {likeAnimation.type === 'like' ? (
                        <HeartIcon className="w-32 h-32 text-red-500 animate-bounce" />
                      ) : (
                        <XIcon className="w-32 h-32 text-gray-500 animate-bounce" />
                      )}
                    </div>
                  )}
                  {user.image && (
                    <div className="w-full h-full relative">
                      <Image
                        src={user.image}
                        alt="User Image"
                        fill
                        className="object-cover object-top"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent">
                        <div className="flex items-center gap-2 pl-4">
                          <p className="font-bold text-xl text-white">{user.name}</p>
                        </div>
                        <p className="text-gray-200 line-clamp-2 pl-4">{user.bio}</p>
                        <div className="flex justify-around items-center h-18 ">
                          <Image src={"/nope.png"} height={70} width={70} alt="dislike" onClick={() => handleLike(user.id, 'dislike')} className="cursor-pointer hover:scale-110 transition-transform" />
                          <Image src={"/like.png"} height={70} width={70} alt="like" onClick={() => handleLike(user.id, 'like')} className="cursor-pointer hover:scale-110 transition-transform" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
          )}
        </div>
      </div>
      <Navbar user={currentUser} publicKey={publicKey} />
    </div>
  );
}

export function Navbar({ user, publicKey }: { user: User | null, publicKey: PublicKey | null }) {
  const pathname = usePathname();

  return (
    <div className="w-full border-t-2 border-b-8 border-[black]">
      <div className="flex flex-row w-full items-center justify-around gap-2 h-[10vh] bg-[#462a0b] border-t-12 border-b-12 border-[#efb308] ">
        {pathname === `/dashboard/edit-profile` ? (
          <PencilIcon className="w-10 h-10 text-[white] hover:text-white transition-colors rounded-full p-1" />
        ) : (
          <Link href={`/dashboard/edit-profile?wallet=${publicKey?.toBase58()}`}>
            <PencilIcon className="w-10 h-10 text-[white] hover:text-white transition-colors rounded-full p-1" />
          </Link>
        )}

        {pathname === `/dashboard/match-profile` ? (
          <MessageCircleIcon className="w-10 h-10 text-[white] transition-colors rounded-full p-1" />
        ) : (
          <Link href={`/dashboard/match-profile?userId=${user?.id}`}>
            <MessageCircleIcon className="w-10 h-10 text-[white] transition-colors rounded-full p-1" />
          </Link>
        )}

        {pathname === `/dashboard` ? (
          <HeartIcon className="w-10 h-10 text-[white] fill-current hover:text-[#ff0000] transition-colors rounded-full p-1" fill="#ff0000" />
        ) : (
          <Link href={`/dashboard`}>
            <HeartIcon className="w-10 h-10 text-[white] fill-current hover:text-[#ff0000] transition-colors rounded-full p-1" fill="#ff0000" />
          </Link>
        )}

        {pathname === `/dashboard/challenges-token` ? (
          <CoinsIcon className="w-10 h-10 text-[white] hover:text-white transition-colors rounded-full p-1" />
        ) : (
          <Link href={`/dashboard/challenges-token`}>
            <CoinsIcon className="w-10 h-10 text-[white] hover:text-white transition-colors rounded-full p-1" />
          </Link>
        )}
      </div>
    </div>
  );
}