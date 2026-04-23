# Flow Calendar — Project Context for Claude

## What is Flow?
A productivity calendar app built around circadian rhythms. The day is divided into 4 time blocks (Morning / Afternoon / Evening / Night), dynamically calculated from the user's wake/rest time. Tasks have weights (Quick / Focused / Deep) and can recur. The app supports Recovery Mode, fade-in alarms with ambient sounds, and multilingual UI (EN / RU / ES).

Live: https://flow-nine-xi.vercel.app  
Repo: https://github.com/denzakh/flow

---

## Stack
- **Frontend**: React 19 + TypeScript + Vite
- **Icons**: Lucide React
- **Styling**: Tailwind CSS
- **Storage**: localStorage (all data is client-side)
- **Voice**: Web Speech API (SpeechRecognition + SpeechSynthesis)
- **AI (planned)**: Anthropic API via backend proxy

---

## Architecture

### Core types (src/types.ts)
```ts
TimePeriod: MORNING | AFTERNOON | EVENING | NIGHT
TaskWeight: QUICK | FOCUSED | DEEP
Recurrence: 'none' | 'daily' | 'weekly' | 'all-blocks'
Task: { id, title, periods, dueDate, completed, weight, recurrence, priority, createdAt, originalPeriod }
UserSettings: { wakeUpTime, restTime, recoveryDays, language, alarm }
VoiceSettings: { enabled, language, autoSubmit, requireConfirmation, ttsEnabled, confidenceThreshold }
VoiceCommand: { type, intent, entities, confidence, rawText }
CommandType: ADD_TASK | TOGGLE_TASK | DELETE_TASK | NAVIGATE_DATE | CHANGE_VIEW | UPDATE_TASK | UNKNOWN
```

### Key services (src/services/)
- `taskOptimizer.ts` — `suggestWeight()` (rule-based weight detection), `adjustTaskPeriods()` (capacity-aware period routing), `findAvailableSlot()` (smart time-aware slot finding), `calculatePeriodPoints()` (block capacity calculation)
- `voice/VoiceControlService.ts` — Web Speech API wrapper (listen, speak, dispose)
- `voice/VoiceCommandProcessor.ts` — parses transcript → VoiceCommand (rule-based regex)
- `voice/commands/UpdateCommands.ts` — patterns for task updates (weight, period, priority)

### Key components
- `App.tsx` — main state, voice handlers, task CRUD, capacity-aware task routing
- `components/views/` — DayView, WeekView, MonthView, YearView
- `components/modals/` — SettingsModal (now includes voice settings), AlarmModal, AlarmPlayingModal
- `components/voice/VoiceFeedback.tsx` — voice status indicator
- `components/TaskManagerPanel.tsx` — bulk task management (delete all/completed tasks)
- `components/blocks/FocusPoint.tsx` — task input with smart weight suggestion and capacity checking

### State in App.tsx
- `tasks` — persisted to `flow_tasks` in localStorage
- `settings` — persisted to `flow_settings`
- `user` — persisted to `flow_user`
- `voiceSettings` — voice control config (enabled, language, autoSubmit, requireConfirmation, ttsEnabled, confidenceThreshold)
- `activePeriodId` — computed from current time + wake/rest settings
- `isRecoveryMode` — true on recovery days or during wind-down (90 min before rest)
- `dynamicBlocks` — 3 equal blocks between wake and rest time
- `capacityNotification` — temporary notification for task transfer events (transferred/full)

---

## AI Integration Plan

### Current state (rule-based)
| Feature | Location | Current approach |
|---|---|---|
| Task weight suggestion | `taskOptimizer.ts → suggestWeight()` | Keyword matching |
| Voice command parsing | `VoiceCommandProcessor.ts` | Regex patterns (EN/RU) |
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
  feature: 'suggest-weight' | 'parse-voice' | 'daily-brief',
  payload: { title?, transcript?, tasks?, lang? }
}
```

### Rate limiting
- Suggest weight: cache by title (same title = same result, no repeat calls)
- Voice parsing: max 1 req/sec per session
- Daily Brief: once per day per user (cache in localStorage with date key)

---

## Conventions

- All new AI functions go into `src/services/ai/`
- AI functions are async and have non-AI fallbacks (fall back to rule-based if API fails)
- Never call Anthropic API directly from the frontend in production
- Keep prompts in a separate `src/services/ai/prompts.ts` file (one export per feature)
- Localization: prompts should instruct the model to respond in the user's language

---

## Recent Updates

### 2026-04-14 (v3): Testing Results & New Bugs

#### ✅ What was tested
- TTS → STT infinite loop fix — **PASSES** ✅
- TTS cooldown (1.5s) — **PASSES** ✅
- Console logs for TTS lifecycle — **PASSES** ✅

#### ⚠️ What partially works
- STT confidence fallback — effectiveConfidence = 0.80 (fallback works) BUT VoiceCommandProcessor applies `* 0.8` multiplier → final confidence = 0.64 < 0.7 threshold → confirmation dialog always appears

#### 🐛 New bugs discovered
1. **Sleep gap warning not visible** — appears at bottom of Settings modal
2. **Language switch requires F5** — doesn't apply immediately after Save Changes
3. **Double quote in notification** — "Зазада"тестовая задача" instead of Задача "тестовая задача"
4. **Confidence drops to 0.64** — despite 0.80 fallback, final confidence is below threshold

### 2026-04-14 (v2): Critical Voice Module Fixes

#### ✅ TTS → STT infinite loop fixed
**Problem:** After voice command execution, TTS speaks feedback ("Задача добавлена") → microphone picks it up → creates new task → TTS speaks again → infinite loop
**Root cause:** `speak()` in `VoiceControlService` did NOT pause speech recognition
**Fix:**
- `speak()` now stops recognition before speaking
- Added `ttsCooldownActive` flag — 1.5s cooldown after TTS ends
- Recognition only restarts AFTER cooldown expires
- If recognition was not active before TTS, it stays stopped

#### ✅ STT confidence = 0 fallback
**Problem:** Chrome Web Speech API returns `confidence: 0` for all recognitions — threshold check always fails
**Root cause:** Browser bug, cannot be fixed at browser level
**Fix:** In `App.tsx` voice callback — if `confidence === 0 || undefined`, use `threshold + 0.1` as effective confidence
- Result: commands execute without confirmation dialog (0.8 > 0.7 default threshold)
- User can still raise threshold to 0.9 to force confirmation

### 2026-04-14: Bug Fixes & Localization

#### ✅ Hardcoded strings fixed
- Added `sleepGapError` to `TRANSLATIONS` (EN/RU/ES) in constants.tsx
- Replaced hardcoded error message in `handleSaveSettings()` with `t.sleepGapError`
- Fixed empty `{title}` in task transfer notifications — now passes real task title
  - Fixed in `addTask()` (form submit path)
  - Fixed in `FocusPoint` `onTaskAdd` callback (manual input path)
  - Voice commands already used `command.entities.title` correctly

#### ✅ Voice module cleanup
- Removed unused `extractEntities()` stub method from `VoiceCommandProcessor`
- Removed fake `calculateConfidence()` — confidence now passed directly from STT

#### ✅ Already completed (verified)
- `es: 'es-ES'` in `LANG_MAP` — VoiceControlService.ts ✅
- `normalizeText()` — punctuation, ё→е, whitespace ✅
- `NOISE_PHRASES` filter — EN/RU/ES ✅
- Auto-restart on silence — `shouldAutoRestart` flag + `onend` handler ✅
- `VoiceFeedback.tsx` localized via `VOICE_TRANSLATIONS` ✅
- `VOICE_TRANSLATIONS` ES complete ✅

### 2026-04-10: Smart Task Transfer & Bulk Management

#### ✅ Automatic task transfer on block overflow
Implemented intelligent capacity-aware task routing:

**`adjustTaskPeriods()`** — checks each selected period for overflow
- Validates capacity (12 points max per block)
- Returns adjusted periods + date
- Handles both same-day and next-day routing

**`findAvailableSlot()`** — smart time-aware slot finding
- Checks only relevant periods (skips past periods)
- Example: at 22:06 (evening), skips morning/afternoon → checks evening → if full → next day morning

**`isPeriodRelevant()`** — period relevance validation
- Morning at 22:06? → Not relevant
- Evening at 22:06? → Relevant

**Routing logic:**
```
Current time: 22:06 (evening)
Evening full (12/12) → Check morning tomorrow (0/12) → Transfer ✅

Current time: 14:00 (afternoon)
Afternoon full (12/12) → Check evening today (6/12) → Transfer ✅
```

**Applied to:**
- Voice commands (VoiceCommandProcessor → executeVoiceCommand)
- Manual input (FocusPoint → onTaskAdd)
- Form input (App.tsx → addTask)

#### ✅ Bulk task management
**`TaskManagerPanel.tsx`** — new component for mass operations:
- Statistics: total/completed/active tasks
- Delete all completed tasks (with confirmation)
- Delete all tasks (with confirmation)
- Expandable panel design
- Integrated into DayView

#### ✅ Voice settings consolidation
- Removed separate voice settings button from Header
- All voice settings moved to SettingsModal
- Cleaner UI, single settings location

#### ✅ UI cleanup
- Removed artifact "Manage Blocks" menu from TaskItem
- Simplified task item controls (only delete button on hover)

---

## Current TODOs

### Voice module — ⚠️ NEW BUGS FOUND

#### Known bugs from testing (2026-04-14 v3)

**Bug #1: Sleep gap warning not visible**
- **Symptom:** When sleep < 7 hours, warning appears at bottom of Settings modal — not visible
- **Expected:** Warning should be overlay/modal on top of Settings
- **File:** `App.tsx` + `SettingsModal.tsx`
- **Priority:** 🔴 High

**Bug #2: Language switch requires page reload**
- **Symptom:** Changing language in Settings → Save Changes only applies after F5
- **Expected:** Language should switch immediately after "Save Changes"
- **Root cause:** `t = TRANSLATIONS[settings.language]` is computed once at render; `settings.language` updates but React doesn't re-render all components that use `t`
- **File:** `App.tsx` (line ~40: `const t = TRANSLATIONS[settings.language]`)
- **Priority:** 🔴 High — breaks UX

**Bug #3: Double quote in task transfer notification**
- **Symptom:** `"Зазада"тестовая задача" перенесена на Утро завтра 15 апреля"` — extra letter "За" + double quote
- **Expected:** `Задача "Тестовая задача" перенесена на Утро завтра (15 апр.)`
- **Root cause:** Likely in `.replace('{title}', newTaskTitle)` — need to check string encoding or title value
- **File:** `App.tsx` (addTask + FocusPoint onTaskAdd)
- **Priority:** 🟡 Medium — cosmetic

**Bug #4: Command confidence drops to 0.64 despite fallback**
- **Symptom:** effectiveConfidence = 0.80 (fallback works), but `Command confidence: 0.64` after VoiceCommandProcessor
- **Root cause:** `parseCommand()` applies `* 0.8` multiplier for ADD_TASK fallback: `confidence * 0.8 = 0.80 * 0.8 = 0.64`
- **Expected:** Confidence should NOT drop below threshold for clear commands
- **File:** `VoiceCommandProcessor.ts → createAddTaskCommand()`
- **Fix:** Don't apply multiplier when STT confidence was already 0 (used fallback)
- **Priority:** 🔴 High — confirmation dialog always appears

### AI integration
- [ ] Create `/api/ai.ts` Vercel Edge Function proxy
- [ ] Implement `suggestWeightAI()` with fallback to `suggestWeight()`
- [ ] Implement `parseVoiceCommandAI()` with fallback to `VoiceCommandProcessor`
- [ ] Add `getDailyBrief()` — show in DayView header
- [ ] Add loading state to task input while weight is being suggested

### General — ✅ ALL COMPLETE

---

## Voice Module — Resolved Issues

### ✅ All issues resolved as of 2026-04-14

#### Previously fixed:
- ~~Spanish language not supported~~ → Fixed with `LANG_MAP` in VoiceControlService.ts
- ~~`calculateConfidence()` is fake~~ → Removed; STT confidence passed directly
- ~~`extractEntities()` is empty~~ → Removed; entities extracted in specific command methods
- ~~`normalizeText()` missing~~ → Implemented with ё→е, punctuation strip, whitespace collapse
- ~~Noise phrase filter missing~~ → Added `NOISE_PHRASES` for EN/RU/ES
- ~~Auto-restart on silence~~ → Implemented with `shouldAutoRestart` flag
- ~~VoiceFeedback status strings hardcoded in English~~ → Localized via `VOICE_TRANSLATIONS`
- ~~Spanish missing in VOICE_TRANSLATIONS~~ → Complete ES translations added

---

## Planned UX Features

### 1. Overloaded Block (Перегруженный блок)
**Trigger:** `calculatePeriodPoints() > BLOCK_CAPACITY` (12 points)
**Status:** Partially done — `adjustTaskPeriods()` transfers tasks automatically, but no visual signal

**What to add:**
- Block border changes to warm amber (not red — amber = care, not error)
- Soft message: "Morning seems full. Transfer some to Afternoon?"
- Bubbles visually "press" against each other (CSS density effect)
- **Tone:** support, never warning

**User Story:** As an ambitious planner, I want overload signals so I can realistically assess my capacity.

**Files to modify:** `components/blocks/TimeBlock.tsx`, `components/views/DayView.tsx`

---

### 2. Empty State (Пустой поток)
**Trigger:** `tasks.length === 0` in a block or entire day
**Status:** Not implemented — currently shows nothing

**What to add:**
- Warm invitation text: "Your flow is clear. What's the first task for today?"
- Voice variant: empty block offers "listen for ideas" button
- Bubbles slowly "breathe" — CSS animation of anticipation
- **Tone:** inviting, not empty

**Files to modify:** `components/blocks/TimeBlock.tsx`

---

### 3. Burnout Mode / Reset Flow
**Trigger:** 3+ consecutive days with < 50% task completion (check `workHistory`)
**Status:** Not started

**What to add:**
- Detect stagnation pattern from `workHistory` + task completion rates
- Offer "Reset Flow": keep only high-priority, archive the rest
- Message: "Seems like a heavy week. Want to keep only the essentials?"
- Ties into Recovery Mode — strengthens wellness positioning
- **Tone:** support, never guilt

**Files to modify:** `App.tsx` (new useMemo for burnout detection), `components/blocks/RecoveryBanner.tsx` (extend)

---

### 4. Visual Notifications (Accessibility — Deaf/HoH)
**Trigger:** User enables "visual notifications" in Settings
**Status:** Not started

**What to add:**
- Settings toggle: "Visual notifications instead of sound"
- Replace TTS confirmations with prominent visual feedback (toast, badge, screen pulse)
- Alarm: visual full-screen signal (pulsing warm color) instead of sound
- Respect system preferences:
  - `prefers-reduced-motion` → remove bubble physics, static circles with fade-in
  - `prefers-contrast: more` → denser fills, thicker borders, no transparency
  - `forced-colors` → Windows High Contrast, don't break icons/forms
- **Principle:** visual feedback helps ALL users, not just Deaf/HoH

**Files to modify:** `SettingsModal.tsx`, `types.ts` (add `visualNotifications: boolean` to UserSettings), global CSS media queries

---

### 5. Travel / Timezone Adaptation
**Trigger:** Timezone change detected or manual "Adapt blocks" button
**Status:** Not started

**What to add:**
- "Adapt blocks to current time" one-tap button
- Auto-detect timezone change → suggest recalculation
- "Travel mode" — temporary, doesn't change core settings
- `Intl.DateTimeFormat().resolvedOptions().timeZone` for detection

**Files to modify:** `SettingsModal.tsx`, `App.tsx` (timezone detection useEffect)

---

### 6. Cycle Mode (Female biorhythms) — Far Future
**Status:** Concept only — requires UX research before implementation
**Principles:**
- Fully optional — user enables explicitly
- No medical terms in UI
- Adapt weight recommendations (less Deep in certain phases)
- Extend Recovery Mode, not separate module
- Delicate presentation

---

### General UX Principles for Edge Cases
- **Tone:** always supportive, never judgmental
- **Colors:** amber for overload (never red — red = error, not overload)
- **All smart hints optional** — can be disabled in Settings
- **Edge cases don't break main flow** — appear unobtrusively
- **Accessibility first:** visual feedback benefits all users, not just specific groups

---

## Roadmap — Future Features

### 1. Idea Bank (Банк идей)
**Status:** Planned  
**Feasibility:** ✅ High — fits existing architecture naturally

**Concept:** A separate storage for fleeting ideas captured by voice. Unlike tasks, ideas have no periods or weights — they just accumulate and can later be converted to tasks or goals.

**Without AI (Phase 1):**
- New type `Idea: { id, text, createdAt, tags?, convertedToTask? }`
- New `CommandType.ADD_IDEA` in `VoiceCommandProcessor`
- Trigger phrase: *"идея: ..."* / *"idea: ..."* / *"guardar idea: ..."*
- Stored in `flow_ideas` in localStorage
- Separate view/panel in the UI (e.g. a tab or side drawer)

**With AI (Phase 2):**
- Periodic analysis: send `ideas[]` to Anthropic API → get clusters of related ideas
- Suggestions: *"У тебя 3 идеи про продуктивность — объединить в цель?"*
- One-tap conversion: idea → task with auto-filled weight and period
- Cache analysis result in localStorage with timestamp (re-analyze when new ideas added)

```ts
// src/services/ai/analyzeIdeas.ts
export async function analyzeIdeas(ideas: Idea[], lang: Language): Promise<IdeaAnalysis>
// IdeaAnalysis: { clusters: { label: string, ideas: Idea[] }[], suggestions: string[] }
```

**New CommandType needed:**
```ts
// Add to types.ts:
CommandType: ADD_TASK | TOGGLE_TASK | DELETE_TASK | NAVIGATE_DATE | CHANGE_VIEW | UPDATE_TASK | ADD_IDEA | UNKNOWN
```

---

### 2. SMART Goal System (Система целей)
**Status:** Planned  
**Feasibility:** ⚠️ Medium — simple version is easy, personalized motivations require AI

**Concept:** Goals created via a step-by-step SMART questionnaire. During progress, the app shows personalized micro-motivations tied to the user's preferences (not generic templates).

**Without AI (Phase 1) — SMART form:**
```ts
Goal: {
  id: string
  title: string
  why: string           // "зачем эта цель?"
  deadline: string      // ISO date
  steps: GoalStep[]     // разбивка на шаги
  linkedPeriod?: TimePeriod
  progress: number      // 0-100
  createdAt: number
  motivations?: string[] // pre-generated phrases
}
GoalStep: { id, title, completed, dueDate? }
```

Questionnaire flow (5 steps):
1. What is the goal? (title)
2. Why does it matter? (why — used for motivation context)
3. Deadline?
4. Break into 3-5 steps
5. Which time block fits best?

**With AI (Phase 2) — personalized motivations:**
- At goal creation: send `{ goal, why, userPreferences }` → get 7-10 personalized micro-motivations
- UserPreferences collected during onboarding: favorite drink, hobby, reward habit
- Example: goal="run 5km", preference="coffee lover" → *"3 км сегодня — и утренний кофе вдвойне заслужен"*
- Motivations generated once, cached in `goal.motivations[]`, shown on step completion
- No repeated API calls during normal usage

```ts
// src/services/ai/generateMotivations.ts
export async function generateMotivations(
  goal: Goal,
  preferences: UserPreferences,
  lang: Language
): Promise<string[]>
```

**New type needed:**
```ts
// Add to types.ts:
UserPreferences: {
  favoriteReward?: string   // "кофе", "прогулка", "сериал"
  hobby?: string
  motivationStyle?: 'gentle' | 'direct' | 'playful'
}
// Add to UserSettings or store separately in flow_preferences
```

---

### 3. Voice Widget / Background Mode
**Status:** Planned (PWA first, native later)  
**Feasibility:** ❌ Not possible as pure web — requires PWA or native app

**Why it can't be done in browser:**
Browser kills microphone access when tab is inactive. No background listening is possible without user interaction. This is a browser security constraint, not a Flow limitation.

**Phase 1 — PWA shortcut (realistic now):**
- Add `manifest.json` with `display: standalone` → app installs to home screen
- Add URL parameter: `?voice=true&mode=idea` or `?voice=true&mode=task`
- On app load: detect parameter → auto-start voice module immediately
- User flow: tap icon on home screen → app opens → mic activates in 1 second

```ts
// In App.tsx useEffect on mount:
const params = new URLSearchParams(window.location.search);
if (params.get('voice') === 'true') {
  const mode = params.get('mode') ?? 'task'; // 'task' | 'idea'
  setTimeout(() => startVoiceWithMode(mode), 800);
}
```

PWA manifest additions needed:
```json
{
  "shortcuts": [
    {
      "name": "Добавить задачу",
      "url": "/?voice=true&mode=task",
      "icons": [{ "src": "/icon-task.png", "sizes": "96x96" }]
    },
    {
      "name": "Записать идею",
      "url": "/?voice=true&mode=idea",
      "icons": [{ "src": "/icon-idea.png", "sizes": "96x96" }]
    }
  ]
}
```

**Phase 2 — Native app (future):**
- React Native / Expo reuses most of the business logic
- True home screen widget with single mic button
- Background processing possible
- Not planned until web version is stable

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

### ⚠️ KNOWN ISSUES (as of 2026-04-14 v3)
| # | Issue | Severity | Status |
|---|-------|----------|--------|
| 1 | Sleep gap warning not visible in Settings | 🔴 High | Open |
| 2 | Language switch requires page reload | 🔴 High | Open |
| 3 | Double quote in task transfer notification | 🟡 Medium | Open |
| 4 | Voice confidence drops to 0.64 (always shows confirmation) | 🔴 High | Open |
| 5 | Update commands ("Сделай задачу 1 важной") not working | 🔴 High | Open |

### ✅ VOICE MODULE STATUS
| Feature | Status |
|---------|--------|
| Spanish language support | ✅ |
| normalizeText() | ✅ |
| NOISE_PHRASES filter | ✅ |
| Auto-restart on silence | ✅ |
| VoiceFeedback localization | ✅ |
| extractEntities() cleanup | ✅ |
| TTS → STT infinite loop | ✅ Fixed |
| STT confidence = 0 fallback | ⚠️ Partial (0.64 after multiplier) |
| Update commands | ❌ Not working |

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

---

### Light Theme

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

### Dark Theme

**App background:** #0F0F14 (near black)
**Surface / cards:** #1A1A24
**Text primary:** #F0F0F5
**Text secondary:** #A0A0B5
**Outline / dividers:** rgba(255,255,255,0.1)

**Block backgrounds** (dark tinted — quiet, recede into background):
| Block     | Hex     | Character           |
|-----------|---------|---------------------|
| Morning   | #2A1A10 | Dark terracotta     |
| Afternoon | #0A1A30 | Dark navy           |
| Evening   | #1A0F2E | Dark purple         |
| Night     | #0A0A18 | Near black          |

**Text on blocks:** #FFFFFF white

**Bubble colors** (vivid, saturated — become light sources):
| Weight  | Hex     | Character      |
|---------|---------|----------------|
| Quick   | #4ADE80 | Vivid green    |
| Focused | #FCD34D | Vivid amber    |
| Deep    | #F472B6 | Vivid pink     |

**WCAG 1.4.11:** all bubble/block pairs ≥ 3:1 (verify after implementation) ✅

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
- prefers-color-scheme: auto-switch Light/Dark
- prefers-contrast: more → increase bubble opacity to 1.0, add 1px border same hue darker
- prefers-reduced-motion → disable physics, show static bubbles with simple fade-in
- forced-colors (Windows High Contrast) → rely on shape and size only, colors override by OS
- Visual notifications setting (for deaf/hard of hearing) → replaces all sound feedback
  with screen flash + persistent visual indicator