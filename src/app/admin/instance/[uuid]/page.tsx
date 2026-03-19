import { getInstanceDetail } from "@/lib/admin/actions";
import { isAuthenticated } from "@/lib/admin/auth";
import { redirect, notFound } from "next/navigation";
import { InstanceDetailClient } from "./client";

export const dynamic = "force-dynamic";

export default async function InstanceDetailPage({ params }: { params: Promise<{ uuid: string }> }) {
  if (!(await isAuthenticated())) redirect("/admin/login");
  const { uuid } = await params;
  const data = await getInstanceDetail(uuid);
  if (!data) notFound();
  return <InstanceDetailClient data={data} uuid={uuid} />;
}
