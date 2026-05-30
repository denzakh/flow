> ⚠️ FUTURE SPEC — не реализовывать без явного запроса
Audio Settings Spec
Purpose
This screen lets users control Flow’s sound system without exposing technical complexity. The settings should feel premium, simple, and calm.

Core Controls
Background Sound
Controls the circadian background layer.

Off — no ambient sound.

Subtle — soft, low-volume background.

Immersive — fuller sound bed for deep focus.

UI Sounds
Controls interaction feedback.

Off — no click sounds.

Minimal — only key confirmations and transitions.

Full — clicks for task actions, block changes, and capacity events.

Recovery Mode
Controls optional night-only sound.

Off — no sleep audio.

Night only — enabled only in nighttime hours.

Dynamic — adaptive recovery layer with very low intensity.

Master Volume
Global output level for all Flow sounds.

Range: 0 to 100.

Default: low-to-medium.

Must not override system mute.

Suggested Screen Layout
Section 1: Ambient
A short intro line explains that ambient audio supports focus and transitions.
Then show the Background Sound selector and Master Volume slider.

Section 2: Interaction
A compact block for task feedback.
Show the UI Sounds selector plus a note that important actions are still confirmed visually.

Section 3: Recovery
A separate block for rest-related sound.
Show the Recovery Mode selector with a clear warning that it is optional and quiet by design.

Section 4: Accessibility
A final block with toggles for:

Respect reduced motion.

Mute during calls.

Full sound off.

Copy Blocks
Background Description
Ambient sound for focus and smooth transitions.

UI Sounds Description
Short sounds for task actions and feedback.

Recovery Description
Optional night sound for rest.

Accessibility Description
Minimize motion and sound intensity.

Behavior Rules
Changing a setting should apply immediately.

If sound is disabled, the UI should never show a “broken” state.

If respectReducedMotion is on, background intensity should default lower.

If muteDuringCalls is on, any active background layer should fade out automatically.

Recovery audio must never start without explicit user choice.

Technical Mapping
Background Modes
off → no ambient graph.

subtle → one low-volume oscillator or filtered noise bed.

immersive → layered graph with drone plus filtered motion.

UI Sound Modes
off → no short sounds.

minimal → only important confirmations.

full → all task and block sounds.

Recovery Modes
off → no recovery audio.

night-only → only active in the night block.

dynamic → slightly adaptive, still very quiet.

State Model
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
Implementation Notes
Use one shared AudioContext.

Build ambient sound as a persistent graph per mode.

Build UI sounds as short-lived graphs with gain envelopes.

Prefer BiquadFilterNode for tone shaping and GainNode for fades.

Use AudioWorklet only if a noise generator needs custom behavior.

Keep all changes smooth with short fades, not abrupt stops.

Edge Cases
If browser audio is blocked, fall back to silent mode and visual feedback.

If the user changes settings during playback, crossfade the old state into the new one.

If the device is on low battery or audio context is suspended, do not auto-restart aggressively.

If backgroundMode is off, uiSoundMode can still stay on.

Non-Goals
No music library.

No streaming integration.

No medical claims.

No aggressive alarm-style effects.

No hidden autoplay.

QA Checklist
Settings persist across reloads.

Sounds stop cleanly on mute.

Recovery mode stays off by default.

Reduced motion lowers intensity.

UI sounds remain brief and unobtrusive.

Important actions still have visual confirmation when sound is off.

Recommended Next Document
The next useful file is docs/audio-events-map.md, where each app event is mapped to a sound type, duration, envelope, and fallback behavior.