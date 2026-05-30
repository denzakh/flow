> ⚠️ FUTURE SPEC — не реализовывать без явного запроса
Audio Neural Engine
Purpose
Flow uses a minimal, functional sound system that supports focus, state transitions, and low-friction interaction. The audio layer is generated in code with Web Audio API primitives only; no external mp3 or wav assets are used.

Design Principles
Sound must be subtle, clean, and non-distracting.

Background audio should support circadian states, not behave like music.

UI sounds should be short, tactile, and informative.

Recovery and sleep modes must be opt-in and clearly labeled.

The system should work with reduced-motion and sound-off preferences.

Audio Layers
1. Circadian Background Layer
A continuous background layer reflects the current time block.

Morning: soft sine drone with gentle alpha-to-beta motion.

Afternoon: dense brown-noise bed with very light micro-pulsation.

Evening: darker low-pass pad with slower theta-like movement.

Night: silence by default; optional recovery audio only.

2. UI Interaction Layer
Short one-shot sounds confirm actions and preserve tactile feedback.

Quick task: high sine tick.

Focused task: mid-frequency click with soft decay.

Deep task: low pitch glide downward.

Capacity complete: short pad-like closure with a clean stop.

3. Recovery Layer
An optional night-only mode for rest.

Keep the sound extremely quiet.

Use simple binaural or beat-style modulation only if enabled by the user.

Never auto-enable it.

Circadian Mapping
Morning
Goal: soft activation.

Sound profile: sine drone, light air texture, slow gain rise.

Emotion: calm wake-up, low friction, no urgency.

Afternoon
Goal: sustained concentration.

Sound profile: brown noise, filtered low end, subtle rhythmic pulsing.

Emotion: stable focus, visual noise masking, deep work.

Evening
Goal: decompression.

Sound profile: triangle or sine pad, low-pass filtered, darker tone.

Emotion: lowering arousal, task closure, mental cleanup.

Night
Goal: silence or recovery.

Sound profile: off by default; optional minimal recovery mode.

Emotion: rest, restoration, no attention capture.

Sound Events
task.add.quick -> high short tick.

task.add.focused -> medium click.

task.add.deep -> low glide.

task.complete -> soft closure.

block.switch -> short transition tone.

capacity.full -> muted alert, no harshness.

recovery.enable -> very soft entrance tone.

recovery.disable -> soft exit tone.

Recommended Parameters
Quick
Oscillator: sine.

Frequency: 880 Hz.

Gain: 0.2.

Decay: 50 ms.

Focused
Oscillator: sine.

Frequency: 440 Hz.

Gain: 0.3.

Decay: 120 ms.

Deep
Oscillator: sine with glide.

Start: 120 Hz.

End: 60 Hz.

Gain: 0.4.

Decay: 300 ms.

Capacity Complete
Oscillator: triangle or sine pad.

Frequency: 160-240 Hz.

Gain: 0.15-0.2.

Decay: 250-400 ms.

Implementation Notes
Use AudioContext as the root engine.

Keep one shared background graph per active mode.

Create short-lived nodes for one-shot UI sounds.

Always fade in and fade out to avoid clicks.

Stop nodes after their envelope ends.

Prefer BiquadFilterNode, GainNode, OscillatorNode, and AudioWorklet where necessary.

Suggested Module Structure
src/audio/audioEngine.ts

src/audio/circadianDrones.ts

src/audio/uiSounds.ts

src/audio/recoveryMode.ts

src/audio/audioSettings.ts

Settings Model
ts
export type AudioMode = 'off' | 'subtle' | 'immersive';
export type UiSoundMode = 'off' | 'minimal' | 'full';
export type RecoveryAudioMode = 'off' | 'night-only' | 'dynamic';

export interface AudioSettings {
  backgroundMode: AudioMode;
  uiSoundMode: UiSoundMode;
  recoveryMode: RecoveryAudioMode;
  masterVolume: number;
  muteDuringCalls: boolean;
  respectReducedMotion: boolean;
}
UX Copy
Background: Ambient sound for focus and smooth transitions.

UI sounds: Short sounds for task actions and feedback.

Recovery mode: Optional night sound for rest.

Reduced motion: Minimize motion and sound intensity.

Accessibility Rules
Always provide a full mute option.

Respect reduced-motion preferences.

Avoid harsh transients and sharp high-frequency peaks.

Do not depend on sound alone for critical feedback.

Pair sound with visual confirmation for all important actions.

Non-Goals
No music playlist engine.

No external media files.

No medical or therapeutic claims.

No automatic sleep intervention.

No dense soundscape that competes with the interface.