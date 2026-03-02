export { catalog } from "./catalog";
export { registry } from "./registry";

// Re-export key utilities from json-render packages
export { defineCatalog, createStateStore } from "@json-render/core";
export type { StateStore, Spec } from "@json-render/core";
export {
  Renderer,
  JSONUIProvider,
  defineRegistry,
  useStateStore,
  useStateValue,
  useBoundProp,
  useAction,
} from "@json-render/react";
export { schema } from "@json-render/react/schema";
export {
  shadcnComponentDefinitions,
} from "@json-render/shadcn/catalog";
export { shadcnComponents } from "@json-render/shadcn";
