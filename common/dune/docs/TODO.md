# Dune Imperium: Uprising — Implementation TODO

## Core Systems — COMPLETE
- [x] Board spaces (22 spaces, 13 observation posts, all effect types)
- [x] Card agent abilities (parser + execution + conditionals + turn tracking)
- [x] Card reveal abilities (parser + faction bonds + conditionals)
- [x] Combat rewards (parsing, distribution, ties, battle icons, sandworm doubling)
- [x] Spy system (placement, infiltrate, gather intelligence, spy access)
- [x] CHOAM contracts (setup, take, complete, auto-triggers for all conditions)
- [x] Intrigue cards (plot at 3 points per turn, endgame before scoring)
- [x] Setup (objectives, first player, defensive bonus, swordmaster, high council, TSMF)
- [x] Sandworms (hooks, summoning, shield wall, protected conflict blocking)

## Leaders — 20/24 implemented
- [x] Leader selection (choose or random), Signet Ring dispatch
- [x] Paul Atreides: Prescience (peek top of deck at agent turn start)
- [x] Feyd-Rautha: Training Track (branching graph with rewards)
- [x] Lady Jessica: Other Memories / Reverend Mother flip (memory cash-in, repeat space effects)
- [x] Shaddam Corrino IV: Sardaukar contract exclusivity (CHOAM required)
- [x] Baron Vladimir: Masterstroke (once per game +1 Influence x2)
- [x] 14 other leaders with passive/triggered hooks
- [ ] Remaining 4 leaders (expansion-only or data TBD)

## Card Effect Parser — 58% coverage (219/377 base-game effects)
- [x] Simple effects: gain, troop, draw, intrigue, spy, spice-harvest, VP
- [x] Choice effects, cost→effect patterns, OR choices
- [x] Conditional patterns (If/With/Having + 20 condition types)
- [x] Faction bonds, compound abilities, multi-clause patterns
- [x] Deploy, retreat, opponent effects, recall spy cost
- [x] parsedEffect field infrastructure (parsedAgentEffect, parsedRevealEffect, etc.)

## Remaining: 158 unique card effects needing structured data
Cards with unparseable effects need `parsedAgentEffect`, `parsedRevealEffect`,
`parsedPlotEffect`, `parsedCombatEffect`, or `parsedEndgameEffect` arrays added
to their definitions in `res/cards/imperium.js` and `res/cards/intrigue.js`.

The original text fields remain for display — the parsed arrays override the text parser.

### Imperium cards (~80 cards)
- [ ] Add structured effects to imperium card definitions

### Intrigue cards (~77 cards)
- [ ] Add structured effects to intrigue card definitions

## Data Gaps
- [ ] Sardaukar Commander recruitment (Bloodlines expansion — deferred)
