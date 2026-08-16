"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

/**
 * Subscribes to live attendance/leave/notification changes for this org and
 * calls router.refresh() when anything relevant happens — which re-runs the
 * Overview page's server-side data fetch without a full reload, so KPI
 * counts and the trend chart pick up new check-ins as they happen.
 */
export function RealtimeRefresher({ orgId }: { orgId: string }) {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel(`org-${orgId}-live`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "attendance_events", filter: `org_id=eq.${orgId}` },
        () => router.refresh()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "leave_requests", filter: `org_id=eq.${orgId}` },
        () => router.refresh()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notifications", filter: `org_id=eq.${orgId}` },
        () => router.refresh()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orgId, router]);

  return null;
}