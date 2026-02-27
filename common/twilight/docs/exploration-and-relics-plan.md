# Exploration & Relics Implementation Plan

Full implementation of the PoK exploration system: exploration card effects, planet attachments, relic fragments, relic deck, and all associated UI.

## Current State

### What works
- All 4 exploration decks defined in `res/explorationCards.js` (cultural, hazardous, industrial, frontier — 10 cards each)
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
- 6 exploration cards have no `resolve()` function: `lazax-survivors`, `derelict-vessel`, `lost-crew`, `gamma-relay`, `ion-storm`, `mirage`
- Gamma wormhole attachment stored but not applied to adjacency

### Missing UI
- No frontier token indicators on map
- No attachment indicators on planets (map or player tableau)
- No relic fragment display on player tableau
- No relic card display on player tableau
- No exploration card reveal flow

---

## Phase 1: Fix Existing Bugs

1. **Fix Dark Energy Tap** in `twilight.js` — use `card.resolve?.()` for effects and `card.fragmentType` for fragments
2. **Fix Empyrean Multiverse Shift** — same `card.relicFragment` → `card.fragmentType` fix
3. **Add missing `resolve()` functions** to exploration cards in `res/explorationCards.js`:
   - `lazax-survivors`: gain 1 infantry on explored planet (needs planet context passed to resolve)
   - `derelict-vessel` / `lost-crew`: draw 2 action cards
   - `gamma-relay`: place gamma wormhole token in system
   - `ion-storm`: place Ion Storm token — may defer, requires new token type
   - `mirage`: add Mirage planet to system — may defer, requires dynamic planet creation

## Phase 2: Attachment Bonuses

4. **Update `TwilightPlayer.getTotalResources()`** to read `state.planets[planetId].attachments` and sum `getExplorationCard(cardId).attachment.resources`
5. **Update `TwilightPlayer.getTotalInfluence()`** — same pattern for `.attachment.influence`
6. **Update tech specialty handling** to include specialties from attached exploration cards (biotic/cybernetics/propulsion/warfare research facilities)
7. **Apply Demilitarized Zone** PRODUCTION 1 to production calculations
8. **Apply gamma wormhole attachment** to adjacency/wormhole calculations

## Phase 3: Relic System

9. **Implement relic deck** in state initialization — `state.relicDeck` as shuffled array of relic IDs
10. **Implement `_gainRelic(playerName)`** — draw from relic deck, store full card info in player state, fire `onRelicGained` hook
11. **Implement general 3-fragment purge** as an anytime/component action — purge 3 fragments of same type (unknown fragments act as wildcards) to gain 1 relic
12. **Replace stub relic references** in Naaz-Rokha Fabrication, Black Market Forgery PN, Perfect Synthesis hero, and Mahact Vaults of the Heir to call real `_gainRelic()`
13. **Implement relic on-gain effects** for relics with immediate effects: The Obsidian (draw secret objective), Book of Latvinia (research 2 no-prereq techs), Shard of the Throne (+1 VP)

## Phase 4: UI — Map

14. **Frontier tokens on map** — show frontier token indicator on systems with no planets
15. **Attachment indicators on planets** — show small icons on planets that have attachments (resource bonus, influence bonus, tech specialty, wormhole)
16. **Gamma wormhole tokens** on systems where placed via exploration

## Phase 5: UI — Player Tableau

17. **Relic fragment chips** on player panel — show counts by type (cultural/hazardous/industrial/unknown) with purge action
18. **Relic cards display** — show gained relics with their abilities (similar to technology cards)
19. **Planet attachment display** — show attachment bonuses on planet cards in player area (e.g., "+2" overlay from Dyson Sphere)

## Phase 6: UI — Exploration Flow

20. **Exploration card reveal** — when a planet is explored, show the drawn card before resolving (important for multi-card choice with Naaz-Rokha)
21. **Exploration log entries** — ensure exploration results appear in game log with card names/effects

---

## Dependencies

- Phase 1 has no dependencies — can start immediately
- Phase 2 has no dependencies — can run in parallel with Phase 1
- Phase 3 depends on `res/relics.js` (done)
- Phases 4-6 (UI) can be done incrementally alongside or after engine work

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
