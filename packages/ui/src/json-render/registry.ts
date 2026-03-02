import { defineRegistry } from "@json-render/react";
import { shadcnComponents } from "@json-render/shadcn";
import { catalog } from "./catalog";

/**
 * KKB json-render registry with shadcn/ui component implementations.
 * Maps catalog definitions to their React renderers.
 */
export const { registry } = defineRegistry(catalog, {
  components: {
    // Layout
    Card: shadcnComponents.Card,
    Stack: shadcnComponents.Stack,
    Grid: shadcnComponents.Grid,
    Separator: shadcnComponents.Separator,

    // Navigation
    Tabs: shadcnComponents.Tabs,
    Accordion: shadcnComponents.Accordion,
    Collapsible: shadcnComponents.Collapsible,

    // Content
    Heading: shadcnComponents.Heading,
    Text: shadcnComponents.Text,
    Badge: shadcnComponents.Badge,
    Alert: shadcnComponents.Alert,
    Table: shadcnComponents.Table,

    // Feedback
    Progress: shadcnComponents.Progress,
    Skeleton: shadcnComponents.Skeleton,

    // Input
    Button: shadcnComponents.Button,
    Input: shadcnComponents.Input,
    Textarea: shadcnComponents.Textarea,
    Select: shadcnComponents.Select,
    Checkbox: shadcnComponents.Checkbox,
    Switch: shadcnComponents.Switch,
    Toggle: shadcnComponents.Toggle,
  },
});
