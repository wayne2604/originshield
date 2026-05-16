import { getAllUsers } from "@/app/actions/admin";
import UsersClient from "./UsersClient";

export default async function UsersPage() {
  const users = await getAllUsers();

  return <UsersClient users={users} />;
}
