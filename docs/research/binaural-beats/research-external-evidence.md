# Research: brainwave entrainment / binaural beats with modern Web Audio technology

## Summary
Modern Web Audio can implement binaural beats accurately with native `OscillatorNode`s, per-ear gain/routing, and an explicit stereo `ChannelMergerNode`; an `AudioWorklet` is only needed for custom synthesis, sample-level modulation beyond built-in nodes, or custom analyzers/metrics. Scientific evidence supports the psychoacoustic phenomenon, but claims of reliable brainwave entrainment or clinical benefit remain mixed and methodologically weak, so product language should avoid medical/therapeutic claims and present this as an audio/experimental feature.

**Confidence level:** High for Web Audio feasibility and autoplay constraints; medium-high for psychoacoustic implementation constraints; medium for clinical implications because evidence is heterogeneous and low-to-very-low quality in clinical reviews.

## Findings
1. **Web Audio is a strong fit for precise tone generation and routing.** The W3C Web Audio spec defines an audio routing graph, sample-accurate scheduling, `OscillatorNode`, `GainNode`, `ChannelMergerNode`, `StereoPannerNode`, `AudioParam` automation, and 32-bit float PCM processing. It also says one `AudioContext` per document is usually enough because contexts are expensive. [W3C Web Audio API 1.1](https://www.w3.org/TR/webaudio/)

2. **A binaural beat should be implemented as two independent sine oscillators routed to separate stereo channels.** The spec defines `OscillatorNode` as a mono source with a-rate `frequency` and `detune`; `ChannelMergerNode` combines multiple mono inputs into ordered output channels without interpreting left/right identity. For a 10 Hz beat around a 400 Hz carrier, generate e.g. 400 Hz left and 410 Hz right, each through its own `GainNode`, into a 2-input `ChannelMergerNode`, then destination. [W3C OscillatorNode / ChannelMergerNode sections](https://www.w3.org/TR/webaudio/#OscillatorNode)

3. **Headphones and carrier/difference constraints matter.** The 2023 PLOS systematic review summarizes binaural beats as an illusory percept created when different tones are presented separately to each ear. It reports common perceptual constraints: carrier tones below about 1000 Hz, best perception around 400 Hz, and tone differences around 1-30 Hz; above about 30 Hz, listeners may perceive two tones rather than a beat. [PLOS ONE systematic review](https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0286023)

4. **Autoplay must be designed as user-initiated audio.** MDN states Web Audio is subject to autoplay blocking and playback with audible sound is generally allowed only after user interaction or other browser-specific allowlisting. Chrome specifically applies autoplay policy to Web Audio and recommends creating/resuming `AudioContext` after a click/tap; otherwise the context may remain `suspended`. [MDN Autoplay guide](https://developer.mozilla.org/en-US/docs/Web/Media/Autoplay_guide), [Chrome autoplay policy](https://developer.chrome.com/blog/autoplay)

5. **Prefer built-in `OscillatorNode` first; use `AudioWorklet` only when native nodes are insufficient.** MDN describes `AudioWorklet` as custom off-main-thread audio processing, while the spec positions it for custom nodes and direct scripted synthesis. For steady sine tones and simple ramps, native oscillators and `AudioParam` automation are simpler, optimized, and less error-prone. `AudioWorklet` is justified for custom waveform generation, integrated dual-channel phase handling, custom modulation algorithms, or reusable DSP modules. [MDN AudioWorklet guide](https://developer.mozilla.org/docs/Web/API/Web_Audio_API/Using_AudioWorklet), [W3C AudioWorklet section](https://www.w3.org/TR/webaudio/#AudioWorklet)

6. **Avoid `ScriptProcessorNode`; it is deprecated.** The Web Audio spec marks `ScriptProcessorNode` as deprecated and intended to be replaced by `AudioWorkletNode`. If custom DSP is required, implement it with `AudioWorklet`, not main-thread script callbacks. [W3C ScriptProcessorNode section](https://www.w3.org/TR/webaudio/#ScriptProcessorNode)

7. **Entrainment evidence is inconclusive.** The 2023 PLOS review included 14 EEG studies and found five results in line with entrainment, eight contradictory, and one mixed, with substantial heterogeneity in beat implementation, design, EEG measures, and analyses. It concludes existing psychological/physiological effect claims should be treated with caution unless entrainment is empirically measured. [PLOS ONE systematic review](https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0286023)

8. **Clinical/pain evidence is weak and heterogeneous.** A 2024 systematic review of 16 RCTs on pain found potential effects, especially acute procedural pain, but rated evidence low to very low and found high risk of bias in most studies. The authors advise caution and call for better-designed trials before firm conclusions. [BMC Complementary Medicine and Therapies review](https://link.springer.com/article/10.1186/s12906-024-04339-y)

9. **Safety and claims require caution.** A 2024 stress-management systematic review found some promising RCT signals but concluded evidence is not strong enough for widespread recommendation, adverse effects are poorly known, and no optimal protocol is established. Product copy should include volume/listening cautions, encourage comfortable levels, and avoid promises around stress, sleep, cognition, pain, anxiety, or medical treatment. [Systematic review of non-clinical stress use](https://www.tandfonline.com/doi/full/10.1080/18387357.2024.2374759)

## Decision implications
- Implement MVP with `AudioContext` created/resumed from an explicit Play button.
- Use two `OscillatorNode`s with `type = "sine"`, independent `GainNode`s, and `ChannelMergerNode({ numberOfInputs: 2 })` for per-ear routing.
- Keep carrier and beat-frequency controls constrained to psychoacoustically plausible ranges by default, e.g. carrier 100-900 Hz with 400 Hz default; beat delta 1-30 Hz with presets clearly labeled as audio-frequency deltas, not guaranteed brain states.
- Add amplitude ramps via `GainNode.gain.setTargetAtTime` or linear ramps to avoid clicks; expose master gain and per-ear gain.
- Add headphone guidance; speakers can acoustically mix channels and produce monaural beating instead of binaural presentation.
- Do not market as medical therapy or guaranteed entrainment. Use language like “binaural beat audio generator” and “experimental/ambient listening.”
- Reserve `AudioWorklet` for a later DSP module if needing custom stereo synthesis, custom phase continuity, audio-rate parameter arrays, offline rendering tests, or worklet-based metering.

## Sources
- Kept: W3C Web Audio API 1.1 (https://www.w3.org/TR/webaudio/) — primary current spec for nodes, routing, scheduling, channel behavior, worklets, and deprecations.
- Kept: MDN Autoplay guide for media and Web Audio APIs (https://developer.mozilla.org/en-US/docs/Web/Media/Autoplay_guide) — practical cross-browser autoplay guidance.
- Kept: Chrome autoplay policy (https://developer.chrome.com/blog/autoplay) — authoritative Chrome behavior and `AudioContext.resume()` guidance.
- Kept: MDN AudioWorklet guide (https://developer.mozilla.org/docs/Web/API/Web_Audio_API/Using_AudioWorklet) — practical implementation guidance for custom audio processing.
- Kept: PLOS ONE 2023 systematic review (https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0286023) — strongest source on entrainment evidence and psychoacoustic constraints.
- Kept: BMC Complementary Medicine and Therapies 2024 systematic review (https://link.springer.com/article/10.1186/s12906-024-04339-y) — current clinical/pain evidence and risk-of-bias assessment.
- Kept: Tandfonline 2024 stress-management systematic review (https://www.tandfonline.com/doi/full/10.1080/18387357.2024.2374759) — current non-clinical efficacy/safety caution; only search snippet/content was available, but useful for gaps/adverse-effect uncertainty.
- Dropped: GitHub binaural beat apps — implementation examples but not authoritative evidence.
- Dropped: StackOverflow AudioWorklet oscillator answers — useful for snippets, but secondary and not needed given W3C/MDN sources.
- Dropped: SEO safety pages — made strong safety claims without adequate sourcing.
- Dropped: older single studies where covered by newer systematic reviews — retained reviews instead for balanced evidence.

## Gaps
- No high-confidence protocol exists for “effective” binaural beat frequencies, session durations, or clinical outcomes.
- Adverse effects are underreported in RCTs and reviews; robust contraindication evidence was not found in authoritative sources.
- Browser output-device behavior, headphones, OS spatial audio, mono accessibility settings, and Bluetooth latency can alter the intended stereo stimulus and should be empirically tested in target browsers/devices.
- Suggested next steps: prototype native-node implementation; add an offline render/snapshot test for channel separation and frequencies; browser-test autoplay/resume behavior; add product disclaimers and volume limits before public release.

## Pi-intercom handoff
No safe orchestrator target was provided; returned findings via requested output file.
