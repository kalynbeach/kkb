class AudioRuntimeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}

export class NetworkError extends AudioRuntimeError {}

export class DecodeError extends AudioRuntimeError {}

export class UnsupportedError extends AudioRuntimeError {}

export class UserGestureRequiredError extends AudioRuntimeError {}

export class WorkletError extends AudioRuntimeError {}

export class InterruptionError extends AudioRuntimeError {}
