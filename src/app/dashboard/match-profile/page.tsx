import getMatches from "@/query/getMatches";
import type { User } from "../../../../generated/prisma";
import MatchProfileClient from "./MatchProfileClient";

export default async function MatchProfilePage({ searchParams }: { searchParams: { userId?: string } }) {
  // Next.js 15: searchParams will be async in the future
  const { userId } = await searchParams;
  if (!userId) return <div>No userId provided</div>;
  const matches: User[] = await getMatches(userId);
  if (!matches.length) return <div>No matches found</div>;

  return <MatchProfileClient matches={matches} myUserId={userId} />;
}
