# Engine Improvements Roadmap

Distilled from the Dune Imperium: Uprising build (Mar 28 – May 11, ~65 commits). Each item below maps to a recurring failure mode and proposes an engine or process change that would have eliminated or contained it. Sequenced for incremental rollout — pure additions first, schema changes later, infrastructure last.

Companion analysis: see commit-history retrospective in chat; the lessons summarized inline here.

---

## At a glance

| # | Item | Type | Risk | Dependencies | Approx. effort | Status |
|---|------|------|------|--------------|----------------|--------|
| 1 | ESLint rule: tests cannot import internal modules | Config | Low | — | ~½ day | — |
| 2 | `BaseCardManager` source indexing + `loadFromDirectory` | Engine (additive) | Low | — | 1–2 days | ✓ Completed 2026-05-11 |
| 3 | `BasePlayer.incrementCounter` source attribution + history | Engine (additive) | Low | — | 1 day + per-game migration | ✓ Completed 2026-05-11 (Dune migrated) |
| 4 | Structured `choose()` options (`{title, id, kind}`) | Engine (additive) | Medium | — | 2 days + per-game migration | ✓ Completed 2026-05-11 |
| 5 | `actions.privateChoice()` primitive | Engine (additive) | Low | — | 1 day | — |
| 6 | `BaseCard.hooks` + `LIFECYCLE_EVENTS` registry | Engine (schema) | High | 4 (so handlers can emit structured prompts uniformly) | 3–5 days + per-game migration | — |
| 7 | Scope-explicit state (`transient/turn/round/persistent`) | Engine (schema) | High | — | 2–3 days + per-game migration | — |
| 8 | `BaseTestUtil` with schema-validated `setBoard/testBoard` | Engine (infrastructure) | High | 6, 7 (state shape must be canonical) | 4–6 days + per-game migration | — |
| P1 | Process: audit-by-card budget | Doc | — | — | — | — |
| P2 | Process: multi-valued data discipline | Doc | — | — | — | — |
| P3 | Process: card body text is UI-only | Doc | — | — | — | — |

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

Codebase is CommonJS, so `no-restricted-imports` (which only catches ES `import` declarations) does nothing here. Use `no-restricted-syntax` with esquery selectors that match `require('...')` AST nodes instead.

```js
{
  files: ['**/*.test.js'],
  ignores: [
    'lib/**',                          // engine unit tests need internal access
    '**/testutil*.js',                 // testutil files are not test files anyway
    'dune/tests/cardEffects.test.js',  // pure parser unit test; pending P3 refactor
    'dune/tests/combat.test.js',       // pure parser unit test; pending P3 refactor
    'magic/util/CardFilter.test.js',   // pure utility test; loads card DB from disk
  ],
  rules: {
    'no-restricted-syntax': ['error',
      {
        selector: "CallExpression[callee.name='require'][arguments.0.value=/(\\/|^)(systems|phases|mixins)\\//]",
        message: 'Tests must drive the game via testutil + game.run()/choose()/action(). Do not require internal modules (systems/phases/mixins).',
      },
      {
        selector: "CallExpression[callee.name='require'][arguments.0.value=/^(fs|fs\\/.*|path)$/]",
        message: 'Tests should not read source files. Use inline fixtures or expose a loader through testutil.',
      },
    ],
  },
}
```

Key choices:
- Selectors fire on direct `require('...')` calls only. They don't catch `require.resolve(...)` (a `MemberExpression`, not `Identifier` callee) — currently unused in tests; revisit if it appears.
- The first pattern matches `(/|^)(systems|phases|mixins)/` against the require argument so it catches relative paths like `../../systems/foo` as well as bare ones.
- `**/mixins/**` (added to original roadmap deny list) catches the lone Agricola violation and prevents future ones.
- `lib/game.js`, `lib/util.js`, `lib/selector.js` are framework public API and remain importable.
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

### Current state (audited 2026-05-11)

Dune card definitions live under `common/dune/res/cards/` with two layout patterns:

| Pattern | Example | Subdir per source? | `index.js` size |
|---|---|---|---|
| **Source-subfolder** | `imperium/{base,bloodlines,immortality,promo,riseOfIx,uprising}/` | yes | 21–113 lines each (6 indexes) |
| **Flat with source field** | `intrigue/`, `conflict/`, `contracts/`, `tech/`, etc. | no — `source` distinguishes | 17–269 lines each (9 indexes) |

A total of **16 per-source / per-card-type `index.js` files** manually `require()` every card file and re-export the union as an array. Per-card files already carry `source` and `compatibility` as top-level fields (`source: "Uprising"`, `compatibility: "All"`). Each new card requires editing exactly one index file.

Filtering today (`common/dune/res/index.js`):
- `SOURCE_TO_SETTING = { 'Base': 'useBaseGameCards', ... }` maps source names to settings flags.
- `isSourceActive(source, settings)` returns `true` for `'Uprising'` always, otherwise checks the corresponding flag.
- `isIncluded(item, settings)` combines source-active with compatibility (`'All'` or `'Uprising'`).
- Per-card-type getters: `getImperiumCards(settings)`, `getIntrigueCards(settings)`, etc. — 10 of them, each calling `filterByCompatibility` (or, for imperium, a slightly different one-liner).
- Consumers: `systems/deckEngine.js` calls `getImperiumCards/getIntrigueCards/...`, `systems/leaders.js` calls `getLeaders`, `systems/choam.js` calls `getContractCards`.

No `cardLoader.js` exists — the original roadmap's reference to one is aspirational. Dune also has no `DuneCardManager.js`; it uses `BaseCardManager` directly (Magic and Ultimate are the only games with subclasses today).

### Engine changes

`BaseCardManager` today is a runtime *instance* registry, not a *definition* loader. The roadmap conflates the two; for this implementation, the loader helpers are static methods on `BaseCardManager` to keep card-related machinery in one place, but they don't read or write `this`.

```js
// common/lib/game/BaseCardManager.js

const fs = require('fs')
const path = require('path')

class BaseCardManager {
  // ... existing instance methods unchanged

  /**
   * Walk a directory, require every .js file that isn't a test or index,
   * and return their exports as an array. Mechanical replacement for the
   * hand-maintained per-card-type index.js files.
   *
   * opts.skip — RegExp matched against each filename. Default skips test files.
   * opts.requireSource — throw if any def is missing a `source` field. Default true.
   */
  static loadFromDirectory(dirPath, { skip = /\.test\.js$/, requireSource = true } = {}) {
    const defs = []
    for (const entry of fs.readdirSync(dirPath).sort()) {
      if (entry === 'index.js') continue
      if (!entry.endsWith('.js')) continue
      if (skip.test(entry)) continue
      const def = require(path.join(dirPath, entry))
      if (requireSource && !def.source) {
        throw new Error(`Card definition ${entry} is missing required 'source' field`)
      }
      defs.push(def)
    }
    return defs
  }

  /**
   * Filter a list of definitions by allowed source set and/or required tags.
   * Settings-driven filtering belongs in the game class; this is the pure
   * predicate.
   */
  static filterDefinitions(defs, { sources, tags } = {}) {
    return defs.filter(def => {
      if (sources && !sources.includes(def.source)) return false
      if (tags && !def.tags?.some(t => tags.includes(t))) return false
      return true
    })
  }
}
```

Design notes:
- **Static, not instance**: these operate on raw definitions before any game exists. Putting them on `this` would require constructing a CardManager just to load defs, which is backwards.
- **Sorted readdir**: makes the resulting array order deterministic across filesystems. Today's hand-written `index.js` files are author-ordered (no consistent rule); sorting alphabetically is the simplest stable convention.
- **`requireSource` defaults true**: enforces the roadmap's "source is a required top-level field" rule without a separate schema validator. If a game doesn't use sources (Tyrants?), it can opt out per call.
- **No `tags` field exists yet** in any game's card defs. Including it in `filterDefinitions` future-proofs the API but is unused on day one.
- **No `static SOURCES` requirement**: the roadmap suggested games declare their valid sources via a class static. Skipped — the game's settings-to-sources mapping already encodes the valid set implicitly; an explicit class static adds a synchronization point without enforcement value.

### Dune migration

**Per-card-type index files** (16 total). Replace hand-listed `require()`s with `loadFromDirectory(__dirname)`. Examples:

```js
// common/dune/res/cards/intrigue/index.js (was 269 lines)
'use strict'
const { BaseCardManager } = require('../../../../lib/game/BaseCardManager.js')
module.exports = BaseCardManager.loadFromDirectory(__dirname)
```

```js
// common/dune/res/cards/imperium/uprising/index.js (was 113 lines)
'use strict'
const { BaseCardManager } = require('../../../../../lib/game/BaseCardManager.js')
module.exports = BaseCardManager.loadFromDirectory(__dirname)
```

The aggregator `imperium/index.js` (which spreads the 6 source arrays) can stay as-is — each spread now points at a `loadFromDirectory`-backed file. Or it can collapse to a single `loadFromDirectory` walk plus per-subdir spread; either way the line count drops from ~12 to similar.

**Top-level filtering** (`res/index.js`). Replace `filterByCompatibility` with `BaseCardManager.filterDefinitions`, keeping the existing settings → sources translation:

```js
const { BaseCardManager } = require('../../lib/game/BaseCardManager.js')

const SOURCE_TO_SETTING = { /* unchanged */ }

function getActiveSources(settings) {
  return ['Uprising', ...Object.entries(SOURCE_TO_SETTING)
    .filter(([_, key]) => Boolean(settings[key]))
    .map(([source]) => source)]
}

function getCards(defs, settings) {
  // Compatibility is Dune-specific (Uprising vs. original Dune Imperium); keep it inline.
  const compatible = defs.filter(d => d.compatibility === 'All' || d.compatibility === 'Uprising')
  return BaseCardManager.filterDefinitions(compatible, { sources: getActiveSources(settings) })
}

module.exports = {
  // ...
  getImperiumCards: settings => getCards(cards.imperiumCards, settings),
  getIntrigueCards: settings => getCards(cards.intrigueCards, settings),
  // etc.
}
```

The 10 getter methods collapse to one-liners over a shared `getCards`. Compatibility check stays Dune-specific (it's an artifact of supporting both the Uprising and original Dune Imperium card pools).

**Files touched**: ~16 per-type index.js files (massive line reduction), `res/index.js` (minor refactor), `lib/game/BaseCardManager.js` (additions). No game-logic changes; all consumers continue calling the same `getImperiumCards(settings)` etc.

### Other games — deferred

| Game | Card def layout | Migration |
|---|---|---|
| Twilight | One-file-per-faction in `res/factions/`, plus shared `res/` data files | Defer — no per-card-file split yet |
| Ultimate | `res/{base,arti,figs,echo,unseen,echo2,figs2}/` per-card files | Could migrate, but the existing per-expansion `factory(...)` pattern is more involved than Dune's; defer |
| Agricola | `res/cards/{minorA-E,occupationA-E,major}/` per-card files | Eligible for migration on the same model, but ~270 cards × per-set files is its own project |
| Tyrants | `res/cards/{drow,demons,...}/` per-card files | Small (~33 cards); easy candidate after Dune validates the approach |
| Magic | No per-card definitions; cards loaded from the MTG database at runtime | N/A |

Engine changes are pure additions, so deferring per-game adoption is safe.

### Implementation order

1. Add `loadFromDirectory` + `filterDefinitions` to `BaseCardManager`, with one unit test in `common/lib/game/BaseCardManager.test.js` covering a temp directory fixture.
2. Migrate Dune `intrigue/index.js` first (largest file, flat layout) — validates the basic case.
3. Migrate Dune `imperium/{base,bloodlines,immortality,promo,riseOfIx,uprising}/index.js` (6 files, source-subfolder layout).
4. Migrate remaining per-card-type indexes (conflict, contracts, objectives, reserve, sardaukar, starter, tech, tleilax — 8 files).
5. Refactor `res/index.js` filtering to use `filterDefinitions` + a shared `getCards` helper.
6. Run full Dune test suite; expect no regressions.
7. Add a short note to `docs/new-game-guide/06-cards-and-abilities.md` describing the convention.

### Verification

- `npm run test -w common -- --testPathPattern dune` passes unchanged.
- Adding a new file `common/dune/res/cards/imperium/uprising/new-card.js` (with `source: "Uprising"`) makes it appear in `getImperiumCards(settings)` with no other edits.
- Removing a file removes the card the same way.
- Deliberately omitting `source:` from a card def fails fast at module-load time with the file name in the error.

**Done when.** Dune card loading goes through `BaseCardManager.loadFromDirectory`; adding a card file requires zero registry edits; lint + tests clean.

**Status.** ✓ Completed 2026-05-11. Landed in `bd36b4982` (per-card-type `index.js` files migrated to `loadFromDirectory`); engine helpers added earlier on the `BaseCardManager` class. All 16 Dune per-source/per-type index files collapsed to one-liners; new card files appear automatically with zero registry edits.

---

## 3. `BasePlayer.incrementCounter` source attribution + history

**Problem.** `0efda16d1` retrofitted source labels onto every VP-mutating call site in Dune late in the project. Every game eventually needs a "where did points/resources come from?" UI. Currently each game would solve it independently.

### Current state (audited 2026-05-11)

Only Dune has any history tracking today:
- `DunePlayer.gainVp(amount, source)` / `loseVp(amount, source)` write `{amount, source, round}` entries into `game.state.vpHistory[playerName][]`.
- Bootstrap: `dune.js:160` initializes `state.vpHistory = {}`, `initializePlayers()` seeds starting-VP entries.
- 29 call sites pass plain-string sources like `'For Humanity'`, `'Junction Headquarters'`, `"Smuggler's Haven"`. Each site also emits its own VP log message; `gainVp` calls `incrementCounter` with `silent: true` to avoid double logging.
- Only consumer: `app/src/modules/games/dune/components/modals/DuneVpBreakdownModal.vue` (132 lines, renders the per-player VP table). Wired into `DunePlayerPanel.vue` via a click handler on the VP badge.

Other games:
- Magic / Ultimate / Agricola / Twilight have no `History` state at all. None override the counter methods. Counter mutation site density: Dune 198, Tyrants 95, Magic 1, the others use direct `counters[name] = ...` or game-specific shortcuts.

No `BasePlayer` subclass overrides `incrementCounter` / `setCounter`. The base class today has no history infrastructure.

### Engine changes — `BasePlayer`

Add a `counterHistory` state writer to the existing `incrementCounter` and `setCounter`. Both accept a new `opts.source`, which can be either a plain string (treated as a label) or `{ label, ref? }` for callers who want to attach a card/leader/space reference.

```js
incrementCounter(name, count=1, opts={}) {
  const before = this.counters[name] || 0
  this.counters[name] = before + count
  this._recordCounterChange(name, count, before + count, opts.source)

  if (!opts.silent) {
    this.log.add({ /* existing template */ })
  }
}

setCounter(name, value, opts={}) {
  const before = this.counters[name] || 0
  this.counters[name] = value
  this._recordCounterChange(name, value - before, value, opts.source)

  if (!opts.silent) {
    this.log.add({ /* existing template */ })
  }
}

_recordCounterChange(counter, delta, total, source) {
  if (delta === 0) {
    return
  }
  this.game.state.counterHistory ||= {}
  this.game.state.counterHistory[this.name] ||= []
  this.game.state.counterHistory[this.name].push({
    counter,
    delta,
    total,
    source: this._normalizeSource(source),
    round: this.game.state.round ?? null,
    turn: this.game.state.turn ?? null,
  })
}

_normalizeSource(source) {
  if (!source) return null
  if (typeof source === 'string') return { label: source }
  return source
}
```

Decisions baked in:
- **Track unconditionally** — every non-zero mutation goes into history. Roadmap's preference. Cost is ~200-300 entries per Dune game; state is ephemeral so it doesn't grow across runs, but does inflate the JSON over the wire. Acceptable tradeoff for full audit coverage.
- **Skip zero-delta mutations** — `setCounter(name, current)` and `incrementCounter(name, 0)` don't emit history rows. Stops the noise of no-op writes.
- **`addCounter` stays untracked** — initial-value registration in subclass constructors isn't a mutation. History begins when gameplay does.
- **`opts.source` accepts string or `{ label, ref? }`** — string for the 90% case, structured form when callers want to reference the card/leader that caused it. Normalized to `{ label, ref? }` on write so the consumer always sees the same shape.

### Engine changes — Vue: generic `CounterHistoryModal`

Move the Dune VP table to `app/src/modules/games/common/CounterHistoryModal.vue`. Make it parameterized:

```vue
<!-- Props (or modal payload): playerId, counterName, title, currentValue -->
<!-- Reads: game.state.counterHistory[playerId].filter(e => e.counter === counterName) -->
```

The modal builds the running total internally (entries store `total`, but recomputing from `delta` keeps it self-contained). Renders Rd | Source | Δ | Total just like Dune's current one.

Per-game wiring: each game's main component imports `CounterHistoryModal` and exposes it under whichever modal id makes sense (e.g., Dune keeps `dune-vp-breakdown-modal` id for now; under the hood it's the generic component with `counterName: 'vp'`).

### Dune migration

1. **Replace `gainVp` / `loseVp` call sites.** Each of the 29 sites does `player.gainVp(N, 'Source Name')`; rewrite to `player.incrementCounter('vp', N, { silent: true, source: 'Source Name' })`. Keep the `silent: true` so the per-card log messages don't double up. Then delete `gainVp`, `loseVp`, `_recordVpEntry` from `DunePlayer`.
2. **Replace starting-VP seed.** `dune.js:initializePlayers` currently writes a manual `vpHistory[player.name].push({...})`; change to `player.setCounter('vp', startingVp, { silent: true, source: 'Starting VP' })`.
3. **Drop `state.vpHistory`.** Remove the init in `_reset` and the manual writes in `initializePlayers`. The new `state.counterHistory` covers the same ground.
4. **Update `DuneVpBreakdownModal`.** Either (a) replace it entirely with `CounterHistoryModal` wired with `counterName: 'vp'`, or (b) thin-wrap if Dune wants specific styling. Recommendation: thin-wrap, ~10 lines, defers full deletion to a follow-up.
5. **Leave `gainInfluence` / `loseInfluence` alone.** Those wrappers live on `DunePlayer` but are entry points for a workflow (the `systems/factions.js` orchestration around influence-gain hooks). They should keep their own existence; under the hood they'll now record history via `incrementCounter`.

### Other games — deferred

Engine change is additive: existing call sites without `opts.source` produce history entries with `source: null`. Tyrants' 95 mutation sites and the others will accumulate sourceless rows until someone migrates them. No UI exists to consume non-Dune history yet, so the entries are harmless until that work happens.

### Implementation order

1. Add `_recordCounterChange` + `_normalizeSource` to `BasePlayer`, wire from `incrementCounter` + `setCounter`. Extend `BasePlayerManager.test.js` (or add to `BasePlayer.test.js` if missing) with cases: increment writes history, setCounter writes delta, zero-delta skipped, string source normalized, `{label, ref}` source preserved, `addCounter` doesn't write.
2. Add `app/src/modules/games/common/CounterHistoryModal.vue` (carved from `DuneVpBreakdownModal.vue`).
3. Migrate Dune's 29 `gainVp` / `loseVp` call sites to `incrementCounter('vp', N, { silent: true, source })`.
4. Migrate Dune's starting-VP seed; remove `vpHistory` state + `gainVp` / `loseVp` / `_recordVpEntry` methods.
5. Replace `DuneVpBreakdownModal` body with `<CounterHistoryModal counterName="vp" :playerId="..." />` (thin wrapper, file stays as a Dune-named modal).
6. Run Dune test suite + lint.

### Verification

- `npm run test -w common` clean.
- A new test confirms that `incrementCounter` / `setCounter` write `counterHistory` entries with the right shape.
- The Dune VP breakdown modal renders identically (eyeball check on a running game).
- Counter mutations from non-Dune games produce sourceless `counterHistory` entries without breaking anything.

**Done when.** `BasePlayer` writes `counterHistory` for every non-zero mutation; Dune's bespoke `gainVp` / `loseVp` / `_recordVpEntry` + `state.vpHistory` are gone; the VP breakdown UI reads from the shared `counterHistory`.

**Status.** ✓ Completed 2026-05-11. Landed across three commits: `e81373aaa` (`BasePlayer.incrementCounter` / `setCounter` write `counterHistory`), `6a5459118` (shared `CounterHistoryTable` Vue component), `3509487df` (Dune VP migrated to shared infrastructure). Other games will accumulate sourceless `counterHistory` entries as they call `incrementCounter` / `setCounter`; migration to source-attributed calls happens opportunistically.

---

## 4. Structured `choose()` options

**Problem.** `274cbde3c` (today): bare-string option `"Duncan Idaho"` was ambiguous between an imperium card and a leader. `chooseCards` already emits `{title, id, defId, kind}` (good — fixed during Dune), but plain `choose` still takes raw strings, so any game-level prompt mixing cards with non-cards has to manually structure the payload. `637653484` and `3fa3853b4` had to bolt on chip-rendering for the same reason.

### Current state (audited 2026-05-11)

**Engine.** `BaseActionManager.choose(player, choices, opts)` is type-agnostic — it accepts any array and passes it through to `common/lib/selector.js`, which already does most of the structured-option work:

- `_normalize` wraps bare-string choices into `{ title: opt }` form before validation, so the validator never sees raw strings.
- `_validate` matches selector option ↔ selection by `id` when both sides carry one, otherwise by `title`. Structured options round-trip safely *and* bare-string responses from legacy clients keep working.
- Therefore the migration is purely additive: structured options are already supported end-to-end. The remaining work is (a) emitting structured options at call sites, (b) catching bare-string leaks early.

`chooseCards` already emits `{ title, id, defId?, kind? }` and sorts alphabetically. `chooseYesNo`, `choosePlayer`, `flipCoin` still pass bare strings (`['yes', 'no']`, `choices.map(p => p.name)`, `['heads', 'tails']`).

**Dune (canonical shape established).** `common/dune/phases/playerTurns.js` already defines local helpers:

```js
function cardOption(card, kind = 'imperium-card') {
  return { title: card.name, id: card.id, defId: card.defId, kind }
}
function spaceOption(space) {
  return { title: space.name, id: space.id, kind: 'board-space' }
}
```

`274cbde3c` made these the engine-blessed shape. The Dune frontend `DuneGame.vue` resolver:
- prefers structured options carrying `kind`/`defId`/`id` for chip routing
- falls back to bare-name lookup with cards prioritized over leaders (cards collide far more often, e.g. Duncan Idaho)
- emits a dev-only `console.warn` when a bare-string option arrives

Note: original roadmap proposed `{ id, label, kind, meta }`. Reality uses `{ title, id, defId?, kind? }` — `title` (not `label`) is what `selector._validate` keys on, and `chooseCards` already produces this shape. Don't rename.

**Bare-string surface across games.** 837 `actions.choose` sites total. Sampled patterns:

| Game | Sites | Notable bare-string patterns |
|---|---|---|
| Twilight | 337 | Parseable planet strings (`'${pId} (${inf})'` parsed back with regex); player names; system ids; pool tokens (`'tactics'`/`'fleet'`/`'strategy'`) — last group is benign |
| Ultimate | 268 | Colors / numbers / biscuit codes (mostly benign primitives); some `cards.map(c => c.name)` patterns |
| Dune | 150 | 7 sites still pass `cards.map(c => c.name)` directly; rest already structured via `cardOption`/`spaceOption` |
| Agricola | 67 | Largely structured `choices = [{title, ...}]` arrays already |
| Tyrants | 14 | No known ambiguity |
| Magic | 0 | n/a |

The worst pattern by far is Twilight's planet-vote / production prompts: `readyPlanets.map(pId => '${pId} (${inf})')`, then `choice.split(' (')[0]` to recover the id. Embeds parseable data in display strings and regexes it back out. Direct migration target.

**Dune's remaining 7 `cards.map(c => c.name)` sites**:
- `res/cards/imperium/uprising/corrinth-city.js`
- `res/cards/imperium/uprising/branching-path.js`
- `res/cards/imperium/base/reverend-mother-mohiam.js`
- `res/cards/intrigue/discerning.js`
- `res/cards/intrigue/devious.js`
- `res/cards/intrigue/unnatural.js`
- `res/cards/intrigue/manipulate.js`

Each does name-based recovery (`cards.find(c => c.name === choice)`) — safe for unique-name hands but unnecessarily fragile.

### Engine changes

**1. Canonical option shape.** `{ title, id?, defId?, kind?, meta? }`. Already enforced de facto by `selector._normalize` / `_validate`; just codify in a helper.

**2. Helpers on `BaseActionManager`.** Promote Dune's local helpers so all games share them:

```js
// common/lib/game/BaseActionManager.js

option({ id, title, kind, defId, meta } = {}) {
  const opt = { title: title ?? String(id) }
  if (id != null) opt.id = id
  if (defId != null) opt.defId = defId
  if (kind != null) opt.kind = kind
  if (meta != null) opt.meta = meta
  return opt
}

cardOption(card, kind = 'card') {
  return { title: card.name, id: card.id, defId: card.defId, kind }
}

playerOption(player) {
  return { title: player.name, id: player.name, kind: 'player' }
}
```

`cardOption` lives on the base manager because cards are universal. `spaceOption` / `factionOption` / `planetOption` are game-specific — each game extends `BaseActionManager` (or adds methods on its `actions` instance) to provide them. Dune keeps `spaceOption` local for now; Twilight needs a new `planetOption` / `systemOption`.

**3. Bare-string allowlist + dev warning.** Add to `BaseActionManager`:

```js
static SAFE_BARE_OPTIONS = new Set([
  'Pass', 'Skip', 'Continue', 'Cancel', 'Done',
  'Yes', 'No', 'yes', 'no',
  'heads', 'tails',
])

_warnOnBareStrings(choices, title) {
  if (process.env.NODE_ENV === 'production') return
  for (const c of choices) {
    if (typeof c !== 'string') continue
    if (BaseActionManager.SAFE_BARE_OPTIONS.has(c)) continue
    if (/^\d+$/.test(c)) continue
    console.warn(`[choose] bare-string option "${c}" in prompt "${title ?? 'Choose'}" — emit {title, id, kind?} instead`)
  }
}
```

Wire from `choose` before the selector dispatches. Warning surfaces the migration surface without breaking builds. Domain primitives like `'tactics'`/`'fleet'`/`'strategy'` will warn — either add them to the allowlist (preferred for Twilight pool tokens) or restructure as `{ title: 'Tactics', id: 'tactics', kind: 'command-token' }`. Picking case-by-case is fine.

**4. Route `chooseYesNo`, `choosePlayer`, `flipCoin` through structured path.** All three pass bare strings today and would trip their own warning. Update:

```js
chooseYesNo(player, title) {
  const choice = this.choose(player, [
    { title: 'Yes', id: 'yes' },
    { title: 'No',  id: 'no' },
  ], { title, count: 1 })
  const pick = choice[0]
  return (pick?.id ?? pick) === 'yes'
}

choosePlayer(player, choices, opts={}) {
  const selected = this.choose(
    player,
    choices.map(p => this.playerOption(p)),
    { ...opts, title: opts.title ?? 'Choose Player' },
  )
  const pick = selected[0]
  const id = pick?.id ?? pick
  return choices.find(p => p.name === id)
}
```

`?? pick` keeps backward compatibility with bare-string responses from legacy stored games (same fallback `chooseCards` uses).

**5. Selector validation: unchanged.** `_normalize` + `_validate` already handle both bare-string and structured selections; no changes needed.

### Per-game migration

**Dune** (mostly done — finish):
- Lift `cardOption` / `spaceOption` from `phases/playerTurns.js` into the engine layer. `cardOption` becomes `game.actions.cardOption(card, 'imperium-card')`; `spaceOption` stays a local Dune helper (board-space concept doesn't generalize).
- Convert the 7 `cards.map(c => c.name)` sites to `cards.map(c => game.actions.cardOption(c, 'imperium-card'))`. Replace the post-`choose` `cards.find(c => c.name === choice)` with `cards.find(c => c.id === selected.id)` (where `selected` is the option object). For mixed lists like `['Pass', ...cards.map(c => c.name)]`, keep `'Pass'` bare (allowlisted) and structure the rest.
- Remove the dev-only bare-string warning from `DuneGame.vue` once the engine-side warning is in place. Keep the cards-prioritized fallback resolver — that's belt-and-suspenders for legacy stored games.

**Twilight** (biggest win, biggest lift):
- Add `actions.planetOption(planetId, influence)` returning `{ title: '${planetId} (${influence})', id: planetId, kind: 'planet' }`. Convert ~12 sites in `twilight.js`, `strategyCards.js`, `universities-of-jol-nar.js`, etc. Drop the regex parsing of selection strings.
- Convert `systemSelection[0]` patterns to read `.id`. Add a `systemOption(systemId)` helper if it shows up more than twice.
- Convert `actions.choose(player, others.map(p => p.name))` to `others.map(p => this.playerOption(p))`. Read `.id` on the response.
- Pool tokens (`'tactics'`/`'fleet'`/`'strategy'`): add to `SAFE_BARE_OPTIONS` rather than restructuring (they're already lowercase ids; structuring adds no value).

**Ultimate, Agricola**: opportunistic. Sweep `actions.choose(...)` for `.map(c => c.name)` and similar. Each game's existing `chooseCard` / `chooseCards` paths already structure card options; plain-string `choose` calls on card-name arrays are the targets.

**Tyrants, Magic**: defer. 14 sites and 0 sites; no known collisions; ROI low.

### Implementation order

1. Add `option` / `cardOption` / `playerOption` + `SAFE_BARE_OPTIONS` + `_warnOnBareStrings` to `BaseActionManager`. Wire warning from `choose`. Add unit tests in `common/lib/game/BaseActionManager.test.js` covering: structured option round-trip, allowlisted bare string passes silently, non-allowlisted bare string warns once, `chooseYesNo` returns boolean from structured choice, `choosePlayer` returns the right player object.
2. Update `chooseYesNo`, `choosePlayer`, `flipCoin` to use structured options. Run full test suite — every game uses these.
3. Dune: convert the 7 `cards.map(c => c.name)` sites; lift `cardOption` to the engine (delete the local helper); remove the Dune-only frontend warning.
4. Twilight: add `planetOption`, migrate planet-vote / production-planet / Jol-Nar Pillage sites. Drop string-parsing.
5. Twilight: migrate player-name and system sites. Add pool tokens to allowlist.
6. Ultimate / Agricola: sweep `.map(c => c.name)` sites.
7. `npm run lint -w common`, `npm run test -w common` clean per game.

### Verification

- New unit tests confirm the dev warning fires once per non-allowlisted bare-string and stays silent for allowlisted/numeric/structured options.
- `chooseYesNo` / `choosePlayer` return the same values as before across every game's test suite (regression net).
- Test fixture: two cards with the same name in a Dune hand, prompted via structured `actions.choose` — selection returns the specific instance via `id`.
- Running each game's suite produces zero `[choose] bare-string` warnings outside the allowlist for migrated games; remaining warnings form an actionable migration list.

**Done when.** `cardOption` lives on `BaseActionManager`; Dune's seven `cards.map(c => c.name)` sites are structured; Twilight's parseable planet strings (and their regex parsers) are gone; the engine-side dev warning has replaced Dune's frontend warning; the warning produces zero hits for Dune and Twilight under their test suites.

**Status.** ✓ Completed 2026-05-11. Landed across four commits:
- `85822d919` Engine helpers (`option` / `cardOption` / `playerOption` on `BaseActionManager`), `SAFE_BARE_OPTIONS` allowlist, `_warnOnBareStrings` dev warning (silent in test/prod), and structured `chooseYesNo` / `choosePlayer` with back-compat resolution.
- `0f9dc3bfe` Dune migration — 19 card-name and 3 player-name `actions.choose` sites converted (chooseCard for forced picks, structured + id resolution for Pass-mixed), local `cardOption` helper lifted out of `phases/playerTurns.js`, Dune-only frontend warning removed.
- `f103213b9` Twilight migration — `planetOption` / `systemOption` on `TwilightActionManager`; the five regex-parsed planet sites (agenda voting, two `strategyCards.js` pay-loops, Jol-Nar Doctor Sucaban, Winnu Hegemonic Trade) emit structured options and resolve by id; `choice.split(' (')[0]` parsing is gone. Two player-name choose sites migrated; `_handleTransaction` partner list structured. Engine allowlist gained pool tokens (`tactics`, `fleet`, `strategy`, `alpha`, `beta`, `pds`, `space-dock`).
- `d0016a203` Ultimate — `UltimateActionManager.chooseCards` emits structured options (the `auto` sentinel stays bare). Five tests updated to extract titles from structured choices. Agricola required no changes; its choose sites were already structured.

Engine auto-respond strips `meta` from structured options, so sites that need to preserve computed display values use a recompute function (see Twilight `planetResources` / `planetInfluence` helpers) instead. Future improvement: have auto-respond preserve full structured options including meta. Description-string options (`['Pass', 'Discard 2 cards and pay 5 Solari for +1 VP']` and similar) still trip the dev warning — those are non-ambiguous semantic strings and can be allowlisted per-prompt later if the warning noise becomes a problem.

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

Track active work in the project TODO doc. As items land, update the "Done when" line and add a row under "Completed" below.

This doc itself should be revisited after the next game build — every recurring problem in the next game's history is a candidate addition.

---

## Completed

| Item | Completed | Landing commits | Notes |
|---|---|---|---|
| 2 — `BaseCardManager` source indexing + `loadFromDirectory` | 2026-05-11 | `bd36b4982` | 16 Dune per-source/per-type `index.js` files collapsed to one-liners; adding a card file requires zero registry edits. Engine helpers (`loadFromDirectory`, `filterDefinitions`) added to `BaseCardManager` |
| 3 — `BasePlayer.incrementCounter` source attribution + history | 2026-05-11 | `e81373aaa`, `6a5459118`, `3509487df` | `BasePlayer.incrementCounter` / `setCounter` write `game.state.counterHistory`; shared `CounterHistoryTable` Vue component renders the table; Dune VP migrated from bespoke `gainVp` / `loseVp` / `vpHistory` to the shared infrastructure |
| 4 — Structured `choose()` options | 2026-05-11 | `85822d919`, `0f9dc3bfe`, `f103213b9`, `d0016a203` | Engine `option` / `cardOption` / `playerOption` helpers + bare-string dev warning; `chooseYesNo`/`choosePlayer` rerouted through structured options; Dune (~22 sites) + Twilight (planet/player/transaction sites, planet regex parsing gone) + Ultimate (`UltimateActionManager.chooseCards` central migration) migrated; Agricola required no changes |

Full item sections remain in place above for reference. New entries land here when the corresponding section's "Done when" criteria are satisfied.
