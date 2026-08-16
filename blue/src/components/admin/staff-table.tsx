"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { RemoveStaffButton } from "@/app/admin/staff/remove-staff-button";
import { cn } from "@/lib/utils";

const ROLE_VARIANT = {
  staff: "outline",
  manager: "attention",
  org_admin: "default",
  super_admin: "default",
} as const;

const ROLE_LABEL: Record<string, string> = {
  staff: "Staff",
  manager: "Manager",
  org_admin: "Org Admin",
  super_admin: "Super Admin",
};

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

type StaffRow = {
  id: string;
  full_name: string;
  role: string;
  site_id: string | null;
  employment_type: string;
};

export function StaffTable({
  staff,
  siteNameById,
  canManage,
  currentEmployeeId,
}: {
  staff: StaffRow[];
  siteNameById: Map<string, string>;
  canManage: boolean;
  currentEmployeeId: string;
}) {
  const [focused, setFocused] = useState(0);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (staff.length === 0) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setFocused((i) => (i === staff.length - 1 ? 0 : i + 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setFocused((i) => (i === 0 ? staff.length - 1 : i - 1));
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [staff.length]);

  if (staff.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-muted-foreground">
        No staff yet — invite your first employee.
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-10 pl-5">#</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Site</TableHead>
          <TableHead>Employment</TableHead>
          {canManage && <TableHead className="w-10" />}
        </TableRow>
      </TableHeader>
      <TableBody>
        {staff.map((s, i) => {
          const isFocused = i === focused;
          return (
            <TableRow
              key={s.id}
              onMouseEnter={() => setFocused(i)}
              className={cn(isFocused && "bg-primary text-primary-foreground")}
            >
              <TableCell className={cn("pl-5 font-mono text-xs", isFocused ? "text-primary-foreground/70" : "text-muted-foreground")}>
                {i + 1}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>{initials(s.full_name)}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{s.full_name}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant={ROLE_VARIANT[s.role as keyof typeof ROLE_VARIANT] ?? "outline"}
                  className={isFocused ? "border-primary-foreground/40 text-primary-foreground" : ""}
                >
                  {ROLE_LABEL[s.role] ?? s.role}
                </Badge>
              </TableCell>
              <TableCell className={isFocused ? "text-primary-foreground/80" : "text-muted-foreground"}>
                {s.site_id ? siteNameById.get(s.site_id) ?? "—" : "Unassigned"}
              </TableCell>
              <TableCell className={cn("capitalize", isFocused ? "text-primary-foreground/80" : "text-muted-foreground")}>
                {s.employment_type.replace("_", " ")}
              </TableCell>
              {canManage && (
                <TableCell>
                  {s.id !== currentEmployeeId && (
                    <RemoveStaffButton employeeId={s.id} employeeName={s.full_name} />
                  )}
                </TableCell>
              )}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}