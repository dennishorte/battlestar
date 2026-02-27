# Exploration & Relics Implementation Plan

Full implementation of the PoK exploration system: exploration card effects, planet attachments, relic fragments, relic deck, and all associated UI.

## Current State

### What works
- All 4 exploration decks defined in `res/explorationCards.js` (cultural, hazardous, industrial, frontier — 20 cards each, 80 total)
- Core `_explorePlanet()` in `systems/exploration.js` — draws cards, stores attachments/fragments in state
- Exploration triggers on invasion (establish control) and via Scanlink Drone Network tech
- Faction hooks: Naaz-Rokha Distant Suns (bonus card), Titans sleeper placement, Naaz-Rokha Fabrication (2-fragment purge → real relic), Black Market Forgery PN (→ real relic), Empyrean Multiverse Shift, Mahact Vaults of the Heir (→ real relic), Perfect Synthesis hero (→ real relic)
- Relic card data complete in `res/relics.js` (16 relics across PoK, Codex II, Codex IV)
- Attachment bonuses applied to resource/influence/tech calculations and agenda voting
- Relic deck with `_initRelicDeck()` / `_gainRelic()`, on-gain effects (Shard of the Throne VP, The Obsidian secret objective)
- General 3-fragment purge component action with unknown-wildcard support
- `setBoard` supports `relicDeck` and `relicsGained` for tests

### Missing engine features
- Gamma wormhole attachment stored but not applied to adjacency
- Demilitarized Zone immediate effect (return structures/ground forces) and ongoing restriction (no units committed/produced/placed)
- 5 deferred action-type exploration cards (require complex subsystems)
- Book of Latvinia on-gain effect (research 2 no-prereq techs)
- Relic ACTION component actions (Dominus Orb, Stellar Converter, The Codex, Nano-Forge, etc.)
- Relic passive/trigger effects in gameplay (Crown of Thalnos combat reroll, Scepter of Emelpar strategy token, etc.)

### Missing UI
- Gamma wormhole tokens on map (deferred with gamma wormhole card)

---

## Phase 1: Fix Existing Bugs — DONE

1. ~~**Fix Dark Energy Tap** in `twilight.js`~~ — replaced inline handler with `_exploreFrontier()` call
2. ~~**Fix Empyrean Multiverse Shift**~~ — replaced inline handler with `_exploreFrontier()` call
3. Added shared `_resolveExplorationCard()` and `_exploreFrontier()` methods in `systems/exploration.js`

## Phase 2: Exploration Card Effects — DONE (15 of 18 cards implemented)

Implemented `_resolveActionExploration()` dispatcher in `systems/exploration.js` with a switch on base card ID. 15 cards fully implemented with integration tests. 3 cards deferred (require complex subsystems).

### Cultural actions (6 cards) — 3 of 6 done
3. ~~**Mercenary Outfit** (x3)~~: place 1 infantry from reinforcements on this planet
4. **Freelancers** (x3): DEFERRED — requires mini-production flow (spend influence as resources)
5. **Gamma Wormhole** (x1): DEFERRED — requires wormhole token system

### Industrial actions (12 cards) — 12 of 12 done
6. ~~**Abandoned Warehouses** (x4)~~: gain 2 commodities OR convert up to 2 commodities to TG
7. ~~**Functioning Base** (x4)~~: gain 1 commodity OR spend 1 TG/commodity to draw 1 action card
8. ~~**Local Fabricators** (x4)~~: gain 1 commodity OR spend 1 TG/commodity to place 1 mech

### Hazardous actions (9 cards) — 9 of 9 done
9. ~~**Core Mine** (x3), **Expedition** (x3), **Volatile Fuel Source** (x3)~~: shared "if mech on planet OR remove 1 infantry" conditional. Core Mine → gain 1 TG, Expedition → ready planet, Volatile Fuel Source → gain 1 command token (pool selection)

### Frontier actions (14 cards) — 9 of 14 done
10. ~~**Lost Crew** (x2)~~: draw 2 action cards
11. ~~**Merchant Station** (x2)~~: replenish commodities OR convert commodities to TG
12. ~~**Derelict Vessel** (x2)~~: draw 1 secret objective
13. ~~**Entropic Field** / **Major** / **Minor** (x3)~~: gain TG + command tokens (pool selection)
14. ~~**Keleres Ship** (x2)~~: gain 2 command tokens (pool selection)
15. ~~**Dead World** (x1)~~: gain 1 relic from relic deck
16. **Enigmatic Device** (x2): DEFERRED — persistent card in play area with ACTION ability
17. **Gamma Relay** (x1): DEFERRED — requires wormhole token system
18. **Ion Storm** (x1): DEFERRED — persistent token with flip mechanic
19. **Mirage** (x1): DEFERRED — dynamic planet creation

### Attach card with immediate effect
20. **Demilitarized Zone** (x1): DEFERRED — attaches correctly, but immediate effect (return structures/ground forces) and ongoing restriction (no units committed/produced/placed) not yet implemented

## Phase 3: Attachment Bonuses — DONE

Added `_getPlanetAttachmentBonuses(planetId)` helper in `systems/exploration.js`. Returns `{ resources, influence, techSpecialties[] }` from all attachments on a planet. Research facility fallback logic: if planet already has a tech specialty, grants +1/+1 resources/influence instead of a new specialty.

20. ~~**Update `TwilightPlayer.getTotalResources()`**~~ — adds attachment resource bonuses
21. ~~**Update `TwilightPlayer.getTotalInfluence()`**~~ — adds attachment influence bonuses
22. ~~**Update `getTechPrerequisites()`**~~ — counts attachment-granted tech specialties (respects exhaustion + Psychoarchaeology)
23. ~~**Update agenda voting**~~ — both display string and vote tally include attachment influence
24. **Apply Demilitarized Zone** restrictions to production and unit placement — DEFERRED
25. **Apply gamma wormhole** to adjacency/wormhole calculations — DEFERRED

## Phase 4: Relic System — DONE

26. ~~**Implement relic deck**~~ — `_initRelicDeck()` lazily initializes `state.relicDeck` as shuffled array of all 16 relic IDs
27. ~~**Implement `_gainRelic(playerName)`**~~ — draws from relic deck, stores in `state.relicsGained[playerName][]`, logs, fires on-gain effects and `onRelicGained` hook
28. ~~**Implement general 3-fragment purge**~~ — component action in `componentActions.js` with `_canPurgeRelicFragments` / `_executePurgeRelicFragments`. Unknown fragments work as wildcards. Prefers typed fragments when removing.
29. ~~**Replace stub relic references**~~ — Naaz-Rokha Fabrication, Black Market Forgery PN, Perfect Synthesis hero, Mahact Vaults of the Heir all call `_gainRelic()` now
30. ~~**On-gain effects**~~: Shard of the Throne (+1 VP), The Obsidian (draw secret objective)
31. **Book of Latvinia** on-gain (research 2 no-prereq techs): DEFERRED — requires tech selection flow
32. ~~**`setBoard` support**~~ — `relicDeck` and `relicsGained` in `testutil.js`

## Phase 5: Relic Abilities (not yet started)

Relics that have ACTION, passive, or trigger effects need engine implementation:

33. **Dominus Orb** (trigger: beforeMovement) — purge to move units from systems with your command tokens
34. **Maw of Worlds** (trigger: startOfAgendaPhase) — purge + exhaust all planets to gain 1 tech
35. **Scepter of Emelpar** (trigger: onSpendStrategyToken) — exhaust to spend from reinforcements instead
36. **Stellar Converter** (action) — destroy all units on a non-home planet, place destroyed planet token
37. **The Codex** (action) — purge to take up to 3 action cards from discard pile
38. **The Crown of Emphidia** (trigger: afterTacticalAction) — exhaust to explore 1 planet; purge at status phase if controlling Tomb of Emphidia for +1 VP
39. **The Crown of Thalnos** (passive) — combat reroll with +1, units that miss are destroyed
40. **The Prophet's Tears** (trigger: onResearchTechnology) — exhaust to ignore 1 prereq or draw action card
41. **Dynamis Core** (action + passive) — +2 commodity value; purge to gain TG equal to commodity value
42. **JR-XS455-O** (action) — exhaust to let a player spend 3 resources for a structure or gain 1 TG
43. **Nano-Forge** (action) — attach to planet for +2/+2 and legendary status
44. **Circlet of the Void** (action + passive) — ignore gravity rifts/anomalies; exhaust to explore frontier
45. **Neuraloop** (trigger: onPublicObjectiveRevealed) — purge a relic to replace objective

## Phase 6: UI — Map — DONE

46. ~~**Frontier tokens on map**~~ — "F" badge on empty systems that haven't been explored yet
47. ~~**Attachment indicators on planets**~~ — orange dot on planet indicators in hex tiles when attachments present
48. **Gamma wormhole tokens** on systems where placed via exploration — DEFERRED (gamma wormhole card deferred)

## Phase 7: UI — Player Tableau — DONE

49. ~~**Relic fragment chips**~~ on player panel — monospace counts by type (C/H/I/?), color-coded, hidden when zero
50. ~~**Relic cards display**~~ — orange-bordered chips on player panel, clickable to open CardDetailModal with relic type/effect
51. ~~**Planet attachment display**~~ — planet R/I values include attachment bonuses, `+` indicator, attachment tech specialty circles
52. ~~**Relic detail in CardDetailModal**~~ — type badge, exhaust/purge indicators, effect text
53. ~~**Planet attachments in CardDetailModal**~~ — attachment names shown as orange tags below controller
54. ~~**Planet attachments in SystemDetailModal**~~ — attachment names shown on planet detail cards

## Phase 8: UI — Exploration Log — DONE

55. ~~**Exploration log entries**~~ — `planet` args resolve to proper names, `relic` args render as clickable orange chips (TiRelicToken), `card` args already rendered as TiCardToken chips

---

## Dependencies

- Phase 1 has no dependencies — DONE
- Phase 2 depends on Phase 1 — DONE (3 cards deferred for subsystems)
- Phase 3 depends on attachment data — DONE (2 items deferred: Demilitarized Zone, gamma wormhole)
- Phase 4 depends on `res/relics.js` — DONE (Book of Latvinia deferred)
- Phase 5 (relic abilities) can be done incrementally, no hard blockers
- Phases 6-8 (UI) — DONE (gamma wormhole token deferred with engine work)
- Wormhole token system is shared blocker for Gamma Wormhole, Gamma Relay, and gamma adjacency

## Rules Reference

Key rules from the Living Rules Reference:

- **35.1**: Gaining control of an uncontrolled planet triggers exploration
- **35.2**: Draw from the deck matching the planet's trait (cultural/hazardous/industrial)
- **35.2b**: Traitless planets (Mecatol Rex, home systems) cannot be explored
- **35.4**: Frontier tokens require Dark Energy Tap tech or equivalent to explore
- **35.6**: Frontier tokens are discarded after exploration
- **35.7**: Exploration cards are discarded after resolution UNLESS they are relic fragments or attachments
- **35.8**: Cards with "attach" header attach to the explored planet
- **35.9**: Cards with "relic fragment" in the title go to the player's play area; can be traded via transactions
- **73.1**: Purge 3 fragments of same type to gain 1 relic
- **73.2**: Gain a relic = draw top card of relic deck
- **73.4**: Relics cannot be traded (but relic fragments can)
- **94.2**: Transactions can include relic fragments

## Testing

All tests must be integration tests per `docs/specs/testing.md`. No calling game methods directly — use `t.fixture()`, `t.setBoard()`, `t.choose()`, `t.action()`, `t.testBoard()`, and `t.currentChoices()` only. The engine is a black box. Reading `game.state.*` for assertions is OK but never mutate state after `game.run()`. Use `t.setBoard({ explorationDecks: { ... } })` to control which cards are drawn. Use `t.setBoard({ relicDeck: [...] })` to control which relics are drawn.
