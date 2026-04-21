# 9. Implementation Checklist

A step-by-step checklist for implementing a new game. Each item links to the relevant guide section. Phases are sequential, but items within a phase can be tackled in any order.

---

## Phase 1: Rules and Planning

- [ ] Obtain game rulebook(s) and expansion rules
- [ ] Convert rules to structured format ([Section 1](01-rules-documentation.md))
  - [ ] Create `common/<game>/docs/living_rules/` or `rules/` directory
  - [ ] Write one file per concept (or a single structured rules file for simpler games)
  - [ ] Write `index.md` with alphabetical listing
  - [ ] Add `errata.md` and `faq.md` if applicable
- [ ] Plan file architecture ([Section 2](02-architecture-planning.md))
  - [ ] Decide complexity tier (minimal / modular / subsystem)
  - [ ] List all files to create
  - [ ] Decide which managers to extend
  - [ ] Identify subsystems that need their own files
- [ ] Plan data organization ([Section 3](03-data-and-resources.md))
  - [ ] Design card definition format
  - [ ] Plan `res/` directory structure
  - [ ] Decide card set organization strategy
- [ ] Draft log output for a full round ([Section 5](05-logging-design.md))
  - [ ] Write example log with indentation
  - [ ] Map indent levels to function boundaries
  - [ ] List custom arg handlers needed
- [ ] Plan the testing approach ([Section 7](07-testing-strategy.md))
  - [ ] Design `setBoard` fields and defaults
  - [ ] Design `testBoard` assertion fields
  - [ ] Write `test.todo()` stubs for core mechanics

---

## Phase 2: Skeleton

- [ ] Create `common/<game>/` directory
- [ ] Create main game class with empty `_mainProgram`
  - [ ] Constructor extending `Game`
  - [ ] `_reset()` with game-specific blank state
  - [ ] `GameFactory` and `factoryFromLobby`
  - [ ] Module exports (`Game`, `GameFactory`, `factory`, `res`)
- [ ] Create Player class extending BasePlayer
- [ ] Create PlayerManager with custom `playerClass`
- [ ] Create LogManager with initial arg handlers
- [ ] Create `res/index.js` (can be minimal initially)
- [ ] Create `testutil.js` with `fixture()`, `setBoard()`, `testBoard()`
- [ ] Write and pass the first test: game creates and runs without error
- [ ] Create game architecture doc at `docs/games/<game>.md`
- [ ] Add game directory to `.husky/pre-commit` game loop so commits trigger scoped tests

---

## Phase 3: Core Loop

- [ ] Implement `initialize()` ([Section 4](04-initialization-and-game-loop.md))
  - [ ] Player zones (hand, board, discard, etc.)
  - [ ] Card creation and registration
  - [ ] Board/map setup (if applicable)
  - [ ] Starting state (deal cards, place starting units, etc.)
  - [ ] `initialization-complete` breakpoint
- [ ] Implement `mainLoop()` ([Section 4](04-initialization-and-game-loop.md))
  - [ ] Round/phase structure
  - [ ] Turn rotation
  - [ ] Phase transitions with log entries
- [ ] Implement basic player turns
  - [ ] Action selection (choose from available actions)
  - [ ] Action resolution (execute the chosen action)
  - [ ] Turn-end cleanup
- [ ] Implement end-game condition and scoring
- [ ] Wire up logging throughout ([Section 5](05-logging-design.md))
  - [ ] Phase/round headers with events
  - [ ] Turn-start and player-action entries
  - [ ] Indentation for action details
- [ ] Tests for the core loop
  - [ ] Complete round plays through
  - [ ] Turn order is correct
  - [ ] End-game triggers at the right time
  - [ ] Log output matches expected format

---

## Phase 4: Game Mechanics

- [ ] Implement card/ability system ([Section 6](06-cards-and-abilities.md))
  - [ ] Card definitions in `res/`
  - [ ] Hook dispatch points in the game loop
  - [ ] Triggered ability resolution
- [ ] Implement each major mechanic
  - [ ] Write test stubs for the mechanic
  - [ ] Implement the mechanic
  - [ ] Implement related card hooks
  - [ ] Fill in test stubs, verify they pass
- [ ] Implement anytime actions (if applicable)
- [ ] Implement special abilities / faction powers (if applicable)
- [ ] Implement scoring for each category

---

## Phase 5: Testing

- [ ] Write game-specific testing guide at `common/<game>/docs/specs/testing.md`
- [ ] Expand test coverage
  - [ ] Every card/ability has at least one test
  - [ ] Edge cases: zero resources, max capacity, empty hands
  - [ ] Interaction tests: multiple abilities triggering together
  - [ ] Scoring tests: verify each scoring category
- [ ] Verify all `test.todo()` stubs from Phase 1 are filled in
- [ ] Run full test suite, fix any failures

---

## Phase 6: Frontend

- [ ] Create game module in `app/src/modules/games/<game>/` ([Section 8](08-frontend-integration.md))
- [ ] Main game view component
- [ ] Game-specific log component with `cardClasses()`
- [ ] Player panel component
- [ ] Board/play area component (read-only first)
- [ ] Choice UI (dropdown selection)
- [ ] Board interactions (clickable elements for action-type selectors)
- [ ] Register game in the app router and game list
- [ ] Lobby options component (player count, expansions, etc.)

---

## Phase 6b: Data Page

- [ ] Create data page component in `app/src/modules/data/components/` ([Section 10](10-data-page.md))
  - [ ] Tabs for each card/data type
  - [ ] Search filter across all text fields
  - [ ] Source/expansion filter
  - [ ] Sortable columns
- [ ] Register route in `app/src/modules/data/router.js`
- [ ] Add link in `GameData.vue` data hub

---

## Phase 7: Polish

- [ ] Review log output for clarity and completeness
- [ ] Add errata handling (if the game has official errata)
- [ ] Performance check: ensure replay speed is acceptable for long games
- [ ] Update `docs/games/<game>.md` with final architecture
- [ ] Update root `CLAUDE.md` game table with the new game
