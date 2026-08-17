"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2, Copy, Check } from "lucide-react";

import { generateAccessCode } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function GenerateCodeForm() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [note, setNote] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [issued, setIssued] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setIssued(null);

    try {
      const result = await generateAccessCode(email.trim(), note.trim());
      if (!result || "error" in result) {
        setError(result?.error ?? "Couldn't reach the server.");
        return;
      }
      setIssued(result.code);
      setEmail("");
      setNote("");
      router.refresh();
    } catch {
      setError("Couldn't reach the server.");
    } finally {
      setLoading(false);
    }
  }

  async function copyCode() {
    if (!issued) return;
    await navigator.clipboard.writeText(issued);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="codeEmail">Their email</Label>
          <Input
            id="codeEmail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="amina@example.com"
            required
          />
          <p className="text-xs text-muted-foreground">
            Only an account signed up with this exact email can redeem the code.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="codeNote">Note (optional)</Label>
          <Input
            id="codeNote"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Alpha Pride Security — demo 12 Aug"
          />
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {issued && (
        <div className="flex flex-wrap items-center gap-2 rounded-sm border border-primary/40 bg-primary/5 p-3">
          <span className="font-mono text-sm">{issued}</span>
          <Button type="button" size="sm" variant="outline" onClick={copyCode}>
            {copied ? <Check /> : <Copy />}
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>
      )}

      <Button type="submit" disabled={loading || !email.trim()} className="self-start">
        {loading && <Loader2 className="animate-spin" />}
        Generate code
      </Button>
    </form>
  );
}
