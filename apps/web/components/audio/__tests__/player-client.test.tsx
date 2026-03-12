import { describe, expect, mock, test } from "bun:test";
import { renderToString } from "react-dom/server";

import { PlayerClient } from "../player-client";

describe("PlayerClient", () => {
  test("does not create the browser audio runtime during server render", () => {
    const createPlayer = mock(() => {
      throw new Error("browser runtime should not be created during server render");
    });

    expect(() => renderToString(<PlayerClient createPlayer={createPlayer} />)).not.toThrow();
    expect(createPlayer).not.toHaveBeenCalled();
  });

  test("renders the default catalog track metadata during server render", () => {
    const html = renderToString(<PlayerClient />);

    expect(html).toContain("Test Tone (AAC)");
    expect(html).toContain("Playlist");
  });
});
