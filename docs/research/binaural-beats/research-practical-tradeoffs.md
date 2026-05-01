# Research: practical tradeoffs for web brainwave entrainment / binaural beats

## Summary
A Web Audio implementation is technically feasible in 2025/2026, but the safest product posture is “audio relaxation/focus experiment,” not therapeutic entrainment. Prefer a small engine that supports binaural, monaural, and isochronic modes, with monaural/isochronic as speaker-friendly defaults and binaural as a headphone-only mode. Confidence: **medium-high for web/audio implementation constraints; medium for comparative auditory-beat effects; low-medium for health/efficacy claims** because clinical evidence remains heterogeneous.

## Findings
1. **Binaural beats require stereo separation and headphones; monaural/isochronic are more robust on speakers/mobile.** Binaural beats are perceived when slightly different tones are delivered separately to each ear; this makes headphone use and reliable left/right channel routing core requirements. Monaural beats and isochronic tones encode the beat in the acoustic waveform itself, so they survive mono playback and speakers better. [Springer: effects of binaural and monaural beat stimulation](https://link.springer.com/article/10.1007/s00221-021-06155-z), [Healthline overview](https://www.healthline.com/health/isochronic-tones)

2. **Evidence does not justify strong therapeutic or “brainwave control” claims.** A systematic review on binaural beats and brain oscillatory activity found the entrainment hypothesis attractive but mixed, method-dependent, and not consistently established. A 2024 stress-management review found some positive RCT signals but also no-effect studies and methodological limitations. Product copy should avoid treating anxiety, depression, insomnia, ADHD, pain, or other conditions unless supported by claim-specific evidence and regulatory review. [Systematic review, PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC10198548/), [2024 stress RCT systematic review](https://www.tandfonline.com/doi/full/10.1080/18387357.2024.2374759), [FTC health claims guidance](https://business.ftc.gov/advertising-and-marketing/health-claims)

3. **Web Audio precision is good enough for tone generation if scheduling stays in the audio graph, not UI timers.** Web Audio supports sample-accurate scheduled playback, `AudioParam` automation, a rendering thread, 128-frame default render quanta, and `OscillatorNode` frequency as an a-rate parameter. Use `OscillatorNode`, `GainNode`, channel split/merge, and `AudioParam` automation for fades and modulation; avoid `setInterval`/React state loops for DSP timing. [W3C Web Audio API 1.1](https://www.w3.org/TR/webaudio/), [MDN setValueAtTime](https://developer.mozilla.org/en-US/docs/Web/API/AudioParam/setValueAtTime)

4. **AudioWorklet is only needed for custom waveforms/modulators or measurement; basic beats can avoid it.** Native nodes can generate sine carriers, gain modulation, panning, and channel merging with less maintenance. AudioWorklet moves custom processing onto the audio rendering thread and replaces deprecated `ScriptProcessorNode`, but adds module loading, secure-context, processor lifecycle, browser debugging, and compatibility/test burden. [MDN AudioWorklet](https://developer.mozilla.org/docs/Web/API/Web_Audio_API/Using_AudioWorklet), [W3C AudioWorklet section](https://www.w3.org/TR/webaudio/#AudioWorklet)

5. **Mobile constraints are mostly product/UX constraints, not DSP blockers.** Browsers may start `AudioContext` suspended until user activation; Chrome documents autoplay policy behavior for Web Audio, and the Web Audio spec allows user agents to require sticky activation. iOS/Safari/mobile also commonly expose route changes, muted hardware switches, Bluetooth latency, and mono/accessibility audio settings. UX needs explicit “Tap to start,” route/headphone guidance, pause/resume handling, and visible state. [Chrome Web Audio autoplay policy](https://developer.chrome.com/blog/web-audio-autoplay), [MDN Web Audio best practices](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Best_practices), [W3C AudioContext allowed-to-start](https://www.w3.org/TR/webaudio/#AudioContext)

6. **Latency is less important than stability for passive entrainment, but glitches are unacceptable.** Entrainment tracks do not need game-like input latency after playback starts, but clicks/pops can be startling and unsafe-feeling. Web Audio identifies audio glitches as catastrophic and recommends avoiding overload; choose simple graphs, one `AudioContext`, smooth gain/frequency changes, and fade in/out all starts/stops. [W3C performance considerations](https://www.w3.org/TR/webaudio/#PerformanceConsiderations), [MDN best practices](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Best_practices)

7. **Stereo/mono degradation must be tested explicitly.** Binaural mode can silently lose its intended effect if the OS, browser, Bluetooth accessory, accessibility setting, or speaker path downmixes stereo. Web Audio channel rules define up/down-mixing behavior, and destination hardware may differ. Include a stereo check (“left/right test”), a mono fallback, and a warning that binaural mode is headphone-only and may not work with mono audio. [W3C channel mixing](https://www.w3.org/TR/webaudio/#ChannelUpMixingandDownMixing), [W3C AudioDestinationNode](https://www.w3.org/TR/webaudio/#AudioDestinationNode)

8. **Safety/accessibility disclosures should be prominent, not buried.** Disclose: not medical treatment; stop if discomfort, dizziness, headache, anxiety, nausea, or unusual symptoms; do not use while driving/operating machinery; use low volume; consult a clinician for epilepsy/seizure history, neurological conditions, serious mental-health concerns, pregnancy, implanted medical devices, or medication-sensitive conditions. Sound-triggered reflex seizures are rare but documented; visualizers must also comply with WCAG seizure guidance. [Epilepsy Action: reflex seizures](https://www.epilepsy.org.uk/info/reflex-epilepsy), [W3C WCAG three flashes](https://www.w3.org/WAI/WCAG22/Understanding/three-flashes-or-below-threshold.html), [MDN seizure accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility/Seizure_disorders)

9. **Regulatory/product risk rises sharply with medical framing.** FDA general-wellness policy is lower-risk only for products intended for general wellness and low safety risk; FTC expects competent substantiation for health-related advertising. Avoid disease-condition claims, outcome guarantees, “clinically proven” unless proven for the exact feature/population/outcome, and app-store metadata that implies treatment. [FDA general wellness guidance](https://www.fda.gov/regulatory-information/search-fda-guidance-documents/general-wellness-policy-low-risk-devices), [FTC health claims](https://business.ftc.gov/advertising-and-marketing/health-claims)

10. **Validation should focus on audio correctness, browser resilience, and claim discipline, not proving neuroscience.** Practical validation: offline-render signal tests for beat frequency, carrier frequency, channel isolation, fades, clipping/headroom; device/browser tests on Chrome/Safari/Firefox desktop and iOS/Android; mono/stereo/headphone route tests; autoplay/resume/background behavior; visualizer WCAG checks; copy/legal review. If efficacy is a goal, run an IRB/ethics-reviewed controlled study or avoid efficacy claims.

11. **Maintenance cost is low-to-medium for native-node synthesis; medium-high if adding presets, claims, personalization, or AudioWorklet DSP.** A minimal native Web Audio generator is small, but durable quality needs browser matrix testing, mobile route handling, safe volume defaults, preset governance, telemetry-free privacy posture, and ongoing copy review as claims evolve. AudioWorklet/custom DSP increases test surface and potential glitches.

## Decision implications
- Ship only as a **wellness/relaxation audio tool** unless a separate evidence/regulatory path is chosen.
- Implement **monaural/isochronic first** for broad compatibility; add **binaural as an explicit headphone mode** with left/right test and mono fallback.
- Use **native Web Audio nodes** for v1: one `AudioContext`, oscillators, gain modulation, channel merger, automation, fade envelopes. Defer AudioWorklet until there is a concrete DSP need.
- Add **mandatory safety copy and safe defaults**: low initial gain, no sudden starts/stops, session duration limits/reminders, stop button always visible.
- Treat “brainwave entrainment” wording as high-risk; prefer “auditory beat,” “tone session,” “focus/relaxation soundscape,” and careful user-controlled presets.

## Sources
- Kept: W3C Web Audio API 1.1 (https://www.w3.org/TR/webaudio/) — primary implementation/timing/channel/latency source.
- Kept: MDN Web Audio best practices (https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Best_practices) — practical browser guidance.
- Kept: Chrome Web Audio autoplay policy (https://developer.chrome.com/blog/web-audio-autoplay) — mobile/autoplay user-gesture constraints.
- Kept: MDN AudioWorklet (https://developer.mozilla.org/docs/Web/API/Web_Audio_API/Using_AudioWorklet) — custom processing tradeoffs.
- Kept: Binaural beats brain oscillatory activity systematic review (https://pmc.ncbi.nlm.nih.gov/articles/PMC10198548/) — core evidence caution.
- Kept: 2024 stress-management systematic review (https://www.tandfonline.com/doi/full/10.1080/18387357.2024.2374759) — recent non-clinical RCT evidence.
- Kept: Effects of binaural and monaural beat stimulation on attention and EEG (https://link.springer.com/article/10.1007/s00221-021-06155-z) — comparative binaural/monaural evidence.
- Kept: FDA general wellness guidance (https://www.fda.gov/regulatory-information/search-fda-guidance-documents/general-wellness-policy-low-risk-devices) — claim boundary source.
- Kept: FTC health claims guidance (https://business.ftc.gov/advertising-and-marketing/health-claims) — substantiation requirements.
- Kept: W3C WCAG three flashes (https://www.w3.org/WAI/WCAG22/Understanding/three-flashes-or-below-threshold.html) — visualizer safety/accessibility.
- Kept: Epilepsy Action reflex seizures (https://www.epilepsy.org.uk/info/reflex-epilepsy) — rare sound-triggered seizure context.
- Dropped: SEO/product pages for binaural/isochronic tone benefits — useful for market language but not strong evidence.
- Dropped: StackOverflow mobile Safari oscillator posts — stale and anecdotal compared with MDN/spec/browser docs.
- Dropped: GitHub binaural-beat demo repos — useful implementation examples, but not authoritative for safety/evidence.

## Gaps
- No direct 2025/2026 cross-browser benchmark found for long-running oscillator frequency drift on current iOS/Android devices.
- Comparative efficacy of binaural vs monaural vs isochronic remains uncertain across outcomes, frequencies, populations, and session lengths.
- Safety evidence is mostly general/reflex-seizure and consumer guidance, not large adverse-event studies for web-generated beat sessions.
- Next steps: prototype signal-generation tests with `OfflineAudioContext`; run device QA on current iOS/Android/Safari/Chrome/Firefox; get legal/regulatory review for product copy; consider an expert review by an audiologist/neuroscientist if the feature is marketed prominently.

## Pi-intercom handoff
No safe orchestrator target was provided; returning via output file only.
