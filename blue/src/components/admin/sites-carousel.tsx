"use client";

import { useEffect, useState } from "react";
import { MapPin, Fingerprint, Users } from "lucide-react";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DeleteSiteButton } from "@/app/admin/sites/delete-site-button";
import { cn } from "@/lib/utils";

type SiteRow = {
  id: string;
  name: string;
  geofence_lat: number;
  geofence_lng: number;
  geofence_radius_m: number;
  staffCount: number;
  deviceCount: number;
};

export function SitesCarousel({
  sites,
  canManage,
}: {
  sites: SiteRow[];
  canManage: boolean;
}) {
  const [focused, setFocused] = useState(0);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (sites.length === 0) return;

      if (e.key === "ArrowRight") {
        e.preventDefault();
        setFocused((i) => (i === sites.length - 1 ? 0 : i + 1));
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        setFocused((i) => (i === 0 ? sites.length - 1 : i - 1));
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [sites.length]);

  if (sites.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-muted-foreground">
        No sites yet — add one to start scheduling staff there.
      </p>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {sites.map((site, i) => {
        const isFocused = i === focused;
        return (
          <div
            key={site.id}
            tabIndex={0}
            onFocus={() => setFocused(i)}
            onMouseEnter={() => setFocused(i)}
            className={cn(
              "cursor-pointer rounded-md border p-1 outline-none transition-colors",
              isFocused
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-card-foreground"
            )}
          >
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <CardTitle
                  className={cn(isFocused ? "text-primary-foreground" : "")}
                >
                  {site.name}
                </CardTitle>
                {canManage && <DeleteSiteButton siteId={site.id} siteName={site.name} />}
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div
                className={cn(
                  "flex items-center gap-1.5 text-xs",
                  isFocused ? "text-primary-foreground/80" : "text-muted-foreground"
                )}
              >
                <MapPin className="size-3.5" />
                {site.geofence_lat.toFixed(4)}, {site.geofence_lng.toFixed(4)} · {site.geofence_radius_m}m radius
              </div>
              <div className="flex gap-2">
                <Badge variant={isFocused ? "outline" : "outline"} className={isFocused ? "border-primary-foreground/40 text-primary-foreground" : ""}>
                  <Users className="size-3" /> {site.staffCount} staff
                </Badge>
                <Badge variant="outline" className={isFocused ? "border-primary-foreground/40 text-primary-foreground" : ""}>
                  <Fingerprint className="size-3" /> {site.deviceCount} device{site.deviceCount === 1 ? "" : "s"}
                </Badge>
              </div>
            </CardContent>
          </div>
        );
      })}
    </div>
  );
}