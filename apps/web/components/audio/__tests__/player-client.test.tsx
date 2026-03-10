import { describe, expect, test } from "bun:test";
import { renderToString } from "react-dom/server";

import { PlayerClient } from "../player-client";

describe("PlayerClient", () => {
  test("does not create the browser audio runtime during server render", () => {
    expect(() => renderToString(<PlayerClient />)).not.toThrow();
  });
});
