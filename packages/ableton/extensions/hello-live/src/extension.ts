// NOTE: This is just an initial (temporary) placeholder Ableton Live extension for `@kkb/ableton`
import { type ActivationContext, initialize } from "@ableton-extensions/sdk";

export function activate(activation: ActivationContext) {
  const context = initialize(activation, "1.0.0");

  const { tempo } = context.application.song;
  console.log(`Hello from hello-live! Your Live Set's tempo is: ${tempo} bpm.`);
}
