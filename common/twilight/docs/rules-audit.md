# Twilight Imperium Rules Audit

Audit of game logic implementation and test coverage against the Living Rules Reference (101 sections).

**Legend:** IMPL = Implementation status, TEST = Test coverage status

---

## Fully Implemented & Tested (No Gaps)

These sections are fully implemented and have adequate test coverage:

| # | Section | Notes |
|---|---------|-------|
| 2 | Action Cards | Drawing, hand limit (7), play timing, discard |
| 4 | Active Player | First in initiative order, rotates |
| 5 | Active System | Token placement, can't re-activate, persists for tactical action |
| 6 | Adjacency | Physical, wormhole, hyperlane adjacency all working |
| 7 | Agenda Card | Laws vs directives, For/Against, Elect mechanics |
| 8 | Agenda Phase | Voting, speaker tiebreak, ready planets after |
| 11 | Asteroid Field | Ships cannot move through or into |
| 12 | Attach | Exploration attachments, planet card modification |
| 13 | Attacker | Active player = attacker in combat |
| 14 | Blockaded | Can't produce ships, can produce ground forces |
| 21 | Commodities | Convert on trade, replenish, commodity values |
| 22 | Component Action | All sources gathered (faction, tech, relic, exploration) |
| 25 | Control | Gain/lose control, planet cards, exploration trigger |
| 26 | Cost | Resource spending, two-icon units, structures have no cost |
| 29 | Defender | Non-active player in combat |
| 34 | Exhausted | Flip facedown, ready in status phase, can't spend |
| 35 | Exploration | All 4 decks, attachments, relic fragments, frontier tokens |
| 36 | Fighter Tokens | Token/plastic substitution |
| 37 | Fleet Pool | Command tokens = max non-fighter ships per system |
| 38 | Frontier Tokens | Placed in empty systems, explored, discarded |
| 40 | Game Round | 4 phases, agenda added after custodians |
| 43 | Ground Forces | Always on planets or transported, no placement limit |
| 44 | Hyperlanes | Connected systems adjacent, not systems themselves |
| 46 | Infantry Tokens | Token/plastic substitution |
| 47 | Influence | Planet value, spend by exhausting, trade good = 1 influence |
| 55 | Mechs | Ground force type, transported, produced, not technologies |
| 60 | Neighbors | Units/planets in same or adjacent systems, wormhole neighbors |
| 71 | Readied | Faceup state, ready in status phase |
| 72 | Reinforcements | Personal supply of unused units/tokens |
| 73 | Relics | All 16 relics implemented with abilities, can't be traded |
| 74 | Rerolls | New result replaces old, can't reroll same die with same ability |
| 75 | Resources | Planet value, spend by exhausting, trade good = 1 resource |
| 85 | Structures | PDS and space docks, placed on planets, can't move |
| 86 | Supernova | Ships cannot move through or into |
| 88 | System Tiles | Green/blue/red backs, planets, space areas |
| 90 | Technology | Prerequisites, colors, specialties, unit upgrades, Valefar Assimilator |
| 93 | Trade Goods | Gain, spend as resource/influence (not for votes), exchange |
| 96 | Units | Ships, ground forces, structures |
| 97 | Unit Upgrades | Cover base unit on faction sheet, improved attributes |

---

## Sections With Gaps

### CRITICAL — Partially Implemented

#### 17. Capture
- **IMPL: Partial** — Vuil'raith-specific capture fully implemented; general framework deferred
- **TEST: Partial** — Vuil'raith capture tests pass
- Implemented: Devour, Amalgamation, Riftmeld, Vortex, Dimensional Anchor (all Vuil'raith)
- Implemented: `state.capturedUnits` tracking, `onUnitDestroyed` hooks
- TODO: Transaction-based capture returns (Rule 17.2)
- TODO: Production prevention for captured unit types (Rule 17.1)
- TODO: Blockade restrictions on capture returns (Rule 17.3)

#### 33. Elimination — IMPLEMENTED
- **IMPL: Yes** — Core elimination detection and handling
- **TEST: Yes** — 5 integration tests in `elimination.test.js`
- Implemented: Check for (no ground forces AND no production units AND no planets)
- Implemented: Remove all units from board
- Implemented: Remove command tokens from board
- Implemented: Return other players' promissory notes
- Implemented: Discard action cards
- Implemented: Return strategy cards
- Implemented: Shuffle secret objectives back into deck
- Implemented: Speaker passes to next player on elimination (Rule 80.7)
- Implemented: Eliminated player skipped in strategy/action/status phases
- Implemented: Return captured units to original owners
- TODO: Faction-specific elimination rules (Nekro, Creuss, Naalu, Titans, Mahact)

---

### Previously CRITICAL — Now Implemented (Strategy Cards)

#### 45. Imperial (Strategy Card) — IMPLEMENTED
- **IMPL: Yes** — Primary now includes public objective scoring
- **TEST: Yes** — Tests in `strategicAction.test.js`
- Implemented: Primary allows scoring 1 public objective if requirements met
- Implemented: Mecatol VP + secret draw logic
- TODO: 3-objective hand limit enforcement for secrets (Rule 61.21)

#### 52. Leadership (Strategy Card) — PARTIALLY IMPLEMENTED
- **IMPL: Partial** — Secondary is now free; influence spending deferred
- **TEST: Yes** — Tests in `strategicAction.test.js`
- Implemented: Secondary is free (no strategy token cost)
- Implemented: Secondary gives 1 command token
- TODO: Primary/secondary influence spending (1 token per 3 influence) — deferred due to replay engine limitations with optional prompts

#### 91. Technology (Strategy Card) — IMPLEMENTED
- **IMPL: Yes** — 2nd tech and secondary cost added
- **TEST: Yes** — Tests in `strategicAction.test.js`
- Implemented: Primary allows spending 6 resources for 1 additional technology
- Implemented: Secondary costs strategy token + 4 resources

#### 24. Construction (Strategy Card) — IMPLEMENTED
- **IMPL: Yes** — Secondary now system-restricted
- **TEST: Yes** — Tests in `strategicAction.test.js`
- Implemented: Secondary requires choosing a system and placing command token
- Implemented: Building restricted to planets in chosen system

---

### HIGH — Core Mechanics Missing

#### 41. Gravity Rift
- **IMPL: ~80%** — Core mechanics implemented
- **TEST: ~80%**
- Implemented: +1 move for ships exiting gravity rift (0-cost exit in BFS pathfinding)
- Implemented: Die roll per ship exiting (1d10, 1-3 = ship removed, not destroyed)
- Implemented: Circlet of the Void exemption
- Missing: Can affect same ship multiple times (multiple rifts in path)
- Missing: Multiple rifts in system = single rift
- Implemented: Gravity rift as valid destination, Vuil'raith faction +1 move

#### 59. Nebula
- **IMPL: ~95%** — All key mechanics implemented
- **TEST: ~90%**
- Implemented: Move value set to 1 when ship starts in nebula (bonuses still stack on top)
- Implemented: Defender gets +1 to each combat roll in nebula space combat
- Implemented: Circlet of the Void exemption for move clamp
- Implemented: Can only move into if active system, can't move through

#### 95. Transport
- **IMPL: ~60%** — Basic transport works but intermediate pickup missing
- **TEST: ~70%**
- Missing: Pick up units from systems moved through (only picks from origin system)
- Missing: Cannot pick up units from non-active systems that contain own command token (Rule 95.3)

#### 100. Wormhole Nexus
- **IMPL: ~40%** — Activation mechanics missing
- **TEST: ~20%**
- Missing: Inactive/active state tracking for nexus tile
- Missing: Flip to active side when unit enters or Mallice controlled
- Missing: Active side has alpha + beta + gamma wormholes (inactive has only gamma)
- Implemented: Mallice placement, gamma wormhole

#### 78. Space Combat — Excess Capacity
- **IMPL: ~90%** — Post-combat capacity enforcement implemented
- **TEST: ~80%**
- Implemented: After space combat, excess fighters/ground forces removed (cheapest first)
- Implemented: Only enforced when space combat actually occurred (not during transit)
- Implemented: Capacity-exempt units (faction abilities) respected

#### 31. Destroyed
- **IMPL: Partial**
- **TEST: No**
- Missing: "Removed from board" vs "destroyed" distinction — different triggers/effects
- Missing: Player choice in hit assignment (currently auto-assigned)
- Note: Units are correctly removed but reinforcements pool tracking incomplete

#### 30. Deploy
- **IMPL: Partial** — Only exploration-driven deployment
- **TEST: Partial**
- Missing: General DEPLOY unit ability (place from reinforcements without producing)
- Missing: Must be in reinforcements to deploy
- Missing: Once per timing window limit
- Some faction-specific deploy abilities work (e.g., exploration cards)

---

### MEDIUM — Secondary Features Missing

#### 32. Diplomacy (Strategy Card)
- **IMPL: Partial**
- **TEST: Partial**
- Missing: Cannot choose Mecatol Rex system in primary
- Missing: If player has no reinforcement tokens, they must place from command sheet
- Missing: Secondary should let player choose which 2 planets to ready (currently auto-selects)

#### 99. Warfare (Strategy Card)
- **IMPL: Partial**
- **TEST: Partial**
- Missing: Token redistribution is a placeholder ("Done" button, no actual redistribution options)

#### 53. Legendary Planets
- **IMPL: No**
- **TEST: No**
- Missing: Legendary planet ability cards gained with planet control
- Missing: Ready/exhaust state for ability cards
- Missing: Purge ability card when planet card purged
- Note: Planet data includes legendary flag but no mechanical effect

#### 69. Promissory Notes
- **IMPL: Partial**
- **TEST: Partial**
- Missing: Max 1 promissory note per transaction not enforced
- Missing: Return-after-resolve mechanic
- Missing: Eliminated player's promissory notes returned to game box

#### 94. Transactions
- **IMPL: Partial**
- **TEST: Partial**
- Missing: Agenda phase transactions (1 transaction per player per agenda, not just neighbors)
- Missing: Max 1 promissory per transaction enforcement

#### 61. Objectives
- **IMPL: Partial**
- **TEST: Partial**
- Missing: Max 3 secret objectives hand limit enforcement (Rule 61.21)
- Missing: Game ends immediately if speaker cannot reveal an objective card (Rule 61.15)
- Missing: Tie-breaking when multiple players reach 10 VP simultaneously (Rule 98.7)

#### 98. Victory Points
- **IMPL: Partial**
- **TEST: Partial**
- Missing: Simultaneous 10 VP tie-breaking (earliest in initiative order wins)
- Missing: Game end from no unrevealed objectives (most VP wins, tie = first in initiative order)

#### 84. Strategy Phase — 3-4 Player Rules
- **IMPL: Partial**
- **TEST: Partial**
- Missing: Players cannot pass until they have exhausted BOTH strategy cards in 3-4 player game (Rules 3.4a, 82.2a)
- Note: Card picking (snake draft for 2 cards) works correctly

#### 87. Sustain Damage
- **IMPL: Partial**
- **TEST: Partial**
- Missing: Cannot cancel direct-destroy effects (Rule 87.5) — no distinction between "hits" and "direct destroy"

---

### LOW — Edge Cases / Minor Gaps

#### 9. Anomalies
- Missing: Abilities that dynamically make a system an anomaly (e.g., Vuil'raith Dimensional Tear)
- Missing: Tests for systems that are two different anomalies simultaneously

#### 10. Anti-Fighter Barrage
- Missing test: AFB fires even when no fighters present (hits have no effect)
- Missing test: Combat modifiers don't affect AFB rolls

#### 15. Bombardment
- Missing test: L1Z1X Harrow doesn't target own ground forces
- Missing test: Plasma Scoring +1 die bonus
- Missing test: Multiple planet bombardment in single invasion

#### 16. Capacity
- Missing: Explicit excess capacity removal mechanism mid-game

#### 18. Combat Attribute
- Missing test: Burst icon mechanics (multi-dice units)

#### 28. Deals
- Binding vs non-binding distinction not enforced (social contract only)

#### 39. Game Board
- Missing: Explicit edge detection function (inferred from position)

#### 42. Ground Combat
- Missing test: Draw scenario (both sides eliminated simultaneously)
- Missing test: Start/end of combat timing window hooks

#### 51. Leaders
- Missing: Hero purge mechanism after abilities resolved (Rule 51.12)
- Missing: Agent ready-in-status-phase explicit wiring
- Missing test: Titans hero exception (not purged, attached to Elysium)

#### 54. Mecatol Rex
- Implemented via custodians token — no separate gaps

#### 56. Modifiers
- Missing test: Modifier bounds clamping (effective combat 1-10)

#### 58. Movement
- Missing test: Ship moving through own command tokens
- Missing: Explicit handling that ability movement follows ability rules, not normal movement rules

#### 62. Opponent
- Missing test: Non-participants can't use opponent-targeting abilities

#### 63. PDS
- Missing test: PDS destroyed when on planet with no own ground forces and enemy units present

#### 64. Planets
- No gaps identified

#### 65. Planetary Shield
- Missing: X-89 Bacterial Weapon bypass (X-89 tech may not be fully implemented)
- Missing test: L1Z1X Harrow blocked by Planetary Shield

#### 66. Politics (Strategy Card)
- No gaps identified — well implemented and tested

#### 67. Producing Units
- Missing: Reinforcements cap not tracked (units created without limit checking)

#### 68. Production (Unit Ability)
- Missing: Arborec space dock restriction (can't produce infantry from space docks)

#### 70. Purge
- Implemented for relics and heroes; no general gaps

#### 76. Ships
- No gaps beyond fleet pool (covered in 37)

#### 77. Space Cannon
- Missing test: Graviton Laser System (SC hits target non-fighter ships)
- Missing test: Plasma Scoring bonus
- Missing test: Hero attachment space cannon abilities

#### 79. Space Dock
- Missing: Space dock destroyed when on planet with no own ground forces and enemy units (Rule 79.4)

#### 80. Speaker
- Missing: Speaker passes left on elimination (see Elimination section)

#### 81. Status Phase
- No major gaps — all 8 steps implemented

#### 82. Strategic Action
- Missing: 3-4 player must resolve both strategy cards before passing (see Strategy Phase)

#### 83. Strategy Card (General)
- No gaps

#### 89. Tactical Action
- No major gaps — all 5 steps implemented

#### 92. Trade (Strategy Card)
- No gaps — well implemented

#### 101. Wormholes
- Missing test: PDS II firing through wormholes (integration test)

---

## Summary by Priority

### CRITICAL (Resolved or partially resolved)
1. ~~**Capture system** (Rule 17)~~ — Vuil'raith capture fully implemented; general framework (transactions, production prevention) deferred
2. ~~**Elimination system** (Rule 33)~~ — **IMPLEMENTED** — Core detection, component removal, speaker transfer
3. ~~**Imperial primary** (Rule 45)~~ — **IMPLEMENTED** — Public objective scoring in primary
4. ~~**Leadership influence spending** (Rule 52)~~ — **PARTIAL** — Free secondary implemented; influence spending deferred
5. ~~**Technology 2nd research + secondary cost** (Rule 91)~~ — **IMPLEMENTED** — 6R 2nd tech + 4R secondary cost
6. ~~**Construction secondary system restriction** (Rule 24)~~ — **IMPLEMENTED** — Command token + system scoping

### HIGH (Core mechanics incomplete)
7. **Gravity Rift** (Rule 41) — Die roll, ship removal, +1 move not implemented
8. **Nebula combat/movement** (Rule 59) — Move value=1, defender +1 combat missing
9. **Transport from path** (Rule 95) — Can't pick up from intermediate systems
10. **Wormhole Nexus activation** (Rule 100) — Inactive/active state missing
11. **Post-combat excess capacity** (Rule 78) — Not enforced after combat
12. **Deploy ability** (Rule 30) — General deploy mechanic not wired
13. **Destroyed vs Removed distinction** (Rule 31) — Different trigger semantics missing

### MEDIUM (Secondary features)
14. **Diplomacy Mecatol exclusion** (Rule 32)
15. **Warfare token redistribution** (Rule 99)
16. **Legendary Planets** (Rule 53) — Ability cards not implemented
17. **3-4 player dual strategy card pass restriction** (Rules 3.4, 82.2)
18. **Game end from no objectives** (Rule 61.15)
19. **Simultaneous VP tiebreaking** (Rule 98.7)
20. **Max 3 secret objectives** (Rule 61.21)
21. **Agenda phase transactions** (Rule 94.6)
22. **Promissory note return/limit** (Rule 69)
23. **Sustain Damage vs direct destroy** (Rule 87.5)
