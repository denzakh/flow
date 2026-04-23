<div align="center">

# FLOW — Circadian Rhythm Productivity Calendar

🌅 **Flow** — productivity calendar app built around circadian rhythms

[Live Demo](https://flow-nine-xi.vercel.app) · [Report Bug](https://github.com/denzakh/flow/issues)

</div>

## 📋 Overview

Flow divides your day into **4 time blocks** (Morning / Afternoon / Evening / Night), dynamically calculated from your wake/rest times. Tasks have **weights** (Quick=1pt, Focused=3pt, Deep=6pt) and each block has a **capacity of 12 points**. When a block overflows, tasks are automatically transferred to the next available slot.

### ✨ Features

- **🕐 Dynamic Time Blocks** — Morning/Afternoon/Evening/Night calculated from your schedule
- **⚖️ Task Weights** — Quick (1pt), Focused (3pt), Deep (6pt) with smart suggestions
- **🔄 Automatic Task Transfer** — Overflow routing to next available slot
- **🎤 Voice Control** — Add/manage tasks via Web Speech API (EN/RU/ES)
- **🌙 Recovery Mode** — Neural recovery days with tips
- **⏰ Fade-in Alarm** — Gentle wake-up with ambient sounds
- **🌍 Multilingual** — English, Russian, Spanish
- **💾 Client-side** — All data stored in localStorage

## 🚀 Run Locally

**Prerequisites:** Node.js 18+

```bash
# 1. Install dependencies
npm install

# 2. Run the app
npm run dev

# 3. Open http://localhost:5173
```

## 📦 Build

```bash
npm run build    # Production build in dist/
npm run preview  # Preview production build
```

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Frontend | React 19 + TypeScript |
| Build | Vite 6 |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| Voice | Web Speech API (STT + TTS) |
| Storage | localStorage |
| AI (planned) | Anthropic API via backend proxy |

## 📁 Project Structure

```
├── App.tsx                     # Main app: state, voice handlers, CRUD
├── types.ts                    # Core types (Task, TimePeriod, etc.)
├── constants.tsx               # Translations, voice translations, weights
├── design-tokens.ts            # Design system (colors, typography, spacing)
├── services/
│   ├── taskOptimizer.ts        # Weight suggestion, capacity routing
│   └── voice/
│       ├── VoiceControlService.ts   # Web Speech API wrapper
│       ├── VoiceCommandProcessor.ts # Regex command parsing
│       └── commands/           # Command patterns (Task, Navigation, Update)
├── components/
│   ├── views/                  # DayView, WeekView, MonthView, YearView
│   ├── modals/                 # SettingsModal, AlarmModal
│   ├── blocks/                 # FocusPoint, TimeBlock, RecoveryBanner
│   ├── voice/                  # VoiceFeedback, VoiceControlButton
│   └── common/                 # DateNavigator, ViewSwitcher
└── CLAUDE.md                   # Project context for AI assistants
```

## 🧪 Testing

See [TEST_PLAN.md](TEST_PLAN.md) for detailed test scenarios.

```bash
# Current voice module status:
# ✅ TTS loop fix, Spanish, localization, noise filter
# ⚠️ Confidence fallback (0.64 after multiplier)
# ❌ Update commands not working
# 🔴 4 known bugs (see CLAUDE.md)
```

## 📝 Documentation

- [CLAUDE.md](CLAUDE.md) — Project context & architecture for AI assistants
- [TEST_PLAN.md](TEST_PLAN.md) — Test scenarios & bug tracking
- [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) — Design system documentation
- [COMPETITIVE_ANALYSIS.txt](COMPETITIVE_ANALYSIS.txt) — Market analysis

## 🗺️ Roadmap

### Voice Module (Current Priority)
- [ ] Fix Bug #1: Sleep gap warning visibility
- [ ] Fix Bug #2: Language switch without reload
- [ ] Fix Bug #3: Double quote in notifications
- [ ] Fix Bug #4: Voice confidence multiplier
- [ ] Fix Bug #5: Update commands not working

### AI Integration (Planned)
- [ ] `/api/ai.ts` Vercel Edge Function proxy
- [ ] `suggestWeightAI()` with fallback
- [ ] `parseVoiceCommandAI()` with fallback
- [ ] `getDailyBrief()` — AI daily analysis

### Future Features
- [ ] Idea Bank (voice-captured ideas → tasks)
- [ ] SMART Goal System with personalized motivations
- [ ] PWA support with voice widget

---

Built with React, TypeScript, and circadian science 🌙
