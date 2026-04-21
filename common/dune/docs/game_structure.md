# Dune Imperium: Uprising — Game Structure Reference

Quick reference for how the game is implemented. For rules, see `living_rules/`. For architecture, see `docs/games/dune.md`.

## Starting Deck (per player)

| Card | Count | Agent Icons | Faction Access | Reveal |
|------|-------|-------------|----------------|--------|
| Convincing Argument | 2 | — | — | 2 Persuasion |
| Dagger | 2 | green | — | 1 Sword |
| Diplomacy | 1 | — | emperor, guild, bene-gesserit, fremen | 1 Persuasion |
| Dune, The Desert Planet | 2 | yellow | — | 1 Persuasion |
| Reconnaissance | 1 | purple | — | 1 Persuasion |
| Seek Allies | 1 | — | emperor, guild, bene-gesserit, fremen | — |
| Signet Ring | 1 | green, purple, yellow | — | 1 Persuasion |

Cards with no `agentIcons` AND no `factionAccess` (Convincing Argument) can only be revealed, never played on agent turns.

## Board Space → Icon Mapping

| Icon | Spaces |
|------|--------|
| purple (city) | Arrakeen, Spice Refinery, Research Station, Sietch Tabr |
| yellow (desert) | Imperial Basin, Hagga Basin, Deep Desert, Accept Contract, Shipping |
| green (Landsraad) | High Council, Imperial Privilege, Sword Master, Assembly Hall, Gather Support |
| emperor | Sardaukar, Dutiful Service |
| guild | Heighliner, Deliver Supplies |
| bene-gesserit | Espionage, Secrets |
| fremen | Desert Tactics, Fremkit |

Faction-icon spaces (emperor/guild/bene-gesserit/fremen) are accessed via `factionAccess` on cards, not `agentIcons`.

## Agent Turn Choice Sequence

1. **Choose Turn Type**: `Agent Turn` or `Reveal Turn`
2. **Choose Card**: from hand (must have matching icon for at least one space)
3. **Choose Board Space**: filtered by icon match, occupancy, cost, influence requirements
4. **Spy**: Infiltrate (auto if occupied + spy), or Gather Intelligence offer (if unoccupied + spy)
5. **Pay Cost**: board space cost deducted
6. **Faction Influence**: +1 if faction space
7. **Resolve Card Agent Ability**: parsed from `agentAbility` text field
8. **Resolve Board Space Effects**: from `space.effects[]` array
9. **Deploy Units**: if combat space — choose 0..2 troops from garrison
10. **Control Bonus**: controller of space gets bonus resource
11. **Plot Intrigue**: offered before and after

## Reveal Turn Sequence

1. **Plot Intrigue** offered
2. **Reveal Hand**: all remaining cards move to revealed zone
3. **Accumulate**: persuasion + swords from revealed cards
4. **Resolve Reveal Abilities**: including faction bond checks
5. **Set Strength**: `troops×2 + sandworms×3 + swords×1` (0 if no units in conflict)
6. **Acquire Cards**: spend persuasion on Imperium Row / Reserve cards
7. **Plot Intrigue** offered again
8. **Clean Up**: all played + revealed cards → discard

## Phase Sequence (per round)

1. **Round Start** (`phases/roundStart.js`): Reveal conflict card, defensive bonus, draw 5
2. **Player Turns** (`phases/playerTurns.js`): Clockwise from first player, Agent or Reveal
3. **Combat** (`phases/combat.js`): Combat intrigue round → resolve by strength ranking
4. **Makers** (`phases/makers.js`): +1 spice on unoccupied maker spaces
5. **Recall** (`phases/recall.js`): Endgame check (10 VP or empty conflict deck), recall agents, pass first player

## Key State Fields

```
game.state.boardSpaces        // { spaceId: playerName | null }
game.state.controlMarkers     // { arrakeen|spice-refinery|imperial-basin: playerName | null }
game.state.shieldWall         // boolean
game.state.alliances          // { emperor|guild|bene-gesserit|fremen: playerName | null }
game.state.spyPosts           // { postId: [playerName, ...] }
game.state.bonusSpice         // { deep-desert|hagga-basin|imperial-basin: number }
game.state.conflict           // { cardId, currentCard, wonCards, deployedTroops, deployedSandworms }
game.state.turnTracking       // per-turn modifiers (reset each agent turn)
```

## Player Counters

`solari`, `spice`, `water`, `vp`, `agents`, `agentsPlaced`, `hasRevealed`, `persuasion`, `strength`, `troopsInGarrison`, `troopsInSupply`, `spiesInSupply`, `hasSwordmaster`, `hasHighCouncil`, `influence_emperor`, `influence_guild`, `influence_bene-gesserit`, `influence_fremen`

## Zones

Common: `common.imperiumDeck`, `common.imperiumRow`, `common.intrigueDeck`, `common.intrigueDiscard`, `common.conflictDeck`, `common.conflictActive`, `common.reserve.prepareTheWay`, `common.reserve.spiceMustFlow`, `common.trash`, `common.contractDeck`, `common.contractMarket`

Per-player: `{name}.deck`, `{name}.hand`, `{name}.played`, `{name}.revealed`, `{name}.discard`, `{name}.intrigue`, `{name}.contracts`, `{name}.contractsCompleted`

## Writing Tests

The `setBoard` breakpoint fires at `initialization-complete` — after zones, cards, and players exist but before the main loop. It can set:
- Player resources, influence, troops, spies, agents
- Game state: shieldWall, controlMarkers, alliances, bonusSpice, boardSpaces, spyPosts, makerHooks

**It cannot directly set hands.** Decks are shuffled with `seedrandom('test_seed')`, so draw order is deterministic for a given seed. To get specific cards in hand:
- Use a known seed and inspect what gets drawn
- Manipulate zones in the breakpoint callback directly (move cards between deck/hand)
- Inspect hand after `game.run()` and pick from what's available

Since the starting deck always contains the same cards, and a fixed seed produces the same shuffle, hands are repeatable across test runs with the same seed.
