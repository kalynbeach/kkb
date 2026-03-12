import { describe, expect, mock, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";

import { TrackSelector } from "../track-selector";

const findSelectElement = (
  node: unknown,
): { props: { onChange: (event: { currentTarget: { value: string } }) => void } } | null => {
  if (!node || typeof node !== "object") {
    return null;
  }

  if ("type" in node && node.type === "select" && "props" in node) {
    return node as { props: { onChange: (event: { currentTarget: { value: string } }) => void } };
  }

  if (!("props" in node)) {
    return null;
  }

  const children = Array.isArray(node.props.children) ? node.props.children : [node.props.children];

  for (const child of children) {
    const match = findSelectElement(child);

    if (match) {
      return match;
    }
  }

  return null;
};

describe("TrackSelector", () => {
  test("renders all catalog tracks and marks the selected track", () => {
    const html = renderToStaticMarkup(
      <TrackSelector
        tracks={[
          { id: "test-tone-aac", title: "AAC Track", assets: [] },
          { id: "test-tone-opus", title: "Opus Track", assets: [] },
        ]}
        selectedTrackId="test-tone-opus"
        onSelectTrack={() => {}}
      />,
    );

    expect(html).toContain(">AAC Track</option>");
    expect(html).toContain(">Opus Track</option>");
    expect(html).toContain('value="test-tone-opus"');
  });

  test("calls onSelectTrack when the selected option changes", () => {
    const onSelectTrack = mock((_trackId: string) => {});
    const element = TrackSelector({
      tracks: [
        { id: "test-tone-aac", title: "AAC Track", assets: [] },
        { id: "test-tone-opus", title: "Opus Track", assets: [] },
      ],
      selectedTrackId: "test-tone-aac",
      onSelectTrack,
    });
    const select = findSelectElement(element);

    expect(select).not.toBeNull();

    select?.props.onChange({
      currentTarget: {
        value: "test-tone-opus",
      },
    });

    expect(onSelectTrack).toHaveBeenCalledWith("test-tone-opus");
  });
});
