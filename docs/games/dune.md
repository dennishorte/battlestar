# Dune Imperium: Uprising

Deck-building worker placement game for 2-4 players. Players send Agents to board spaces using cards from their hand, build their deck by acquiring new cards, compete in combat for conflict rewards, and vie for faction influence and alliances.

## Architecture

**Complexity tier**: Tier 2 Modular (~3-5K LOC target across ~25 files)

### Key Files

| File | Purpose |
|------|---------|
| `dune.js` | Main game class, factory, `_mainProgram`, phase orchestration |
| `DunePlayer.js` | Player class: resources, agents, troops, spies, influence |
| `DunePlayerManager.js` | Custom playerClass registration |
| `DuneCard.js` | Card class wrapping definitions, dual effects (agent/reveal) |
| `DuneLogManager.js` | Custom arg handlers for cards, factions, resources |
| `DuneActionManager.js` | Dynamic choice filtering for agent turns |
| `testutil.js` | Test utilities: fixture, setBoard, testBoard |

### Directory Layout

```
common/dune/
├── dune.js                    # Main game class
├���─ Dune*.js                   # Manager/model classes
├── phases/                    # Phase logic (one file per phase)
├── systems/                   # Subsystems (deck, factions, spies, leaders, CHOAM)
├── res/                       # Game data
│   ├── index.js               # Aggregator with compatibility filtering
│   ├── constants.js           # Game constants
│   ├── boardSpaces.js         # Board space definitions
│   ├── observationPosts.js    # Spy post connections
│   ├── cards/                 # Card data by type (imperium, intrigue, etc.)
│   └── leaders/               # Leader definitions
├── docs/                      # Rules, specs, CSV card inventories
│   ├── living_rules/          # Structured rules reference (19 files)
│   └── specs/testing.md       # Test conventions
└── tests/                     # Test files
```

### Card Data and Expansion System

All card data lives in `res/cards/` as JS modules converted from CSV inventories. Every card has `source` (which product) and `compatibility` (which game configurations use it).

Filtering is settings-based via `res/index.js`:
- `getImperiumCards(settings)`, `getLeaders(settings)`, etc.
- Initial implementation: compatibility "All" + "Uprising" always included
- CHOAM module: adds "Contracts (Uprising)" when `settings.useCHOAM`
- Future: Rise of Ix, Immortality, Bloodlines add their compatibility sets

### State Model

All game state is in `game.state` (ephemeral, rebuilt each replay):
- `round`, `phase`, `firstPlayerIndex`
- `boardSpaces` -- occupation tracking
- `controlMarkers` -- Arrakeen, Spice Refinery, Imperial Basin
- `shieldWall` -- boolean
- `alliances` -- faction alliance ownership
- `spyPosts` -- spy placement on observation posts
- `conflict` -- current combat state
- `bonusSpice` -- accumulated spice on Maker spaces

Player state via counters: `solari`, `spice`, `water`, `vp`, `agents`, `troopsInGarrison`, `troopsInSupply`, `spiesInSupply`, faction influence (`influence_emperor`, etc.).

### Round Structure

5 phases per round:
1. **Round Start** -- Reveal conflict card, draw 5 cards
2. **Player Turns** -- Clockwise from first player: Agent Turn or Reveal Turn
3. **Combat** -- Combat intrigue cards (pass-until-all-pass), resolve strength
4. **Makers** -- Spice accumulates on unoccupied Maker spaces
5. **Recall** -- Check endgame (10+ VP or empty conflict deck), recall agents, pass first player

### Testing

```bash
npm run test -w common -- --testPathPattern dune
npm run test -w common -- --testPathPattern "dune/tests/basic"
```

Standard integration test pattern: `fixture()` -> `setBoard()` -> `game.run()` -> `choose()` -> `testBoard()`.

Default 2-player fixture: dennis (P1), micah (P2). 4-player adds scott (P3), eliya (P4).

See `common/dune/docs/specs/testing.md` for full setBoard/testBoard reference.
