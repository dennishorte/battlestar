# Dune Card-Split Plan

Migrating every Dune card from bulk-array data files (`res/cards/*.js`) into
one file per card, following the leader pattern (`res/leaders/<Name>.js` +
`res/leaders/<Name>.test.js`).

## Decisions (locked)

- **Imperium cards** live in `res/cards/imperium/<source>/<id>.js` with source
  subfolders: `base/`, `uprising/`, `bloodlines/`, `riseOfIx/`, `immortality/`,
  `promo/`. Other card types keep a flat folder per type.
- **File names are `<id>.js`**, not `<name>.js`, to avoid collisions where
  multiple cards share a name (e.g. two `Sardaukar` cards, many `Skirmish`
  conflicts). Test files mirror: `<id>.test.js`.
- **1:1 test file per card**, even for pure-data types. Most tests are
  smoke assertions on id / name / source / compatibility. Pure-reward
  cards (most conflicts, all objectives) get only smoke tests; cards with
  agent / reveal / plot / combat / endgame effects get behaviour tests.
- **Aggregator index files** in each folder re-export the same arrays
  (`imperiumCards`, `intrigueCards`, …) so `res/cards/index.js` and all
  downstream consumers keep working.
- **`cardImplementations.js`** gets deleted once every named override has been
  folded into its matching per-card file as `agentEffect` / `revealEffect` /
  `plotEffect` / `combatEffect` / `endgameEffect` methods.
- **Always look up cards by id**, not by name. Cards can have `count > 1`
  (multiple copies in the deck) and names sometimes collide across cards.
  When the existing `cardImplementations.js` table keys by name, audit each
  collision and either confirm the implementations are identical (extract
  shared helper module if so) or split into per-id implementations.
- **Add `usePromo`** to the lobby/game settings and to
  `res/index.js#SOURCE_TO_SETTING`. Default false.

## Source/compatibility normalisation (apply during the split)

| File | Action |
|------|--------|
| `sardaukar.js` | every entry → `source: 'Bloodlines'`, `compatibility: 'Bloodlines'` |
| `objectives.js` | every entry → `source: 'Uprising'`, `compatibility: 'Uprising'` |
| `contracts.js` | every entry → add `compatibility: 'Uprising'` (source already set) |
| Dune factory + lobby | add `useBloodlines`, `useImmortality`, `usePromo` toggles (most already present) |

## Data-normalisation edits (apply during split)

- `sardaukar.js`: add `source: 'Bloodlines'`, set `compatibility: 'Bloodlines'`
  on every entry.
- `objectives.js`: add `source: 'Uprising'`, `compatibility: 'Uprising'` on
  every entry.
- `contracts.js`: add `compatibility: 'Uprising'` on every entry
  (source is already set).

## Execution order (one commit per phase)

| Phase | Scope | Files | Notes |
|-------|-------|-------|-------|
| 1 | Plan doc (this file) | 1 | Checkpoint for continuity. |
| 2 | `objectives/` | 5 + 5 tests | Trivial data; locks in the folder pattern. |
| 3 | `starter/` | 9 + 9 tests | Core starter deck. |
| 4 | `reserve/` | 5 + 5 tests | |
| 5 | `sardaukar/` | 6 + 6 tests | Normalise source/compatibility. |
| 6 | `contracts/` | 35 + 35 tests | Add compatibility. |
| 7 | `conflict/` | 36 + 36 tests | Mostly reward data. |
| 8 | `tech/` | 36 + 36 tests | Rise of Ix. |
| 9 | `tleilax/` | 19 + 19 tests | Immortality. Address `source: 'Promo'`. |
| 10 | `intrigue/` | 131 + 131 tests | Split in sub-batches; migrate plot/combat/endgame overrides. |
| 11 | `imperium/base/` | ~? + tests | |
| 12 | `imperium/uprising/` | ~? + tests | |
| 13 | `imperium/bloodlines/` | ~? + tests | |
| 14 | `imperium/riseOfIx/` | ~? + tests | |
| 15 | `imperium/immortality/` | ~? + tests | |
| 16 | Delete `cardImplementations.js` once every override is migrated. | -1 | Verify via grep: no `implementations[...]` lookups remain. |

## Progress log

- [x] Phase 1 — plan written
- [ ] Phase 2 — objectives
- [ ] Phase 3 — starter
- [ ] Phase 4 — reserve
- [ ] Phase 5 — sardaukar
- [ ] Phase 6 — contracts
- [ ] Phase 7 — conflict
- [ ] Phase 8 — tech
- [ ] Phase 9 — tleilax
- [ ] Phase 10 — intrigue
- [ ] Phase 11 — imperium/base
- [ ] Phase 12 — imperium/uprising
- [ ] Phase 13 — imperium/bloodlines
- [ ] Phase 14 — imperium/riseOfIx
- [ ] Phase 15 — imperium/immortality
- [ ] Phase 16 — delete cardImplementations.js

## Subagent delegation

Each phase is a self-contained mechanical split that can be handed to a
fresh subagent. The agent's prompt should include:

1. **Goal** — "split `res/cards/<type>.js` into one file per card under
   `res/cards/<type>/`, mirroring the leader pattern in
   `res/leaders/PaulAtreides.js` (data + co-located hooks)."
2. **Required reading** — paths only:
   - `common/dune/docs/card-split-plan.md` (this doc)
   - `common/dune/res/leaders/PaulAtreides.js` and one of `LadyJessica.js` or
     `FeydRauthaHarkonnen.js` (template with hooks)
   - `common/dune/res/leaders/index.js` (aggregator pattern)
   - `common/dune/res/cards/<type>.js` (the source data)
   - `common/dune/systems/cardImplementations.js` (for intrigue/imperium
     phases — to migrate matching overrides)
3. **Conventions** — listed in this doc's "Decisions" section.
4. **Acceptance** — `npx jest --testPathPattern="common/dune"` passes; the
   old data file is deleted; the aggregator (`res/cards/index.js`) still
   exports the same array name; commit and update this doc's progress log.

Phases 2–9 (small, data-heavy types) are good for parallel agents. Phase
10 (intrigue) and phases 11–15 (imperium) need to migrate effect overrides
from `cardImplementations.js` and should run sequentially so each agent
sees the other's deletions in `cardImplementations.js`.

## Open questions / deferred

- **Name collisions in `cardImplementations.js`** — the override table is
  keyed by name. When a name is ambiguous (multiple cards, possibly
  different effects), I'll flag in this doc and resolve per card.
- **`source: 'Promo'`** on some Tleilaxu cards — under the new filter these
  are excluded in every configuration. Leaving as-is; revisit if needed.
- **Pattern validation** — after phase 2 (objectives), confirm the folder
  layout works with the existing `cards/index.js` aggregator before
  proceeding.
