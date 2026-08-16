import { getEmployeeContext } from "@/lib/supabase/employee";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/admin/page-header";
import { AddShiftDialog } from "./shift-dialog";
import { ScheduleList } from "@/components/admin/schedule-list";

export default async function SchedulePage() {
  const employee = await getEmployeeContext();
  if (!employee) return null;

  const supabase = await createClient();

  const now = new Date();
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 14);

  const [{ data: shifts }, { data: employees }, { data: sites }] = await Promise.all([
    supabase
      .from("shifts")
      .select("id, employee_id, site_id, start_at, end_at, status")
      .gte("start_at", start.toISOString())
      .lt("start_at", end.toISOString())
      .order("start_at", { ascending: true }),
    supabase
      .from("employees")
      .select("id, full_name, site_id")
      .eq("org_id", employee.orgId)
      .in("role", ["staff", "manager"]),
    supabase.from("sites").select("id, name").eq("org_id", employee.orgId),
  ]);

  const employeeNameById = new Map((employees ?? []).map((e) => [e.id, e.full_name]));
  const siteNameById = new Map((sites ?? []).map((s) => [s.id, s.name]));
  const canManage = ["org_admin", "super_admin", "manager"].includes(employee.role);

  const byDay = new Map<string, NonNullable<typeof shifts>>();
  for (const shift of shifts ?? []) {
    const day = shift.start_at.slice(0, 10);
    if (!byDay.has(day)) byDay.set(day, []);
    byDay.get(day)!.push(shift);
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <PageHeader
        title="Schedule"
        description="Shift rosters for the next 14 days."
        action={
          canManage ? (
            <AddShiftDialog employees={employees ?? []} sites={sites ?? []} />
          ) : undefined
        }
        align="center"
      />

      <ScheduleList
        byDay={Array.from(byDay.entries())}
        employeeNameById={employeeNameById}
        siteNameById={siteNameById}
        canManage={canManage}
      />
    </div>
  );
}