type PlayerStatus = "idle" | "loading" | "ready" | "playing" | "paused" | "recovering" | "error";

const shouldPollPlayerTimeline = (status: PlayerStatus) => status === "playing";

export { shouldPollPlayerTimeline };
