import { Button } from "@kkb/ui/components/button";
import { ButtonGroup } from "@kkb/ui/components/button-group";
import { Checkbox } from "@kkb/ui/components/checkbox";
import { Input } from "@kkb/ui/components/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@kkb/ui/components/input-group";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@kkb/ui/components/input-otp";
import { Label } from "@kkb/ui/components/label";
import { RadioGroup, RadioGroupItem } from "@kkb/ui/components/radio-group";
import { Slider } from "@kkb/ui/components/slider";
import { Switch } from "@kkb/ui/components/switch";
import { Textarea } from "@kkb/ui/components/textarea";
import { Toggle } from "@kkb/ui/components/toggle";
import { ToggleGroup, ToggleGroupItem } from "@kkb/ui/components/toggle-group";
import { BellIcon } from "@phosphor-icons/react/dist/ssr/Bell";
import { MagnifyingGlassIcon } from "@phosphor-icons/react/dist/ssr/MagnifyingGlass";
import { PulseIcon } from "@phosphor-icons/react/dist/ssr/Pulse";
import { SlidersHorizontalIcon } from "@phosphor-icons/react/dist/ssr/SlidersHorizontal";

import { ComponentCard } from "../component-card";
import { CalendarDemo, SelectDemo } from "../demos/select-calendar-demo";

export function InputSection() {
  return (
    <>
      <ComponentCard
        title="Buttons"
        description="Primary actions, lower-emphasis affordances, and grouped choices."
      >
        <div className="space-y-4 p-6">
          <div className="flex flex-wrap gap-3">
            <Button>Run checks</Button>
            <Button variant="outline">Open route</Button>
            <Button variant="secondary">Save note</Button>
          </div>
          <ButtonGroup>
            <Button variant="outline">Source</Button>
            <Button variant="outline">States</Button>
            <Button variant="outline">Tokens</Button>
          </ButtonGroup>
        </div>
      </ComponentCard>

      <ComponentCard
        title="Text Inputs"
        description="Straight fields plus richer grouped input affordances."
      >
        <div className="space-y-4 p-6">
          <Input placeholder="Search primitives" defaultValue="audio waveform" />
          <InputGroup>
            <InputGroupAddon>
              <MagnifyingGlassIcon aria-hidden="true" focusable="false" className="size-4" />
              <InputGroupText>Filter</InputGroupText>
            </InputGroupAddon>
            <InputGroupInput defaultValue="focused state coverage" />
          </InputGroup>
          <Textarea defaultValue="Document the import path, visible states, and recovery behavior before marking a primitive ship-ready." />
        </div>
      </ComponentCard>

      <ComponentCard
        title="Choice Controls"
        description="Binary, exclusive, and preference-style controls in one compact surface."
      >
        <div className="grid gap-5 p-6">
          <div className="flex items-center justify-between gap-4 rounded-md bg-muted/20 px-4 py-3">
            <div className="space-y-1">
              <Label htmlFor="sticky-rail" className="font-medium">
                Enable sticky rail
              </Label>
              <p className="text-sm text-muted-foreground">
                Keeps spatial browsing visible on desktop.
              </p>
            </div>
            <Switch id="sticky-rail" defaultChecked aria-label="Enable sticky rail" />
          </div>

          <div className="space-y-3 rounded-md bg-muted/20 px-4 py-3">
            <p className="text-sm font-medium">Release channel</p>
            <RadioGroup defaultValue="stable" className="gap-2">
              <div className="flex items-center gap-2 text-sm">
                <RadioGroupItem id="release-stable" value="stable" />
                <Label htmlFor="release-stable">Ship-ready</Label>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <RadioGroupItem id="release-preview" value="preview" />
                <Label htmlFor="release-preview">Needs browser pass</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex items-center gap-3 rounded-md bg-muted/20 px-4 py-3 text-sm">
            <Checkbox id="follow-up-notes" defaultChecked />
            <Label htmlFor="follow-up-notes">Add verification notes to the handoff</Label>
          </div>
        </div>
      </ComponentCard>

      <ComponentCard
        title="OTP + Select"
        description="Structured entry plus a richer controlled select surface for preset choices."
      >
        <div className="space-y-0">
          <div className="space-y-2">
            <div className="space-y-4 border-b p-6">
              <p className="text-sm font-medium">Verification code</p>
              <InputOTP maxLength={6}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
          </div>
          <SelectDemo />
        </div>
      </ComponentCard>

      <ComponentCard
        title="Calendar"
        description="Single-date picking with a compact month view and local selected state."
      >
        <CalendarDemo />
      </ComponentCard>

      <ComponentCard
        title="Toggles + Slider"
        description="Quick state flips and continuous adjustment in one command surface."
      >
        <div className="space-y-5 p-6">
          <div className="flex flex-wrap gap-3">
            <Toggle defaultPressed aria-label="Show scope traces">
              <PulseIcon aria-hidden="true" focusable="false" className="size-4" />
              Scope traces
            </Toggle>
            <Toggle aria-label="Watch browser checks">
              <BellIcon aria-hidden="true" focusable="false" className="size-4" />
              Watch checks
            </Toggle>
          </div>

          <div className="space-y-3">
            <ToggleGroup type="multiple" defaultValue={["grid", "labels"]}>
              <ToggleGroupItem value="grid">Grid</ToggleGroupItem>
              <ToggleGroupItem value="labels">Labels</ToggleGroupItem>
              <ToggleGroupItem value="stats">Stats</ToggleGroupItem>
            </ToggleGroup>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <SlidersHorizontalIcon aria-hidden="true" focusable="false" className="size-4" />
              Density
            </div>
            <Slider defaultValue={[72]} max={100} step={1} getAriaLabel={() => "Density"} />
          </div>
        </div>
      </ComponentCard>
    </>
  );
}
