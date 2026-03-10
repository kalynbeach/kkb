import { describe, expect, test } from "bun:test";

import { createFallbackSource } from "../fallback-source";
import { createMediaElementSource } from "../media-element-source";

const createAudioStub = () => {
  let src = "";

  return {
    currentTime: 0,
    duration: 0,
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

describe("createFallbackSource", () => {
  test("exposes lower capabilities than the media element source", () => {
    const fallback = createFallbackSource(createAudioStub());
    const mediaElement = createMediaElementSource(createAudioStub());

    expect(fallback.score({ coopCoepEnabled: false, lowPowerModeLikely: false })).toBeLessThan(
      mediaElement.score({ coopCoepEnabled: false, lowPowerModeLikely: false }),
    );
    expect(fallback.capabilities.sampleAccurateSeek).toBe(false);
  });

  test("can still load and play a compatible input", async () => {
    let playCalls = 0;
    const audio = {
      ...createAudioStub(),
      play: async () => {
        playCalls += 1;
      },
    };
    const source = createFallbackSource(audio);

    await source.load({
      src: "/audio/test-tone-opus.webm",
      mimeType: "audio/webm; codecs=opus",
    });
    await source.play();

    expect(audio.src).toBe("/audio/test-tone-opus.webm");
    expect(playCalls).toBe(1);
  });
});
