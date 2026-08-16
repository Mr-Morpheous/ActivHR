import { getEmployeeContext } from "@/lib/supabase/employee";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/admin/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { InviteStaffDialog } from "./invite-dialog";
import { StaffTable } from "@/components/admin/staff-table";

export default async function StaffPage() {
  const employee = await getEmployeeContext();
  if (!employee) return null;

  const supabase = await createClient();

  const [{ data: staff }, { data: sites }] = await Promise.all([
    supabase
      .from("employees")
      .select("id, full_name, role, site_id, employment_type, created_at")
      .eq("org_id", employee.orgId)
      .order("created_at", { ascending: true }),
    supabase.from("sites").select("id, name").eq("org_id", employee.orgId),
  ]);

  const siteNameById = new Map((sites ?? []).map((s) => [s.id, s.name]));
  const canManage = employee.role === "org_admin" || employee.role === "super_admin";

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <PageHeader
        title="Staff"
        description="Employee roster, roles, and site assignments."
        action={canManage ? <InviteStaffDialog sites={sites ?? []} /> : undefined}
        align="center"
      />

      <Card>
        <CardContent className="p-0">
          <StaffTable
            staff={staff ?? []}
            siteNameById={siteNameById}
            canManage={canManage}
            currentEmployeeId={employee.id}
          />
        </CardContent>
      </Card>
    </div>
  );
}