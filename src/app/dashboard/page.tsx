import getUsers from "@/query/getUsers";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const users = await getUsers();

  return <DashboardClient usersProps={users} />;
}
