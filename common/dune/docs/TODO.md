# Dune Imperium: Uprising — Implementation Status

## Core Systems — COMPLETE
- [x] Board spaces (22 spaces, 13 observation posts, all effect types)
- [x] Card effects: 100% coverage (377/377) via text parser + implementation functions
- [x] Combat rewards (parsing, distribution, ties, battle icons, sandworm doubling)
- [x] Spy system (placement, infiltrate, gather intelligence, spy access)
- [x] CHOAM contracts (setup, take, complete, auto-triggers for all conditions)
- [x] Intrigue cards (plot/combat/endgame — all effects implemented)
- [x] Setup (objectives, first player, defensive bonus, swordmaster, high council, TSMF)
- [x] Sandworms (hooks, summoning, shield wall, protected conflict blocking)
- [x] All base-game leaders implemented with passive abilities

## Turn Tracking Modifiers — ALL WIRED
- [x] `spaceIsCombat`: Converts non-combat space to combat
- [x] `extraInfluence`: Gain 2 influence instead of 1 on faction space
- [x] `forceRetreatOnDeploy`: Force enemy retreat per troop deployed
- [x] `recruitToConflict`: Recruited troops go to conflict instead of garrison
- [x] `acquireWithSolari`: Use Solari instead of Persuasion for card acquisition
- [x] `ignoreInfluenceRequirements`: Skip influence checks on board spaces
- [x] `ignoreOccupancy`: Skip occupied space check (Infiltrate intrigue)
- [x] `allIcons`/`allFactionIcons`: Card gets all agent/faction icons
- [x] `acquireToTopOfDeck`: Acquired card goes on top of deck
- [x] `troopOnAcquire`: +1 Troop when acquiring a card
- [x] `blockedSpaces`: The Voice blocks a space for the round
- [x] `demandRespect`/`toTheVictor`/`strategicPush`: Combat win bonuses
- [x] `bonusFirstPlaceInfluence`: Pivotal Gambit adds influence to first place reward

## Test Coverage — Gaps

### Quality Fixes
- [ ] `boardSpaces.test.js`: Non-deterministic — silently skips via `if (!purpleCard) return` when hand lacks needed icon. Use deterministic seed + known hand contents instead.
- [ ] `spies.test.js`: Same silent-skip pattern for infiltrate and gather intelligence tests.

### Setup (01_setup) — setup.test.js
- [x] Conflict deck composition: 1 tier-I + 5 tier-II + 4 tier-III = 10 cards
- [x] Imperium Row initialized with 5 cards
- [x] Reserve stacks exist (Prepare the Way, The Spice Must Flow)
- [x] Intrigue deck exists and is non-empty
- [x] Starting deck composition: 2×Convincing Argument, 2×Dagger, 1×Diplomacy, 2×Dune The Desert Planet, 1×Reconnaissance, 1×Seek Allies, 1×Signet Ring
- [x] Faction influence starts at 0 for all four factions
- [x] Shield wall in place, control markers unowned, alliances unclaimed

### Deck Building (03_deck_building) — revealTurns.test.js
- [x] Acquiring a card with persuasion moves it to discard
- [x] Imperium Row refills after acquisition
- [ ] Trashing a card removes it from the game
- [ ] Reshuffle discard into deck when deck empty

### Agents (04_agents) — agentTurns.test.js
- [ ] Swordmaster (3rd agent) acquisition via Sword Master space
- [x] Occupied space blocks agent placement (no spy)
- [x] Agent icon matching enforced (card icon must match space icon)
- [x] Faction card accesses faction spaces
- [x] Influence requirement blocks/allows access

### Board Spaces (05_board_spaces) — boardSpaces.test.js, agentTurns.test.js
- [x] Influence requirements: Sietch Tabr (2+ Fremen)
- [ ] Influence requirements: Imperial Privilege (2+ Emperor), Shipping (2+ Guild)
- [ ] Cost payment enforced before effects
- [x] Faction spaces grant +1 influence (factions.test.js)
- [ ] Integration tests for remaining 18 spaces (only Arrakeen, Assembly Hall, Spice Refinery, Gather Support tested)

### Factions (06_factions) — factions.test.js
- [x] VP gained at 2 influence
- [x] VP lost when dropping below 2
- [x] Bonus at 4 influence (Guild: 3 Solari tested)
- [x] Alliance at 4 influence (first player to reach)
- [x] Alliance token passes when overtaken on track

### Intrigue Cards (07_intrigue_cards)
- [ ] Plot intrigue playable during Agent and Reveal turns
- [ ] Combat intrigue playable during combat phase
- [ ] Endgame intrigue playable at end of game
- [ ] Intrigue cards kept separate from deck (in player.intrigue zone)

### Round Start (08_round_start)
- [ ] Conflict card revealed each round
- [ ] Defensive bonus: controller deploys 1 troop when their location's conflict revealed

### Agent Turns (09_agent_turns) — agentTurns.test.js
- [x] Turn order: first player acts first
- [x] Can choose Reveal Turn while agents remain (optional)
- [x] Once revealed, turns are skipped for rest of phase

### Reveal Turns (10_reveal_turns) — revealTurns.test.js
- [x] Reveal effects resolved (persuasion accumulated)
- [x] Strength calculation: swords add when units in conflict
- [x] No strength without units in conflict
- [x] Acquiring cards from Imperium Row
- [x] Clean up: all played + revealed cards → discard

### Units and Deployment (11_units_and_deployment) — deployment.test.js
- [x] Deploy up to 2 from garrison on combat space
- [x] Deploying moves troops from garrison to conflict
- [x] Recruiting troops goes to garrison
- [x] Non-combat space does not offer deployment
- [ ] Sandworm summoning (requires Maker Hook, not blocked by Shield Wall if down)
- [ ] Shield Wall blocks sandworms at protected locations

### Combat (12_combat)
- [ ] Combat intrigue card phase (pass-until-all-pass)
- [ ] Reward distribution: 1st/2nd/3rd place by strength
- [ ] 0 strength = no reward
- [ ] Winner takes conflict card
- [ ] After combat: troops → supply (not garrison), sandworms → bank, reset markers

### Combat Rewards (13_combat_rewards)
- [ ] Battle icon matching: flip pair + 1 VP
- [ ] Sandworm reward doubling (not for control or battle icons)
- [ ] Tie for 1st: each gets 2nd reward, no winner
- [ ] Tie for 2nd: each gets 3rd reward
- [ ] 4-player 3rd place reward

### Spies (14_spies)
- [ ] Spy placement from card/board space effects (integration)
- [ ] Cannot recall same spy for both infiltrate and gather intelligence

### Critical Locations (15_critical_locations) — controlLocations.test.js
- [ ] Control marker placed on winning location conflict
- [x] Control bonuses: Arrakeen 1 Solari, Imperial Basin 1 spice
- [x] Controller gets bonus when they visit own controlled space
- [ ] Shield Wall detonation

### Makers (16_makers) — makers.test.js
- [x] Spice accumulates on unoccupied maker spaces each round
- [x] Bonus spice accumulates over multiple rounds
- [ ] Bonus spice collected on harvest

### Recall and Endgame (17_recall_and_endgame) — recall.test.js
- [x] Endgame triggered at 10+ VP
- [ ] Endgame triggered when conflict deck empty
- [ ] Endgame intrigue cards offered
- [x] Tiebreakers: most spice wins
- [x] First player marker passes clockwise

### CHOAM Module (18_choam)
- [ ] Taking contracts from market
- [ ] Completing board-space contracts
- [ ] Contract icon gives 2 Solari without CHOAM module
- [ ] Replacement of taken contracts from deck

### Objectives (19_objectives)
- [ ] Objective card distribution by player count
- [ ] Battle icon matching with objectives
- [ ] First player determined by objective card

## Expansion Stubs (logged as memo, not implemented)
- Dreadnoughts, Tech tiles, Freighter, Mentat, Sardaukar Commanders
