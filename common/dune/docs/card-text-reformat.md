# Card Text Reformatting Plan

## Goal
Reformat card/leader ability text for human readability — newlines, bullet points, structured layout — so the UI modal can display them clearly.

## Formatting Conventions
- `\n` for line breaks
- `· ` prefix for bullet points
- Ability name on first line (before colon), body on subsequent lines
- Conditional lists as bullets

## Card Types (in order)

### 1. Leaders (`res/leaders/index.js`)
- Fields: `leaderAbility`, `signetRingAbility`, `startingEffect`
- Risk: LOW — abilities are mostly display-only or have custom handlers in `leaders.js` and `leaderAbilities.js`. Not parsed by `parseAgentAbility`.
- Render: modal in `DuneOptionChip.vue` needs to respect `\n` in text

### 2. Starter Cards (`res/cards/starter.js`)
- Fields: `agentAbility`, `revealAbility`
- Risk: MEDIUM — agentAbility text IS parsed by `parseAgentAbility`. Reformatting may break the parser.
- Strategy: reformat, run tests, fix parser or add implementations for broken cards

### 3. Imperium Cards (`res/cards/imperium.js`)
- Fields: `agentAbility`, `revealAbility`, `passiveAbility`, `acquisitionBonus`
- Risk: MEDIUM-HIGH — ~50%+ rely on parser for agentAbility/revealAbility
- Strategy: same as starter — reformat, test, fix

### 4. Intrigue Cards (`res/cards/intrigue.js`)
- Fields: `plotEffect`, `combatEffect`, `endgameEffect`
- Risk: MEDIUM — parsed for plot/combat execution

### 5. Reserve Cards (`res/cards/reserve.js`)
- Small set, low risk

### 6. Contract Cards, Tech Cards, etc.
- Smaller sets, variable risk

## Parser Strategy
After reformatting leaders (safe) and starter cards (first test), we'll know whether:
- **Option A**: Parser can be updated to normalize text (strip `\n`, `· `) before parsing — one fix covers all cards
- **Option B**: Parser breaks badly — cards need explicit implementations in `cardImplementations.js`

Option A is strongly preferred. If `parseAgentAbility` normalizes input first, all existing patterns continue to work.

## Renderer Changes
- `DuneOptionChip.vue` modal: render `\n` as `<br>` or separate `<div>`s
- `DuneCard.vue` effect text: same treatment
- `GameLogDune.vue`: ability text in log entries should also respect line breaks

## Progress Tracker
- [ ] Leaders — reformat text, update renderer
- [ ] Starter cards — reformat, test parser impact
- [ ] Decide parser strategy based on starter results
- [ ] Imperium cards
- [ ] Intrigue cards
- [ ] Reserve / contract / tech cards
