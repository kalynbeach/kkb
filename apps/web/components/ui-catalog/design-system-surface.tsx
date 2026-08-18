"use client";

import { Badge } from "@kkb/ui/components/badge";
import { Button } from "@kkb/ui/components/button";
import { Input } from "@kkb/ui/components/input";
import { Spinner } from "@kkb/ui/components/spinner";
import { cn } from "@kkb/ui/lib/utils";

import { SpecimenStage } from "./catalog-surface-shared";

export function DesignSystemSurface() {
  return (
    <div className="min-h-full bg-background p-4 md:p-6">
      <div className="grid gap-x-8 gap-y-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="grid gap-x-8 gap-y-6 md:grid-cols-2">
          <DesignSystemCards />
        </div>
        <div className="grid content-start gap-6">
          <TokenPanel
            title="Implementation"
            rows={[
              ["semantic tokens", "shared CSS variables with paired foregrounds"],
              ["shape", "0px structure; roundness only for named mechanics"],
              ["hierarchy", "borders and tonal surfaces before shadows"],
              ["modes", "one anatomy across curated light and dark mappings"],
            ]}
          />
          <TokenPanel
            title="State contract"
            rows={[
              ["interaction", "focus, hover, active, disabled"],
              ["validation", "invalid and destructive remain distinct"],
              ["progress", "loading uses behavior, copy, and activity"],
              ["status", "success and warning use paired semantic roles"],
            ]}
          />
          <TokenPanel
            title="Scoped color"
            rows={[
              ["audio blue", "audio and seek timeline only"],
              ["P31 green", "oscilloscope traces only"],
              ["accent", "neutral product interaction"],
            ]}
          />
        </div>
      </div>
    </div>
  );
}

export function DesignSystemCards({ stageClassName }: { stageClassName?: string } = {}) {
  return (
    <>
      <SpecimenStage title="Semantic color" className={stageClassName}>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {[
            ["background", "bg-background text-foreground"],
            ["foreground", "bg-foreground text-background"],
            ["card", "bg-card text-card-foreground"],
            ["primary", "bg-primary text-primary-foreground"],
            ["secondary", "bg-secondary text-secondary-foreground"],
            ["muted", "bg-muted text-muted-foreground"],
            ["success", "bg-success text-success-foreground"],
            ["warning", "bg-warning text-warning-foreground"],
            ["destructive", "bg-destructive text-destructive-foreground"],
          ].map(([label, className]) => (
            <div key={label} className={cn("min-h-24 border p-3 font-mono text-xs", className)}>
              {label}
            </div>
          ))}
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          Use the Light, Dark, and System control in the catalog header to inspect the same anatomy
          against each curated mapping.
        </p>
      </SpecimenStage>
      <SpecimenStage title="Typography" className={stageClassName}>
        <div className="space-y-4">
          <div>
            <p className="font-mono text-2xl font-semibold tracking-[-0.02em]">
              Instrument-grade heading
            </p>
            <p className="font-mono text-xs text-muted-foreground">font-mono / TX-02</p>
          </div>
          <p className="max-w-prose text-sm leading-6 text-muted-foreground">
            Geist carries longer explanatory copy with stable rhythm and readable line lengths.
          </p>
          <p className="font-mono-secondary text-xs">Departure Mono stays selective.</p>
        </div>
      </SpecimenStage>
      <SpecimenStage title="Geometry" className={stageClassName}>
        <div className="grid gap-4">
          <div className="grid min-h-24 place-items-center border bg-card p-4 text-center font-mono text-xs">
            radius-none structure
          </div>
          <div>
            <p className="mb-2 font-mono text-xs text-muted-foreground">
              Named functional exceptions
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Badge>status chip</Badge>
              <span className="size-4 rounded-full border border-primary" aria-hidden="true" />
              <span
                className="h-2 w-24 overflow-hidden rounded-full bg-primary/20"
                role="progressbar"
                aria-label="Progress track"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={66}
              >
                <span className="block h-full w-2/3 rounded-full bg-primary" />
              </span>
            </div>
          </div>
        </div>
      </SpecimenStage>
      <SpecimenStage title="Spacing" className={stageClassName}>
        <div className="space-y-3">
          {[1, 2, 3, 4, 6, 8].map((step) => (
            <div key={step} className="flex items-center gap-3">
              <span className="w-10 font-mono text-xs text-muted-foreground">{step * 4}px</span>
              <div className="h-3 bg-foreground" style={{ width: step * 4 }} />
            </div>
          ))}
        </div>
      </SpecimenStage>
      <SpecimenStage
        title="Interaction and status states"
        className={cn("md:col-span-2", stageClassName)}
      >
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="flex flex-wrap content-start gap-2">
            <Button>Default</Button>
            <Button className="bg-accent text-accent-foreground" variant="ghost">
              Hover
            </Button>
            <Button className="border-ring ring-[3px] ring-ring/50" variant="outline">
              Focus
            </Button>
            <Button className="bg-accent text-accent-foreground shadow-inner" variant="ghost">
              Active
            </Button>
            <Button disabled>Disabled</Button>
            <Button disabled aria-busy="true">
              <Spinner aria-hidden="true" role="presentation" />
              Loading
            </Button>
            <Input aria-invalid="true" defaultValue="Invalid value" aria-label="Invalid field" />
          </div>
          <fieldset className="grid gap-2 border-0 p-0">
            <legend className="sr-only">Semantic status examples</legend>
            <div className="border border-success bg-success p-3 text-sm text-success-foreground">
              Success: contract checks passed.
            </div>
            <div className="border border-warning bg-warning p-3 text-sm text-warning-foreground">
              Warning: review the pending token change.
            </div>
            <div className="border border-destructive bg-destructive p-3 text-sm text-destructive-foreground">
              Destructive: this action cannot be undone.
            </div>
          </fieldset>
        </div>
      </SpecimenStage>
      <SpecimenStage
        title="Scoped instrument color"
        className={cn("md:col-span-2", stageClassName)}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="border border-audio-panel-border bg-audio-accent-softer p-4 text-foreground">
            <p className="font-mono text-sm">audio blue</p>
            <div className="mt-4 flex h-20 items-end gap-1">
              {[28, 64, 42, 80, 54, 72, 36, 60].map((value) => (
                <div
                  key={value}
                  className="flex-1 bg-audio-accent"
                  style={{ height: `${value}%` }}
                />
              ))}
            </div>
          </div>
          <div className="border bg-[color:var(--oscilloscope-shoulder)] p-4 text-[color:var(--oscilloscope-glow)]">
            <p className="font-mono text-sm">P31 oscilloscope</p>
            <div className="mt-4 h-20 border border-[color:var(--oscilloscope-floor)] bg-[color:var(--oscilloscope-shoulder)] p-3">
              <div className="h-full w-full border-t-2 border-[color:var(--oscilloscope-trace)]" />
            </div>
          </div>
        </div>
      </SpecimenStage>
    </>
  );
}

function TokenPanel({
  title,
  rows,
}: {
  title: string;
  rows: readonly (readonly [string, string])[];
}) {
  return (
    <section className="min-w-0 bg-background">
      <header className="mb-2 px-1">
        <h3 className="font-mono text-xs text-muted-foreground">{title}</h3>
      </header>
      <div className="divide-y bg-muted/25 p-4">
        {rows.map(([label, value]) => (
          <div key={label} className="grid gap-2 py-2 text-sm sm:grid-cols-[112px_minmax(0,1fr)]">
            <span className="font-mono text-xs text-muted-foreground">{label}</span>
            <span className="text-muted-foreground">{value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
