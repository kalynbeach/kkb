"use client";

import { cn } from "@kkb/ui/lib/utils";

import { itemFromId } from "./catalog-data";
import { SpecimenStage, SurfaceHeader } from "./catalog-surface-shared";

export function DesignSystemSurface() {
  return (
    <div>
      <SurfaceHeader item={itemFromId("design-system")} />
      <div className="grid gap-px border-t bg-border xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="grid gap-px bg-border md:grid-cols-2">
          <DesignSystemCards stageClassName="border-0" />
        </div>
        <div className="grid content-start gap-px bg-border">
          <TokenPanel
            title="Implementation"
            rows={[
              ["semantic tokens", "shadcn-compatible CSS variables"],
              ["studio names", "bench ink, rail gray, scope blue"],
              ["shape", "1-4px product radii"],
              ["motion", "stateful, reduced-motion aware"],
            ]}
          />
          <TokenPanel
            title="Scoped color"
            rows={[
              ["audio blue", "audio and waveform only"],
              ["P31 green", "oscilloscope traces only"],
              ["accent", "neutral product accent"],
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
      <SpecimenStage title="Color tokens" className={stageClassName}>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {[
            ["background", "bg-background text-foreground"],
            ["foreground", "bg-foreground text-background"],
            ["card", "bg-card text-card-foreground"],
            ["primary", "bg-primary text-primary-foreground"],
            ["secondary", "bg-secondary text-secondary-foreground"],
            ["muted", "bg-muted text-muted-foreground"],
            ["accent", "bg-accent text-accent-foreground"],
            ["border", "bg-border text-foreground"],
            ["audio", "bg-audio-accent text-primary"],
          ].map(([label, className]) => (
            <div key={label} className={cn("min-h-28 border p-3 font-mono text-xs", className)}>
              {label}
            </div>
          ))}
        </div>
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
      <SpecimenStage title="Radius" className={stageClassName}>
        <div className="grid grid-cols-4 gap-3">
          {["rounded-none", "rounded-sm", "rounded-md", "rounded-lg"].map((radius) => (
            <div
              key={radius}
              className={cn(
                "grid aspect-square place-items-center border bg-muted/30 font-mono text-[10px]",
                radius,
              )}
            >
              {radius.replace("rounded-", "")}
            </div>
          ))}
        </div>
      </SpecimenStage>
      <SpecimenStage title="Spacing" className={stageClassName}>
        <div className="space-y-3">
          {[1, 2, 3, 4, 6, 8].map((step) => (
            <div key={step} className="flex items-center gap-3">
              <span className="w-10 font-mono text-xs text-muted-foreground">{step * 4}px</span>
              <div className="h-3 bg-foreground" style={{ width: step * 16 }} />
            </div>
          ))}
        </div>
      </SpecimenStage>
      <SpecimenStage
        title="Scoped instrument color"
        className={cn("md:col-span-2", stageClassName)}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="border border-audio-panel-border bg-audio-accent-softer p-4">
            <p className="font-mono text-sm text-audio-accent">audio blue</p>
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
    <div className="bg-background p-4">
      <p className="font-mono text-sm font-semibold">{title}</p>
      <div className="mt-3 divide-y">
        {rows.map(([label, value]) => (
          <div key={label} className="grid gap-2 py-2 text-sm sm:grid-cols-[112px_minmax(0,1fr)]">
            <span className="font-mono text-xs text-muted-foreground">{label}</span>
            <span className="text-muted-foreground">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
