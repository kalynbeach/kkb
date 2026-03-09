"use client";

import type { Spec } from "@kkb/ui/json-render";
import { Renderer, JSONUIProvider, registry } from "@kkb/ui/json-render";

export function JsonRenderDemo({
  spec,
  initialState,
}: {
  spec: Spec;
  initialState?: Record<string, unknown>;
}) {
  return (
    <JSONUIProvider registry={registry} initialState={initialState ?? spec.state ?? {}}>
      <Renderer spec={spec} registry={registry} />
    </JSONUIProvider>
  );
}
