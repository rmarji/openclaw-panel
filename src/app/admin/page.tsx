import { getFleetData } from "@/lib/admin/actions";
import { InstanceCard } from "@/components/admin/InstanceCard";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { StaleDataBanner } from "@/components/admin/StaleDataBanner";

export const dynamic = "force-dynamic";

export default async function FleetPage() {
  const { instances, summary, cacheStatus } = await getFleetData();
  return (
    <>
      <AdminHeader summary={summary} cacheStatus={cacheStatus} />
      {cacheStatus.isStale && <StaleDataBanner />}
      {instances.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-white/20 text-sm">
            No instances found. Trigger a cache refresh to populate.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          {instances.map((inst) => (
            <InstanceCard key={inst.uuid} instance={inst} />
          ))}
        </div>
      )}
    </>
  );
}
