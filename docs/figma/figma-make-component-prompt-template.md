# Component Spec Prompt Template — Figma Make

Use this template for each new component. Replace [BRACKETS] with actual values.

---

## COMPONENT PROMPT (copy and fill in)

---

Generate a complete component specification for **[COMPONENT NAME]** in the Flow Calendar design system.

The Figma component is attached. Use the system prompt context (tokens.css, CLAUDE.md, ai-manifesto.md, ui-react-aria-flow.md, ui-layout-flow.md) as the source of truth for all rules.

---

### Component context

**What this component does:**
[1-2 sentences. Example: "TaskIndicator is a physics bubble in Day View that encodes task weight (size + color) and priority (shape) simultaneously."]

**Where it lives in the app:**
[Example: "Inside Matter.js physics layer within TimeBlock, also used as weight-dot in TaskItem rows."]

**Container level (from ui-layout-flow.md hierarchy):**
[ ] Page Container
[ ] Section Container
[ ] Physical Layer (Matter.js)
[ ] Card / Pane
[x] Control Group
[ ] Inline Slot

**Related components:**
[Example: "TaskIndicator uses colors from the same token set as TimeBlock. Appears inside BubbleBlock."]

---

### Figma variants to map

List the Figma variants/properties visible in the attached component and what they should map to in code:

| Figma property | Figma values | Code prop name | Code type |
|---|---|---|---|
| [property1] | [value1, value2] | [propName] | [TypeScript type] |
| [property2] | [value1, value2, value3] | [propName] | [TypeScript type] |

Example:
| Figma property | Figma values | Code prop name | Code type |
|---|---|---|---|
| Weight | Quick, Focused, Deep | weight | TaskWeight (from @/types) |
| Priority | Low, Medium, High | priority | Priority (from @/types) |
| State | Default, Hover, Pressed, Disabled | — | handled via react-aria |

---

### Special rules for this component

[List any Flow-specific rules that apply. Examples below — delete what doesn't apply, add what does.]

- [ ] Uses Flow weight colors (`--flow-weight-*`) — NOT M3 system colors
- [ ] Uses Flow block colors (`--flow-block-*`) — NOT M3 system colors
- [ ] Contains Matter.js physics — disable in Recovery Mode and prefers-reduced-motion
- [ ] Uses `activePeriodId` from App.tsx for smart default selection
- [ ] Night period excluded (no tasks in Night block)
- [ ] Left-handed mode affects positioning
- [ ] User-selectable content (icon, text) — document fallback/default
- [ ] Participates in capacity system (pts) — document overflow behavior
- [x] Other: [describe]

---

### Known issues or decisions already made

[List anything resolved before spec generation. This prevents Figma Make from re-opening closed questions.]

Example:
- High priority shape: 12-sided cookie with soft concave edges. NO sharp corners (violates Flow philosophy).
- Loading state: one-time fade-in only. NO cyclic pulsing (violates ai-manifesto.md).
- Spring animations: replaced with ease-m3-decelerate throughout.

---

### Output format

Generate the spec in Markdown.
Follow the section order from the system prompt exactly:
Purpose → Usage → Anatomy → Layout → Variants → States → Tokens → Motion → Interaction → Accessibility → Mapping to Code → Open Questions.

For the Tokens section: always include a table with columns:
`Element | CSS Variable | Light (reference) | Dark (reference)`

For the Mapping to Code section: always include:
- File path: `src/components/[folder]/[ComponentName].tsx`
- Full TypeScript props interface
- List of react-aria hooks used
- List of imports from `@/types`

Flag any Figma value that cannot be mapped to an existing `tokens.css` variable with ⚠️.

---

## END OF COMPONENT PROMPT

---

## quick VERSION (for simple components)

If the component is simple (few variants, no physics, no smart logic), use this shorter version:

---

Generate a component spec for **[COMPONENT NAME]** in Flow Calendar.

Figma component attached.

Rules:
- All colors → CSS variables from tokens.css (no hex)
- All motion → token variables (no hardcoded cubic-bezier or ms)
- Types → import from @/types (no local redefinition)
- Icons → lucide-react only
- Interactivity → useButton + useFocusRing from react-aria
- Reserve min-height for all dynamic content (no layout shift)
- Include EN/RU/ES for all user-visible strings and ARIA labels
- Dark theme: one line only ("switches via .dark class")
- Flag anything not in tokens.css with ⚠️

This component: [one sentence description].
Figma variants: [list them].
Special notes: [anything unusual or already decided].

---

## EXAMPLE: filled prompt for TaskIndicator

Generate a complete component specification for **TaskIndicator** in the Flow Calendar design system.

The Figma component is attached. Use the system prompt context as source of truth.

**What this component does:**
Physics bubble in Day View that simultaneously encodes task weight (size + color) and priority (shape). No text — visual encoding only.

**Where it lives:**
Matter.js physics layer inside TimeBlock (Day View). Also used as weight-dot in TaskItem list rows.

**Container level:** Physical Layer (Matter.js) / Inline Slot

**Related components:** TimeBlock, TaskItem, BubbleBlock

### Figma variants to map

| Figma property | Figma values | Code prop name | Code type |
|---|---|---|---|
| Type | Quick, Focused, Deep | weight | TaskWeight (from @/types) |
| property1 | Low, Medium, High | priority | Priority (from @/types) |
| State | Default, Hover, Pressed, Disabled | — | react-aria states |

### Special rules

- Uses Flow weight colors (`--flow-weight-*`) — NOT M3 system colors
- Contains Matter.js physics — disable in Recovery Mode and prefers-reduced-motion
- User-selectable icon from lucide-react — document fallback (Circle)
- Three independent visual channels: size + color + shape (WCAG 1.4.1)

### Known decisions

- High priority shape: 12-sided cookie, soft concave edges, NO sharp corners
- Icon: user-selectable from lucide-react, auto-suggested by title text, editable via separate IconPickerSheet (not this component)
- Loading: no skeleton, no pulsing — one-time fade-in only
- Spring animations: not used anywhere in Flow
