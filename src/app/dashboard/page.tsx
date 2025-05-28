import getUser from "@/query/getUser";
import getUsers from "@/query/getUsers";
import DashboardClient from "./DashboardClient";


export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ wallet?: string }> }) {
  const users = await getUsers();
  const { wallet } = await searchParams;
  if (!wallet) return <div>No wallet provided</div>;
  const user = await getUser(wallet);

  return <DashboardClient usersProps={users} user={user} />;
}
