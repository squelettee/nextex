import ChallengeTokenClient from "./ChallengeTokenClient";
import getUser from "@/query/getUser";

export default async function ChallengesTokenPage({ searchParams }: { searchParams: { wallet?: string } }) {
  const { wallet } = await searchParams;
  let user = null;
  if (wallet) {
    user = await getUser(wallet);
  }
  return <ChallengeTokenClient user={user} />;
}
