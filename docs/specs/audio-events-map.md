> ⚠️ FUTURE SPEC — не реализовывать без явного запроса
Audio Events Map
Purpose
This file maps app events to sound behaviors. It defines what should play, when it should play, and how the system should behave on desktop and mobile.

Global Rules
Never autoplay sound on page load.

On mobile, audio must remain muted or suspended until the first explicit user gesture.

The first tap, touchend, or click on a meaningful control should unlock the AudioContext.

If audio is blocked, the app must fall back to visual feedback without error.

All sounds must use short fades to avoid clicks and harsh transients.

Background layers should be crossfaded, not hard-switched.

Use lower default intensity on mobile than on desktop.

Mobile Behavior
Audio Unlock
On mobile, the app creates the audio graph early if needed, but keeps playback suspended.

Resume the AudioContext only after a user gesture such as touchend, pointerup, or click.

Prefer a deliberate UI action like tapping the mic, enabling sound, or opening audio settings.

If the browser denies autoplay, keep the system silent and show a small “Tap to enable sound” prompt.

Mobile Intensity Profile
Default masterVolume should be lower on mobile.

Background mode should start in subtle instead of immersive.

UI sounds should default to minimal.

Recovery mode should remain off until explicitly enabled.

Use fewer simultaneous layers to reduce battery and CPU load.

Mobile Timing
Use short, well-defined envelopes.

Keep sound events under 400 ms unless they are ambient background beds.

Avoid dense rapid-fire feedback on repeated taps.

If multiple events happen quickly, collapse them into one confirmation sound.

Event Map
App Startup
app.ready
Desktop: no sound by default.

Mobile: no sound by default.

If the user previously enabled audio, show an unlocked-but-muted state until the first gesture if required by the browser.

audio.unlock
Trigger: first valid user gesture.

Sound: very soft confirmation tick or silent unlock depending on browser state.

Mobile note: this event is primarily functional, not decorative.

Navigation
view.change
Trigger: day/week/month/year switch.

Sound: short soft transition tone.

Mobile: only if uiSoundMode is not off and the change is user-initiated.

Duration: 60–120 ms.

block.switch
Trigger: moving between Morning, Afternoon, Evening, Night.

Sound: short tonal shift or filtered sweep.

Mobile: lighter and lower volume than desktop.

Task Creation
task.add.quick
Trigger: task weight = Quick.

Sound: high sine tick.

Parameters: 880 Hz, 50 ms decay.

Mobile: reduce gain by 20–30%.

task.add.focused
Trigger: task weight = Focused.

Sound: mid-frequency click.

Parameters: 440 Hz, 120 ms decay.

Mobile: keep it soft and dry.

task.add.deep
Trigger: task weight = Deep.

Sound: low glide down.

Parameters: 120 Hz to 60 Hz over 300 ms.

Mobile: reduce sub energy slightly to avoid harshness on phone speakers.

task.add.failed
Trigger: validation prevents add.

Sound: muted low alert or no sound if sound is off.

Mobile: prefer visual-only if the action was already noisy.

Task Completion
task.complete
Trigger: task toggled complete.

Sound: soft closure or tiny pad hit.

Mobile: use the minimal version only.

Duration: 120–250 ms.

task.undo
Trigger: restoring a task.

Sound: short reverse-like soft cue.

Mobile: keep it optional and very quiet.

Capacity System
capacity.near_full
Trigger: block capacity approaches limit.

Sound: subtle tension cue only if enabled.

Mobile: avoid repeating often; once per meaningful threshold.

capacity.full
Trigger: block hits max points.

Sound: low muted closure.

Mobile: no sharp alarm; use a visual flash plus a soft sound if uiSoundMode === 'full'.

capacity.transfer
Trigger: task is automatically moved to another block.

Sound: short relocation tone.

Mobile: should not exceed 150 ms.

Recovery and Rest
recovery.enable
Trigger: user explicitly enables Recovery Mode.

Sound: soft entrance tone.

Mobile: only after explicit interaction.

recovery.disable
Trigger: user disables Recovery Mode.

Sound: soft exit tone.

Mobile: optional, very low volume.

sleep.start
Trigger: entering the night block with recovery active.

Sound: near-silent ambient entry.

Mobile: keep bass minimal; many phones reproduce sub frequencies poorly.

sleep.end
Trigger: waking or leaving night recovery.

Sound: soft fade-out.

Mobile: no abrupt cutoff.

Voice
voice.listening
Trigger: mic starts listening.

Sound: tiny activation cue.

Mobile: must be extremely short and low-volume.

voice.success
Trigger: command recognized and applied.

Sound: positive confirmation tick.

Mobile: use the same family as task confirmations.

voice.error
Trigger: command could not be parsed.

Sound: muted negative cue or none.

Mobile: prioritize haptic/visual error state if available.

Settings
settings.open
Trigger: opening sound settings.

Sound: none or very subtle transition.

Mobile: avoid duplicate cues.

settings.save
Trigger: saving audio preferences.

Sound: short confirmation pulse.

Mobile: only if a visible save action exists.

settings.mute
Trigger: user mutes Flow.

Sound: none, except maybe a tiny fade-out if already playing.

Mobile: always honor immediately.

Mobile Fallback Rules
If AudioContext.state !== 'running', do not queue audible events indefinitely.

If the browser suspends audio after backgrounding, re-check on foreground and resume only after user interaction if needed.

If the device is low-power mode or audio playback is restricted, degrade to silent visual feedback.

If speakers are weak or the device is very small, suppress deep sub-bass effects and favor mid-frequency cues.

If multiple sounds would overlap, prioritize the most important one and drop the rest.

Tone Mapping by Device
Desktop
Can use slightly richer background layers.

Can support more continuous ambient motion.

Can allow immersive mode by default if the user opts in.

Mobile
Start with subtle.

Keep the number of simultaneous nodes low.

Use shorter decays and lighter filters.

Favor recognizability over texture.

Treat sound as a confirmation layer, not a main experience.

Recommended Event API
ts
export type AudioEvent =
  | 'app.ready'
  | 'audio.unlock'
  | 'view.change'
  | 'block.switch'
  | 'task.add.quick'
  | 'task.add.focused'
  | 'task.add.deep'
  | 'task.add.failed'
  | 'task.complete'
  | 'task.undo'
  | 'capacity.near_full'
  | 'capacity.full'
  | 'capacity.transfer'
  | 'recovery.enable'
  | 'recovery.disable'
  | 'sleep.start'
  | 'sleep.end'
  | 'voice.listening'
  | 'voice.success'
  | 'voice.error'
  | 'settings.open'
  | 'settings.save'
  | 'settings.mute';
Implementation Notes
Build a single dispatcher that maps events to sound presets.

Keep event playback idempotent where possible.

Avoid re-triggering the same cue on rapid state updates.

On mobile, coalesce repeated events inside a short debounce window.

Use touchend and pointerup as primary unlock signals where supported.

Use AudioContext.baseLatency only as a diagnostic signal, not a hard guarantee.

Keep autoplay disabled by default and rely on user opt-in.

Quality Checklist
The first user tap can unlock audio.

No sound plays before interaction on mobile.

Sound cues remain clear on phone speakers.

Ambient layers do not drain battery excessively.

Visual feedback always exists when sound is off.

Recovery mode stays opt-in and quiet.