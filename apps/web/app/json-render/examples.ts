import type { Spec } from "@kkb/ui/json-render";

/** Simple card with heading and text */
export const cardSpec: Spec = {
  root: "card",
  elements: {
    card: {
      type: "Card",
      props: { title: "Welcome", description: "A json-render demo" },
      children: ["stack"],
    },
    stack: {
      type: "Stack",
      props: { direction: "vertical", gap: "md" },
      children: ["heading", "text"],
    },
    heading: {
      type: "Heading",
      props: { text: "Hello, json-render", level: "h2" },
      children: [],
    },
    text: {
      type: "Text",
      props: {
        text: "This UI is rendered entirely from a JSON spec using shadcn/ui components.",
        variant: "muted",
      },
      children: [],
    },
  },
};

/** Dashboard-style layout with badges, progress, and a table */
export const dashboardSpec: Spec = {
  root: "root",
  elements: {
    root: {
      type: "Stack",
      props: { direction: "vertical", gap: "lg" },
      children: ["header", "metrics", "table_card"],
    },
    header: {
      type: "Heading",
      props: { text: "Dashboard", level: "h2" },
      children: [],
    },
    metrics: {
      type: "Grid",
      props: { columns: 3, gap: "md" },
      children: ["metric1", "metric2", "metric3"],
    },
    metric1: {
      type: "Card",
      props: { title: "Users" },
      children: ["metric1_stack"],
    },
    metric1_stack: {
      type: "Stack",
      props: { direction: "horizontal", gap: "sm", align: "center" },
      children: ["metric1_val", "metric1_badge"],
    },
    metric1_val: {
      type: "Heading",
      props: { text: "1,234", level: "h3" },
      children: [],
    },
    metric1_badge: {
      type: "Badge",
      props: { text: "+12%", variant: "default" },
      children: [],
    },
    metric2: {
      type: "Card",
      props: { title: "Revenue" },
      children: ["metric2_stack"],
    },
    metric2_stack: {
      type: "Stack",
      props: { direction: "horizontal", gap: "sm", align: "center" },
      children: ["metric2_val", "metric2_badge"],
    },
    metric2_val: {
      type: "Heading",
      props: { text: "$48.2k", level: "h3" },
      children: [],
    },
    metric2_badge: {
      type: "Badge",
      props: { text: "+8%", variant: "secondary" },
      children: [],
    },
    metric3: {
      type: "Card",
      props: { title: "Uptime" },
      children: ["metric3_progress"],
    },
    metric3_progress: {
      type: "Progress",
      props: { value: 99.9, max: 100, label: "99.9%" },
      children: [],
    },
    table_card: {
      type: "Card",
      props: { title: "Recent Activity" },
      children: ["table"],
    },
    table: {
      type: "Table",
      props: {
        columns: ["Event", "User", "Date", "Status"],
        rows: [
          ["Deployment", "kalyn", "2026-03-01", "Success"],
          ["Build", "ci-bot", "2026-03-01", "Running"],
          ["PR Merged", "kalyn", "2026-02-28", "Complete"],
          ["Test Suite", "ci-bot", "2026-02-28", "Passed"],
        ],
      },
      children: [],
    },
  },
};

/** Interactive form with state bindings */
export const formSpec: Spec = {
  root: "form_card",
  state: {
    form: {
      name: "",
      email: "",
      notify: false,
      role: "",
      message: "",
    },
    submitted: false,
  },
  elements: {
    form_card: {
      type: "Card",
      props: { title: "Contact Form", description: "Two-way state bindings" },
      children: ["form_stack"],
    },
    form_stack: {
      type: "Stack",
      props: { direction: "vertical", gap: "md" },
      children: [
        "name_input",
        "email_input",
        "role_select",
        "message_input",
        "notify_switch",
        "submit_btn",
        "success_alert",
      ],
    },
    name_input: {
      type: "Input",
      props: {
        label: "Name",
        name: "name",
        placeholder: "Enter your name",
        value: { $bindState: "/form/name" },
      },
      children: [],
    },
    email_input: {
      type: "Input",
      props: {
        label: "Email",
        name: "email",
        type: "email",
        placeholder: "you@example.com",
        value: { $bindState: "/form/email" },
      },
      children: [],
    },
    role_select: {
      type: "Select",
      props: {
        label: "Role",
        name: "role",
        options: ["Developer", "Designer", "Manager", "Other"],
        value: { $bindState: "/form/role" },
      },
      children: [],
    },
    message_input: {
      type: "Textarea",
      props: {
        label: "Message",
        name: "message",
        placeholder: "Tell us something...",
        rows: 3,
        value: { $bindState: "/form/message" },
      },
      children: [],
    },
    notify_switch: {
      type: "Switch",
      props: {
        label: "Send notifications",
        name: "notify",
        checked: { $bindState: "/form/notify" },
      },
      children: [],
    },
    submit_btn: {
      type: "Button",
      props: { label: "Submit", variant: "primary" },
      children: [],
      on: {
        press: {
          action: "setState",
          params: { statePath: "/submitted", value: true },
        },
      },
    },
    success_alert: {
      type: "Alert",
      props: {
        title: "Submitted!",
        message: { $template: "Thanks, ${/form/name}. We'll reach out at ${/form/email}." },
        type: "success",
      },
      children: [],
      visible: { $state: "/submitted" },
    },
  },
};

/** Tabbed content with visibility conditions */
export const tabsSpec: Spec = {
  root: "root",
  state: {
    activeTab: "overview",
    darkMode: false,
    compact: false,
  },
  elements: {
    root: {
      type: "Stack",
      props: { direction: "vertical", gap: "md" },
      children: ["tabs", "overview_content", "settings_content", "help_content"],
    },
    tabs: {
      type: "Tabs",
      props: {
        tabs: [
          { label: "Overview", value: "overview" },
          { label: "Settings", value: "settings" },
          { label: "Help", value: "help" },
        ],
        defaultValue: "overview",
        value: { $bindState: "/activeTab" },
      },
      children: [],
    },
    overview_content: {
      type: "Card",
      props: { title: "Overview" },
      children: ["overview_text"],
      visible: { $state: "/activeTab", eq: "overview" },
    },
    overview_text: {
      type: "Text",
      props: {
        text: "This tab panel is conditionally rendered based on the activeTab state value. Click the tabs above to switch between panels.",
      },
      children: [],
    },
    settings_content: {
      type: "Card",
      props: { title: "Settings" },
      children: ["settings_stack"],
      visible: { $state: "/activeTab", eq: "settings" },
    },
    settings_stack: {
      type: "Stack",
      props: { direction: "vertical", gap: "sm" },
      children: ["dark_mode_toggle", "compact_toggle"],
    },
    dark_mode_toggle: {
      type: "Switch",
      props: { label: "Dark mode", name: "darkMode", checked: { $bindState: "/darkMode" } },
      children: [],
    },
    compact_toggle: {
      type: "Switch",
      props: { label: "Compact layout", name: "compact", checked: { $bindState: "/compact" } },
      children: [],
    },
    help_content: {
      type: "Card",
      props: { title: "Help" },
      children: ["help_accordion"],
      visible: { $state: "/activeTab", eq: "help" },
    },
    help_accordion: {
      type: "Accordion",
      props: {
        type: "single",
        items: [
          { title: "What is json-render?", content: "A framework for rendering JSON specs as React component trees." },
          { title: "How does state work?", content: "State is managed via JSON Pointer paths. Use $bindState for two-way binding." },
          { title: "Can I add custom components?", content: "Yes! Define them in your catalog alongside the standard shadcn components." },
        ],
      },
      children: [],
    },
  },
};
