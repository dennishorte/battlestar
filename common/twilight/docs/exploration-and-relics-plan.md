# Exploration & Relics Implementation Plan

Full implementation of the PoK exploration system: exploration card effects, planet attachments, relic fragments, relic deck, and all associated UI.

## Current State

### What works
- All 4 exploration decks defined in `res/explorationCards.js` (cultural, hazardous, industrial, frontier — 20 cards each, 80 total)
- Core `_explorePlanet()` in `systems/exploration.js` — draws cards, stores attachments/fragments in state
- Exploration triggers on invasion (establish control) and via Scanlink Drone Network tech
- Faction hooks: Naaz-Rokha Distant Suns (bonus card), Titans sleeper placement, Naaz-Rokha Fabrication (2-fragment purge), Black Market Forgery PN, Empyrean Multiverse Shift, Mahact Vaults of the Heir
- Relic card data complete in `res/relics.js` (16 relics across PoK, Codex II, Codex IV)

### Known bugs
- **Dark Energy Tap** handler in `twilight.js` (~line 1342) references `card.tradeGoods` and `card.relicFragment` — these fields don't exist on frontier cards. Should use `card.resolve?.()` and `card.fragmentType`
- **Empyrean Multiverse Shift** in `systems/factions/empyrean.js` (~line 213) references `card.relicFragment` instead of `card.fragmentType`

### Missing engine features
- Attachment bonuses stored in `state.planets[id].attachments[]` but never applied to resource/influence/tech calculations
- No relic deck, no relic draw mechanic — `relicsGained` is just a string array stub
- No general 3-fragment purge action (only Naaz-Rokha Fabrication's 2-fragment variant exists)
- All 42 action-type exploration cards need engine implementation (no `resolve()` functions)
- 1 attach card (Demilitarized Zone) has an immediate effect on explore that needs implementation
- Gamma wormhole attachment stored but not applied to adjacency

### Missing UI
- No frontier token indicators on map
- No attachment indicators on planets (map or player tableau)
- No relic fragment display on player tableau
- No relic card display on player tableau
- No exploration card reveal flow

---

## Phase 1: Fix Existing Bugs

1. **Fix Dark Energy Tap** in `twilight.js` — the frontier exploration handler references `card.tradeGoods` and `card.relicFragment` which don't exist on frontier cards. Needs to route through the same card resolution logic as `_explorePlanet`
2. **Fix Empyrean Multiverse Shift** — same `card.relicFragment` → `card.fragmentType` fix

## Phase 2: Exploration Card Effects

Implement effects for all 42 action-type cards and 1 attach card with an immediate effect. The current `_explorePlanet()` calls `card.resolve(player)` for action cards, but the real effects need game context (planet, system, choice prompts). This likely means moving resolution logic into `systems/exploration.js` with a dispatcher rather than inline `resolve()` functions on the card data.

### Cultural actions (6 cards)
3. **Freelancers** (x3): produce 1 unit in this system; may spend influence as resources
4. **Mercenary Outfit** (x3): place 1 infantry from reinforcements on this planet

### Industrial actions (12 cards)
5. **Abandoned Warehouses** (x4): gain 2 commodities OR convert up to 2 commodities to TG
6. **Functioning Base** (x4): gain 1 commodity OR spend 1 TG/commodity to draw 1 action card
7. **Local Fabricators** (x4): gain 1 commodity OR spend 1 TG/commodity to place 1 mech

### Hazardous actions (9 cards, shared pattern)
8. **Core Mine** (x3), **Expedition** (x3), **Volatile Fuel Source** (x3): all share the "if mech on planet OR remove 1 infantry" conditional. Core Mine → gain 1 TG, Expedition → ready planet, Volatile Fuel Source → gain 1 command token (pool selection)

### Frontier actions (14 cards)
9. **Lost Crew** (x2): draw 2 action cards
10. **Merchant Station** (x2): replenish commodities OR convert commodities to TG
11. **Derelict Vessel** (x2): draw 1 secret objective
12. **Entropic Field** / **Major** / **Minor** (x3): gain TG + command tokens (pool selection)
13. **Keleres Ship** (x2): gain 2 command tokens (pool selection)
14. **Enigmatic Device** (x2): persistent card in play area, ACTION: spend 6 resources + purge → research 1 tech
15. **Gamma Relay** (x1): place gamma wormhole token in system, purge card
16. **Dead World** (x1): draw 1 relic (depends on Phase 4)
17. **Ion Storm** (x1): place ion storm token, persistent card in common area, flip mechanic — may defer
18. **Mirage** (x1): place Mirage planet token, gain planet card — may defer (dynamic planet creation)

### Attach card with immediate effect
19. **Demilitarized Zone** (x1): on explore, return structures to reinforcements, return ground forces to space area. Ongoing: units cannot be committed to, produced on, or placed on this planet.

## Phase 3: Attachment Bonuses

20. **Update `TwilightPlayer.getTotalResources()`** to read `state.planets[planetId].attachments` and sum `getExplorationCard(cardId).attachment.resources`
21. **Update `TwilightPlayer.getTotalInfluence()`** — same pattern for `.attachment.influence`
22. **Update tech specialty handling** to include specialties from attached exploration cards. Research facilities have a fallback: if planet already has a specialty, grant +1/+1 instead
23. **Apply Demilitarized Zone** restrictions to production and unit placement
24. **Apply gamma wormhole** to adjacency/wormhole calculations

## Phase 4: Relic System

25. **Implement relic deck** in state initialization — `state.relicDeck` as shuffled array of relic IDs
26. **Implement `_gainRelic(playerName)`** — draw from relic deck, store full card info in player state, fire `onRelicGained` hook
27. **Implement general 3-fragment purge** as an anytime/component action — purge 3 fragments of same type (unknown fragments act as wildcards) to gain 1 relic
28. **Replace stub relic references** in Naaz-Rokha Fabrication, Black Market Forgery PN, Perfect Synthesis hero, and Mahact Vaults of the Heir to call real `_gainRelic()`
29. **Implement relic on-gain effects** for relics with immediate effects: The Obsidian (draw secret objective), Book of Latvinia (research 2 no-prereq techs), Shard of the Throne (+1 VP)

## Phase 5: UI — Map

30. **Frontier tokens on map** — show frontier token indicator on systems with no planets
31. **Attachment indicators on planets** — show small icons on planets that have attachments (resource bonus, influence bonus, tech specialty, wormhole)
32. **Gamma wormhole tokens** on systems where placed via exploration

## Phase 6: UI — Player Tableau

33. **Relic fragment chips** on player panel — show counts by type (cultural/hazardous/industrial/unknown) with purge action
34. **Relic cards display** — show gained relics with their abilities (similar to technology cards)
35. **Planet attachment display** — show attachment bonuses on planet cards in player area (e.g., "+2" overlay from Dyson Sphere)

## Phase 7: UI — Exploration Flow

36. **Exploration card reveal** — when a planet is explored, show the drawn card before resolving (important for multi-card choice with Naaz-Rokha)
37. **Exploration log entries** — ensure exploration results appear in game log with card names/effects

---

## Dependencies

- Phase 1 has no dependencies — can start immediately
- Phase 2 depends on Phase 1 (bug fixes to card resolution path)
- Phase 3 has no dependencies — can run in parallel with Phases 1-2
- Phase 4 depends on `res/relics.js` (done); Dead World card (Phase 2 item 16) depends on Phase 4
- Phases 5-7 (UI) can be done incrementally alongside or after engine work

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
