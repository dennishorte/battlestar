# Game Log Styling Guide

## Architecture

The game log has a layered rendering architecture:

1. **`GameLog.vue`** (common) — Base component that renders log lines. Each line is a `.log-line` div with scoped styles (`display: flex`, `padding-left: 1em`, `width: 100%`).
2. **`GameLogText.vue`** (common) — Renders the text content of each line. Wraps content in a `<div style="display:inline-block">`.
3. **`GameLogAgricola.vue`** — Game-specific wrapper that provides `lineClasses`, `lineStyles`, and `chatColors` callbacks via a `funcs` prop.

## How classes and styles are applied

The `.log-line` div receives classes from two sources (see `GameLog.vue` line 11):

```html
<div class="log-line" :class="[line.classes, classes(line)]">
```

- `line.classes` — classes stored on the log entry data itself (set in `BaseLogManager`)
- `classes(line)` — dynamically computed by `lineClasses()` callback from `GameLogAgricola`

The `lineStyles()` callback is applied to the inner `<GameLogText>` component, NOT the `.log-line` div:

```html
<GameLogText :text="line.text" :style="styles(line)" />
```

This distinction is critical for understanding what styles go where.

## Specificity pitfalls

### Scoped style specificity

`GameLog.vue` has scoped styles on `.log-line`. Vue's scoped styles compile to attribute selectors like `.log-line[data-v-abc123]`, giving them specificity `(0, 2, 0)`.

`GameLogAgricola.vue` uses `#gamelog :deep(.some-class)` which compiles to `#gamelog[data-v-xyz789] .some-class`, giving specificity `(1, 1, 1)`. Despite the id selector, this targets the `.log-line` element which does NOT carry GameLogAgricola's scope attribute — only GameLog's. In practice, `:deep()` styles from the parent are unreliable for overriding scoped styles in the child component on the same element.

**Key rule: `:deep()` scoped CSS from a parent cannot reliably override scoped CSS in a child component.** Properties that aren't set by the child's scoped styles will work fine. Properties that conflict (like `padding`, `margin`) will lose.

### What works via `:deep()` CSS (on `.log-line`)

Properties NOT set by GameLog's `.log-line` scoped styles:
- `background-color`
- `color`
- `font-weight`
- `text-align`
- `border-radius`

### What does NOT work via `:deep()` CSS (on `.log-line`)

Properties that conflict with GameLog's `.log-line` scoped styles:
- `padding` (conflicts with `padding-left: 1em`)
- `margin` (conflicts with `margin-top: 1px`)

### The `lineStyles()` escape hatch

The `lineStyles()` callback applies styles directly to `<GameLogText>` via Vue's `:style` binding, which produces inline styles. Inline styles have the highest specificity and bypass all scoped style conflicts.

**Use `lineStyles()` for properties that need to override the base `.log-line` styles** — particularly `padding` and `margin`. This is why the player-turn padding/margin/border-radius are set in `lineStyles()` rather than in the scoped CSS.

### Centering text

`text-align: center` on `.log-line` doesn't visually center text because `GameLogText` renders a `<div style="display:inline-block">` that shrinks to content width. Two workarounds:

1. Add `display: flex; justify-content: center` on the `.log-line` class (e.g. `.round-header`)
2. Override the child div: `.round-header > div { display: block }`

Both are needed together for reliable centering.

## Summary of styling strategies by line type

| Line type | Background | Applied via | Padding/margin | Applied via |
|-----------|-----------|-------------|----------------|-------------|
| `.round-header` | `:deep()` CSS | scoped style | works (no conflict) | scoped style |
| `.work-phase` | `:deep()` CSS | scoped style | works (no conflict) | scoped style |
| `.player-turn` | dynamic color | `lineStyles()` | negative margin trick | `lineStyles()` |
| `.player-action` | static beige | `:deep()` CSS | negative margin trick | `:deep()` CSS* |
| `.harvest-phase` | static gold | `:deep()` CSS | works (no conflict) | scoped style |

*`.player-action` margin/padding override works because the second `padding` declaration in the same rule block overrides the first, and `margin: 0 -.5em` doesn't conflict with the base `margin-top: 1px` on the horizontal axis.
