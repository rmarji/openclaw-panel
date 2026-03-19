import { getAnalyticsData } from "@/lib/admin/actions";
import { isAuthenticated } from "@/lib/admin/auth";
import { redirect } from "next/navigation";
import { AnalyticsClient } from "./client";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  if (!(await isAuthenticated())) redirect("/admin/login");
  const data = await getAnalyticsData(7);
  return <AnalyticsClient data={data} />;
}
