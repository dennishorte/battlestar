# Dune Imperium: Uprising — Implementation TODO

## Board Space Data
- [x] Populate `res/boardSpaces.js` with all 22 board spaces: id, name, icon, faction, cost, influence requirements, combat/maker/protected flags, control bonuses, effects
- [x] Populate `res/observationPosts.js` with 13 spy post connections (A-M) to board spaces
- [x] Wire up choice effects (Spice Refinery, Sietch Tabr, Hagga Basin, Deep Desert, Gather Support)
- [x] Wire up simple effects: influence-choice, high-council, sword-master, trash-card, steal-intrigue, vp, influence, control
- [x] Wire up remaining complex effects: intrigue-trash-draw, recall-agent, maker-hook, break-shield-wall, sandworm
- [x] Wire up contract effect (via CHOAM module)

## Card Agent Effects
- [x] Wire up card `agentAbility` execution during agent turns via `resolveCardAgentAbility`
- [x] Build agent ability text parser (`systems/cardEffects.js`) for simple patterns
- [ ] Handle conditional abilities (If/With patterns, Signet Ring, faction synergies)

## Card Reveal Effects
- [x] Wire up `revealAbility` via `resolveCardRevealAbility` — parses simple effects and faction bonds
- [ ] Handle complex reveal abilities (conditional bonuses, alliance checks)

## Combat Reward Distribution
- [x] Parse and execute conflict card rewards (first/second/third place)
- [x] Winner takes conflict card into supply
- [x] Location control: winner gains control marker for location-based conflicts
- [x] Battle icon matching: check for pairs when winner takes conflict card (+1 VP)
- [ ] Sandworm reward doubling (double most rewards, not control or battle icons)

## Combat Intrigue Effects
- [ ] Execute combat intrigue card effects (currently cards are discarded but effect text is only logged)

## Spy System
- [x] Create `systems/spies.js`
- [x] Spy placement on observation posts (when spy icon appears on card/board space)
- [x] Infiltrate: recall spy to ignore occupied board space
- [x] Gather Intelligence: recall spy to draw a card (before resolving effects)
- [x] Spy agent icon: send agent to space connected to your spy's post (via spyAccess on cards)
- [x] Wire spy choices into agent turn flow

## Leaders
- [ ] Create `systems/leaders.js` with ability dispatch
- [ ] Leader selection during setup (choose or random)
- [ ] Leader ability 1: passive/triggered effects during play
- [ ] Signet Ring card triggers leader ability 2
- [ ] Individual leader implementations (start with simpler complexity-1 leaders)

## Intrigue Cards (Plot/Endgame)
- [x] Plot intrigue: offered at start of turn, after effects resolve, and at end of turn
- [x] Endgame intrigue: prompted before final scoring in `endGame()`
- [x] Simple intrigue effects execute via parser; complex ones logged as memo
- [ ] Execute individual complex intrigue card effects (conditional, faction-specific)

## Setup Completeness
- [ ] Deal objective cards to players, determine first player from objective
- [ ] Defensive bonus: deploy 1 troop from supply when your controlled location's conflict is revealed
- [x] Swordmaster acquisition effect (gain 3rd agent, dynamic cost 8/6)
- [x] High Council seat effect (take seat; 2nd visit gives 2 spice + 1 intrigue + 3 troops)
- [x] The Spice Must Flow acquisition bonus (+1 VP)

## Sandworms
- [x] Maker Hooks token tracking per player
- [x] Sandworm summoning effect (deploys sandworms to conflict)
- [x] Shield Wall detonation effect (break-shield-wall)
- [ ] Sandworm deployment restriction: require Maker Hooks, disallow at protected locations unless shield wall broken

## CHOAM Module
- [x] Create `systems/choam.js`
- [x] Contract setup (shuffled deck, 2 face-up market)
- [x] Taking contracts from market
- [x] Contract reward parsing and execution
- [ ] Auto-completing contracts (board space visit, harvest threshold, immediate, acquire TSMF triggers)
- [ ] Contract completion tracking for card conditionals ("If you have completed 4+ Contracts")

## Data Gaps
- [x] Conflict card reward text parser — `parseRewardText()` in combat.js
- [x] Spice Refinery control bonus is solari (verified)
- [x] Emperor 4-influence bonus is place a spy (corrected from +2 solari)
- [ ] Sardaukar Commander recruitment mechanic
