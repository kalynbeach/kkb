#!/usr/bin/env bash
set -euo pipefail

OUT_DIR="${OUT_DIR:-.artifacts/oscilloscope}"
BASE_URL="${BASE_URL:-http://localhost:3000/oscilloscope}"
FAKE_MONO_URL="${FAKE_MONO_URL:-${BASE_URL}?mic=fake-mono}"
FAKE_STEREO_URL="${FAKE_STEREO_URL:-${BASE_URL}?mic=fake-stereo}"
LIVE_URL="${LIVE_URL:-${BASE_URL}}"
VIEWPORT_WIDTH="${VIEWPORT_WIDTH:-1440}"
VIEWPORT_HEIGHT="${VIEWPORT_HEIGHT:-1100}"
VIEWPORT_SCALE="${VIEWPORT_SCALE:-2}"

mkdir -p "$OUT_DIR"

ab() {
  if command -v agent-browser >/dev/null 2>&1; then
    agent-browser "$@"
  else
    bunx agent-browser "$@"
  fi
}

open_session() {
  local session="$1"
  local url="$2"

  ab --session "$session" close || true
  ab --session "$session" open "$url"
  ab --session "$session" wait --load networkidle
  ab --session "$session" set viewport "$VIEWPORT_WIDTH" "$VIEWPORT_HEIGHT" "$VIEWPORT_SCALE"
  ab --session "$session" snapshot -i
}

capture() {
  local session="$1"
  echo "==> screenshot: session=$session"
  ab --session "$session" screenshot --screenshot-dir "$OUT_DIR"
}

preset_and_mic() {
  local session="$1"
  local preset="$2"

  echo "==> preset: $preset"
  ab --session "$session" select @e1 "$preset"
  ab --session "$session" wait 1200
  capture "$session"
}

echo "==> fake mono mic smoke"
open_session "osc-fake-mono" "$FAKE_MONO_URL"
capture "osc-fake-mono"
ab --session "osc-fake-mono" click @e3
ab --session "osc-fake-mono" wait 1200
capture "osc-fake-mono"
preset_and_mic "osc-fake-mono" "Figure Eight"
preset_and_mic "osc-fake-mono" "Lissajous 3:2"
preset_and_mic "osc-fake-mono" "Breathing Detune"

echo "==> fake stereo mic smoke"
open_session "osc-fake-stereo" "$FAKE_STEREO_URL"
capture "osc-fake-stereo"
ab --session "osc-fake-stereo" click @e3
ab --session "osc-fake-stereo" wait 1500
capture "osc-fake-stereo"

echo "==> live permission / recovery smoke"
open_session "osc-live" "$LIVE_URL"
capture "osc-live"
ab --session "osc-live" click @e3
ab --session "osc-live" wait 4000 || true
capture "osc-live"
ab --session "osc-live" click @e2
ab --session "osc-live" wait 1200
capture "osc-live"

echo "==> done"
echo "Artifacts saved under: $OUT_DIR"
