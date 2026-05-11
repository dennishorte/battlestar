# Engine Improvements Roadmap

Distilled from the Dune Imperium: Uprising build (Mar 28 – May 11, ~65 commits). Each item below maps to a recurring failure mode and proposes an engine or process change that would have eliminated or contained it. Sequenced for incremental rollout — pure additions first, schema changes later, infrastructure last.

Companion analysis: see commit-history retrospective in chat; the lessons summarized inline here.

---

## At a glance

| # | Item | Type | Risk | Dependencies | Approx. effort |
|---|------|------|------|--------------|----------------|
| 1 | ESLint rule: tests cannot import internal modules | Config | Low | — | ~½ day |
| 2 | `BaseCardManager` source indexing + `loadFromDirectory` | Engine (additive) | Low | — | 1–2 days |
| 3 | `BasePlayer.incrementCounter` source attribution + history | Engine (additive) | Low | — | 1 day + per-game migration |
| 4 | Structured `choose()` options (`{id, label, kind}`) | Engine (additive) | Medium | — | 2 days + per-game migration |
| 5 | `actions.privateChoice()` primitive | Engine (additive) | Low | — | 1 day |
| 6 | `BaseCard.hooks` + `LIFECYCLE_EVENTS` registry | Engine (schema) | High | 4 (so handlers can emit structured prompts uniformly) | 3–5 days + per-game migration |
| 7 | Scope-explicit state (`transient/turn/round/persistent`) | Engine (schema) | High | — | 2–3 days + per-game migration |
| 8 | `BaseTestUtil` with schema-validated `setBoard/testBoard` | Engine (infrastructure) | High | 6, 7 (state shape must be canonical) | 4–6 days + per-game migration |
| P1 | Process: audit-by-card budget | Doc | — | — | — |
| P2 | Process: multi-valued data discipline | Doc | — | — | — |
| P3 | Process: card body text is UI-only | Doc | — | — | — |

Total engine work: ~3 weeks of focused effort, plus migration cost paid per game.

---

## Sequencing rationale

**Phase 1 — Independent additive primitives.** Items 1–5 can land in any order and don't break existing games. They unlock the largest immediate quality-of-life wins for the next game build.

**Phase 2 — Schema changes.** Items 6 and 7 redefine where state lives and how cards opt in to lifecycle events. Each migration is per-game work but mechanical. Do these before any new game starts.

**Phase 3 — Testing infrastructure.** Item 8 only pays off once the canonical state shape from #7 is stable. Migrating each game's `testutil.js` is the largest single migration, but every subsequent test benefits.

**Migration ordering across games.** Adopt in this order, validating each: Dune (most recent, easiest to verify) → Tyrants (smallest) → Twilight → Ultimate → Agricola (largest). Hold off on Magic until its scope is clearer.

---

## 1. ESLint rule: tests cannot import internal game modules

**Problem.** `e8e44bea2` rewrote 18 Dune test files that had imported `systems/*`, `phases/*`, and called internal helpers (`resolveEffect`, `spySystem.*`, `parseRewardText`). The integration-only rule lives in `CLAUDE.md` and `docs/testing.md` but was unenforced.

### Current violation surface (audited 2026-05-11)

The original roadmap text claimed "most should already comply post-Dune; Twilight tests have a few known offenders." That is wrong — actual counts:

| Game | Files | Notes |
|---|---|---|
| Twilight | 6 | ~17 inline `getHandler`/handler requires inside `describe`/`it` blocks |
| Dune | 7 | 5 in `tests/`, 2 in `res/leaders/` |
| Agricola | 1 | inline `mixins/ActionChoicesMixin` require in `agricola.test.js:417` |
| Magic | 1 | `util/CardFilter.test.js` uses `fs`/`path` to read the MTG card DB |
| `common/lib/` | 8 | engine unit tests — must be exempted from the rule |

No game's production code requires refactoring. The work is test rewrites plus one optional Dune facade addition.

### Per-game structural notes

| Game | Has `systems/` | Has `phases/` | Test layout |
|---|---|---|---|
| Dune | yes | yes | `tests/` + co-located `res/cards/*.test.js`, `res/leaders/*.test.js` |
| Twilight | yes | no | `tests/` + `tests/factions/*.test.js` |
| Agricola | no | yes (tests live there but don't import from `phases/`) | top-level + co-located `res/`, `actions/`, `phases/`, `player/`, `util/` |
| Ultimate | no | no | top-level + co-located `res/` |
| Tyrants | no | no | top-level + co-located `res/cards/` |
| Magic | no | no | top-level + co-located `draft/`, `util/` |
| `lib/` | n/a | n/a | engine tests — exempt |

The deny patterns (`**/systems/**`, `**/phases/**`, `**/mixins/**`) only fire on Dune, Twilight, and one Agricola line — exactly where violations exist. Co-located card tests that import the card def they're testing (`require('./advanced-weaponry.js')`) are unaffected.

### Rule design (`common/eslint.config.js`)

Add a new flat-config block after the existing one:

```js
{
  files: ['**/*.test.js'],
  ignores: [
    'lib/**',                              // engine unit tests need internal access
    '**/testutil*.js',                     // testutil files are not test files anyway
    'dune/tests/cardEffects.test.js',      // pure parser unit test; pending P3 refactor
    'dune/tests/combat.test.js',           // pure parser unit test; pending P3 refactor
    'magic/util/CardFilter.test.js',       // pure utility test; loads card DB from disk
  ],
  rules: {
    'no-restricted-imports': ['error', {
      patterns: [
        {
          group: ['**/systems/**', '**/phases/**', '**/mixins/**'],
          message: 'Tests must drive the game via testutil + game.run()/choose()/action(). Do not import internal modules.',
        },
        {
          group: ['fs', 'fs/*', 'fs/promises', 'path'],
          message: 'Tests should not read source files. Use inline fixtures or expose a loader through testutil.',
        },
      ],
    }],
  },
}
```

Key choices:
- Patterns use `**/segment/**` (not `*/segment/*`) — minimatch's `*` matches a single path segment, so `*/systems/*` would miss `../../systems/factions/index.js`.
- `**/mixins/**` added to the deny list (not in original roadmap) — catches the lone Agricola violation and prevents future ones.
- `lib/game.js`, `lib/util.js`, `lib/selector.js` are framework public API and are deliberately not in the deny list. Tests already import them.
- Three carve-outs are pending follow-up:
  - **Dune parser tests** kept until card-text parsing is removed (roadmap P3 + item #6). Re-enable the rule on these files when those land.
  - **Magic CardFilter** is a pure utility unit test, not a game test. Conceptually outside this rule's scope.

### Per-game migration breakdown

#### Twilight (6 files, ~17 sites)

All violations are inline `require('../../systems/factions/...')` calls that grab a faction handler to either:
1. **Tautologically assert handler structure** (`expect(handler.onAnySystemActivated).toBeDefined()`) — *delete*. These check that a method exists by name; if the method disappears, the integration tests covering its behavior already fail.
2. **Call handler methods with synthesized mock contexts** (e.g., `vuil-raith-cabal.test.js:165–188` builds a fake `mockCtx` to invoke `handler.onUnitDestroyed`) — *rewrite as integration tests* driving real game state.

Sites per file: ghosts-of-creuss 3, council-keleres 3, l1z1x-mindnet 2, yssaril-tribes 2, mahact 1, vuil-raith-cabal 4. Start with mahact (single site) to validate the approach.

No Twilight game-code refactor required. `game.factionAbilities.handlerFor(player)` could be exposed for cleaner test code, but the structural-assert sites should be deleted regardless, so the win is small.

#### Dune (7 files)

| File | What it does | Migration |
|---|---|---|
| `tests/cardEffects.test.js` | unit-tests `parseAgentAbility` | **Carve-out** — keep until P3 refactor removes body-text parsing |
| `tests/combat.test.js` | unit-tests `parseRewardText` | **Carve-out** — same as above |
| `tests/spies.test.js` | calls `spySystem.hasSpyAt(game, ...)` etc. | Switch to `game.spies.hasSpyAt(player, loc)` facade |
| `tests/leaders.test.js` | calls `leaders.getLeader(game, player)` | Switch to `game.leaders.get(player)` facade |
| `tests/combatTies4p.test.js` | uses `fs` to read `phases/combat.js` source and string-match | **Delete the two source-grep tests outright** (they assert source substrings, not behavior). Keep the third test (real integration) |
| `res/leaders/LadyMargotFenring.test.js` | imports `systems/factions` to call `factions.gainInfluence(...)` in setup | Drive influence gain through `setBoard({ ... })` or an existing game action; remove the import |
| `res/leaders/PrincessIrulan.test.js` | same | same |

**Game refactor:** add `game.spies` and `game.leaders` facades to `Dune` (in the constructor). Bind to existing `systems/spies.js` and `systems/leaders.js` exports — no logic moves, just method dispatch.

```js
function Dune(serialized_data, viewerName) {
  Game.call(this, /* ... */)
  const spies = require('./systems/spies.js')
  const leaders = require('./systems/leaders.js')
  this.spies = {
    hasSpyAt: (player, loc) => spies.hasSpyAt(this, player, loc),
    connectedSpaces: (player) => spies.getSpyConnectedSpaces(this, player),
    placeSpyAt: (post, player) => spies.placeSpyAt(this, post, player),
    recallSpyAt: (post, player) => spies.recallSpyAt(this, post, player),
  }
  this.leaders = {
    get: (player) => leaders.getLeader(this, player),
  }
}
```

The systems are already lazy-required inside functions today (`dune.js:163`, `dune.js:205`) to avoid circular imports — keep `require` inside the constructor for the same reason.

#### Agricola (1 file)

`agricola.test.js:417` does `const { ActionChoicesMixin } = require('./mixins/ActionChoicesMixin.js')` and calls `ActionChoicesMixin.checkActionPrerequisites.call(game, dennis, action)`. Rewrite to assert the prerequisite check through actual game-action choice availability (`t.currentChoices(game)`), or expose `game.canPlayerTakeAction(player, action)` as a facade.

#### Magic (1 file)

`util/CardFilter.test.js` is exempted via the `ignores` list above. No code change.

### Implementation order

1. Add the rule to `common/eslint.config.js` with the carve-outs.
2. Run `npm run lint -w common` — confirm violation surface matches the table above.
3. Add `game.spies` and `game.leaders` facades to Dune.
4. Migrate `dune/tests/spies.test.js` and `dune/tests/leaders.test.js` to use the facades.
5. Delete the two source-grep tests in `dune/tests/combatTies4p.test.js`; keep the third.
6. Migrate the two Dune leader res tests to drop the `systems/factions` import.
7. Migrate the Agricola `mixins` violation.
8. Twilight: rewrite/delete handler-import sites in 6 files, starting with `mahact-gene-sorcerers.test.js`.
9. `npm run lint -w common` — clean.
10. `npm run test -w common` — clean per game (touch each game's test suite to confirm no regressions).

### Verification

- `npm run lint -w common` passes.
- `npm run test -w common` passes per game.
- Adding a deliberately broken `require('./systems/foo')` to any game test file fires the rule.

**Done when.** `npm run lint -w common` passes; the rule fires on a deliberately-broken test; the three carve-outs are documented above with their follow-up trigger.

---

## 2. `BaseCardManager` source indexing + `loadFromDirectory`

**Problem.** Late additions in Dune: `0c9754c29` (gate cards on source selection), `118c1f84e` (`usePromo`), `7baa1f33a` (lobby toggle for base imperium), `06daadd20` (exclude Base-only cards). Each game reinvents the filter pipeline. Per-card file split (`9baa0c944`) had to manually wire each new file into the registry.

**Plan.**
1. Add to `BaseCardManager`:
   ```js
   loadFromDirectory(dirPath, { skip = /\.test\.js$/ } = {})
   // Returns: { [defId]: definition }
   // Walks dir, requires every .js file matching pattern,
   // validates each export against this.cardSchema (subclass-defined).
   ```
2. Add `getDefinitions({ sources, tags } = {})` to filter by `definition.source` and `definition.tags[]`.
3. Define `source` as a top-level required field on card definitions; games declare their valid source set via `static SOURCES = [...]`.
4. Settings-driven filtering lives in the game class, not the manager — the manager exposes `getDefinitions`, the game decides which sources to pull from `settings`.

**Migration.**
- Dune already has per-card files; convert its `cardLoader.js` (or equivalent) to `loadFromDirectory` in one PR.
- Ultimate, Twilight, Agricola: opt in only when they refactor to per-card files (likely deferred).
- Document the convention in `docs/new-game-guide/`.

**Done when.** Dune card loading goes through `BaseCardManager.loadFromDirectory`; adding a card file requires zero registry edits.

---

## 3. `BasePlayer.incrementCounter` source attribution + history

**Problem.** `0efda16d1` retrofitted source labels onto every VP-mutating call site in Dune late in the project. Every game eventually needs a "where did points/resources come from?" UI. Currently each game would solve it independently.

**Plan.**
1. Extend `BasePlayer.incrementCounter(name, count, opts)` so `opts.source` is canonical:
   ```js
   incrementCounter(name, count=1, opts={}) {
     // opts.source: { label: string, ref?: any }  -- recommended
     // opts.silent: existing
     this.counters[name] += count
     this.game.state.counterHistory ||= {}
     const history = this.game.state.counterHistory[this.id] ||= []
     history.push({
       counter: name,
       delta: count,
       total: this.counters[name],
       source: opts.source || null,
       round: this.game.state.round ?? null,
       turn: this.game.state.turn ?? null,
     })
     if (!opts.silent) { /* existing log */ }
   }
   ```
2. Apply the same treatment to `setCounter`.
3. Ship a generic Vue component `app/src/modules/games/common/CounterHistoryModal.vue` that renders `game.state.counterHistory[playerId][counter]` as a sortable table. Games wire it to whichever counter badge they expose.
4. Mark `opts.source` as recommended in docs, not required — but lint warn if missing in PR review.

**Migration.**
- Add the param (no-op default) — zero breaking change.
- Per-game adoption: each game updates its mutation sites with source labels over time. Game state is ephemeral (deterministic replay), so backfilling historical games is automatic on next load.

**Done when.** `BasePlayer` writes `counterHistory` for every mutation; Dune's bespoke `gainVp/loseVp` + `DuneVpBreakdownModal` are replaced by the shared infrastructure.

---

## 4. Structured `choose()` options

**Problem.** `274cbde3c` (today): bare-string option `"Duncan Idaho"` was ambiguous between an imperium card and a leader. `chooseCards` already emits `{title, id, defId, kind}` (good — fixed during Dune), but plain `choose` still takes raw strings, so any game-level prompt mixing cards with non-cards has to manually structure the payload. `637653484` and `3fa3853b4` had to bolt on chip-rendering for the same reason.

**Plan.**
1. Define the canonical option shape:
   ```js
   { id: string, label: string, kind?: 'card'|'leader'|'space'|'faction'|..., meta?: object }
   ```
2. `BaseActionManager.choose` accepts a mixed array; auto-wraps bare strings as `{ id: s, label: s }` for an allowlist (`Yes`, `No`, `Pass`, `Skip`, `Continue`, `Cancel`, digits).
3. Bare strings outside the allowlist emit a dev-only `console.warn` (gated on `process.env.NODE_ENV !== 'production'`). The UI fallback resolver in each game's main Vue component already exists; the warning surfaces the migration path.
4. `chooseYesNo`, `choosePlayer`, etc. internally route through the structured path.
5. The response selector (`common/lib/selector.js`) accepts both bare-string and `{id}` responses — selection equality matches on `id`.

**Migration.**
- Engine change is additive; existing games work unchanged.
- Per-game: grep for `actions.choose(.*[A-Z]` and convert ambiguous payloads to `{id, label, kind}`. Highest priority: Dune (already partly done), Twilight (component actions use strings), Ultimate (card-name strings everywhere).
- Each game's frontend `resolveOption` should prefer structured `id` over `label`.

**Done when.** Dune's per-game patch from `274cbde3c` (DuneGame.vue fallback resolver) is no longer special — it's the engine default. The dev-warning produces zero hits for migrated games.

---

## 5. `actions.privateChoice()` primitive

**Problem.** `a3dabdaf1`: prompting only when the player has a playable card leaks "I have nothing." Re-litigated 24 days later (`197c16b3c`) and once more (`31f50c0c8`). `dfe96fe43` is the same shape: Prescience reveal leaked to others.

**Plan.**
1. Add to `BaseActionManager`:
   ```js
   privateChoice(player, choices, opts) {
     // - Always emits a prompt, even if `choices` is empty (auto-injects a 'Pass' option).
     // - InputRequestEvent carries { private: true, actor: player.name }
     //   so the UI shows opponents "Waiting on <player>..." without the choice set.
     // - Log emits a structured 'private-choice' entry; opponents see "<player> made a private choice"
     //   while the actor sees the actual selection (or "passed").
   }
   ```
2. Selector validation rejects empty selections on private choices unless `Pass` is explicitly selected — prevents UI bugs from making a pass invisible.
3. Add to `BaseLogManager`: an opponent-visible "private decision" event type that hides args but shows actor + context.

**Migration.**
- Dune `combat.js` intrigue prompt → `privateChoice`.
- Twilight: action card play prompts → `privateChoice`.
- Magic: any "decline to respond" prompt → `privateChoice`.

**Done when.** No game ad-hoc-checks "does this player have a playable card?" before prompting in a hidden-info context.

---

## 6. `BaseCard.hooks` + `LIFECYCLE_EVENTS` registry

**Problem.** The single largest source of late-game refactors in Dune. Hooks added one card at a time: `onAcquire` (`bb96defb3`), `onTrash`/`onDiscard` (`6e44883dc`), `prePlacementEffect` (`cf13e480a`), leader hooks (multiple), `parsedAgentEffect`/`parsedRevealEffect`/`parsedCombatEffect`/`parsedPlotEffect`/`parsedEndgameEffect` (`2a40c0a5c`). Each addition required revisiting earlier cards.

**Plan.**
1. Define `LIFECYCLE_EVENTS` on `BaseCard` — the union set across games. Each event is a name + signature:
   ```js
   static LIFECYCLE_EVENTS = {
     onDraw:       { args: ['player'] },
     onAcquire:    { args: ['player', { to: 'hand'|'deck'|'discard' }] },
     onPlay:       { args: ['player'] },
     onReveal:     { args: ['player'] },
     onTrash:      { args: ['player'] },
     onDiscard:    { args: ['player'] },
     onRecall:     { args: ['player'] },
     onLeavePlay:  { args: ['player'] },
     onRoundStart: { args: [] },
     onRoundEnd:   { args: [] },
     onTurnStart:  { args: ['player'] },
     onTurnEnd:    { args: ['player'] },
     beforePlacement: { args: ['player', 'space'] },
     afterPlacement:  { args: ['player', 'space'] },
   }
   ```
   Games extend the set via `static LIFECYCLE_EVENTS = { ...BaseCard.LIFECYCLE_EVENTS, onSandwormSummon: { args: [...] } }` — not arbitrary strings.
2. Card definitions declare hooks as `{ hooks: { onTrash: (game, player) => {...} } }`. Validated at load time against the registry (unknown hook names = error).
3. Add `BaseCardManager.fire(eventName, card, ...args)` that calls `card.definition.hooks[eventName]?.(game, ...args)`. Sites that previously did `if (card.definition.onAcquire) card.definition.onAcquire(...)` ad-hoc become uniform.
4. Games fire events at the canonical points (draw, acquire, play, etc.) — refactor each game's mutation paths to route through fire().

**Migration.**
- Big lift. Per-game schema for hooks (which events exist, which sites fire them).
- Recommendation: implement on a new game first (Warhammer, when it starts), then backport to Dune (smallest existing surface), then Twilight/Ultimate/Agricola opportunistically.
- Existing per-game ad-hoc dispatch keeps working until the game opts in.

**Done when.** Dune's `cardEffects.js` (867 lines) shrinks substantially; new lifecycle events get added to the registry, not invented per-card.

---

## 7. Scope-explicit state buckets

**Problem.** `cf13e480a`: `persistentFlags` introduced specifically because turn-tracked state was getting clobbered at phase boundaries. `40feecc7f` had to wire reset logic for every turn modifier. The implicit hierarchy (per-action / per-turn / per-round / persistent) was rediscovered mid-project.

**Plan.**
1. Add to base `Game`:
   ```js
   game.state.transient   // cleared after every choose/action resolves
   game.state.turn        // cleared at end of turn
   game.state.round       // cleared at end of round
   game.state.persistent  // never auto-cleared
   ```
2. Engine handles the resets: a hook in `BasePlayerManager.advanceTurn` clears `state.turn`, a hook in the game's round-end clears `state.round`, post-input resolution clears `state.transient`.
3. Helper API:
   ```js
   game.turnState.set(player, key, value)
   game.turnState.get(player, key)
   game.roundState.flag(key)            // ephemeral booleans
   game.persistent.modifier(player, name, delta)  // for stacking modifiers
   ```
4. Direct writes to `game.state.turn.foo` still work — the helpers are sugar.

**Migration.**
- Each game's `roundStart.js`-equivalent currently has manual reset code (Dune: `playerTurns.js` resets `turnTracking`; Twilight: similar; Agricola: round phase clears). Migrate one game at a time, deleting bespoke reset code as the engine takes over.
- Inventory existing flags first: grep for `game.state.*Flags?` and `*Tracking` in each game.

**Done when.** No game has bespoke "reset turn flags" logic; phase-boundary state leaks become impossible by construction.

---

## 8. `BaseTestUtil` with schema-validated `setBoard`/`testBoard`

**Problem.** `bda3a33b0`, `2048590d0`, `c4402168b`, `e8e44bea2`, `e2e0ae89e` — testutil hardened in five separate commits, each adding support for a state key that should have been there from setup. Tests still fail silently when a state key is set but not read by the game (typos in keys = no-op).

**Plan.**
1. Add `common/lib/game/BaseTestUtil.js` with:
   ```js
   class BaseTestUtil {
     static STATE_SCHEMA = {}  // games override: { conflict: 'object', objectives: 'array', ... }
     fixture(opts) { /* canonical: build game with default players, settings */ }
     setBoard(spec) {
       this._validateSpecAgainstSchema(spec)  // unknown keys = throw
       this._applySpec(spec)
     }
     testBoard(expected) {
       this._diff(expected)  // detailed mismatch report
     }
     currentChoices() { /* parse latest InputRequest into option strings */ }
     choose(game, ...selections) { /* respond to current InputRequest */ }
     action(game, name, args) { /* respond to action prompt */ }
   }
   ```
2. Each game's existing `testutil.js` becomes a subclass declaring its `STATE_SCHEMA` (the inventory of supported keys + their types/setters).
3. Adding a new state key in a game requires adding it to the schema — surfaces "did I forget to wire X" gaps at boot.
4. `testBoard` defaults to "exhaustive equality" mode: any unspecified state must match the no-op default. Forces tests to declare everything they care about (already a documented convention; now enforced).

**Migration.**
- This is the biggest single lift because every test file calls into testutil.
- Sequence: define `BaseTestUtil`, port Dune's `testutil.js` as the first subclass (proves the API), then port the others.
- Per-game porting is mechanical: existing `setBoard` keys map to schema entries; existing implementation moves into subclass methods.

**Done when.** Every game's testutil subclasses `BaseTestUtil`; setting an unknown key in `setBoard` throws at the call site instead of silently no-op'ing.

---

## Process changes (documentation only)

### P1. Audit-by-card budget

Schedule explicit per-card audit passes after nominal 100% implementation. Treat the bug count as a project KPI, not a regression. Dune found 9 engine bugs in `cf13e480a` alone — these would be invisible without the audit.

**Action.** Add an "Audit phase" section to `docs/new-game-guide/`. State explicitly: budget ≥ 20% of total project time for audit, expect to find ≥ 5 engine bugs per ~50 cards audited.

### P2. Multi-valued data discipline

`fc9ec5c07` (dual-affiliation rendering): any property that could conceivably have two values someday — make it an array from the start. `card.faction` → `card.factions[]`. `space.icons` → `space.icons[]` (already array, good). Always-an-array beats sometimes-an-array.

**Action.** Add to `docs/new-game-guide/data-modeling.md`: rule of thumb + checklist of common offenders (faction membership, card type, icon set, target type, payout type).

### P3. Card body text is UI-only

Seven "Parser batch" commits + ongoing parser bugs prove this. The pivot to per-card function dispatch (`a1528998c`) was correct but happened mid-project.

**Action.** Add to `docs/new-game-guide/cards.md`: "Body text on card definitions is for UI rendering only. Effects must be either (a) structured data on the definition or (b) hook functions on the definition. Do not parse body text at runtime." Link this rule from item #6 above.

---

## Tracking

Track active work in the project TODO doc. As items land, update the "Done when" line and move them to a "Completed" section at the bottom of this file.

This doc itself should be revisited after the next game build — every recurring problem in the next game's history is a candidate addition.
