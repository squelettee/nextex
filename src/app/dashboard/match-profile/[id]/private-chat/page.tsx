import getMessages from "@/query/getMessages";
import type { Message } from "../../../../../../generated/prisma";
import PrivateChatClient from "./PrivateChatClient";

export default async function PrivateChatPage({ params, searchParams }: { params: Promise<{ id: string }>, searchParams: Promise<{ me?: string }> }) {
  // Next.js 15: params et searchParams seront async dans le futur
  const { id } = await params;
  const { me } = await searchParams;
  const otherUserId = id;
  const myUserId = me;

  if (!myUserId) return <div>Missing your user id</div>;

  const messages: Message[] = await getMessages(myUserId, otherUserId);

  return (
    <PrivateChatClient myUserId={myUserId} otherUserId={otherUserId} messages={messages} />
  );
}
