# Dune Imperium Test Coverage Gaps

Audit of test coverage against living rules (2026-03-30).

## High Priority

1. [ ] Sandworm reward doubling integration — having sandworms doubles rewards taken
2. [ ] Strength requires units — swords alone with no units in conflict = 0 strength
3. [ ] Agent-turn cards excluded from reveal effects — only just-revealed cards produce Reveal effects
4. [ ] Full tiebreaker chain — Solari, water, garrisoned troops tiebreakers (only spice tested)
5. [ ] CHOAM contract types — harvest, immediate, acquire-TSMF contracts untested

## Medium Priority

6. [ ] Faction bonus permanence — dropping below 4 influence keeps the bonus
7. [ ] Faction bonus re-earn — moving down then back to 4 earns bonus again
8. [ ] Spy agent icon — send agent to space connected to post where you have spy (no recall)
9. [ ] 4-player tie scenarios — 2 tied for 1st with 3rd reward; 3+ tied for 1st
10. [ ] Persuasion pooling/splitting/loss — pool from multiple sources, split across purchases, lose unused
11. [ ] Remaining board space effects — Sietch Tabr, Deep Desert, Heighliner, Carthag, Stillsuits, etc.

## Low Priority

12. [ ] Starting component counts — 1 water, 3 troops in garrison, 3 spies, 3 control markers
13. [ ] Supply exhaustion — cannot recruit troop if none in supply
14. [ ] Combat marker overflow — strength >20 flips marker to +20 side
15. [ ] Leader ability coverage — only Glossu Rabban tested, Signet Ring activation untested
16. [ ] Sandworm requires Maker Hooks — summoning requires token on garrison
17. [ ] Recall spy when none available — may recall one spy for no effect to free for placement
18. [ ] Icon-restricted spy placement — some effects restrict spy to posts connected to specific icon
19. [ ] Spice Refinery control bonus — controller gets 1 Solari when anyone visits
20. [ ] Contract replacement from bank — new contract flipped face-up when one taken
21. [ ] Same-turn contract restriction — cannot complete board-space contract taken same turn
22. [ ] All contracts taken fallback — contract icon reverts to 2 Solari when none remain
23. [ ] Agents return to leader in Phase 5
24. [ ] Chain card acquisitions — acquire, row refills, acquire replacement
25. [ ] Objective card player-count filtering — 1-3P vs 4P cards omitted by count
