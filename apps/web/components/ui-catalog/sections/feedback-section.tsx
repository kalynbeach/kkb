import { Alert, AlertDescription, AlertTitle } from "@kkb/ui/components/alert";
import { Badge } from "@kkb/ui/components/badge";
import { Button } from "@kkb/ui/components/button";
import { Progress } from "@kkb/ui/components/progress";
import { Skeleton } from "@kkb/ui/components/skeleton";
import { Spinner } from "@kkb/ui/components/spinner";
import { AlertTriangle, CheckCircle2, Zap } from "lucide-react";

import { ComponentCard } from "../component-card";

export function FeedbackSection() {
  return (
    <>
      <ComponentCard
        title="Alerts"
        description="Immediate status messaging with explicit next steps for success, caution, and failure states."
      >
        <div className="space-y-3 p-6">
          <Alert>
            <CheckCircle2 className="size-4" />
            <AlertTitle>Catalog hierarchy pass saved</AlertTitle>
            <AlertDescription>
              Core primitives, instrument bays, and support exports now have separate scan paths.
            </AlertDescription>
          </Alert>
          <Alert variant="destructive">
            <AlertTriangle className="size-4" />
            <AlertTitle>Browser verification failed</AlertTitle>
            <AlertDescription>
              Fix clipped overlays or overflow findings, then rerun the focused Browser check.
            </AlertDescription>
          </Alert>
          <div className="flex flex-wrap gap-2">
            <Button size="sm">Rerun Browser check</Button>
            <Button size="sm" variant="outline">
              Open findings
            </Button>
          </div>
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
              <span className="font-medium">Focused state coverage</span>
              <span className="font-mono text-xs text-muted-foreground">6 / 8</span>
            </div>
            <Progress value={75} />
          </div>

          <div className="flex items-center gap-3 rounded-md bg-muted/20 px-4 py-3">
            <Spinner className="size-4" />
            <div className="space-y-1">
              <p className="text-sm font-medium">Browser verification running</p>
              <p className="text-sm text-muted-foreground">
                Checking rail navigation, command search, instrument bays, and focused component
                states.
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
          <div className="space-y-3 rounded-md bg-muted/20 p-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-28" />
              <Zap className="size-4 text-muted-foreground" />
            </div>
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-5/6" />
            <Skeleton className="h-20 w-full rounded-md" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Skeleton className="h-10 rounded-md" />
            <Skeleton className="h-10 rounded-md" />
            <Skeleton className="h-10 rounded-md" />
          </div>
        </div>
      </ComponentCard>
    </>
  );
}
