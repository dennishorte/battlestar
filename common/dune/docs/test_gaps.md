# Dune Imperium Test Coverage Gaps

Audit of test coverage against living rules (2026-03-30).

## High Priority

1. [x] Sandworm reward doubling integration — sandwormDoubling.test.js
2. [x] Strength requires units — strengthRequiresUnits.test.js
3. [x] Agent-turn cards excluded from reveal effects — revealExclusion.test.js
4. [x] Full tiebreaker chain — tiebreakers.test.js
5. [x] CHOAM contract types — choamContractTypes.test.js

## Medium Priority

6. [x] Faction bonus permanence — factionBonusPermanence.test.js
7. [x] Faction bonus re-earn — factionBonusPermanence.test.js
8. [x] Spy agent icon — spyAgentIcon.test.js
9. [x] 4-player tie scenarios — combatTies4p.test.js
10. [x] Persuasion pooling/splitting/loss — persuasionMechanics.test.js
11. [x] Remaining board space effects — remainingSpaces.test.js

## Low Priority

12. [x] Starting component counts — startingComponents.test.js
13. [x] Supply exhaustion — supplyExhaustion.test.js
14. [ ] Combat marker overflow — strength >20 flips marker to +20 side (UI-only, not game logic)
15. [ ] Leader ability coverage — only Glossu Rabban tested, Signet Ring activation untested
16. [x] Sandworm requires Maker Hooks — makerHooksRequirement.test.js
17. [ ] Recall spy when none available — may recall one spy for no effect to free for placement
18. [ ] Icon-restricted spy placement — some effects restrict spy to posts connected to specific icon
19. [x] Spice Refinery control bonus — spiceRefineryControl.test.js
20. [x] Contract replacement from bank — choamContractTypes.test.js
21. [x] Same-turn contract restriction — choamEdgeCases.test.js
22. [x] All contracts taken fallback — choamEdgeCases.test.js
23. [x] Agents return to leader in Phase 5 — agentRecall.test.js
24. [x] Chain card acquisitions — agentRecall.test.js
25. [x] Objective card player-count filtering — objectiveFiltering.test.js
