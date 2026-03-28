# Dune Imperium: Uprising — Implementation TODO

## Board Space Data
- [x] Populate `res/boardSpaces.js` with all 22 board spaces: id, name, icon, faction, cost, influence requirements, combat/maker/protected flags, control bonuses, effects
- [x] Populate `res/observationPosts.js` with 13 spy post connections (A-M) to board spaces
- [x] Wire up choice effects (Spice Refinery, Sietch Tabr, Hagga Basin, Deep Desert, Gather Support)
- [x] Wire up simple effects: influence-choice, high-council, sword-master, trash-card, steal-intrigue, vp, influence, control
- [ ] Wire up remaining complex effects: intrigue-trash-draw, recall-agent, maker-hook, break-shield-wall, contract, sandworm

## Card Agent Effects
- [ ] Wire up card `agentAbility` execution during agent turns (currently card is played but only board space resolves)
- [ ] Convert card ability text strings to executable functions (or build an effect parser)

## Card Reveal Effects
- [ ] Wire up `revealAbility` text beyond just `revealPersuasion`/`revealSwords` (e.g., "Fremen Bond: +1 Water", faction affiliation bonuses)

## Combat Reward Distribution
- [x] Parse and execute conflict card rewards (first/second/third place)
- [x] Winner takes conflict card into supply
- [x] Location control: winner gains control marker for location-based conflicts
- [x] Battle icon matching: check for pairs when winner takes conflict card (+1 VP)
- [ ] Sandworm reward doubling (double most rewards, not control or battle icons)

## Combat Intrigue Effects
- [ ] Execute combat intrigue card effects (currently cards are discarded but effect text is only logged)

## Spy System
- [ ] Create `systems/spies.js`
- [ ] Spy placement on observation posts (when spy icon appears on card/board space)
- [ ] Infiltrate: recall spy to ignore occupied board space
- [ ] Gather Intelligence: recall spy to draw a card (before resolving effects)
- [ ] Spy agent icon: send agent to space connected to your spy's post (without recalling)
- [ ] Wire spy choices into agent turn flow

## Leaders
- [ ] Create `systems/leaders.js` with ability dispatch
- [ ] Leader selection during setup (choose or random)
- [ ] Leader ability 1: passive/triggered effects during play
- [ ] Signet Ring card triggers leader ability 2
- [ ] Individual leader implementations (start with simpler complexity-1 leaders)

## Intrigue Cards (Plot/Endgame)
- [ ] Plot intrigue: offer to play during agent or reveal turns
- [ ] Endgame intrigue: prompt before final scoring in `endGame()`
- [ ] Execute individual intrigue card effects

## Setup Completeness
- [ ] Deal objective cards to players, determine first player from objective
- [ ] Defensive bonus: deploy 1 troop from supply when your controlled location's conflict is revealed
- [x] Swordmaster acquisition effect (gain 3rd agent, dynamic cost 8/6)
- [x] High Council seat effect (take seat; 2nd visit gives 2 spice + 1 intrigue + 3 troops)
- [ ] The Spice Must Flow acquisition bonus (+1 VP)

## Sandworms
- [ ] Maker Hooks token tracking per player
- [ ] Sandworm summoning (require Maker Hooks, not protected by Shield Wall)
- [ ] Shield Wall detonation (remove token, allow sandworms at protected locations)

## CHOAM Module
- [ ] Create `systems/choam.js`
- [ ] Contract setup (20 shuffled, 2 face-up)
- [ ] Taking contracts from board
- [ ] Completing contracts (board space, harvest, immediate, acquire TSMF)
- [ ] Contract rewards

## Data Gaps
- [ ] Conflict card reward text needs to be parsed into executable effects (or keep as text and build a reward parser) — DONE: `parseRewardText()` in combat.js
- [ ] Sardaukar Commander recruitment mechanic
- [ ] Spice Refinery control bonus should be solari, not spice (verify against rules) — VERIFIED: solari is correct
