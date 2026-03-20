import { describe, expect, mock, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";

import { TrackSelector } from "../track-selector";

type ButtonNode = {
  type: "button";
  props: {
    onClick: () => void;
    "aria-selected": boolean;
    children: unknown;
  };
};

const findButtons = (node: unknown): ButtonNode[] => {
  const buttons: ButtonNode[] = [];

  const walk = (n: unknown) => {
    if (!n || typeof n !== "object") return;
    if (Array.isArray(n)) {
      for (const child of n) walk(child);
      return;
    }
    if ("type" in n && n.type === "button" && "props" in n) {
      buttons.push(n as ButtonNode);
    }
    if ("props" in n) {
      const p = n as { props: { children?: unknown } };
      const children = Array.isArray(p.props.children) ? p.props.children : [p.props.children];
      for (const child of children) walk(child);
    }
  };

  walk(node);
  return buttons;
};

describe("TrackSelector", () => {
  test("renders all catalog tracks and marks the selected track", () => {
    const html = renderToStaticMarkup(
      <TrackSelector
        tracks={[
          {
            id: "test-tone-aac",
            title: "AAC Track",
            assets: [{ src: "/audio/test-tone-aac.m4a", mimeType: "audio/mp4; codecs=mp4a.40.2" }],
          },
          {
            id: "test-tone-opus",
            title: "Opus Track",
            assets: [{ src: "/audio/test-tone-opus.webm", mimeType: "audio/webm; codecs=opus" }],
          },
        ]}
        selectedTrackId="test-tone-opus"
        onSelectTrack={() => {}}
      />,
    );

    expect(html).toContain("AAC Track");
    expect(html).toContain("Opus Track");
    expect(html).toContain('aria-selected="true"');
    expect(html).toContain('role="listbox"');
  });

  test("calls onSelectTrack when a track is clicked", () => {
    const onSelectTrack = mock((_trackId: string) => {});
    const element = TrackSelector({
      tracks: [
        {
          id: "test-tone-aac",
          title: "AAC Track",
          assets: [{ src: "/audio/test-tone-aac.m4a", mimeType: "audio/mp4; codecs=mp4a.40.2" }],
        },
        {
          id: "test-tone-opus",
          title: "Opus Track",
          assets: [{ src: "/audio/test-tone-opus.webm", mimeType: "audio/webm; codecs=opus" }],
        },
      ],
      selectedTrackId: "test-tone-aac",
      onSelectTrack,
    });
    const buttons = findButtons(element);

    expect(buttons).toHaveLength(2);

    buttons[1].props.onClick();

    expect(onSelectTrack).toHaveBeenCalledWith("test-tone-opus");
  });
});
