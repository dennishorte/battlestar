# Twilight Imperium UI Audit

Cross-reference of living rules against the current UI implementation (21 Vue components).
Items are grouped by category and prioritized by gameplay impact.

---

## 1. Map Display (SystemTile / GalaxyMap)

### Missing: Ground units and structures on planets
**Rules**: 43.1, 63.3, 79.3, 85.1, 88.5 -- Ground forces, PDS, and space docks are placed on planets and should be visible on the board.
**Current**: SystemTile only renders space units (ships). Units on planets (infantry, mechs, PDS, space docks) are not shown on the map. Players must open SystemDetailModal to see them.
**Recommendation**: Show planet-level unit counts on each planet dot (e.g., small icons or counts for infantry/mech/PDS/space dock per planet, colored by owner).

### Missing: Damaged unit indicators
**Rules**: 87.1 -- Units using Sustain Damage are placed on their side to indicate damage. Damaged units cannot sustain again until repaired.
**Current**: No visual indicator for damaged ships on SystemTile or in SystemDetailModal.
**Recommendation**: Add a damage marker (e.g., tilt icon, red dot, or cracked overlay) on damaged units in both map tiles and modals.

### Missing: Custodians token on Mecatol Rex
**Rules**: 27.0, 54.1 -- The custodians token is placed on Mecatol Rex at setup and removed when a player spends 6 influence. Its removal unlocks the agenda phase and grants 1 VP.
**Current**: Not shown on SystemTile. Players have no visual indicator of whether the custodians token is still present.
**Recommendation**: Show a custodians token badge on the Mecatol Rex tile when `game.state.custodiansToken` is present.

### Missing: Planet controller colors on map
**Rules**: 25.3, 25.4 -- Planet control should be visually indicated. Control tokens are placed on planets without units.
**Current**: SystemTile has a `has-controller` CSS class on planet dots but doesn't apply the controller's color. All planets look the same regardless of who controls them.
**Recommendation**: Set the planet dot border or background tint to the controlling player's color.

### Missing: Gamma wormhole tokens on map
**Rules**: 101.4b, exploration system -- Gamma wormhole tokens are placed on systems during exploration.
**Current**: `game.state.gammaWormholeTokens` is tracked in state but not rendered on SystemTile.
**Recommendation**: Show a gamma (γ) wormhole badge on affected system tiles, similar to native wormhole display.

### Missing: Ion storm token on map
**Rules**: Exploration system -- The ion storm token is placed on a system and flips after ship movement through it.
**Current**: `game.state.ionStormToken` is tracked in state but not rendered on SystemTile.
**Recommendation**: Show an ion storm indicator with its current wormhole side on the affected tile.

---

## 2. Player Panel

### Missing: Reinforcements / unit supply display
**Rules**: 72.1, 96.2, 23.4 -- Players need to see how many units remain in their reinforcements. Unit limits per player: 3 space docks, 10 fighters, 6 PDS, 8 destroyers, 8 cruisers, 2 war suns, 12 infantry, 4 carriers, 5 dreadnoughts, 1 flagship, 4 mechs.
**Current**: No reinforcements display anywhere in the UI. Players must mentally track remaining units.
**Recommendation**: Add a collapsible "Supply" section to PlayerPanel showing remaining unit counts per type.

### Missing: Available (ready) resources and influence
**Rules**: 64.8, 64.9, 75.2, 47.2 -- Only readied planets can be spent. Players frequently need to know their available (non-exhausted) totals.
**Current**: PlayerPanel shows total resources/influence across all planets but does not separate ready vs. exhausted totals.
**Recommendation**: Show available/total (e.g., "5/8 R / 3/6 I") so players can see spendable amounts at a glance.

### Missing: Secret objectives (unscored, for owning player)
**Rules**: 61.17-61.21 -- Each player holds secret objectives hidden from others. The owning player needs to see their unscored secrets to plan.
**Current**: PlayerPanel shows scored objectives but not unscored secret objectives, even for the viewing player. Only action cards are shown as hidden hand items.
**Recommendation**: Add a "Secret Objectives" section visible only to the owning player (`isViewer`), similar to how action cards are shown.

### Missing: Captured units display
**Rules**: 17.1, 17.3 -- Captured ships/mechs are placed on the capturing player's faction sheet. Captured fighters/infantry are represented by tokens.
**Current**: No display of captured units anywhere in the UI.
**Recommendation**: If any units are captured, show a "Captured Units" section on the relevant PlayerPanel.

### Missing: Exhausted relic indicators
**Rules**: Relic abilities system -- Relics can be exhausted when used and are readied during the status phase.
**Current**: Relic chips in PlayerPanel show no exhausted/ready state distinction.
**Recommendation**: Apply the same exhausted styling (reduced opacity) to exhausted relics, sourced from `game.state.exhaustedRelics`.

### Missing: Exhausted technology indicators
**Rules**: 71.3, 90.1 -- Some technologies are exhausted to use their ability.
**Current**: Technology chips show no exhausted state.
**Recommendation**: Apply exhausted styling to techs in `game.state.exhaustedTechs`.

---

## 3. Public Game State Displays

### Missing: Public objectives area
**Rules**: 61.13-61.15 -- Five Stage I and five Stage II objectives are placed near the VP track. Two Stage I are revealed at setup; one is revealed each status phase. Players need to see which are revealed, which are scored by whom.
**Current**: No dedicated public objectives display. Scored objectives appear per-player in PlayerPanel. Unrevealed/revealed-but-unscored public objectives are not shown.
**Recommendation**: Add a public objectives section (in PhaseInfo or a new component) showing all revealed public objectives with player tokens indicating who has scored each.

### Missing: Active laws display
**Rules**: 7.2-7.6 -- Laws passed during the agenda phase remain in play with ongoing effects. Players need to see which laws are currently active.
**Current**: No display of active laws/agendas anywhere in the UI.
**Recommendation**: Add an "Active Laws" section showing laws currently in effect, clickable to view details via CardDetailModal.

### Missing: VP target indicator (10 vs 14)
**Rules**: 98.2a -- Games can use a 10-space or 14-space VP track. The game ends when a player reaches the target.
**Current**: PhaseInfo VP bars hardcode `entry.vp / 10 * 100 + '%'` for bar width. Games targeting 14 VP will display incorrectly.
**Recommendation**: Read the VP target from game settings and use it for bar width calculation.

---

## 4. Phase and Step Indicators

### Missing: Tactical action step tracker
**Rules**: 89.1-89.5 -- Tactical actions follow five sequential steps: Activation, Movement, Space Combat, Invasion, Production.
**Current**: PhaseInfo shows "Action Phase" but not which step of a tactical action is active. Players must infer the current step from the choices presented.
**Recommendation**: When a tactical action is in progress, show a step indicator (e.g., highlighted breadcrumb: Activate > **Move** > Combat > Invade > Produce).

### Missing: Combat step tracker
**Rules**: 78.3-78.7 -- Space combat has sub-steps: Anti-Fighter Barrage (round 1 only), Announce Retreats, Roll Dice, Assign Hits, Retreat.
**Current**: No combat step display. Combat is resolved entirely through generic WaitingChoice text selections.
**Recommendation**: Add a combat step indicator when combat is active, showing the current sub-step.

### Missing: Invasion sub-step tracker
**Rules**: 49.1-49.5 -- Invasion has sub-steps: Bombardment, Commit Ground Forces, Space Cannon Defense, Ground Combat, Establish Control.
**Current**: No invasion step display.
**Recommendation**: Show invasion sub-step when relevant.

### Missing: Status phase step tracker
**Rules**: 81.1-81.8 -- Status phase has eight steps: Score Objectives, Reveal Objective, Draw Action Cards, Remove Tokens, Gain/Redistribute, Ready Cards, Repair, Return Strategy Cards.
**Current**: PhaseInfo shows "Status Phase" but not the current step.
**Recommendation**: Show a progress indicator for the status phase steps.

---

## 5. Dedicated Action UIs

Five dedicated action UIs exist: ActivateSystem, MoveShips, ProduceUnits, TradeOffer, RedistributeTokens. The following high-impact interactions use the generic text-based WaitingChoice selector and would benefit from dedicated UIs.

### Missing: Combat UI (dice rolls, hit assignment, sustain damage)
**Rules**: 78.5, 42.1, 87.1, 15.1, 10.1 -- Combat involves rolling dice, displaying results, choosing sustain damage, and assigning hits. Bombardment, anti-fighter barrage, and space cannon also involve dice.
**Current**: All combat interactions use generic text choice lists. No dice are shown. Hit assignment is a plain text selection.
**Recommendation**: Build a combat UI showing: dice rolls with hit/miss highlighting, sustain damage buttons per eligible unit, and visual hit assignment.

### Missing: Agenda voting UI
**Rules**: 8.5-8.17 -- Voting involves exhausting planets for influence, declaring an outcome (For/Against or elect target), and handling special voting effects.
**Current**: Voting uses the generic choice selector. No display of available influence, no planet exhaustion visualization.
**Recommendation**: Build a voting UI showing: available influence per planet, running vote tally, outcome selection, and abstain option.

### Missing: Technology research UI
**Rules**: 90.9-90.15 -- Researching technology requires checking prerequisites (colored symbols), potentially exhausting planets with tech specialties to skip prerequisites.
**Current**: Tech selection is a plain text list in WaitingChoice.
**Recommendation**: Build a tech research UI showing: available technologies with prerequisite indicators, which prerequisites are met, and tech specialty planets that can be exhausted.

### Missing: Influence/resource spending UI
**Rules**: 47.2, 75.2, 27.2, 52.2 -- Many actions require spending resources or influence by exhausting planets. Examples: removing custodians token (6 influence), Leadership (influence for tokens), objectives.
**Current**: Spending choices are plain text selections. Players cannot see which planets to exhaust or the running total.
**Recommendation**: Build a generic spending UI showing: available planets with their resource/influence values, running total vs. required amount, and trade goods as optional supplement.

---

## 6. Information Display Enhancements

### Missing: Neighbor indicators for transactions
**Rules**: 60.1, 94.2 -- Transactions can only occur with neighbors (players with units/planets in adjacent or wormhole-connected systems).
**Current**: TradeOffer component exists but no display of which players are neighbors.
**Recommendation**: When transacting, indicate which players are valid transaction partners.

### Missing: Fleet pool limit warning
**Rules**: 37.1-37.3 -- Non-fighter ships in a system cannot exceed a player's fleet pool count. Excess ships must be removed.
**Current**: Fleet pool token count is shown (F:N) in PlayerPanel but no warning is shown when a system exceeds the limit.
**Recommendation**: Show a warning icon on systems where a player's non-fighter ship count approaches or exceeds their fleet pool.

### Missing: Blockade indicator
**Rules**: 14.1 -- A space dock is blockaded when its system contains enemy ships but no friendly ships. Blockaded docks cannot produce ships.
**Current**: No visual indicator of blockaded space docks on the map or in modals.
**Recommendation**: Show a blockade icon on affected systems/planets in SystemDetailModal.

### Missing: Capacity tracking in movement
**Rules**: 16.1-16.3 -- Ships have capacity values that limit transported fighters/ground forces. Players need to see remaining capacity during movement.
**Current**: MoveShips.vue tracks transport capacity but the display could be more prominent.
**Recommendation**: Ensure capacity usage is clearly shown during movement (current/max), with warnings when exceeded.

### Missing: Commander/hero unlock progress
**Rules**: 51.6, 51.10 -- Commanders have unique unlock conditions; heroes unlock at 3 scored objectives.
**Current**: Leaders show locked/unlocked status badges (A/C/H circles) but no progress indicator toward unlocking.
**Recommendation**: Show unlock progress in CardDetailModal leader view (e.g., hero: "2/3 objectives scored").

---

## 7. Log Token Enhancements

### Existing log tokens: TiCardToken, TiTechToken, TiObjectiveToken, TiRelicToken

### Missing: Player name tokens in log
**Rules**: Multiple -- Player names appear frequently in log entries.
**Current**: Player names in log entries are plain text.
**Recommendation**: Color player names in log entries with the player's faction color for quick scanning.

### Missing: Planet/system tokens in log
**Current**: Planet and system references in log entries are plain text.
**Recommendation**: Make planet/system names clickable to open SystemDetailModal or CardDetailModal.

---

## 8. Errata Compliance

### Missing: Corrected card texts
**Rules**: errata.md -- Several cards have official errata (Diplomacy, Direct Hit, Harrow, Hyper Metabolism, Matriarch, etc.).
**Current**: CardDetailModal displays card data from res files. Need to verify that the underlying data files reflect the errata corrections.
**Recommendation**: Verify all errata items from `errata.md` are reflected in the card data in `res/` files.

---

## 9. FAQ Edge Cases

### Dice display: "0" = 10
**Rules**: FAQ General Q1 -- The "0" face on d10 represents 10.
**Current**: If dice are ever displayed, ensure 0 renders as 10.

### Fighters block movement
**Rules**: FAQ General Q3 -- Systems containing only enemy fighters still block movement.
**Current**: Verify movement path calculation accounts for fighter-only systems.

---

## 10. Off-Map Systems (GalaxyMap)

### Missing: Off-map system rendering (Creuss home, Wormhole Nexus)
**Rules**: 39.5, 51.3, 101.4a -- The Ghosts of Creuss home system is placed to the side of the game board (not in the hex grid), connected only via delta wormhole. The Wormhole Nexus (tile 82) is placed on the edge of the game board.
**Current**: GalaxyMap.vue renders ALL systems from `game.state.systems` at hex coordinates with no concept of "off-map" or "edge" systems.
- **Creuss home** (tile 51) is placed at sentinel position `{q: 99, r: 99}` during initialization, which would render far off-screen or cause viewport issues. It is connected to the on-board Creuss Gate (tile 17) via delta wormhole.
- **Wormhole Nexus** (tile 82) is defined as `type: 'blue'` and placed as a regular hex tile, taking a normal tile slot instead of sitting on the edge.
**Engine**: Adjacency works correctly via wormhole matching in `Galaxy.js` regardless of position — no engine changes needed.
**Recommendation**: Add an "off-map systems" panel adjacent to the galaxy map (e.g., below or beside it) that renders systems flagged as off-map. GalaxyMap should exclude these from the hex grid. Systems to include: Creuss home (always, when Ghosts of Creuss are in the game) and Wormhole Nexus (if the game uses PoK exploration). Each off-map tile should show the same information as regular SystemTile (units, planets, wormholes, command tokens).

### Missing: Wormhole Nexus activation state display
**Rules**: 101.4a -- The Wormhole Nexus starts inactive (gamma wormhole only) and activates when a player moves ships into or through it (adding alpha and beta wormholes).
**Current**: `game.state.wormholeNexusActive` is tracked in state. `Galaxy.js._getTileWormholes()` correctly filters wormholes based on this flag. However, there is no visual indicator on the tile showing its activation state or which wormholes are currently active.
**Recommendation**: Show the nexus tile's current wormhole set (γ only when inactive; α+β+γ when active) and a visual indicator of its activation state.

---

## Summary by Priority

### High Priority (affects core gameplay experience)
1. Ground units/structures on map tiles
2. Public objectives area with scoring tokens
3. Combat UI (dice, sustain, hit assignment)
4. Damaged unit indicators
5. Secret objectives for owning player
6. Available (ready) resources/influence totals

### Medium Priority (quality of life)
7. Off-map system rendering (Creuss home, Wormhole Nexus)
8. Tactical action step tracker
9. Reinforcements display
10. Agenda voting UI
11. Active laws display
12. Planet controller colors on map
13. Custodians token display
14. VP target (10 vs 14) fix
15. Technology research UI
16. Influence/resource spending UI

### Lower Priority (polish)
17. Wormhole Nexus activation state display
18. Exhausted relic/tech indicators
19. Captured units display
20. Combat/invasion/status step trackers
21. Gamma wormhole tokens on map
22. Ion storm token on map
23. Fleet pool warnings
24. Blockade indicators
25. Neighbor indicators
26. Commander/hero unlock progress
27. Log entry enhancements (colored names, clickable references)
