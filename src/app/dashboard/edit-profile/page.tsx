import getUser from "@/query/getUser";
import EditProfileForm from "./EditProfileForm";

export default async function EditProfilePage({ searchParams }: { searchParams: { wallet?: string } }) {
  // Next.js 15: searchParams will be async in the future
  const { wallet } = await searchParams;
  let user = null;
  if (wallet) {
    user = await getUser(wallet);
  }
  return <EditProfileForm user={user} />;
}
