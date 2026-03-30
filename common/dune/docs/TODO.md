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

## Expansion Stubs (logged as memo, not implemented)
- Dreadnoughts, Tech tiles, Freighter, Mentat, Sardaukar Commanders
