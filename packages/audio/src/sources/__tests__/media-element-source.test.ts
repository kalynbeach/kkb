import { describe, expect, test } from "bun:test";

import { createMediaElementSource } from "../media-element-source";

const createAudioStub = () => {
  let src = "";

  return {
    currentTime: 0,
    duration: 0,
    canPlayType: (mimeType: string) => (mimeType.includes("audio/") ? "probably" : ""),
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

describe("createMediaElementSource", () => {
  test("loads, seeks, and destroys the media element", async () => {
    const audio = createAudioStub();
    const source = createMediaElementSource(audio);

    await source.load({
      src: "/audio/test-tone-aac.m4a",
      mimeType: "audio/mp4; codecs=mp4a.40.2",
    });
    await source.seek(32);
    await source.destroy();

    expect(audio.currentTime).toBe(32);
    expect(audio.src).toBe("");
  });

  test("delegates play to the media element", async () => {
    let playCalls = 0;
    const audio = {
      ...createAudioStub(),
      play: async () => {
        playCalls += 1;
      },
    };
    const source = createMediaElementSource(audio);

    await source.play();

    expect(playCalls).toBe(1);
  });
});
