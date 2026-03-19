import { getFleetData } from "@/lib/admin/actions";
import { isAuthenticated } from "@/lib/admin/auth";
import { redirect } from "next/navigation";
import { UsersClient } from "./client";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  if (!(await isAuthenticated())) redirect("/admin/login");
  const { instances } = await getFleetData();
  return <UsersClient instances={instances} />;
}
