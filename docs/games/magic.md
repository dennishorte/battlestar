# Magic: The Gathering

## Overview

Multiplayer Magic: The Gathering implementation with deck selection, stack-based spell resolution, and card drafting (Cube Draft / Set Draft).

## Key Files

```
common/magic/
├── magic.js              Main game class (35KB, extends Game)
├── MagicCard.js           Card wrapper with multi-face support (12KB)
├── MagicCardManager.js    Card management
├── MagicLogManager.js     Game-specific logging
├── MagicPlayerManager.js  Player management
├── MagicZone.js           Zone with morph/secret visibility
├── Zone.js                Zone extension
├── data_sets.js           Card database (703KB)
├── data.js                Data utilities
├── draft/                 Draft game variant
│   ├── cube_draft.js      Cube draft implementation
│   ├── CubeDraftPlayer.js Draft player state
│   ├── pack.js            Pack mechanics
│   └── testutil_cube.js   Draft test utilities
└── util/                  Card utilities
    ├── cardUtil.js        Card parsing and filtering
    ├── CardFilter.js      Complex card filtering
    ├── CubeWrapper.js     Cube list wrapper
    ├── DeckWrapper.js     Deck list wrapper
    └── Serializer.js      Field injection for card data
```

## Game Flow

1. `initialize()` - Setup players (20 life each), zones
2. `chooseDecks()` - Players select their decks
3. `mainLoop()` - Infinite turn loop with phase selection

### Phases
Turn sequence with selectable phases: untap, upkeep, draw, main, combat (begin, attackers, blockers, damage, end), end of turn cleanup.

## MagicCard (`MagicCard.js`)

Extends `BaseCard` with MTG-specific features:

### Properties
- `counters` - Named counters (loyalty, defense, +1/+1, custom)
- `trackers` - Temporary counters (cleared at end of turn)
- `annotation`, `annotationEOT`, `annotationPerpetual` - Status markers
- `attached`, `attachedTo` - Equipment/aura relationships
- `morph`, `secret` - Hidden card states
- `tapped`, `noUntap`, `token`

### Card Data Methods
- `name()`, `typeLine()`, `oracleText()`, `manaCost()` - Per-face or combined
- `colors()`, `colorIdentity()`, `cmc()` / `manaValue()`
- `power()`, `toughness()`, `loyalty()`, `defense()`
- Type checks: `isLand()`, `isCreature()`, `isPlaneswalker()`, `isArtifact()`, etc.
- `supertypes()`, `subtypes()` - Type line parsing

### Multi-Face Support
- `face()`, `faces()`, `numFaces()` - Handle normal, split, flip, transform, modal DFCs
- `addFace()`, `removeFace()` - Edit multi-face cards

### Scarring System
Track persistent card modifications across games.

## Draft Variant (`draft/`)

Cube Draft implementation for card drafting before games:
- Pack creation and distribution
- Pick-and-pass drafting mechanics
- Deck building from drafted cards

## Frontend Components (`app/src/modules/games/magic/`)

22 components for card zones, counters, phases, and tableau display. Includes card closeup modal, counter management, import functionality, and draft linking.

## Testing

```bash
npm run test -w common -- --testPathPattern magic
```

- `magic.test.js` (857 lines) - Main game tests
- `testutil.js` - Fixtures: `fixture()`, `fixtureDecksSelected()`, `testBoard()`
