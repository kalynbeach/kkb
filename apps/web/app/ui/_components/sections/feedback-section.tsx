import { Alert, AlertDescription, AlertTitle } from "@kkb/ui/components/alert";
import { Badge } from "@kkb/ui/components/badge";
import { Progress } from "@kkb/ui/components/progress";
import { Skeleton } from "@kkb/ui/components/skeleton";
import { Spinner } from "@kkb/ui/components/spinner";
import { AlertTriangle, CheckCircle2, Zap } from "lucide-react";

import { ComponentCard } from "../component-card";

export const feedbackSectionItemCount = 4;

export function FeedbackSection() {
  return (
    <>
      <ComponentCard
        title="Alerts"
        description="Immediate status messaging for success, caution, and failure states."
      >
        <div className="space-y-3 p-6">
          <Alert>
            <CheckCircle2 className="size-4" />
            <AlertTitle>Catalog scaffold merged</AlertTitle>
            <AlertDescription>
              Core sections can now land independently without revisiting the page shell.
            </AlertDescription>
          </Alert>
          <Alert variant="destructive">
            <AlertTriangle className="size-4" />
            <AlertTitle>Build verification pending</AlertTitle>
            <AlertDescription>
              Filtered production build still needs a clean, reproducible pass.
            </AlertDescription>
          </Alert>
        </div>
      </ComponentCard>

      <ComponentCard
        title="Badges"
        description="Compact semantic labels for release state, scope, and emphasis."
      >
        <div className="flex flex-wrap gap-3 p-6">
          <Badge>stable</Badge>
          <Badge variant="secondary">preview</Badge>
          <Badge variant="outline">server-owned</Badge>
          <Badge variant="destructive">blocked</Badge>
          <Badge variant="ghost">draft</Badge>
        </div>
      </ComponentCard>

      <ComponentCard
        title="Progress + Spinner"
        description="Longer-running status feedback with both determinate and indeterminate affordances."
      >
        <div className="space-y-5 p-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Core section coverage</span>
              <span className="font-mono text-xs text-muted-foreground">4 / 8</span>
            </div>
            <Progress value={50} />
          </div>

          <div className="flex items-center gap-3 rounded-xl border px-4 py-3">
            <Spinner className="size-4" />
            <div className="space-y-1">
              <p className="text-sm font-medium">Preparing follow-up demos</p>
              <p className="text-sm text-muted-foreground">
                Overlay, menu, data, and audio sections remain queued.
              </p>
            </div>
          </div>
        </div>
      </ComponentCard>

      <ComponentCard
        title="Skeleton"
        description="Low-noise placeholders for cards and loading summaries."
      >
        <div className="space-y-4 p-6">
          <div className="space-y-3 rounded-xl border p-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-28" />
              <Zap className="size-4 text-muted-foreground" />
            </div>
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-5/6" />
            <Skeleton className="h-20 w-full rounded-xl" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Skeleton className="h-10 rounded-xl" />
            <Skeleton className="h-10 rounded-xl" />
            <Skeleton className="h-10 rounded-xl" />
          </div>
        </div>
      </ComponentCard>
    </>
  );
}
