---
paths:
  - "apps/web/**/*.ts"
  - "apps/web/**/*.vue"
---

# Frontend Rules

## Vue 3 Options API
- Use Options API with `<script lang="ts">` and `defineComponent()`
- Structure: `components`, `props`, `emits`, `data()`, `computed`, `methods`, `watch`, lifecycle hooks
- Extract reusable logic into composables (`src/composables/use-*.ts`) when shared across components
- Use `PropType` for typed props

## Component Design
- One component per file, named with PascalCase
- Use `defineComponent()` with typed props via `PropType`
- Emit events for parent communication — never mutate props
- Use `v-model` for two-way binding on form inputs

## Styling
- Tailwind CSS utility classes only — no `<style>` blocks
- No custom CSS files, no inline `style` attributes
- Use Tailwind's responsive prefixes (`sm:`, `md:`, `lg:`)
- Dark mode support via `dark:` prefix where applicable

## Accessibility
- All interactive elements must be keyboard accessible
- Use semantic HTML (`<button>`, `<form>`, `<label>`, `<main>`)
- Add `aria-label` to icon-only buttons
- Form inputs must have associated `<label>` elements
