import * as React from "react";
import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  description,
  action,
  align = "left",
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  align?: "left" | "center";
}) {
  if (align === "center") {
    return (
      <div className="flex flex-col items-center gap-3 text-center">
        <div>
          <h1 className="font-serif text-2xl">{title}</h1>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {action}
      </div>
    );
  }

  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h1 className="font-serif text-2xl">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}