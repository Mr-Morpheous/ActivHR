import { KeyRound } from "lucide-react";

import { getEmployeeContext } from "@/lib/supabase/employee";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/timezone";
import { PageHeader } from "@/components/admin/page-header";
import { Callout } from "@/components/callout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { GenerateCodeForm } from "./generate-code-form";
import { RevokeCodeButton } from "./revoke-code-button";

const STATUS_VARIANT: Record<string, "attention" | "outline" | "proposed" | "destructive"> = {
  pending: "proposed",
  redeemed: "attention",
  revoked: "destructive",
};

/**
 * Issuing and tracking the codes that gate `create_organization_for_self`
 * (migration 0031). This page's writes go through the normal client — the
 * "super admin inserts/updates" policies on org_access_codes are the real
 * enforcement, same reasoning as the rest of `/super`.
 */
export default async function AccessCodesPage() {
  const identity = await getEmployeeContext();
  if (!identity) return null; // layout redirects; satisfies TS

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("org_access_codes")
    .select(
      "id, code, email, status, note, created_at, redeemed_at, organizations(name)"
    )
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <Callout variant="critical" label="Access codes unavailable">
        The code list couldn&apos;t be loaded. Reload — don&apos;t read the
        absence of rows as none having been issued.
      </Callout>
    );
  }

  const codes = data ?? [];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Access codes"
        description="Single-use, email-bound codes required to create an organization. Issue one after a sales call or demo."
      />

      <Card>
        <CardHeader>
          <CardTitle>Issue a code</CardTitle>
        </CardHeader>
        <CardContent>
          <GenerateCodeForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Issued codes</CardTitle>
        </CardHeader>
        <CardContent>
          {codes.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No access codes issued yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-5">Code</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Note</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Issued</TableHead>
                    <TableHead>Organization</TableHead>
                    <TableHead className="pr-5" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {codes.map((c) => {
                    const org = Array.isArray(c.organizations)
                      ? c.organizations[0]
                      : c.organizations;
                    return (
                      <TableRow key={c.id}>
                        <TableCell className="pl-5">
                          <span className="flex items-center gap-2 font-mono text-xs">
                            <KeyRound className="size-3.5 text-muted-foreground" />
                            {c.code}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm">{c.email}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {c.note ?? "—"}
                        </TableCell>
                        <TableCell>
                          <Badge variant={STATUS_VARIANT[c.status] ?? "outline"} className="capitalize">
                            {c.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground">
                          {formatDate(c.created_at)}
                        </TableCell>
                        <TableCell className="text-sm">{org?.name ?? "—"}</TableCell>
                        <TableCell className="pr-5">
                          {c.status === "pending" && <RevokeCodeButton id={c.id} />}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
