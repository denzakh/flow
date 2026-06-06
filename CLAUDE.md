# Flow Calendar — Project Context for Claude

## What is Flow?
A productivity calendar app built around circadian rhythms. The day is divided into 4 time blocks (Morning / Afternoon / Evening / Night), dynamically calculated from the user's wake/rest time. Tasks have weights (Quick / Focused / Deep) and can recur. The app supports Recovery Mode, fade-in alarms using synthesized circadian neural drones (Web Audio API), and multilingual UI (EN / RU / ES).

Live: https://flow-nine-xi.vercel.app  
Repo: https://github.com/denzakh/flow

---

## Stack
- **Frontend**: React 19 + TypeScript + Vite
- **Icons**: Используем строго lucide-react. Кодовая база очищена от альтернативных систем.
- **Styling**: Tailwind CSS + `src/theme/tokens.css` + `design-tokens.ts` (строго без inline hex-значений)
- **Storage**: localStorage (all data is client-side)
- **Voice**: Web Speech API (SpeechRecognition + SpeechSynthesis)
- **AI (planned)**: Anthropic API via backend proxy
- **Audio Engine (Web Audio API):** Sound is generated entirely in code using oscillator and filter primitives[cite: 15]. ZERO external audio assets (.mp3, .wav) are used[cite: 15].
  - **Circadian Drones:** Continuous background layer reflecting the time block (e.g., sine drone with gentle alpha-to-beta motion for Morning, filtered brown noise for Afternoon)[cite: 15].
  - **UI Interaction:** Synthesized short ticks, clicks, and glides (50-300ms) mapped to task weights[cite: 15]. All sounds must use short fades to avoid clicks and harsh transients[cite: 14].
  - **Mobile Rules:** Audio context remains strictly muted or suspended until the first explicit user gesture (tap/touchend)[cite: 14].
---

## Architecture

### Core types (src/types.ts)
```ts
TimePeriod: MORNING | AFTERNOON | EVENING | NIGHT
TaskWeight: quick | focused | deep
Priority: 'low' | 'medium' | 'high'
Language: 'en' | 'ru' | 'es'
Recurrence: 'none' | 'daily' | 'weekly' | 'monthly' | 'all-blocks'
OptimizationStrategy: 'balanced' | 'quick-wins' | 'priority-first'
Task: { id, title, periods, dueDate?, completed, weight, recurrence?, priority, createdAt, originalPeriod?, notes? }
UserSettings: { wakeUpTime, restTime, recoveryDays, workHistory, language, alarm }
AlarmConfig: { enabled, time, sound }
UserProfile: { id, name, email, avatar?, isGuest }
VoiceSettings: { enabled, language, autoSubmit, requireConfirmation, ttsEnabled, ttsVoice?, confidenceThreshold }
VoiceCommand: { type, intent, entities, confidence, rawText, silent? }
CommandEntities: { title?, index?, weight?, period?, priority?, date?, direction?, viewMode? }
CommandType: ADD_TASK | TOGGLE_TASK | DELETE_TASK | NAVIGATE_DATE | CHANGE_VIEW | UPDATE_TASK | UNKNOWN
VoiceCommandResult: { success, command?, error?, requiresConfirmation, confirmationMessage? }
```
⚠️ `OptimizationStrategy` is defined but may not be used anywhere yet.

### Key services (src/services/)
- `taskOptimizer.ts` — `suggestWeight()` (rule-based weight detection), `adjustTaskPeriods()` (capacity-aware period routing), `findAvailableSlot()` (smart time-aware slot finding), `calculatePeriodPoints()` (block capacity calculation)
- `voice/VoiceControlService.ts` — Web Speech API wrapper (listen, speak, dispose)
- `voice/VoiceCommandProcessor.ts` — parses transcript → VoiceCommand (rule-based regex, 3 languages: EN/RU/ES)
- `voice/commands/TaskCommands.ts` — patterns for add/toggle/delete task commands (EN/RU/ES)
- `voice/commands/NavigationCommands.ts` — patterns for date/view navigation commands (EN/RU/ES)
- `voice/commands/UpdateCommands.ts` — patterns for task updates (weight, period, priority)

### Key components
- `App.tsx` — main state, voice handlers, task CRUD, capacity-aware task routing
- `components/Auth.tsx` — authentication screen (guest mode)
- `components/TaskItem.tsx` — single task row with toggle/delete
- `components/TaskManagerPanel.tsx` — bulk task management (delete all/completed, show stats)
- `components/layout/Header.tsx` — top bar with view switcher, alarm toggle, settings button
- `components/common/DateNavigator.tsx` — prev/next/today navigation
- `components/common/ViewSwitcher.tsx` — day/week/month/year tabs
- `components/views/` — DayView, WeekView, MonthView, YearView
- `components/modals/` — SettingsModal (includes voice settings), AlarmModal, AlarmPlayingModal
- `components/blocks/FocusPoint.tsx` — task input with smart weight suggestion and capacity checking
- `components/blocks/TimeBlock.tsx` — single time block card with task list
- `components/blocks/TimeBlockList.tsx` — list of TimeBlock components
- `components/blocks/RecoveryBanner.tsx` — recovery mode notification banner
- `components/voice/VoiceFeedback.tsx` — voice status indicator
- `components/voice/VoiceControlButton.tsx` — microphone toggle button
- `components/voice/VoiceSettingsModal.tsx` — voice settings panel (language, threshold, TTS)
- `components/ui/DesignSystem2.tsx` — GlassCard2, Badge2, TaskItem2, HoverLift components (Design System 2.0)
- `components/ui/index.tsx` — Button, Input, Card, Badge, EmptyState, Divider (basic UI primitives)
- `components/preview/DesignPreview2.tsx` — design system preview/playground

### Utility files
- `utils/MaterialIcons.tsx` — 50+ custom SVG icons as React components (time, navigation, actions, tasks, weather, etc.)
- `utils/design-utils.ts` — shared design utility functions/styles
- `utils/getCurrentYear.ts` — simple helper to get current year for footer

### Design tokens
- `design-tokens.ts` — centralized color palette, spacing, radius, typography, shadows, animation tokens
- `styles.css` — CSS variables + 1400+ lines of global styles (dark theme only)

### State in App.tsx
**Persisted states (localStorage):**
- `tasks` — persisted to `flow_tasks`
- `settings` — persisted to `flow_settings` (includes `wakeUpTime`, `restTime`, `recoveryDays`, `workHistory`, `language`, `alarm`)
- `user` — persisted to `flow_user` (UserProfile | null)
- `voiceSettings` — persisted to `flow_voice_settings`

**App lifecycle:**
- `appState` — `'splash' | 'auth' | 'ready'` (3-second splash → auth if no user → ready)

**Navigation & view:**
- `viewMode` — `'day' | 'week' | 'month' | 'year'`
- `viewDate` — current Date being viewed
- `currentTime` — updated every second via setInterval

**Task input form:**
- `newTaskTitle` — current input text
- `selectedPeriods` — TimePeriod[] (default: [MORNING])
- `selectedRecurrence` — Recurrence ('none' default)
- `selectedWeight` — TaskWeight (focused default)

**Settings modal:**
- `showSettings` — boolean
- `tempWake`, `tempRest`, `tempLang`, `tempAlarm` — temporary edit state
- `settingsError` — validation error string | null

**Alarm:**
- `showAlarmMenu` — boolean
- `isAlarmPlaying` — boolean
- `lastAlarmTriggeredAt` — string | null
- `audioRef` — useRef<HTMLAudioElement>
- `fadeIntervalRef` — useRef<number>

**UI state:**
- `collapsedBlocks` — Record<string, boolean>
- `isInputFocused` — boolean

**Voice control state (8 states):**
- `voiceService` — VoiceControlService | null
- `voiceProcessor` — VoiceCommandProcessor | null
- `isVoiceListening`, `isVoiceProcessing` — booleans
- `voiceTranscript` — string
- `voiceConfidence` — number | undefined
- `voiceStatus` — `'idle' | 'listening' | 'processing' | 'error' | 'success'`
- `voiceError` — string | undefined
- `showVoiceConfirmation` — boolean
- `pendingVoiceCommand` — VoiceCommand | null

**Computed (useMemo, not useState):**
- `activePeriodId` — current time block based on time of day
- `isRecoveryMode` — true on recovery days or during wind-down (90 min before rest)
- `dynamicBlocks` — 3 equal blocks between wake and rest time (computed as TimeBlockConfig[])

**Notifications:**
- `capacityNotification` — `{ type: 'transferred' | 'full', message: string } | null`

---

## AI Integration Plan

### Current state (rule-based)
| Feature | Location | Current approach |
|---|---|---|
| Task weight suggestion | `taskOptimizer.ts → suggestWeight()` | Keyword matching |
| Voice command parsing | `VoiceCommandProcessor.ts` | Regex patterns (EN/RU/ES) |
| Capacity management | `taskOptimizer.ts → adjustTaskPeriods()` | Time-aware overflow routing |
| Period relevance check | `taskOptimizer.ts → isPeriodRelevant()` | Current time vs period |

### Target state (AI-powered)

#### 1. Smart weight detection — upgrade `suggestWeight()`
Replace keyword matching with Anthropic API call.  
Input: task title + optional context (time of day, existing tasks count).  
Output: `{ weight: 'quick' | 'focused' | 'deep', reason: string }`.  
Should work for EN, RU, ES without separate logic.

```ts
// src/services/ai/suggestWeightAI.ts
export async function suggestWeightAI(title: string, lang: Language): Promise<TaskWeight>
```

#### 2. Natural voice command parsing — upgrade `VoiceCommandProcessor`
Replace regex parsing with AI interpretation.  
Input: raw transcript (any language).  
Output: `VoiceCommand` JSON — same interface as current processor.  
Handles: free-form speech, typos, implied context ("add tomorrow morning" → date + period).

```ts
// src/services/ai/parseVoiceCommandAI.ts
export async function parseVoiceCommandAI(transcript: string, context: AppContext): Promise<VoiceCommand>
```

#### 3. Daily Brief (new feature)
On day view load, analyze current block load and suggest optimizations.  
Input: today's tasks, block capacities, time of day.  
Output: short tip (1–2 sentences, localized).

```ts
// src/services/ai/getDailyBrief.ts
export async function getDailyBrief(tasks: Task[], blocks: TimeBlockConfig[], lang: Language): Promise<string>
```

---

## Backend Proxy (for public deployment)

All Anthropic API calls MUST go through a backend proxy to keep the API key secret.

### Recommended: Vercel Edge Functions
```
/api/ai.ts — single proxy endpoint
Flow (React) → POST /api/ai → Anthropic API
```

### Request format
```ts
POST /api/ai
{
  model: "claude-sonnet-4-20250514",
  max_tokens: 1024,
  system: string,       // per-feature system prompt
  messages: [
    { role: "user", content: input }
  ]
}
```

### Response
```ts
{
  result: TaskWeight | VoiceCommand | string  // depends on caller
}
```

---

## Notes
- The app is currently fully client-side. No backend exists yet.
- Recovery Mode and Wind Down are already implemented and work well — don't touch this logic.
- `activePeriodId` is computed every second via `currentTime` state — be careful with derived state that depends on it.
- Voice confidence threshold is configurable (default 0.7) — AI parsing should return a confidence score too.
- `VoiceCommandProcessor` fallback rule: any unrecognized text becomes ADD_TASK. This is intentional but needs noise filtering first (see above).
- **Capacity system**: Each time block has max 12 points (Quick=1, Focused=3, Deep=6). Overflow triggers automatic transfer to next available slot.
- **Debug logging**: `taskOptimizer.ts` functions now include console.log for debugging capacity issues. Look for 🔍, 📅, ✅, ❌ emojis in console.
- **Task transfer applies to**: Voice commands, manual input (FocusPoint), and form submit (addTask). All paths use `adjustTaskPeriods()`.
- ⚠️ **Icon system cleanup complete**: All components now use `lucide-react` exclusively. Legacy file `src/utils/MaterialIcons.tsx` NOT deleted — move to `src/legacy/icons/` for archival after validation.

- ⚠️ **Legacy files pending removal** (manual check required):
  - `src/utils/MaterialIcons.tsx` — 50+ custom SVG icons (pendant removed, moved to legacy folder)
- ⚠️ **No src/tests/ directory exists** — tests may be absent or in a different location.
- ⚠️ **Design tokens (`design-tokens.ts`) define a dark theme only** — the light theme described in the Color System section below is not yet implemented in code/styles.css.

### ⚠️ KNOWN ISSUES (as of 2026-05-15 v5)
| # | Issue | Severity | Status |
|---|-------|----------|--------|
| 1 | Sleep gap warning not visible in Settings | 🔴 High | Open — validation logic exists in App.tsx (`diff < 420` check), error is rendered in SettingsModal, but ⚠️ may have UX visibility issue |
| 2 | Language switch requires page reload | 🔴 High | Not reproducible in Chrome (Edge only) |
| 3 | Double quote in task transfer notification | 🟡 Medium | Open — still present in `constants.tsx`: `taskTransferred: 'Task "{title}" transferred to {period}'` ⚠️ needs verification if it causes display issues |
| 4 | Voice confidence drops to 0.64 (always shows confirmation) | 🔴 High | ✅ Fixed in v5 — `createAddTaskCommand` now uses STT confidence directly (fallback to 0.75 if 0 or undefined) |
| 5 | Update commands ("Сделай задачу 1 важной") not working | 🔴 High | ✅ Fixed in v4 — `UpdateCommands.ts` exists with weight/period/priority patterns |

### ✅ VOICE MODULE STATUS
| Feature | Status | Notes |
|---------|--------|-------|
| Spanish language support | ✅ | Patterns in TaskCommands, NavigationCommands, UpdateCommands, VoiceCommandProcessor |
| normalizeText() | ✅ | In VoiceCommandProcessor |
| NOISE_PHRASES filter | ✅ | 3 languages (RU/EN/ES) in VoiceCommandProcessor |
| Auto-restart on silence | ✅ | ⚠️ needs verification — likely in VoiceControlService |
| VoiceFeedback localization | ✅ | Uses VOICE_TRANSLATIONS from constants.tsx |
| extractEntities() cleanup | ✅ | In VoiceCommandProcessor |
| TTS → STT infinite loop | ✅ Fixed | ⚠️ needs verification — likely in VoiceControlService |
| STT confidence = 0 fallback | ✅ Fixed in v5 | Confirmed: `const confidence = (sttConfidence !== undefined && sttConfidence > 0) ? sttConfidence : 0.75` |
| Update commands (weight/period/priority) | ✅ Fixed in v4 | UpdateCommands.ts with patterns, integrated in VoiceCommandProcessor |
| Toggle commands (nominative case + short forms) | ✅ Fixed in v5 | Patterns in TaskCommands.ts: `готово/сделано/выполнено + задача + number` |
| Task index numbers in Day View | ✅ Added in v4 | ⚠️ needs verification — not confirmed in component code |
| NavigationCommands.ts (dedicated patterns file) | ✅ | Exists with EN/RU patterns for nextDay, prevDay, today, goToDay/Week/Month/Year |
| TaskCommands.ts (dedicated patterns file) | ✅ | Exists with EN/RU/ES patterns for add/toggle/delete |
| VoiceControlButton.tsx | ✅ | Microphone toggle button component |
| VoiceSettingsModal.tsx | ✅ | Voice settings sub-panel in SettingsModal |

---

## Usage Examples

### Adding tasks with capacity checking

```typescript
// Via FocusPoint (manual input)
onTaskAdd: (title, periods, recurrence, weight) => {
  const adjustment = adjustTaskPeriods(tasks, periods, todayStr, weight, activePeriodId, currentTime);
  
  if (adjustment.transferred) {
    // Task was moved to different period/day
    periods = adjustment.periods;
    date = adjustment.date;
    // Show notification: "Задача перенесена на Утро завтра (11.04)"
  }
  
  createTask(title, periods, date, weight);
}
```

### Voice command with update

```typescript
// User says: "Сделай задачу 1 важной"
// VoiceCommandProcessor extracts:
{
  type: CommandType.UPDATE_TASK,
  entities: {
    index: 1,
    priority: 'high'
  }
}

// App executes:
updateTask(tasks[0].id, { priority: 'high' });
```

### Bulk task management

```typescript
// TaskManagerPanel usage
<DayView
  onDeleteAllCompleted={() => setTasks(prev => prev.filter(t => !t.completed))}
  onDeleteAll={() => setTasks([])}
/>
```

## Color System — Full Specification update 22.04.26S

### Philosophy
Two equal themes — Light and Dark. Neither is primary.
Dark theme is not "inverted light" — it's a separate, high-contrast experience.
In dark mode, bubbles become light sources on a dark canvas.

⚠️ **Current implementation status: Only the Dark theme is implemented in code.**
- `styles.css` defines only dark-theme CSS variables (`--bg-primary: #0a0a0a`, etc.)
- `design-tokens.ts` exports dark-theme color values only
- No light-theme CSS variables or media query (`prefers-color-scheme: light`) found
- The Light theme specification below is a **design intent, not yet implemented**

---

### Light Theme (⚠️ NOT IMPLEMENTED — design spec only)

**Block backgrounds** (vibrant, saturated):
| Block     | Hex       | Character        |
|-----------|-----------|------------------|
| Morning   | #D4622A   | Terracotta       |
| Afternoon | #1976D2   | Royal blue       |
| Evening   | #7B3FC4   | Purple           |
| Night     | #37306B   | Deep indigo      |

**Text on blocks:** #FFFFFF white (all blocks ≥ 4.5:1 ✅)

**Bubble colors** (light, airy — same across all blocks):
| Weight  | Hex     | Character |
|---------|---------|-----------|
| Quick   | #CCFCE3 | Mint      |
| Focused | #FEF3C7 | Lemon     |
| Deep    | #FCE4F5 | Rose      |

**WCAG 1.4.11 Non-text Contrast:** all bubble/block pairs ≥ 3:1 ✅

**App background:** #F7F5F2 (warm white)
**Surface / cards:** #FFFFFF
**Text primary:** #1A1A1A
**Text secondary:** #666666
**Outline / dividers:** #E0DDD8

---

### Dark Theme (✅ IMPLEMENTED)

**App background:** #0F0F14 (near black) — actual CSS: `--bg-primary: #0a0a0a`
**Surface / cards:** #1A1A24 — actual CSS: `--bg-card: #141414`, `--bg-elevated: #1a1a1a`
**Text primary:** #F0F0F5 — actual CSS: `--text-primary: #ffffff`
**Text secondary:** #A0A0B5 — actual CSS: `--text-secondary: #a0a0a0`
**Outline / dividers:** rgba(255,255,255,0.1) — actual CSS: ⚠️ not directly mapped

**Block backgrounds** (dark tinted — quiet, recede into background):
| Block     | Hex (spec) | Hex (actual CSS)     | Notes |
|-----------|------------|----------------------|-------|
| Morning   | #2A1A10    | `--period-morning: #fef3c7` ⚠️ | Spec says dark tinted, actual CSS has light yellow |
| Afternoon | #0A1A30    | `--period-afternoon: #fde68a` ⚠️ | Same mismatch |
| Evening   | #1A0F2E    | `--period-evening: #d4a574` | Different |
| Night     | #0A0A18    | `--period-night: #6b7280` | Different |

**Text on blocks:** #FFFFFF white ✅

**Bubble colors** (vivid, saturated — become light sources):
| Weight  | Hex (spec) | Hex (actual CSS) | Match? |
|---------|------------|------------------|--------|
| Quick   | #4ADE80    | `--weight-quick: #34d399` | ⚠️ Different shade |
| Focused | #FCD34D    | `--weight-focused: #60a5fa` | ❌ Different hue entirely (amber vs blue) |
| Deep    | #F472B6    | `--weight-deep: #a78bfa` | ❌ Different hue (pink vs purple) |

**WCAG 1.4.11:** all bubble/block pairs ≥ 3:1 (verify after implementation) ✅

⚠️ **Color system reality**: The CSS variables in `styles.css` and `design-tokens.ts` define a distinct dark theme that does NOT match the Color System spec hex values. The spec may be from an earlier design iteration. Block periods use amber/yellow tones instead of dark tinted, and weight colors skew toward blue/purple rather than amber/pink.

---

### Where Each Color Is Used

**Block background color:**
- Block card fill (the 4 quadrants in Day View)
- Active block indicator in Week/Month views
- Block label chip in task detail

**Bubble color (weight):**
- Physics bubble fill in Day View
- Weight badge background in task list
- Weight dot in all task rows
- Capacity bar fill

**App background (#F7F5F2 / #0F0F14):**
- Page background behind the grid
- Never used as card fill

**Surface (#FFFFFF / #1A1A24):**
- Bottom sheet panels (add task, settings)
- Modal backgrounds
- Task list rows inside expanded blocks

**Text primary:**
- Block names (Morning, Afternoon...)
- Task titles
- All body text

**Text secondary:**
- Block time labels (06:00 – 12:00)
- Capacity points (4/12 pts)
- Placeholder text in inputs

**Outline / dividers:**
- Separator lines in bottom sheets
- Input borders (default state)
- Section dividers

---

### Accessibility Rules
- Never use color as the ONLY differentiator — always pair with size, icon, or label
- Bubble weight: Quick = small + mint, Focused = medium + lemon, Deep = large + rose
- prefers-color-scheme: auto-switch Light/Dark ⚠️ Not implemented — only dark theme CSS exists
- prefers-contrast: more → increase bubble opacity to 1.0, add 1px border same hue darker
- prefers-reduced-motion → disable physics, show static bubbles with simple fade-in
- forced-colors (Windows High Contrast) → rely on shape and size only, colors override by OS
- Visual notifications setting (for deaf/hard of hearing) → replaces all sound feedback
  with screen flash + persistent visual indicator
  ---
### Biomechanics (Left-handed Mode)
- The app relies on a global `isLeftHanded` context.
- **FAB Positioning:** Mirrored to the bottom-left corner.
- **Swipe Gestures:** X-axis vectors for delete/move are inverted to match natural wrist extension.
- **Anti-Occlusion:** Context menus must not open to the right of task cards to prevent palm occlusion.

## ⚙️ Advanced Capacity Logic (Time-Aware)
Available capacity reduces proportionally as time passes.
- `getAvailableCapacity(period, settings, currentTime)` → returns dynamic limit (0–12)
- Recalculates every 15 min (avoids UI jitter)
- Already-added tasks stay → block visually shows as overfull
- Used in: `adjustTaskPeriods()`, `FocusPoint` validation, bubble density rendering
- Recovery Mode (wind-down 90min before rest) also reduces evening capacity

## 🔌 Integrations Roadmap
### Google Calendar (Phase 1)
- Current: "To GCal" button pre-fills event title ✅
- Next: Read-only import → display as **Commitments** (blocked slots, reduce capacity)
- Do NOT convert to Flow tasks (different data model)
- Auto-suggest capacity reduction for fixed-time events

### Health Trackers (Phase 2+)
- HIGH: Sleep data (Apple Health/Google Fit) → auto-correct `wakeUpTime`, trigger Recovery Mode
- MEDIUM: Activity/HRV → adjust capacity recommendations
- LOW: Steps/calories → not planned (overloads logic)
- Requires backend (Supabase) for secure API calls

## 🗄️ Backend & Sync Strategy
### Current State
Fully client-side. `localStorage` only. No auth, no sync, AI proxy planned via Vercel Edge Functions.

### When Backend Becomes Necessary
- Multi-device sync
- Real auth (beyond Guest mode)
- Secure Anthropic API calls
- Push notifications (alarms currently browser-only)
- Data backup/recovery

### Recommended Stack
- Frontend: React 19 + TS (existing)
- AI Proxy: Vercel Edge Functions (`/api/ai.ts`)
- Auth + DB: Supabase (PostgreSQL + realtime, free tier)
- Hosting: Vercel

### Phased Rollout

### Фаза 0: M3 Atoms & Cleanup
- Создание атомарных M3 компонентов: `Chip.tsx`, `Switch.tsx`
- Обновление документации (CLAUDE.md)
- Замена импортов иконок на lucide-react
- Замена хардкод-стилей на Tailwind M3-классы
- Legacy-файлы (`MaterialIcons.tsx`) НЕ удаляются автоматически — требуют ручной проверки

1. **Now**: `localStorage` + Vercel AI proxy
2. **Next**: Supabase auth + cross-device task sync
3. **Future**: Push notifications, health integrations, GCal two-way sync
**Trigger for Phase 2**: Second real user or painful data loss. Avoid premature complexity.

---

## New UI Concept — Day View Redesign

### Core idea
Replace the central input field with a 4-quadrant Day View where tasks are
visualized as physics bubbles. Voice becomes the primary input method;
text input moves to a secondary FAB-triggered bottom sheet.

### Layout
- Day View splits into 4 equal quadrants: Morning / Afternoon / Evening / Night
- Night block is rest-only, no tasks, no bubbles
- Each block has its own M3 tonal palette (see flow_m3.html)

### Bubble visualization
- Each task = one bubble inside its block
- Bubble SIZE encodes weight: Quick = small (r:14), Focused = medium (r:21), Deep = large (r:30)
- Bubble COLOR encodes weight: Quick = mint, Focused = lemon, Deep = rose
- Bubble SHAPE encodes priority (see Shape System below)
- Color + size + shape = triple accessibility marker (not color-only) ✅ WCAG

### Transition: bubbles → task list
- Tap on block → physics pauses, bubbles fade out → task rows animate in (staggered)
- Each row: weight dot + task name + weight badge
- "← back" button returns to bubble view

### Voice input
- Primary input: FAB microphone button (fixed bottom center)
- FAB pulses red while listening
- On voice command → new bubble appears in correct block with physics
- Secondary input: "+ task" button → bottom sheet with text input + weight/block picker

### Physics implementation
- Library: Matter.js (cdnjs)
- Engine per block, SVG render layer (not Canvas)
- Gravity: slightly upward (−0.18) — bubbles float like balloons
- New bubble spawns at bottom, floats up
- Settings: restitution 0.72, frictionAir 0.007, density 0.00035
- Gentle random drift force every few frames — bubbles stay alive
- Squash & stretch on velocity — rubber/balloon feel

### Reference files
- flow_final.html — working physics prototype (Matter.js + SVG, airy bubbles, no tails)
- flow_m3.html — M3 color system with light/dark toggle
- flow_palette.html — color palette comparison with contrast ratios

### Components to create
- DayView.tsx — 4-quadrant grid
- BubbleBlock.tsx — single block with Matter.js SVG layer + task list state
- PhysicsEngine.ts — Matter.js setup, addBubble(), destroyEngine()
- VoiceFAB.tsx — floating mic button, listening state, pulse animation
- TaskSheet.tsx — bottom sheet for manual task input

---

## Shape System — Priority Visualization

### Concept
Task priority communicated through SHAPE of the bubble:
- SIZE → weight (Quick=small, Focused=medium, Deep=large)
- COLOR → weight (Mint/Lemon/Rose)
- SHAPE → priority (Circle/Rhomb/"Cookie")

Three independent visual channels — none relies on color alone. ✅ WCAG
Inspired by M3 MaterialShapes library (Android/Compose).


### Shape → Weight & Priority Mapping (Draft #3)
Task forms encode weight and physical behavior in Matter.js:
| Weight  | Shape         | Text? | UI Focus                                 |
|---------|---------------|-------|------------------------------------------|
| Quick   | Circle        | NO    | Dark contrast icon strictly centered on pastel background |
| Focused | Soft Square   | YES   | `rounded-3xl` (squircle)                 |
| Deep    | "Cookie"      | YES   | Custom organic SVG path with dark contrast outline (`on-container`) |

### Web Implementation (SVG + Matter.js)
- SVG clipPath per shape
- CSS clip-path: polygon() for simpler shapes
- Matter.js Bodies.fromVertices() — physics with arbitrary polygons

### Physics Bonus
- Circle (Low) — rolls smoothly, settles easily
- Rhomb (Medium) — tips and settles on corner
- 12-sided Cookie (High) — bounces unpredictably, hard to stack → physical metaphor for urgency

### Accessibility
- prefers-reduced-motion → all shapes become circles
- forced-colors → shape is the ONLY differentiator, must be preserved
- Screen readers → aria-label: "Write strategy, Deep, High priority"

### Files to create/modify
- src/styles/shapes.ts — SVG paths + Matter.js vertex arrays per priority shape
- BubbleBlock.tsx — shape based on task.priority
- PhysicsEngine.ts — Bodies.fromVertices() for Medium/High priority

---

## UX Edge Cases & Planned Features

### 1. Overloaded Block
- adjustTaskPeriods() auto-transfers tasks ✅ (already implemented)
- Still needed: visual signal — bubbles press together, amber border, soft message
- Tone: supportive, never alarming. Amber = care, never red

### 2. Burnout Mode / Reset Flow
- Detect 3+ days of low completion from workHistory
- Offer "Reset Flow": keep only high-priority, archive rest
- Message: "Looks like a heavy week. Want to keep only the essentials?"

### 3. Time Collision
- Flow works with blocks, not exact times — by design
- On conflict: suggest shifting wakeUpTime or reassigning block
- Timed tasks as separate entity — not MVP

### 4. Empty State
- Warm text: "Your flow is clear. What's the first task for today?"
- Voice variant: empty block offers to listen immediately
- Bubbles slowly "breathe" — CSS anticipation animation

### 5. Travel / Timezone
- "Adapt blocks to current time" — one tap
- Auto-detect timezone change → suggest recalculation
- Temporary travel mode without changing core settings

### 6. Cycle Mode (Female biorhythms) — Far Future
- Fully optional, user explicitly enables
- No medical terms in UI
- Extend Recovery Mode, not a separate module

### General Principles
- Tone: always supportive, never judgmental
- All smart hints optional — can be disabled in Settings
- Accessibility first: visual feedback benefits all users

---

## Idea Bank — UX Concept

### Input Philosophy
Input feels like a familiar messenger — simple, conversational, low friction.
Voice is primary; text input mimics chat interface pattern.

### UI Pattern
- Chat-like input at bottom of Idea Bank screen
- Ideas appear as bubbles in a feed (no periods, no weights)
- Voice: tap mic → speak → idea appears as new message bubble
- Text: type in chat input → send → same result

### Entity
```ts
Idea: { id: string; text: string; createdAt: string; tags?: string[]; convertedToTask?: boolean; }
```
- Storage: flow_ideas in localStorage
- New CommandType: ADD_IDEA
- Trigger phrases: "идея: ..." / "idea: ..." / "guardar idea: ..."

### AI Phase (future)
- Cluster related ideas → suggest goals
- One-tap conversion: idea → task with auto weight/period

---

## Material M3 — Rules for AI Implementation

### Reference Sources
- Design system: https://m3.material.io
- Accessible components: https://react-spectrum.adobe.com/react-aria/

### Button Semantics
- Filled → ONE primary action per screen
- Tonal → secondary actions
- Outlined → alternative actions
- Text → least important / navigation
- FAB → most important persistent action (voice mic)
- Extended FAB → only if label needed

### Navigation
- Bottom bar: 3–5 destinations
- Tab bar: same-level switching (Day/Week/Month/Year)

### Cards
- Elevated → default
- Filled → surface-variant
- Outlined → outline border
- Never mix types in same list

### Sheets & Dialogs
- Bottom sheet → contextual actions
- Dialog → requires decision before proceeding
- Snackbar → confirmation (task added/moved/deleted)
- Never use dialog for simple confirmations

### Typography Mapping
- Headline L/M → page titles
- Headline S / Title L → block names (Morning, Afternoon...)
- Title M/S → task titles
- Body L/M → descriptions
- Body S / Label → timestamps, capacity, captions
- Label L → button labels
- Label M/S → weight badges, chips

### Custom Components — DO NOT apply M3 rules
- DayView 4-quadrant grid
- BubbleBlock with Matter.js physics
- Capacity visualization via bubbles
- VoiceFAB pulse animation
- Shape-based priority system (M3 inspired, web-native)

## Theme Files
- `src/theme/material-theme.json` — M3 theme export with Inter typography, 
  seed #7B3FC4, includes all color schemes (light/dark/high-contrast) 
  and full type scale

  ---

## Energy Peak Planner — Feature Spec

### Концепция
Персонализация биоритмического планирования на основе субъективного пика энергии
конкретного пользователя. Не усреднённый биоритм — а личный профиль.

Философия: не автоматизация, а умная поддержка решения с уважением к автономии.
Каждое предложение системы требует явного подтверждения пользователя.

---

### Компонент 1 — Energy Peak Profile (настройки)

Пользователь указывает свой субъективный пик энергии.

**Entity (добавить в UserSettings):**
```ts
energyPeak?: {
  block: TimePeriod          // MORNING | AFTERNOON | EVENING
  intensity: 'soft' | 'strong'  // насколько выражен пик
}
```

**UI:** секция в SettingsModal после wakeUpTime/restTime.
Выбор через визуальный селектор блоков дня — не абстрактный слайдер,
а тапы по блокам Morning / Afternoon / Evening с индикатором пика.

**Логика:**
- По умолчанию пик не задан → система работает как сейчас
- Если пик задан → влияет на Smart Day Planner и suggestWeight()

---

### Компонент 2 — Smart Day Planner (планирование дня)

Пользователь выбирает дату → система предлагает распределение задач
из существующего списка по блокам с учётом energyPeak.

**Алгоритм распределения:**
```
Deep tasks    → пиковый блок (energyPeak.block)
Focused tasks → блок до или после пика
Quick tasks   → оставшиеся блоки (утро или вечер)
Night block   → всегда пустой (только отдых)
```

**UX Flow:**
1. Пользователь нажимает "Распланировать день" (кнопка в DayView или DateNavigator)
2. Выбирает дату (например, завтра)
3. Приложение открывает эту дату
4. Показывает предложения по одному с подтверждением:
   "Поставить «Написать стратегию» (Deep) в Утро — твой пиковый блок?"
   [Да, поставить] [Пропустить] [Выбрать другой блок]
5. После всех подтверждений — день распланирован

**Важно:** пользователь может пропустить любое предложение или выбрать
другой блок — система не навязывает, а предлагает.

---

### Интеграция с существующим кодом

**suggestWeight() в taskOptimizer.ts:**
Если energyPeak задан — учитывать при автоматическом предложении веса задачи.
Deep задачи предлагать планировать на пиковый блок.

**adjustTaskPeriods() в taskOptimizer.ts:**
При ручном добавлении задачи с весом Deep — если текущий блок не пиковый,
предлагать переместить в пиковый (мягкая рекомендация, не принудительно).

**Новые компоненты:**
- `EnergyPeakSelector.tsx` — визуальный выбор пика в настройках
- `DayPlannerModal.tsx` — модалка с предложениями по распределению
- `PlannerSuggestion.tsx` — одно предложение с кнопками подтверждения

---

### Приоритет реализации
**Фаза 1:** Energy Peak Profile в настройках (UserSettings + UI)
**Фаза 2:** Smart Day Planner — базовый алгоритм + подтверждения
**Фаза 3:** Интеграция с suggestWeight() и adjustTaskPeriods()
**Фаза 4 (AI):** Умные предложения через Anthropic API с учётом истории задач