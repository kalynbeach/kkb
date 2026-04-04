#!/usr/bin/env bash
set -euo pipefail

OUT_DIR="${OUT_DIR:-.artifacts/oscilloscope}"
BASE_URL="${BASE_URL:-http://localhost:3000/oscilloscope}"
FAKE_MONO_URL="${FAKE_MONO_URL:-${BASE_URL}?mic=fake-mono}"
FAKE_STEREO_URL="${FAKE_STEREO_URL:-${BASE_URL}?mic=fake-stereo}"
LIVE_URL="${LIVE_URL:-${BASE_URL}}"
DESKTOP_WIDTH="${DESKTOP_WIDTH:-1440}"
DESKTOP_HEIGHT="${DESKTOP_HEIGHT:-1100}"
DESKTOP_SCALE="${DESKTOP_SCALE:-2}"
MOBILE_WIDTH="${MOBILE_WIDTH:-390}"
MOBILE_HEIGHT="${MOBILE_HEIGHT:-844}"
MOBILE_SCALE="${MOBILE_SCALE:-3}"

mkdir -p "$OUT_DIR"

ab() {
  if command -v agent-browser >/dev/null 2>&1; then
    agent-browser "$@"
  else
    bunx agent-browser "$@"
  fi
}

close_session() {
  local session="$1"
  ab --session "$session" close >/dev/null 2>&1 || true
}

open_session() {
  local session="$1"
  local url="$2"
  local width="$3"
  local height="$4"
  local scale="$5"

  close_session "$session"
  ab --session "$session" open "$url"
  ab --session "$session" wait --load networkidle
  ab --session "$session" set viewport "$width" "$height" "$scale"
  ab --session "$session" wait 800
}

rename_latest_capture() {
  local output="$1"
  local name="$2"
  local source_path

  source_path="$(printf '%s\n' "$output" | perl -pe 's/\e\[[0-9;]*[A-Za-z]//g' | sed -n 's/.*Screenshot saved to //p' | head -n 1)"

  if [ -z "$source_path" ] || [ ! -f "$source_path" ]; then
    echo "Unable to resolve screenshot path for $name" >&2
    return 1
  fi

  mv "$source_path" "$OUT_DIR/$name.png"
}

capture() {
  local session="$1"
  local name="$2"
  local output

  output="$(ab --session "$session" screenshot --screenshot-dir "$OUT_DIR")"
  printf '%s\n' "$output"
  rename_latest_capture "$output" "$name"
}

capture_annotated() {
  local session="$1"
  local name="$2"
  local output

  output="$(ab --session "$session" screenshot --annotate --screenshot-dir "$OUT_DIR")"
  printf '%s\n' "$output"
  rename_latest_capture "$output" "$name"
}

open_preset_menu() {
  local session="$1"
  ab --session "$session" find testid "oscilloscope-preset-trigger" click
  ab --session "$session" wait 300
}

select_preset() {
  local session="$1"
  local preset_id="$2"
  open_preset_menu "$session"
  ab --session "$session" find testid "oscilloscope-preset-$preset_id" click
  ab --session "$session" wait 1200
}

switch_source() {
  local session="$1"
  local source="$2"
  ab --session "$session" find testid "oscilloscope-source-$source" click
  ab --session "$session" wait 1200
}

echo "==> desktop oscillator baseline"
open_session "osc-desktop" "$BASE_URL" "$DESKTOP_WIDTH" "$DESKTOP_HEIGHT" "$DESKTOP_SCALE"
capture_annotated "osc-desktop" "desktop-oscillator-default-annotated"
capture "osc-desktop" "desktop-oscillator-default"
select_preset "osc-desktop" "figure-eight"
capture "osc-desktop" "desktop-oscillator-figure-eight"

echo "==> desktop fake mono mic"
open_session "osc-fake-mono" "$FAKE_MONO_URL" "$DESKTOP_WIDTH" "$DESKTOP_HEIGHT" "$DESKTOP_SCALE"
capture_annotated "osc-fake-mono" "desktop-fake-mono-default-annotated"
switch_source "osc-fake-mono" "mic"
capture "osc-fake-mono" "desktop-fake-mono-mic"
select_preset "osc-fake-mono" "lissajous-3-2"
capture "osc-fake-mono" "desktop-fake-mono-lissajous-3-2"

echo "==> desktop fake stereo mic"
open_session "osc-fake-stereo" "$FAKE_STEREO_URL" "$DESKTOP_WIDTH" "$DESKTOP_HEIGHT" "$DESKTOP_SCALE"
switch_source "osc-fake-stereo" "mic"
capture "osc-fake-stereo" "desktop-fake-stereo-mic"

echo "==> live permission and recovery"
open_session "osc-live" "$LIVE_URL" "$DESKTOP_WIDTH" "$DESKTOP_HEIGHT" "$DESKTOP_SCALE"
switch_source "osc-live" "mic"
ab --session "osc-live" wait 2500 || true
capture "osc-live" "desktop-live-mic-state"
switch_source "osc-live" "oscillators"
capture "osc-live" "desktop-live-recovery-oscillators"

echo "==> mobile layout baseline"
open_session "osc-mobile" "$BASE_URL" "$MOBILE_WIDTH" "$MOBILE_HEIGHT" "$MOBILE_SCALE"
capture_annotated "osc-mobile" "mobile-oscillator-default-annotated"
capture "osc-mobile" "mobile-oscillator-default"
switch_source "osc-mobile" "mic"
capture "osc-mobile" "mobile-live-mic-state"

for session in osc-desktop osc-fake-mono osc-fake-stereo osc-live osc-mobile; do
  close_session "$session"
done

echo "==> done"
echo "Artifacts saved under: $OUT_DIR"