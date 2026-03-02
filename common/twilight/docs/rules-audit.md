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
- **IMPL: Mostly Complete** — Vuil'raith capture, blockade restrictions, and transaction returns implemented
- **TEST: Yes** — 27 Vuil'raith tests including blockade and transaction capture rules
- Implemented: Devour, Amalgamation, Riftmeld, Vortex, Dimensional Anchor, Reanimator, Agent (all Vuil'raith)
- Implemented: `state.capturedUnits` tracking, `onUnitDestroyed` hooks
- Implemented: Blockade prevents capture (Rule 17.6) — all 4 capture entry points check `_isSpaceDockBlockadedBy`
- Implemented: Blockade returns captured units (Rule 14.2) — non-fighter/infantry units returned when blockade established
- Implemented: Transaction-based capture returns (Rule 17.2a) — can return non-fighter/infantry captured units via trade
- Implemented: Fighter/infantry cannot be returned via blockade or transaction (Rule 17.4a/b)
- Implemented: Captured units reduce reinforcement pool (Rule 17.5) — `_countUnitsOnBoard` counts captured units held by other players
- NOTE: Fighter/infantry token tracking (Rule 17.3) is cosmetic in digital; functional distinction enforced via type checks

#### 33. Elimination — IMPLEMENTED
- **IMPL: Yes** — Core elimination detection and handling
- **TEST: Yes** — 11 integration tests in `elimination.test.js`
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
- Implemented: Mahact captured command tokens returned to non-eliminated owners on elimination (Rule 33.10)
- Implemented: Gift of Prescience cleanup — holder eliminated returns PN to Naalu, Naalu eliminated preserves holder's initiative 0 (Rule 33.10)
- Verified: Creuss wormhole token, Nekro assimilator tokens, Titans sleeper tokens persist through elimination (game-level state)

---

### Previously CRITICAL — Now Implemented (Strategy Cards)

#### 45. Imperial (Strategy Card) — IMPLEMENTED
- **IMPL: Yes** — Primary now includes public objective scoring
- **TEST: Yes** — Tests in `strategicAction.test.js`
- Implemented: Primary allows scoring 1 public objective if requirements met
- Implemented: Mecatol VP + secret draw logic
- Implemented: Max 3 secret objectives hand limit (Rule 61.21)

#### 52. Leadership (Strategy Card) — IMPLEMENTED
- **IMPL: Yes** — Primary: 3 tokens + influence spending; Secondary: free influence spending
- **TEST: Yes** — Tests in `strategicAction.test.js`
- Implemented: Primary gains 3 command tokens, then offers influence spending (1 token per 3 influence)
- Implemented: Secondary is free (no strategy token cost), offers influence spending
- `_offerInfluenceForTokens(player)` handles both primary and secondary flow

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

#### 41. Gravity Rift — IMPLEMENTED
- **IMPL: Yes** — All key mechanics implemented
- **TEST: ~85%**
- Implemented: +1 move for ships exiting gravity rift (0-cost exit in BFS pathfinding)
- Implemented: Die roll per rift in path (1d10, 1-3 = ship removed, not destroyed)
- Implemented: Multiple rifts in path = multiple rolls per ship
- Implemented: Circlet of the Void exemption
- Implemented: Gravity rift as valid destination, Vuil'raith faction +1 move
- Note: Multiple rifts in same system is a map construction edge case (single anomaly per tile)

#### 59. Nebula — IMPLEMENTED
- **IMPL: Yes** — All key mechanics implemented
- **TEST: Yes**
- Implemented: Move value set to 1 when ship starts in nebula (bonuses still stack on top)
- Implemented: Defender gets +1 to each combat roll in nebula space combat
- Implemented: Circlet of the Void exemption for move clamp
- Implemented: Can only move into if active system, can't move through (enforced by Galaxy.js pathfinding + tactical action flow)

#### 95. Transport — IMPLEMENTED
- **IMPL: Yes** — Path-based pickup validation
- **TEST: ~80%**
- Implemented: Pick up units from origin AND intermediate systems along ship movement paths
- Implemented: Cannot pick up units from systems with own command token (Rule 95.3)
- Implemented: `validPickupSystems` built from all `movedShipPaths` (excluding destination)

#### 100. Wormhole Nexus — IMPLEMENTED
- **IMPL: Yes** — Activation state tracking + wormhole filtering
- **TEST: Yes** — Galaxy tests updated for nexus activation
- Implemented: `state.wormholeNexusActive` tracks inactive/active state
- Implemented: Inactive = gamma only; active = alpha + beta + gamma
- Implemented: Activates when units enter nexus system (movement)
- Implemented: Activates when Mallice is controlled (_establishControl)
- Implemented: Galaxy.js `_getTileWormholes()` filters wormholes based on activation state

#### 78. Space Combat — Excess Capacity — IMPLEMENTED
- **IMPL: Yes** — Post-combat capacity enforcement with player choice
- **TEST: Yes**
- Implemented: After space combat, excess fighters/ground forces removed
- Implemented: Player chooses which unit type to remove when mixed types present (Rule 78)
- Implemented: Auto-removes when only one capacity-requiring type exists
- Implemented: Only enforced when space combat actually occurred (not during transit)
- Implemented: Capacity-exempt units (faction abilities) respected

#### 31. Destroyed — IMPLEMENTED
- **IMPL: Yes** — `onUnitDestroyed` hooks for Assault Cannon, AFB, Crown of Thalnos, Space Cannon Offense/Defense
- **TEST: Yes** — Tested via faction abilities and combat tests
- Gravity rift/fleet pool remain hook-free (removal, not destruction)

#### 30. Deploy — IMPLEMENTED
- **IMPL: Yes** — `_hasReinforcementsAvailable` helper validates reinforcement limits for all 12 faction deploy mechanics
- **TEST: Yes** — Tested via faction-specific deploy abilities

---

### MEDIUM — Secondary Features Missing

#### 32. Diplomacy (Strategy Card) — IMPLEMENTED
- **IMPL: Yes** — Token deduction from command sheet, no-token edge case
- **TEST: Yes** — Tests in `strategicAction.test.js`
- Implemented: Cannot choose Mecatol Rex system in primary (Rule 32)
- Implemented: Secondary lets player choose which 2 planets to ready
- Implemented: Command token placed deducts from player's command sheet (tactics → strategy → fleet fallback); no token placed if player has 0 tokens

#### 99. Warfare (Strategy Card) — IMPLEMENTED
- **IMPL: Yes** — Token redistribution uses `redistribute-tokens` action (same as status phase)
- **TEST: Partial**
- Implemented: `_redistributeTokens()` accepts player token allocation via action

#### 53. Legendary Planets — IMPLEMENTED
- **IMPL: Yes** — 4 standard legendary abilities (Hope's End, Primor, Mallice, Mirage) + Custodia Vigilia (space cannon, production, imperial reactive)
- **TEST: Yes** — `tests/legendaryPlanets.test.js` (11 tests)
- Exhaust/ready at end-of-turn pattern in `systems/legendaryPlanets.js`
- Custodia Vigilia wired into `spaceCannon.js`, `production.js`, `strategyCards.js`

#### 69. Promissory Notes — IMPLEMENTED
- **IMPL: Yes**
- **TEST: Yes**
- Implemented: Max 1 promissory note per side per transaction (Rule 69.2)
- Implemented: Support for the Throne passive +1 VP to holder
- Implemented: Support for the Throne returned when activating system with giver's units
- Implemented: Trade Agreement returned at strategy phase start, holder receives TGs equal to owner's commodity value
- Implemented: Ceasefire returned at turn start, giver blocked from activating holder's systems for the round
- Note: Eliminated player's promissory notes returned to game box — covered by elimination logic

#### 94. Transactions — IMPLEMENTED
- **IMPL: Yes**
- **TEST: Partial**
- Implemented: Agenda phase transactions (Rule 94.6) — 1 transaction per player per agenda, any player (not just neighbors)
- Implemented: "Transaction" option in vote prompt, per-agenda tracking via `state.agendaTransactions`
- Implemented: Max 1 promissory per transaction enforcement (Rule 69.2)

#### 61. Objectives — IMPLEMENTED
- **IMPL: Yes**
- **TEST: Yes**
- Implemented: Max 3 secret objectives hand limit (Rule 61.21)
- Implemented: Game ends when speaker cannot reveal an objective card (Rule 61.15) — most VP wins, tiebreak by initiative order
- Implemented: Tie-breaking when multiple players reach 10 VP simultaneously (Rule 98.7)

#### 98. Victory Points — IMPLEMENTED
- **IMPL: Yes**
- **TEST: Yes**
- Implemented: Simultaneous 10 VP tie-breaking (earliest in initiative order wins)
- Implemented: Game end from no unrevealed objectives (most VP wins, tie = first in initiative order)

#### 84. Strategy Phase — 3-4 Player Rules — IMPLEMENTED
- **IMPL: Yes**
- **TEST: Partial**
- Implemented: Players cannot pass until all strategy cards used (`hasUsedStrategyCard()` checks `every(c => c.used)`)
- Implemented: Card picking (snake draft for 2 cards) works correctly

#### 87. Sustain Damage
- **IMPL: Complete**
- **TEST: Yes** — Dreadnought and war sun sustain damage tested in `rulesAuditLow.test.js`
- ~~Missing: Cannot cancel direct-destroy effects (Rule 87.5)~~ — Already correct: all direct-destroy effects use `splice()` bypassing the sustain/hit-assignment system

---

### LOW — Edge Cases / Minor Gaps

#### 9. Anomalies
- ~~Missing IMPL: Vuil'raith Dimensional Tear dynamic gravity rift~~ — **IMPLEMENTED** in `twilight.js` (`_getDimensionalTearOwner`), `Galaxy.js` (pathfinding +1 move), `movement.js` (die roll with owner exemption). Tested in `rulesAuditLow.test.js`
- ~~Missing: Tests for systems that are two different anomalies simultaneously~~ — **NOT APPLICABLE**: No standard tiles have dual anomalies. Dimensional Tear (dynamic gravity rift) could theoretically overlap with a tile anomaly, but code handles each anomaly type independently (movement.js checks gravity rift, movement.js checks nebula move clamp separately)

#### 10. Anti-Fighter Barrage
- ~~Missing test: AFB fires even when no fighters present (hits have no effect)~~ — **TESTED** in `spaceCombat.test.js`
- ~~Missing test: Combat modifiers don't affect AFB rolls~~ — **TESTED** in `rulesAuditLow.test.js` (Sardakk +1 doesn't boost AFB)

#### 15. Bombardment
- ~~Missing test: L1Z1X Harrow doesn't target own ground forces~~ — **TESTED** in `rulesAuditLow.test.js`
- ~~Missing test: Plasma Scoring +1 die bonus~~ — **TESTED** in `invasion.test.js`
- ~~Missing IMPL: Multiple planet invasion~~ — **IMPLEMENTED**: `_invasionStep` loops over all enemy planets; auto-commits ground forces to first planet, subsequent planets get bombardment/combat if forces remain in space. Tested in `rulesAuditLow.test.js`
- ~~X-89 Bacterial Weapon ΩΩ~~ — **IMPLEMENTED** — Doubles bombardment hits + exhausts bombarded planet (`combat.js`), tested in `x89BacterialWeapon.test.js`

#### 16. Capacity
- ~~Missing: Explicit excess capacity removal mechanism mid-game~~ — Covered by Rule 78 implementation (post-combat excess capacity with player choice)

#### 18. Combat Attribute
- ~~Missing test: Burst icon mechanics (multi-dice units)~~ — **TESTED** in `rulesAuditLow.test.js` (war sun 3-dice burst)

#### 28. Deals — BY DESIGN
- ~~Binding vs non-binding distinction not enforced~~ — Social contract only; engine cannot enforce player honesty. Transactions (trade goods, promissory notes) are enforced mechanically; deal promises are inherently social

#### 39. Game Board — HANDLED BY ARCHITECTURE
- ~~Missing: Explicit edge detection function~~ — Galaxy.js hex grid adjacency handles edge systems naturally (fewer neighbors). No game mechanic explicitly references "edge" systems; adjacency is computed dynamically via BFS pathfinding

#### 42. Ground Combat
- ~~Missing test: Draw scenario (both sides eliminated simultaneously)~~ — **TESTED** in `invasion.test.js`
- ~~Missing test: Start/end of combat timing window hooks~~ — **TESTED** in `rulesAuditLow.test.js` (Magen Defense Grid auto-hit)

#### 51. Leaders — IMPLEMENTED
- **IMPL: Yes** — Hero purge, agent ready-in-status-phase wired in `twilight.js:1012-1024`
- **TEST: Yes** — Hero purge tested across all 25 factions
- ~~Missing test: Titans hero exception (not purged, attached to Elysium)~~ — **FIXED + TESTED** — `geoform` no longer purges hero (Rule 51 exception); tested in `rulesAuditLow.test.js` and `titans-of-ul.test.js`

#### 54. Mecatol Rex
- Implemented via custodians token — no separate gaps

#### 56. Modifiers
- ~~Missing test: Modifier bounds clamping (effective combat 1-10)~~ — **TESTED** in `spaceCombat.test.js` (Sardakk N'orr combat modifier)

#### 58. Movement
- ~~Missing test: Ship moving through own command tokens~~ — **TESTED** in `rulesAuditLow.test.js`
- ~~Missing: Explicit handling that ability movement follows ability rules~~ — **HANDLED BY ARCHITECTURE**: Each ability implements its own movement logic (direct unit splice/push) rather than calling `_movementStep`. Tactical movement uses `_movementStep` (activation, command tokens, pathfinding, capacity); ability movement uses per-ability code that bypasses these restrictions

#### 62. Opponent — ENFORCED BY ARCHITECTURE
- ~~Missing IMPL+test: Non-participants can't use opponent-targeting abilities~~ — Combat hooks only fire for `[attacker, defender]` (2 players). Non-participants never have their faction abilities called during combat. See `factionAbilities.js:892` — `onSpaceCombatStart` iterates `[[attacker, defender], [defender, attacker]]`.

#### 63. PDS — IMPLEMENTED
- **IMPL: Yes** — PDS destroyed via `_establishControl` when attacker takes planet
- **TEST: Partial** — Covered by invasion tests

#### 64. Planets
- No gaps identified

#### 65. Planetary Shield — IMPLEMENTED
- **IMPL: Yes** — X-89 ΩΩ doubles hits; Harrow respects planetary shield (fixed in `l1z1x-mindnet.js`)
- **TEST: Yes** — `rulesAuditLow.test.js`: Harrow blocked by planetary shield

#### 66. Politics (Strategy Card)
- No gaps identified — well implemented and tested

#### 67. Producing Units — IMPLEMENTED
- **IMPL: Yes** — Reinforcements cap enforced in `production.js` (Rule 67)
- **TEST: Yes** — `production.test.js`: 3 tests for reinforcements cap (at limit, partial, unlimited)

#### 68. Production (Unit Ability) — IMPLEMENTED
- Implemented: Arborec space dock restriction (can't produce infantry from space docks) — `isProductionRestricted` hook
- **TEST: Yes** — 2 tests in `arborec.test.js`

#### 70. Purge
- Implemented for relics and heroes; no general gaps

#### 76. Ships
- No gaps beyond fleet pool (covered in 37)

#### 77. Space Cannon
- ~~Missing test: Graviton Laser System (SC hits target non-fighter ships)~~ — **TESTED** in `spaceCannon.test.js`
- ~~Missing test: Plasma Scoring bonus~~ — **TESTED** in `spaceCannon.test.js`
- ~~Missing test: Hero attachment space cannon abilities~~ — **TESTED** in `rulesAuditLow.test.js` (Titans Geoform Elysium fires space cannon offense)

#### 79. Space Dock
- Implemented: Space dock destroyed when attacker takes control of planet (in `_establishControl`)
- Note: Rule 79.4 covered by existing invasion flow — defender structures removed when attacker has forces and defender doesn't

#### 80. Speaker — IMPLEMENTED
- Implemented: Speaker passes to next player on elimination (Rule 80.7) — see Elimination section

#### 81. Status Phase
- No major gaps — all 8 steps implemented

#### 82. Strategic Action — IMPLEMENTED
- Implemented: 3-4 player must resolve both strategy cards before passing (see Strategy Phase section)

#### 83. Strategy Card (General)
- No gaps

#### 89. Tactical Action
- No major gaps — all 5 steps implemented

#### 92. Trade (Strategy Card)
- No gaps — well implemented

#### 101. Wormholes
- ~~Missing test: PDS II firing through wormholes (integration test)~~ — **TESTED** in `spaceCannon.test.js`

---

## Summary by Priority

### CRITICAL (Resolved or partially resolved)
1. ~~**Capture system** (Rule 17)~~ — Blockade restrictions, transaction returns, production prevention (Rule 17.5) all implemented
2. ~~**Elimination system** (Rule 33)~~ — **IMPLEMENTED** — Core detection, component removal, speaker transfer
3. ~~**Imperial primary** (Rule 45)~~ — **IMPLEMENTED** — Public objective scoring in primary
4. ~~**Leadership influence spending** (Rule 52)~~ — **IMPLEMENTED** — Primary: 3 tokens + spend influence; Secondary: free influence spending
5. ~~**Technology 2nd research + secondary cost** (Rule 91)~~ — **IMPLEMENTED** — 6R 2nd tech + 4R secondary cost
6. ~~**Construction secondary system restriction** (Rule 24)~~ — **IMPLEMENTED** — Command token + system scoping

### HIGH (Core mechanics incomplete)
7. ~~**Gravity Rift** (Rule 41)~~ — **IMPLEMENTED** — +1 move, per-rift die roll, Circlet exemption
8. ~~**Nebula combat/movement** (Rule 59)~~ — **IMPLEMENTED** — Move clamp, defender bonus, active-system-only entry
9. ~~**Transport from path** (Rule 95)~~ — **IMPLEMENTED** — Path-based pickup from origin + intermediate systems
10. ~~**Wormhole Nexus activation** (Rule 100)~~ — **IMPLEMENTED** — Inactive/active state tracking, wormhole filtering
11. ~~**Post-combat excess capacity** (Rule 78)~~ — **IMPLEMENTED** — Player choice for mixed-type removal after combat
12. ~~**Deploy ability** (Rule 30)~~ — **IMPLEMENTED** — `_hasReinforcementsAvailable` helper validates reinforcement limits for all 12 faction deploy mechanics
13. ~~**Destroyed vs Removed distinction** (Rule 31)~~ — **IMPLEMENTED** — `onUnitDestroyed` hooks for Assault Cannon, AFB, Crown of Thalnos, Space Cannon Offense/Defense; gravity rift/fleet pool remain hook-free (removal, not destruction)

### LOW (Resolved)
24. ~~**Reinforcements cap in production** (Rule 67)~~ — **IMPLEMENTED** — `production.js` validates per-unit-type limits
25. ~~**Harrow ignores planetary shield** (Rule 65)~~ — **FIXED** — `_harrowBombardment` in `l1z1x-mindnet.js` now checks planetary shield
26. ~~**Missing tests** (Rules 10, 15, 18, 42, 58, 65)~~ — **TESTED** — 6 integration tests in `rulesAuditLow.test.js`
27. ~~**Arborec infantry restriction** (Rule 68)~~ — **IMPLEMENTED** — `isProductionRestricted` hook in factionAbilities
28. ~~**Captured units block production** (Rule 17.5)~~ — **IMPLEMENTED** — `_countUnitsOnBoard` includes captured units

### MEDIUM (Secondary features)
14. ~~**Diplomacy token deduction** (Rule 32)~~ — **IMPLEMENTED** — Token deduction from command sheet + Mecatol exclusion
15. ~~**Warfare token redistribution** (Rule 99)~~ — **IMPLEMENTED** — Uses `redistribute-tokens` action
16. ~~**Legendary Planets** (Rule 53)~~ — **IMPLEMENTED** — 4 standard + Custodia Vigilia abilities
17. ~~**3-4 player dual strategy card pass restriction** (Rules 3.4, 82.2)~~ — **IMPLEMENTED** — `hasUsedStrategyCard()` already checks all cards
18. ~~**Game end from no objectives** (Rule 61.15)~~ — **IMPLEMENTED**
19. ~~**Simultaneous VP tiebreaking** (Rule 98.7)~~ — **IMPLEMENTED**
20. ~~**Max 3 secret objectives** (Rule 61.21)~~ — **IMPLEMENTED**
21. ~~**Agenda phase transactions** (Rule 94.6)~~ — **IMPLEMENTED** — Transaction option in vote prompt
22. ~~**Promissory note return/limit** (Rule 69)~~ — **IMPLEMENTED** — SFT VP + return, Trade Agreement, Ceasefire
23. ~~**Sustain Damage vs direct destroy** (Rule 87.5)~~ — **ALREADY CORRECT** — Direct-destroy effects use `splice()` bypassing sustain/hit-assignment
