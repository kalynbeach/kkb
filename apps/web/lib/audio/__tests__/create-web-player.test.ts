import { describe, expect, test } from "bun:test";

import { createWebPlayer } from "../create-web-player";

const createAudioStub = () => {
  let src = "";

  return {
    currentTime: 0,
    duration: 180,
    buffered: {
      length: 1,
      start: () => 0,
      end: () => 30,
    },
    canPlayType: () => "probably",
    play: async () => {},
    pause: () => {},
    load: () => {},
    removeAttribute: (name: string) => {
      if (name === "src") {
        src = "";
      }
    },
    set src(value: string) {
      src = value;
    },
    get src() {
      return src;
    },
  };
};

describe("createWebPlayer", () => {
  test("wires engine and sources into one player instance", () => {
    const player = createWebPlayer({
      createMediaElement: createAudioStub,
      createFallbackElement: createAudioStub,
    });

    expect(player).toHaveProperty("engine");
    expect(player).toHaveProperty("sources");
    expect(player.sources).toHaveLength(4);
    expect(typeof player.getSnapshot).toBe("function");
    expect(typeof player.subscribe).toBe("function");
  });
});
