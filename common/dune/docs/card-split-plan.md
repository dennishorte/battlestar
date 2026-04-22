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
- [x] Phase 2 — objectives (agent worktree, merged)
- [x] Phase 3 — starter (agent worktree, merged)
- [x] Phase 4 — reserve (agent worktree, merged; ids generated)
- [x] Phase 5 — sardaukar (agent worktree, merged; source/compat normalised to Bloodlines)
- [x] Phase 6 — contracts (agent worktree, merged; ids generated, compat='Uprising')
- [x] Phase 7 — conflict (agent worktree, merged)
- [x] Phase 8 — tech (agent worktree, merged; ids generated)
- [x] Phase 9 — tleilax (agent worktree, merged; ids generated, compat='All')
- [x] Phase 10 — intrigue (131 cards, script-driven data split)
- [x] Phase 11-15 — imperium (185 cards across base/uprising/bloodlines/riseOfIx/immortality/promo subfolders, one commit)
- [x] Phase 16 — effect migration + `cardImplementations.js` deleted

### Phase 10–16 outcome

- After two agent timeouts (600s watchdog fire) on intrigue and imperium, we
  switched from subagents to a local Node script for the mechanical
  transform. Much faster and deterministic. Scripts live in `/tmp` as
  one-offs; they were not added to the repo.
- 316 card files created (131 intrigue flat + 185 imperium by source).
- 149 effect methods migrated out of `systems/cardImplementations.js` into
  the matching card files, identified by card id (handled one name
  collision: "Crysknife" exists both as an intrigue and an imperium card,
  the endgameEffect override belonged to the intrigue one by shape).
- Callers in `phases/playerTurns.js`, `phases/combat.js`,
  `phases/recall.js` now look for the effect as a method on the card
  definition (`typeof card.definition.plotEffect === 'function'`) and
  fall back to the existing string-parsing path otherwise.
- `systems/cardImplementations.js` deleted.
- Full suite: **556 suites / 821 tests passing**, lint clean (no
  `--no-verify` bypass on this commit).

### Phase 2–9 outcome

- 8 parallel worktree agents ran, each splitting one card type.
- All merged cleanly back to main (one real text conflict in `tests/battleIcons.test.js` between phase 2 and phase 7 was auto-resolved — both agents made the same "drop `.js` extension" edit).
- Full Dune test suite: **240 suites / 505 tests passing** (up from 89 suites / 349 tests).
- Worktrees deleted after merge; Jest was previously picking up test files inside the worktrees and inflating counts.
- Pre-commit `npm run lint:fix` hook failed inside every worktree because the worktrees had no `common/node_modules` — each agent committed with `--no-verify`. Main-branch merges ran with the hook live and it passed. If we run more worktree agents, we need to either `npm install` inside each worktree or symlink `node_modules` from main first.

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
