# Flow App: Design & Code Constitution

## 1. System Authority
- Reference @Material Design 3 for all visual logic and @[Твоя Библиотека] for implementation.
- If a design token exists in `theme.json`, use it. Never use hardcoded HEX or pixel values.

## 2. Visual Standards (Strict M3)
- **Grid:** Use a 4px baseline grid. Padding and margins must be multiples of 4.
- **Elevation:** Only levels 0-5. Use surface tints instead of heavy shadows where possible.
- **Shapes:** Tasks/Cards = Medium (12px), Buttons = Full, Dialogs = Large (28px).
- **Typography:** Strict mapping to M3 typescale (Display, Headline, Title, Body, Label).

## 3. Empathy & Accessibility (The "Respect" Principle)
- All interactive targets must be >= 48x48px.
- Use semantic HTML. Accessibility is not an afterthought; it's the core.
- Color contrast must pass WCAG AA. On-Primary must be on Primary, etc.

## 4. Interaction States
- Every interactive component MUST have: `enabled`, `hovered`, `focused`, `pressed`, `disabled`.
- Use M3 State Layers (translucency overlays) instead of just changing opacity.

## 5. Development Rituals
- Use functional React components with TypeScript interfaces.
- Component structure: Atom -> Molecule -> Organism.
- For every new component, generate a corresponding `.test.tsx` and a Storybook story.