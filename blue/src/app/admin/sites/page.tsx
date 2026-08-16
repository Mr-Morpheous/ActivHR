import { getEmployeeContext } from "@/lib/supabase/employee";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/admin/page-header";
import { AddSiteDialog } from "./site-dialog";
import { SitesCarousel } from "@/components/admin/sites-carousel";

export default async function SitesPage() {
  const employee = await getEmployeeContext();
  if (!employee) return null;

  const supabase = await createClient();

  const [{ data: sites }, { data: employees }, { data: devices }] = await Promise.all([
    supabase
      .from("sites")
      .select("id, name, geofence_lat, geofence_lng, geofence_radius_m, created_at")
      .eq("org_id", employee.orgId)
      .order("created_at", { ascending: true }),
    supabase
      .from("employees")
      .select("id, site_id")
      .eq("org_id", employee.orgId),
    supabase
      .from("biometric_devices")
      .select("id, site_id")
      .eq("org_id", employee.orgId),
  ]);

  const canManage = employee.role === "org_admin" || employee.role === "super_admin";

  const siteRows = (sites ?? []).map((site) => ({
    ...site,
    staffCount: (employees ?? []).filter((e) => e.site_id === site.id).length,
    deviceCount: (devices ?? []).filter((d) => d.site_id === site.id).length,
  }));

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <PageHeader
        title="Sites"
        description="Physical work locations, geofences, and per-site staffing."
        action={canManage ? <AddSiteDialog /> : undefined}
      />

      <SitesCarousel sites={siteRows} canManage={canManage} />
    </div>
  );
}