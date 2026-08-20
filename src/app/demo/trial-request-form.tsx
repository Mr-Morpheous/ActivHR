"use client";

import * as React from "react";
import { Loader2, Crosshair, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PRESETS, TIER_LABELS, SCOPE_LABELS } from "@/lib/org-levels";

export function TrialRequestForm() {
  const [orgName, setOrgName] = React.useState("");
  const [requesterName, setRequesterName] = React.useState("");
  const [workEmail, setWorkEmail] = React.useState("");
  const [presetKey, setPresetKey] = React.useState("small");

  const [siteName, setSiteName] = React.useState("Head Office");
  const [lat, setLat] = React.useState("");
  const [lng, setLng] = React.useState("");
  const [radius, setRadius] = React.useState("150");
  const [locating, setLocating] = React.useState(false);
  const [locateError, setLocateError] = React.useState<string | null>(null);

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [submitted, setSubmitted] = React.useState(false);

  const hasLocation = lat.trim() !== "" && lng.trim() !== "";
  const selected = PRESETS.find((p) => p.key === presetKey) ?? null;

  function detectLocation() {
    setLocateError(null);
    if (!("geolocation" in navigator)) {
      setLocateError("This browser can't detect location. Type the coordinates in below.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude.toFixed(6));
        setLng(pos.coords.longitude.toFixed(6));
        setLocating(false);
      },
      () => {
        setLocateError("Couldn't get your location. Allow it in your browser, or type the coordinates in below.");
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // TODO (backend): replace this block with the real submit call once the
    // API/database side exists. It should send:
    //   { orgName, requesterName, workEmail, presetKey,
    //     site: { name: siteName, lat: Number(lat), lng: Number(lng), radiusM: Number(radius) } }
    // and return { error } on failure or nothing on success.
    await new Promise((resolve) => setTimeout(resolve, 600));

    setLoading(false);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-md border border-border bg-secondary/30 p-8 text-center">
        <CheckCircle2 className="size-8 text-primary" />
        <h3 className="font-serif text-xl">Request received</h3>
        <p className="max-w-sm text-sm text-muted-foreground">
          We will review your details and email an access code to{" "}
          <span className="font-medium text-foreground">{workEmail}</span> so
          you can start your free trial.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="orgName">Organization name</Label>
        <Input
          id="orgName"
          value={orgName}
          onChange={(e) => setOrgName(e.target.value)}
          placeholder="Alpha Pride Security"
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="requesterName">Your name</Label>
        <Input
          id="requesterName"
          value={requesterName}
          onChange={(e) => setRequesterName(e.target.value)}
          placeholder="Amina Otieno"
          autoComplete="name"
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="workEmail">Work email</Label>
        <Input
          id="workEmail"
          type="email"
          value={workEmail}
          onChange={(e) => setWorkEmail(e.target.value)}
          placeholder="amina@company.com"
          autoComplete="email"
          required
        />
        <p className="text-xs text-muted-foreground">
          We will send your access code here once your request is reviewed.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="preset">How your team is structured</Label>
        <div className="flex flex-col gap-2">
          {PRESETS.map((preset) => (
            <label
              key={preset.key}
              className="flex cursor-pointer items-start gap-3 rounded-sm border border-border p-3 transition-colors hover:bg-secondary/50 has-[:checked]:border-primary has-[:checked]:bg-primary/5"
            >
              <input
                type="radio"
                name="preset"
                value={preset.key}
                checked={presetKey === preset.key}
                onChange={() => setPresetKey(preset.key)}
                className="mt-1 accent-[var(--pac-orange)]"
              />
              <span className="flex flex-col gap-0.5">
                <span className="text-sm font-medium">{preset.label}</span>
                <span className="text-xs text-muted-foreground">{preset.description}</span>
              </span>
            </label>
          ))}
        </div>

        {selected && (
          <dl className="mt-1 rounded-sm border border-border bg-secondary/30 p-3 text-xs">
            {selected.levels.map((level) => (
              <div key={level.name} className="flex flex-wrap justify-between gap-2 py-1">
                <dt className="font-medium">{level.rank}. {level.name}</dt>
                <dd className="text-muted-foreground">
                  {TIER_LABELS[level.suggestedTier]} - {SCOPE_LABELS[level.visibilityScope].toLowerCase()}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </div>

      <div className="flex flex-col gap-3 rounded-sm border border-border p-3">
        <div className="flex flex-col gap-2">
          <Label htmlFor="siteName">Your first site</Label>
          <Input
            id="siteName"
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
            placeholder="Head Office"
            required
          />
        </div>

        <div>
          <p className="text-sm font-medium">Where is it?</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Just to preview how ActivHR works, you can adjust this later.
            Stand at the gate and detect it, or type the coordinates in.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="self-start"
          onClick={detectLocation}
          disabled={locating}
        >
          {locating ? <Loader2 className="animate-spin" /> : <Crosshair />}
          {hasLocation ? "Detect again" : "Use my current location"}
        </Button>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="flex flex-col gap-2">
            <Label htmlFor="lat">Latitude</Label>
            <Input id="lat" value={lat} onChange={(e) => setLat(e.target.value)} inputMode="decimal" placeholder="-1.2833" required />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="lng">Longitude</Label>
            <Input id="lng" value={lng} onChange={(e) => setLng(e.target.value)} inputMode="decimal" placeholder="36.8167" required />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="radius">Radius (m)</Label>
            <Input id="radius" type="number" min={20} max={10000} value={radius} onChange={(e) => setRadius(e.target.value)} required />
          </div>
        </div>

        {locateError && <p className="text-xs text-destructive">{locateError}</p>}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" size="lg" className="w-full" disabled={loading || !orgName.trim() || !requesterName.trim() || !hasLocation}>
        {loading && <Loader2 className="animate-spin" />}
        Request free trial access
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        By submitting, you agree to our{" "}
        <a href="/privacy-policy" className="underline">Privacy Policy</a> and{" "}
        <a href="/terms-of-service" className="underline">Terms of Service</a>.
      </p>
    </form>
  );
}
