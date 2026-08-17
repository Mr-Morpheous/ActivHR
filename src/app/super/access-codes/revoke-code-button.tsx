"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { revokeAccessCode } from "./actions";
import { Button } from "@/components/ui/button";

export function RevokeCodeButton({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleClick() {
    setLoading(true);
    setError(null);
    try {
      const result = await revokeAccessCode(id);
      if (result?.error) {
        setError(result.error);
        return;
      }
      router.refresh();
    } catch {
      setError("Couldn't reach the server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <Button size="sm" variant="outline" onClick={handleClick} disabled={loading}>
        {loading && <Loader2 className="animate-spin" />}
        Revoke
      </Button>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
