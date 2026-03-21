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
import { NativeSelect, NativeSelectOption } from "@kkb/ui/components/native-select";
import { RadioGroup, RadioGroupItem } from "@kkb/ui/components/radio-group";
import { Slider } from "@kkb/ui/components/slider";
import { Switch } from "@kkb/ui/components/switch";
import { Textarea } from "@kkb/ui/components/textarea";
import { Toggle } from "@kkb/ui/components/toggle";
import { ToggleGroup, ToggleGroupItem } from "@kkb/ui/components/toggle-group";
import { Bell, Search, SlidersHorizontal, Sparkles } from "lucide-react";

import { ComponentCard } from "../component-card";

export const inputSectionItemCount = 5;

export function InputSection() {
  return (
    <>
      <ComponentCard
        title="Buttons"
        description="Primary actions, lower-emphasis affordances, and grouped choices."
      >
        <div className="space-y-4 p-6">
          <div className="flex flex-wrap gap-3">
            <Button>Publish</Button>
            <Button variant="outline">Preview</Button>
            <Button variant="secondary">Save draft</Button>
          </div>
          <ButtonGroup>
            <Button variant="outline">Day</Button>
            <Button variant="outline">Week</Button>
            <Button variant="outline">Month</Button>
          </ButtonGroup>
        </div>
      </ComponentCard>

      <ComponentCard
        title="Text Inputs"
        description="Straight fields plus richer grouped input affordances."
      >
        <div className="space-y-4 p-6">
          <Input placeholder="Search sections" defaultValue="ui catalog" />
          <InputGroup>
            <InputGroupAddon>
              <Search className="size-4" />
              <InputGroupText>Filter</InputGroupText>
            </InputGroupAddon>
            <InputGroupInput defaultValue="navigation" />
          </InputGroup>
          <Textarea defaultValue="Shared shell is in place. Populate the cards with representative demos next." />
        </div>
      </ComponentCard>

      <ComponentCard
        title="Choice Controls"
        description="Binary, exclusive, and preference-style controls in one compact surface."
      >
        <div className="grid gap-5 p-6">
          <div className="flex items-center justify-between gap-4 rounded-xl border px-4 py-3">
            <div className="space-y-1">
              <Label htmlFor="sticky-rail" className="font-medium">
                Enable sticky rail
              </Label>
              <p className="text-sm text-muted-foreground">Keeps section nav visible on desktop.</p>
            </div>
            <Switch id="sticky-rail" defaultChecked aria-label="Enable sticky rail" />
          </div>

          <div className="space-y-3 rounded-xl border px-4 py-3">
            <p className="text-sm font-medium">Release channel</p>
            <RadioGroup defaultValue="stable" className="gap-2">
              <div className="flex items-center gap-2 text-sm">
                <RadioGroupItem id="release-stable" value="stable" />
                <Label htmlFor="release-stable">Stable</Label>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <RadioGroupItem id="release-preview" value="preview" />
                <Label htmlFor="release-preview">Preview</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex items-center gap-3 rounded-xl border px-4 py-3 text-sm">
            <Checkbox id="follow-up-notes" defaultChecked />
            <Label htmlFor="follow-up-notes">Send follow-up notes after publish</Label>
          </div>
        </div>
      </ComponentCard>

      <ComponentCard
        title="OTP + Native Select"
        description="Structured entry and low-friction platform-native selection."
      >
        <div className="space-y-4 p-6">
          <div className="space-y-2">
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

          <div className="space-y-2">
            <p className="text-sm font-medium">Preferred density</p>
            <NativeSelect defaultValue="comfortable" className="w-full">
              <NativeSelectOption value="compact">Compact</NativeSelectOption>
              <NativeSelectOption value="comfortable">Comfortable</NativeSelectOption>
              <NativeSelectOption value="spacious">Spacious</NativeSelectOption>
            </NativeSelect>
          </div>
        </div>
      </ComponentCard>

      <ComponentCard
        title="Toggles + Slider"
        description="Quick state flips and continuous adjustment in one command surface."
      >
        <div className="space-y-5 p-6">
          <div className="flex flex-wrap gap-3">
            <Toggle defaultPressed aria-label="Auto layout">
              <Sparkles className="size-4" />
              Auto layout
            </Toggle>
            <Toggle aria-label="Notifications">
              <Bell className="size-4" />
              Notifications
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
              <SlidersHorizontal className="size-4" />
              Density
            </div>
            <Slider defaultValue={[72]} max={100} step={1} aria-label="Density" />
          </div>
        </div>
      </ComponentCard>
    </>
  );
}
