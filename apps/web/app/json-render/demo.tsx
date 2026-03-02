"use client";

import type { Spec } from "@json-render/core";
import { Renderer, JSONUIProvider } from "@json-render/react";
import { registry } from "@kkb/ui/json-render/registry";

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
