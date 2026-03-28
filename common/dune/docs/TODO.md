# Dune Imperium: Uprising — Implementation TODO

## Board Space Data
- [x] Populate `res/boardSpaces.js` with all 22 board spaces: id, name, icon, faction, cost, influence requirements, combat/maker/protected flags, control bonuses, effects
- [x] Populate `res/observationPosts.js` with 13 spy post connections (A-M) to board spaces
- [ ] Wire up choice effects (Spice Refinery, Sietch Tabr, Hagga Basin, Deep Desert, Gather Support)
- [ ] Wire up complex effects: high-council, sword-master, imperial-privilege, steal-intrigue, influence-choice, maker-hook, break-shield-wall, recall-agent, trash-card, contract, sandworm

## Card Agent Effects
- [ ] Wire up card `agentAbility` execution during agent turns (currently card is played but only board space resolves)
- [ ] Convert card ability text strings to executable functions (or build an effect parser)

## Card Reveal Effects
- [ ] Wire up `revealAbility` text beyond just `revealPersuasion`/`revealSwords` (e.g., "Fremen Bond: +1 Water", faction affiliation bonuses)

## Combat Reward Distribution
- [ ] Parse and execute conflict card rewards (first/second/third place) — currently logs placement but gives nothing
- [ ] Winner takes conflict card into supply
- [ ] Location control: winner gains control marker for location-based conflicts
- [ ] Battle icon matching: check for pairs when winner takes conflict card (+1 VP)
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
- [ ] Swordmaster acquisition effect (gain 3rd agent, not just pay cost)
- [ ] High Council seat effect (take seat, not just pay cost)
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
- [ ] Conflict card reward text needs to be parsed into executable effects (or keep as text and build a reward parser)
- [ ] Sardaukar Commander recruitment mechanic
- [ ] Spice Refinery control bonus should be solari, not spice (verify against rules)
