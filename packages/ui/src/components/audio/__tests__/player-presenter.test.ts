import { describe, expect, test } from "bun:test";

import { createPlayerPresenter } from "../presenter";

describe("createPlayerPresenter", () => {
  test("maps status to the available transport action", () => {
    const idle = createPlayerPresenter({
      status: "idle",
      currentTime: 0,
      duration: 0,
      bufferedRanges: [],
    });
    const ready = createPlayerPresenter({
      status: "ready",
      currentTime: 0,
      duration: 120,
      bufferedRanges: [],
    });
    const playing = createPlayerPresenter({
      status: "playing",
      currentTime: 12,
      duration: 120,
      bufferedRanges: [],
    });

    expect(idle.controlMode).toBe("unavailable");
    expect(ready.controlMode).toBe("play");
    expect(playing.controlMode).toBe("pause");
  });

  test("formats current time and duration labels", () => {
    const presenter = createPlayerPresenter({
      status: "ready",
      currentTime: 65,
      duration: 125,
      bufferedRanges: [],
    });

    expect(presenter.currentTimeLabel).toBe("1:05");
    expect(presenter.durationLabel).toBe("2:05");
  });

  test("converts buffered ranges into percentage segments", () => {
    const presenter = createPlayerPresenter({
      status: "ready",
      currentTime: 20,
      duration: 120,
      bufferedRanges: [
        { start: 0, end: 30 },
        { start: 60, end: 90 },
      ],
    });

    expect(presenter.bufferedSegments).toEqual([
      { leftPercent: 0, widthPercent: 25 },
      { leftPercent: 50, widthPercent: 25 },
    ]);
  });

  test("sanitizes non-finite timeline values", () => {
    const presenter = createPlayerPresenter({
      status: "ready",
      currentTime: Number.NaN,
      duration: Number.POSITIVE_INFINITY,
      bufferedRanges: [{ start: Number.NaN, end: Number.POSITIVE_INFINITY }],
    });

    expect(presenter.currentTimeLabel).toBe("0:00");
    expect(presenter.durationLabel).toBe("0:00");
    expect(presenter.progressPercent).toBe(0);
    expect(presenter.bufferedSegments).toEqual([{ leftPercent: 0, widthPercent: 0 }]);
  });
});
