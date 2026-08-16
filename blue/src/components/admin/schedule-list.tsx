"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DeleteShiftButton } from "@/app/admin/schedule/delete-shift-button";
import { cn } from "@/lib/utils";

type Shift = {
  id: string;
  employee_id: string;
  site_id: string;
  start_at: string;
  end_at: string;
  status: string;
};

export function ScheduleList({
  byDay,
  employeeNameById,
  siteNameById,
  canManage,
}: {
  byDay: [string, Shift[]][];
  employeeNameById: Map<string, string>;
  siteNameById: Map<string, string>;
  canManage: boolean;
}) {
  // Flatten to one ordered list so arrow keys move through every shift
  // across all days, not just within a day.
  const allShifts = byDay.flatMap(([, shifts]) => shifts);
  const [focusedId, setFocusedId] = useState<string | null>(allShifts[0]?.id ?? null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (allShifts.length === 0) return;

      const currentIndex = allShifts.findIndex((s) => s.id === focusedId);

      if (e.key === "ArrowDown") {
        e.preventDefault();
        const next = currentIndex === -1 || currentIndex === allShifts.length - 1 ? 0 : currentIndex + 1;
        setFocusedId(allShifts[next].id);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const prev = currentIndex <= 0 ? allShifts.length - 1 : currentIndex - 1;
        setFocusedId(allShifts[prev].id);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [allShifts, focusedId]);

  if (allShifts.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-muted-foreground">
        No shifts scheduled in the next 14 days.
      </p>
    );
  }

  let counter = 0;

  return (
    <div className="flex flex-col gap-4">
      {byDay.map(([day, dayShifts]) => (
        <Card key={day}>
          <CardHeader>
            <CardTitle className="font-mono text-sm font-normal tracking-wide uppercase text-muted-foreground">
              {new Date(day).toLocaleDateString(undefined, {
                weekday: "long",
                month: "short",
                day: "numeric",
              })}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {dayShifts.map((shift) => {
              counter += 1;
              const isFocused = shift.id === focusedId;
              return (
                <div
                  key={shift.id}
                  onMouseEnter={() => setFocusedId(shift.id)}
                  className={cn(
                    "flex items-center justify-between gap-3 rounded-sm px-2 py-2 transition-colors",
                    isFocused ? "bg-primary text-primary-foreground" : ""
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "font-mono text-xs",
                        isFocused ? "text-primary-foreground/70" : "text-muted-foreground"
                      )}
                    >
                      {counter}
                    </span>
                    <span className="font-medium">
                      {employeeNameById.get(shift.employee_id) ?? "Unknown"}
                    </span>
                    <Badge
                      variant="outline"
                      className={isFocused ? "border-primary-foreground/40 text-primary-foreground" : ""}
                    >
                      {siteNameById.get(shift.site_id) ?? "—"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "font-mono text-xs",
                        isFocused ? "text-primary-foreground/80" : "text-muted-foreground"
                      )}
                    >
                      {new Date(shift.start_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      {" – "}
                      {new Date(shift.end_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    {canManage && <DeleteShiftButton shiftId={shift.id} />}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}