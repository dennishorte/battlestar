# Dune Imperium: Uprising — Implementation TODO

## Board Space Data
- [x] Populate `res/boardSpaces.js` with all 22 board spaces
- [x] Populate `res/observationPosts.js` with 13 spy post connections (A-M)
- [x] Wire up choice effects (Spice Refinery, Sietch Tabr, Hagga Basin, Deep Desert, Gather Support)
- [x] Wire up simple effects: influence-choice, high-council, sword-master, trash-card, steal-intrigue, vp, influence, control
- [x] Wire up remaining complex effects: intrigue-trash-draw, recall-agent, maker-hook, break-shield-wall, sandworm
- [x] Wire up contract effect (via CHOAM module)

## Card Agent Effects
- [x] Wire up card `agentAbility` execution during agent turns via `resolveCardAgentAbility`
- [x] Build agent ability text parser (`systems/cardEffects.js`) for simple patterns
- [x] Handle conditional abilities (If/With patterns, faction synergies, turn tracking)
- [x] Turn tracking state: spy recalls, contract completions, spice gained, maker/faction space visits
- [x] Extended condition checks: high council, swordmaster, alliance, maker/faction space, persuasion, garrison, spies on board
- [ ] Remaining unparseable card ability patterns (unique per-card effects)

## Card Reveal Effects
- [x] Wire up `revealAbility` via `resolveCardRevealAbility` — parses simple effects and faction bonds
- [x] Conditional reveal abilities parsed via same If/With system

## Combat Reward Distribution
- [x] Parse and execute conflict card rewards (first/second/third place)
- [x] Winner takes conflict card into supply
- [x] Location control: winner gains control marker for location-based conflicts
- [x] Battle icon matching: check for pairs when winner takes conflict card (+1 VP)
- [x] Sandworm reward doubling (double most rewards, not control or battle icons)

## Combat Intrigue Effects
- [x] Execute simple combat intrigue effects via parser (swords, resources)
- [x] Retreat troops effect type for combat intrigue
- [ ] Complex combat intrigue: spy recall combos, deploy from garrison, opponent effects

## Spy System
- [x] Create `systems/spies.js`
- [x] Spy placement on observation posts
- [x] Infiltrate: recall spy to ignore occupied board space
- [x] Gather Intelligence: recall spy to draw a card
- [x] Spy agent icon: send agent to space connected to your spy's post
- [x] Wire spy choices into agent turn flow

## Leaders
- [x] Create `systems/leaders.js` with ability dispatch
- [x] Leader selection during setup (choose or random)
- [x] Signet Ring card triggers leader's signet ring ability
- [x] Leader passive ability hook system (`systems/leaderAbilities.js`)
- [x] 16 leader abilities implemented (Leto, Paul signet, Gurney, Muad'Dib, Rabban, Baron, Richese x2, Thorvald x2, Ecaz, Feyd, Metulli, Irulan, Margot, Duncan, Staban, Yuna)
- [ ] Paul Atreides: Prescience (view top of deck — needs frontend)
- [ ] Shaddam Corrino: Sardaukar Commander exclusivity
- [ ] Lady Jessica: Other Memories system
- [ ] Feyd-Rautha: Training track

## Intrigue Cards (Plot/Endgame)
- [x] Plot intrigue: offered at start of turn, after effects resolve, and at end of turn
- [x] Endgame intrigue: prompted before final scoring in `endGame()`
- [x] Simple intrigue effects execute via parser; complex ones logged as memo
- [x] Intrigue effects parsed via same conditional system (If/With patterns)
- [ ] Intrigue effects with unique mechanics (deploy troops, swap cards, etc.)

## Setup Completeness
- [x] Deal objective cards to players, determine first player from objective
- [x] Defensive bonus: deploy 1 troop from supply when your controlled location's conflict is revealed
- [x] Swordmaster acquisition effect (gain 3rd agent, dynamic cost 8/6)
- [x] High Council seat effect (take seat; 2nd visit gives 2 spice + 1 intrigue + 3 troops)
- [x] The Spice Must Flow acquisition bonus (+1 VP)

## Sandworms
- [x] Maker Hooks token tracking per player
- [x] Sandworm summoning effect (deploys sandworms to conflict)
- [x] Shield Wall detonation effect (break-shield-wall)
- [x] Sandworm deployment restriction: Hagga/Deep Desert not protected; maker-hook check in choice filter
- [x] Sandworm summoning blocked at protected conflict locations when shield wall intact

## CHOAM Module
- [x] Create `systems/choam.js`
- [x] Contract setup (shuffled deck, 2 face-up market)
- [x] Taking contracts from market
- [x] Contract reward parsing and execution
- [x] Auto-completing contracts (board space visit, harvest threshold, immediate, acquire TSMF, earn alliance triggers)
- [x] Contract completion count tracking via `getCompletedContractCount`
- [x] Card conditionals that check completed contract count

## Data Gaps
- [x] Conflict card reward text parser — `parseRewardText()` in combat.js
- [x] Spice Refinery control bonus is solari (verified)
- [x] Emperor 4-influence bonus is place a spy (corrected)
- [ ] Sardaukar Commander recruitment mechanic
