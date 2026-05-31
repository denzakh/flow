# Flow App: Design & Code Constitution

## 1. System Authority
- Reference @Material Design 3 (https://m3.material.io) for all visual logic.
- Reference React Aria (https://react-spectrum.adobe.com/react-aria/) for accessible component implementation.
- If a design token exists in `tokens.css` or `design-tokens.ts`, use it. Never use hardcoded HEX or pixel values.

## 2. Visual Standards (Strict M3)
- **Grid:** 4px baseline grid. All padding and margins must be multiples of 4.
- **Elevation:** Only levels 0–5. Use surface tints instead of heavy shadows where possible.
- **Shapes:** Tasks/Cards = Medium (12px), Buttons = Full, Dialogs = Large (28px).
- **Typography:** Strict mapping to M3 typescale (Display, Headline, Title, Body, Label).
- **State layers:** Every interactive element MUST have enabled / hovered / focused / pressed / disabled states via M3 translucency overlays.

## 3. Empathy & Accessibility (The "Respect" Principle)
- All interactive targets must be ≥ 48×48px.
- Use semantic HTML. Accessibility is not an afterthought — it's the core.
- Color contrast must pass WCAG AA minimum; AAA where possible.
- Never use color as the ONLY differentiator — always pair with shape, size, icon, or label.
- prefers-reduced-motion → disable physics, all bubble shapes become circles with simple fade-in.
- prefers-contrast: more → increase bubble opacity to 1.0, add 1px border same hue darker.
- forced-colors (Windows High Contrast) → shape and size become the ONLY differentiators — preserve them.
- Visual notifications setting → replaces all sound feedback with screen flash + persistent indicator (for deaf/HoH users).

## 4. Interaction States
- Every interactive component MUST have: `enabled`, `hovered`, `focused`, `pressed`, `disabled`.
- Use M3 State Layers (translucency overlays) — do not change opacity of the whole component.
- Focus indicators: 3px solid, contrast ≥ 3:1 against adjacent colors.

## 5. Development Rituals
- Functional React components with TypeScript interfaces only.
- Component structure: Atom → Molecule → Organism.
- No hardcoded HEX values in component files — always reference a CSS variable.
- Import order: tokens.css → motion.css → index.css.
- Tailwind for spacing/layout. CSS variables for dynamic/theme-aware values.
- Do NOT add new npm packages without explicit approval.
- Do NOT change TypeScript logic, state management, voice module, or task optimizer — style changes only unless explicitly asked.

## 6. Flow Visual Language — Bubble System
Bubbles encode task information through THREE independent visual channels:
- **SIZE** → weight: Quick = small (r:14), Focused = medium (r:21), Deep = large (r:30)
- **COLOR** → weight: Quick = mint #CCFCE3, Focused = lemon #FEF3C7, Deep = rose #FCE4F5
- **SHAPE** → priority:
  - Low = Circle (soft, rolls smoothly)
  - Medium = Rounded rhomb / Clover4 (tips on corner)
  - High = Burst / Star (sharp, bounces unpredictably)

Shapes are implemented via SVG clipPath + Matter.js Bodies.fromVertices().
Physics behavior is part of the semantic — High priority literally behaves more urgently.

## 7. Custom Components — DO NOT apply M3 rules here
These components are Flow-specific and intentionally deviate from M3:
- **DayView 4-quadrant grid** — custom layout, no M3 equivalent
- **BubbleBlock with Matter.js physics** — custom visual language
- **Capacity visualization via bubbles** — not a M3 progress indicator
- **VoiceFAB pulse animation** — extends M3 FAB with custom listening state
- **Shape-based priority system** — inspired by M3 MaterialShapes, implemented web-native
- **Idea Bank messenger UI** — custom chat-like pattern

## 8. Tone & Copy Principles
- Always supportive, never judgmental.
- Overload signals: amber (care), never red (error).
- Empty states: warm invitation, not emptiness.
- Recovery/burnout: offer reset gently — "heavy week" not "you failed".
- All smart hints and suggestions are optional — user can disable in Settings.

## 9. M3 Component Specifications

### Navigation Bar (Bottom)
- Exactly 3–5 destinations — never fewer, never more
- Active indicator: 64×32px pill shape on icon only — NOT full width highlight
- Icon size: 24×24px; label: Label Medium
- Badge: top-right of icon, number or dot only
- Do NOT invent custom active states — use M3 indicator exactly

### FAB (Floating Action Button)
- Regular FAB: 56×56px, corner large (16px radius)
- Small FAB: 40×40px
- Large FAB: 96×96px
- Extended FAB: height 56px, min-width 80px, icon LEFT of label, gap 8px
- Container color: ALWAYS primaryContainer — NOT primary
- Icon color: ALWAYS onPrimaryContainer
- ONE FAB per screen maximum
- Position: bottom-right OR bottom-center — never top, never left

### Bottom Sheet
- Modal sheet: always has scrim (rgba(0,0,0,0.32)) behind it
- Handle: 32×4px pill, centered at top, color onSurfaceVariant at 40% opacity
- Top corners: extraLarge (28px) ONLY — never full radius, never square
- Header: 48px tall, title is Title Large
- Do NOT add a close button — drag handle or scrim tap closes it
- Content padding: 16px horizontal

### List Items
- Min height: 1-line = 56px / 2-line = 72px / 3-line = 88px
- Leading element: 40×40px avatar OR 24×24px icon — never both
- Trailing element: icon OR text OR checkbox — never combined
- Padding: 16px horizontal; content vertically centered
- Dividers: optional; use outline-variant color
- Interactive: full row is tappable, state layer covers entire row

### Text Fields
- Two variants ONLY: Filled and Outlined — never custom shapes
- Filled: background surfaceVariant, indicator line bottom only (default) → active on focus
- Outlined: full border in outline color, transparent background
- Label: always floating — never placeholder-only pattern
- Height: 56px always
- Leading icon: 24px, padding-left 12px
- Trailing icon: 24px, padding-right 12px
- Error: error color on border + label + supporting text + trailing icon simultaneously
- Supporting text: body-small, 16px below field
- Character count: trailing inside supporting text row

### Chips (4 types — do not confuse with badges)
- Assist chip: suggests an action, no selection state
- Filter chip: toggleable, shows checkmark when selected
- Input chip: represents entered value, has × to remove
- Suggestion chip: system/AI-generated hint, not user-created
- Height: always 32px
- Shape: full radius (9999px)
- Leading icon: 18px only
- Never use chip where badge is needed and vice versa

### Dialogs
- Shape: extraLarge (28px corners)
- Max width: 560px; min width: 280px
- Title: Headline Small
- Body: Body Medium
- Actions: right-aligned text buttons (or filled + text for emphasis)
- Max 2 action buttons
- Do NOT use dialog for simple confirmations — use Snackbar instead

### Snackbar
- Max 1 action button (Label Large, primary color)
- Auto-dismiss: 4 seconds default
- Position: bottom-center, 16px from edge
- Do NOT stack snackbars — queue them
- Use for: task added, task moved, errors, undo

### Elevation — Dark Theme (CRITICAL — agents always get this wrong)
- In dark mode shadows are barely visible — compensate with surface tint overlay
- Surface tint = primary color at specific opacity over surface:
  - Level 0: 0% tint (no overlay)
  - Level 1: 5% tint
  - Level 2: 8% tint
  - Level 3: 11% tint
  - Level 4: 12% tint
  - Level 5: 14% tint
- Implementation: color-mix(in srgb, var(--md-sys-color-surface), var(--md-sys-color-primary) 5%)
- Do NOT rely on box-shadow alone in dark mode — it barely shows

### Motion Easing (NEVER use linear or ease-in-out — not M3)
- Element entering screen → Emphasized Decelerate: cubic-bezier(0.05, 0.7, 0.1, 1.0)
- Element leaving screen → Emphasized Accelerate: cubic-bezier(0.3, 0, 0.8, 0.15)
- Element staying on screen → Standard: cubic-bezier(0.2, 0, 0, 1.0)
- Container expand/collapse → Emphasized: cubic-bezier(0.2, 0, 0, 1.0)
- Duration: entering = 400ms / leaving = 200ms / transitions = 300ms

### Icons
- Always 24×24px in components (18px inside chips only)
- Use outlined style by default; filled style for active/selected state
- Do NOT mix outlined and filled icons in the same component
- Touch target: always wrap in 48×48px tappable area

### Spacing & Layout
- Base unit: 4px — all spacing must be multiples of 4
- Screen edge margin: 16px (compact) / 24px (medium) / 24px+ (expanded)
- Component internal padding: multiples of 4 only
- Gap between components: 8px, 12px, 16px, 24px — nothing else

## 10. M3 Advanced — Color, Motion, Expressive Components

### Dynamic Color & Tonal Palettes
- ALL colors must come from M3 Color Roles — never arbitrary hex values in components
- Roles to use: Primary, OnPrimary, PrimaryContainer, OnPrimaryContainer,
  Secondary, OnSecondary, SecondaryContainer, OnSecondaryContainer,
  Tertiary, OnTertiary, TertiaryContainer, OnTertiaryContainer,
  Surface, OnSurface, SurfaceVariant, OnSurfaceVariant,
  Outline, OutlineVariant, Background, OnBackground
- Bubble colors (weight) and block colors (time period) must map to these roles explicitly
- Tonal palettes: always use all 5 (Primary, Secondary, Tertiary + 2 Neutral)
  to ensure proper contrast across all combinations
- Dynamic Color (future): support DynamicColors API to extract scheme from user wallpaper
  — do not hardcode scheme, keep it injectable via CSS custom properties

### Motion — Spring Parameters
Separate Spatial motion (bubbles moving in space) from Effects (opacity, color transitions):

**Spatial — Matter.js physics bubbles:**
- These follow Matter.js physics engine, not CSS springs
- On collision/bounce: apply squash & stretch via SVG transform (already implemented)
- Drift force: small random impulse every ~30 frames to keep bubbles alive

**Effects — CSS/JS transitions for UI state changes:**
- Fast spring (buttons, chips, badges):
  stiffness: 700, damping: 35 → approx cubic-bezier(0.2, 0, 0, 1.0) 150ms
- Default spring (bottom sheets, panels sliding in):
  stiffness: 380, damping: 30 → approx cubic-bezier(0.05, 0.7, 0.1, 1.0) 300ms
- Slow spring (full-screen transitions, day view expand):
  stiffness: 200, damping: 25 → approx cubic-bezier(0.2, 0, 0, 1.0) 500ms
- Bubble → task list transition: Effects spring (opacity fade) + Spatial (scale collapse)
  duration 400ms, Emphasized Decelerate easing

### M3 Expressive Components
Use these where applicable — do not substitute with plain buttons/rows:

- **Button Groups** — for weight picker (Quick/Focused/Deep) in TaskSheet:
  buttons visually connected, selected state uses filled style,
  unselected uses outlined or tonal — they form a single control unit
- **Split Button** — for actions with variants (e.g. "Add task ▾" with sub-options)
  only if action has 2+ meaningful variants; do not overuse
- **Toolbar** — for block header area (block name + capacity + add button):
  flexible container that can hold FAB-style button + metadata, not just a plain row

### Containment Principle
- Day View quadrants must have CLEAR visual boundaries — not just color fill
  Users find elements 4× faster with explicit containment
- Use contrasting containers to group related elements:
  block header (name + time + capacity) visually separated from bubble area
- Nested containers for critical actions:
  VoiceFAB must have high-contrast container — stands out from any background
  Consider outline or shadow ring around FAB for maximum visibility

### Elevated Accessibility Standards
- Tap targets: MINIMUM 48×48px everywhere — consider 56×56px for primary actions
- VoiceFAB: 60×60px minimum — it is the most important interaction in the app
- Nested high-contrast containers for critical actions (VoiceFAB, primary CTA buttons)
- Do not rely solely on color for any state — always add shape, icon, or label change
- Error states: never red-only — add icon (error_outline) + supporting text
- Loading states: use M3 LinearProgressIndicator or CircularProgressIndicator,
  never custom spinners