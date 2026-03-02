# Twilight Imperium UI Audit

Cross-reference of living rules against the current UI implementation (21 Vue components).
Items are grouped by category and prioritized by gameplay impact.

---

## Completed Items

The following items have been implemented:

- **Ground units on map tiles** — SystemTile shows infantry/mech/PDS/space-dock icons below planet dots, colored by owner
- **Damaged unit indicators** — Red `*` on damaged ship stacks in SystemTile; "(N damaged)" text in SystemDetailModal for both space and planet units
- **Custodians token on Mecatol Rex** — Gold "C" badge when `!game.state.custodiansRemoved`
- **Planet controller colors on map** — Planet dot border colored by controlling player
- **Gamma wormhole tokens on map** — `allWormholes` computed merges native wormholes + `gammaWormholeTokens`
- **Ion storm token on map** — Lightning icon on affected system, wormhole side integrated into `allWormholes`
- **Available (ready) resources/influence** — PlayerPanel shows "ready/total R / ready/total I" format
- **Secret objectives for owning player** — Viewer sees unscored secret names (purple border); opponents see count only
- **Exhausted relic indicators** — Relic chips fade to 0.45 opacity when in `game.state.exhaustedRelics`
- **Exhausted technology indicators** — Tech chips fade to 0.45 opacity when in `player.exhaustedTechs`
- **VP target fix** — Dynamic `vpTarget` computed; VP bars scale to target instead of hardcoded 10
- **Active laws display** — PhaseInfo shows laws from `game.state.activeLaws` with purple border, clickable to open detail
- **Public objectives area** — PhaseInfo lists revealed objectives with stage I (green) / stage II (blue) borders and colored scorer pips
- **Player name tokens in log** — TiPlayerToken.vue renders player names as colored chips with contrast text in game log
- **Reinforcements / unit supply display** — Collapsible "Supply" section in PlayerPanel showing remaining/limit for 9 unit types, color-coded green/orange/red
- **Wormhole Nexus activation state** — SystemTile shows only active γ when nexus inactive, grayed-out α β when inactive, NEXUS badge with green/gray state
- **Off-map system rendering** — GalaxyMap filters off-map systems (q≥50 or r≥50) from hex grid, renders in separate panel below; fixes Creuss home viewport distortion
- **Tactical action step tracker** — Engine tracks `currentTacticalAction.step` through activate/move/combat/invade/produce; PhaseInfo shows breadcrumb

---

## Remaining Items

### 1. Map Display (SystemTile / GalaxyMap)

*All original map display items have been completed.*

---

### 2. Player Panel

#### ~~Reinforcements / unit supply display~~ **DONE**
Collapsible "Supply" section in PlayerPanel shows remaining/limit for 9 limited unit types (WS, FS, DN, CV, CR, DD, MH, PDS, SD), color-coded green/orange/red.

#### Missing: Captured units display
**Rules**: 17.1, 17.3 -- Captured ships/mechs are placed on the capturing player's faction sheet. Captured fighters/infantry are represented by tokens.
**Current**: No display of captured units anywhere in the UI.
**Recommendation**: If any units are captured, show a "Captured Units" section on the relevant PlayerPanel.

---

### 3. Phase and Step Indicators

#### ~~Tactical action step tracker~~ **DONE**
Engine sets `currentTacticalAction.step` through activate/move/combat/invade/produce (null on early returns and completion). PhaseInfo shows green breadcrumb with completed/active/future styling.

#### Missing: Combat step tracker
**Rules**: 78.3-78.7 -- Space combat has sub-steps: Anti-Fighter Barrage (round 1 only), Announce Retreats, Roll Dice, Assign Hits, Retreat.
**Current**: No combat step display. Combat is resolved entirely through generic WaitingChoice text selections.
**Recommendation**: Add a combat step indicator when combat is active, showing the current sub-step.

#### Missing: Invasion sub-step tracker
**Rules**: 49.1-49.5 -- Invasion has sub-steps: Bombardment, Commit Ground Forces, Space Cannon Defense, Ground Combat, Establish Control.
**Current**: No invasion step display.
**Recommendation**: Show invasion sub-step when relevant.

#### Missing: Status phase step tracker
**Rules**: 81.1-81.8 -- Status phase has eight steps: Score Objectives, Reveal Objective, Draw Action Cards, Remove Tokens, Gain/Redistribute, Ready Cards, Repair, Return Strategy Cards.
**Current**: PhaseInfo shows "Status Phase" but not the current step.
**Recommendation**: Show a progress indicator for the status phase steps.

---

### 4. Dedicated Action UIs

Five dedicated action UIs exist: ActivateSystem, MoveShips, ProduceUnits, TradeOffer, RedistributeTokens. The following high-impact interactions use the generic text-based WaitingChoice selector and would benefit from dedicated UIs.

#### Missing: Combat UI (dice rolls, hit assignment, sustain damage)
**Rules**: 78.5, 42.1, 87.1, 15.1, 10.1 -- Combat involves rolling dice, displaying results, choosing sustain damage, and assigning hits. Bombardment, anti-fighter barrage, and space cannon also involve dice.
**Current**: All combat interactions use generic text choice lists. No dice are shown. Hit assignment is a plain text selection.
**Recommendation**: Build a combat UI showing: dice rolls with hit/miss highlighting, sustain damage buttons per eligible unit, and visual hit assignment.

#### Missing: Agenda voting UI
**Rules**: 8.5-8.17 -- Voting involves exhausting planets for influence, declaring an outcome (For/Against or elect target), and handling special voting effects.
**Current**: Voting uses the generic choice selector. No display of available influence, no planet exhaustion visualization.
**Recommendation**: Build a voting UI showing: available influence per planet, running vote tally, outcome selection, and abstain option.

#### Missing: Technology research UI
**Rules**: 90.9-90.15 -- Researching technology requires checking prerequisites (colored symbols), potentially exhausting planets with tech specialties to skip prerequisites.
**Current**: Tech selection is a plain text list in WaitingChoice.
**Recommendation**: Build a tech research UI showing: available technologies with prerequisite indicators, which prerequisites are met, and tech specialty planets that can be exhausted.

#### Missing: Influence/resource spending UI
**Rules**: 47.2, 75.2, 27.2, 52.2 -- Many actions require spending resources or influence by exhausting planets. Examples: removing custodians token (6 influence), Leadership (influence for tokens), objectives.
**Current**: Spending choices are plain text selections. Players cannot see which planets to exhaust or the running total.
**Recommendation**: Build a generic spending UI showing: available planets with their resource/influence values, running total vs. required amount, and trade goods as optional supplement.

---

### 5. Information Display Enhancements

#### Missing: Neighbor indicators for transactions
**Rules**: 60.1, 94.2 -- Transactions can only occur with neighbors (players with units/planets in adjacent or wormhole-connected systems).
**Current**: TradeOffer component exists but no display of which players are neighbors.
**Recommendation**: When transacting, indicate which players are valid transaction partners.

#### Missing: Fleet pool limit warning
**Rules**: 37.1-37.3 -- Non-fighter ships in a system cannot exceed a player's fleet pool count. Excess ships must be removed.
**Current**: Fleet pool token count is shown (F:N) in PlayerPanel but no warning is shown when a system exceeds the limit.
**Recommendation**: Show a warning icon on systems where a player's non-fighter ship count approaches or exceeds their fleet pool.

#### Missing: Blockade indicator
**Rules**: 14.1 -- A space dock is blockaded when its system contains enemy ships but no friendly ships. Blockaded docks cannot produce ships.
**Current**: No visual indicator of blockaded space docks on the map or in modals.
**Recommendation**: Show a blockade icon on affected systems/planets in SystemDetailModal.

#### Missing: Capacity tracking in movement
**Rules**: 16.1-16.3 -- Ships have capacity values that limit transported fighters/ground forces. Players need to see remaining capacity during movement.
**Current**: MoveShips.vue tracks transport capacity but the display could be more prominent.
**Recommendation**: Ensure capacity usage is clearly shown during movement (current/max), with warnings when exceeded.

#### Missing: Commander/hero unlock progress
**Rules**: 51.6, 51.10 -- Commanders have unique unlock conditions; heroes unlock at 3 scored objectives.
**Current**: Leaders show locked/unlocked status badges (A/C/H circles) but no progress indicator toward unlocking.
**Recommendation**: Show unlock progress in CardDetailModal leader view (e.g., hero: "2/3 objectives scored").

---

### 6. Log Token Enhancements

Existing log tokens: TiCardToken, TiTechToken, TiObjectiveToken, TiRelicToken

#### ~~Player name tokens in log~~ **DONE**
TiPlayerToken.vue renders player names as colored chips with backgroundColor + contrast text color. Wired into GameLogTwilight.vue replacing generic PlayerName component.

#### Missing: Planet/system tokens in log
**Current**: Planet and system references in log entries are plain text.
**Recommendation**: Make planet/system names clickable to open SystemDetailModal or CardDetailModal.

---

### 7. Errata Compliance

#### Missing: Corrected card texts
**Rules**: errata.md -- Several cards have official errata (Diplomacy, Direct Hit, Harrow, Hyper Metabolism, Matriarch, etc.).
**Current**: CardDetailModal displays card data from res files. Need to verify that the underlying data files reflect the errata corrections.
**Recommendation**: Verify all errata items from `errata.md` are reflected in the card data in `res/` files.

---

### 8. FAQ Edge Cases

#### Dice display: "0" = 10
**Rules**: FAQ General Q1 -- The "0" face on d10 represents 10.
**Current**: If dice are ever displayed, ensure 0 renders as 10.

#### Fighters block movement
**Rules**: FAQ General Q3 -- Systems containing only enemy fighters still block movement.
**Current**: Verify movement path calculation accounts for fighter-only systems.

---

### 9. Off-Map Systems (GalaxyMap)

#### ~~Off-map system rendering (Creuss home, Wormhole Nexus)~~ **DONE**
GalaxyMap filters systems with q≥50 or r≥50 into a separate "Off-Map" panel below the hex grid. Off-map tiles render at fixed hexSize=40, remain fully interactive (click, highlights). Fixes Creuss home (q:99, r:99) distorting the viewport.

#### ~~Wormhole Nexus activation state display~~ **DONE**
SystemTile checks `wormholeNexusActive` for tile 82. When inactive: only γ is active, α β shown grayed-out. NEXUS badge shows green when active, gray when inactive.

---

## Summary by Priority

### High Priority (affects core gameplay experience)
1. ~~Ground units/structures on map tiles~~ **DONE**
2. ~~Public objectives area with scoring tokens~~ **DONE**
3. Combat UI (dice, sustain, hit assignment)
4. ~~Damaged unit indicators~~ **DONE**
5. ~~Secret objectives for owning player~~ **DONE**
6. ~~Available (ready) resources/influence totals~~ **DONE**

### Medium Priority (quality of life)
7. ~~Off-map system rendering (Creuss home, Wormhole Nexus)~~ **DONE**
8. ~~Tactical action step tracker~~ **DONE**
9. ~~Reinforcements display~~ **DONE**
10. Agenda voting UI
11. ~~Active laws display~~ **DONE**
12. ~~Planet controller colors on map~~ **DONE**
13. ~~Custodians token display~~ **DONE**
14. ~~VP target (10 vs 14) fix~~ **DONE**
15. Technology research UI
16. Influence/resource spending UI

### Lower Priority (polish)
17. ~~Wormhole Nexus activation state display~~ **DONE**
18. ~~Exhausted relic/tech indicators~~ **DONE**
19. Captured units display
20. Combat/invasion/status step trackers
21. ~~Gamma wormhole tokens on map~~ **DONE**
22. ~~Ion storm token on map~~ **DONE**
23. Fleet pool warnings
24. Blockade indicators
25. Neighbor indicators
26. Commander/hero unlock progress
27. ~~Log entry enhancements (colored names, clickable references)~~ **DONE** (player names; planet/system tokens still pending)
