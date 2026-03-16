# Tyrants of the Underdark

## Overview

Hex-based tactical strategy game with token placement and movement on configurable maps. Supports 2-4 players with multiple map variants.

## Key Files

```
common/tyrants/
├── tyrants.js            Main game class (79KB, extends Game)
├── TyrantsCard.js        Card types
├── TyrantsBaseCard.js    Base card class
├── TyrantsToken.js       Token/unit representation
├── TyrantsZone.js        Game zones
├── TyrantsMapZone.js     Map zone with hex positions
├── TyrantsLogManager.js  Game-specific logging
├── tile.js               Tile system
├── mapLayoutCodec.js     Map encoding/decoding
├── testutil.js           Test helpers
├── dev/                  Development tools
├── doc/                  Documentation
└── res/
    ├── hexTiles.js       Hex tile definitions (27KB)
    ├── maps.js           Map configurations (31KB)
    ├── mapConfigs.js     Map config helpers
    └── cards/            Card data by unit type (17 subdirectories)
```

## Key Concepts

### Map System
- Multiple configurations: base-2, base-3a, base-3b, base-4, demonweb variants
- `_resolveMap()` selects map from lobby options with seeded randomization
- Backward compatibility for legacy map names
- Hex position rotation in 60-degree increments (`rotateHexPosition()`)

### Tokens
- `TyrantsToken` - Individual unit placed on the hex map
- `TyrantsMapZone` - Zone extension for map with hex coordinates

### Cards
- `TyrantsCard` / `TyrantsBaseCard` - Card definitions with unit types
- Card data organized by type in `res/cards/` (17 subdirectories)

## Frontend Components (`app/src/modules/games/tyrants/`)

21 components including:
- **Hex map**: HexTile, HexLocation, HexMap, Paths
- **Map editor**: 7 components for creating/editing hex tiles
- Market and tableau display

## Testing

```bash
npm run test -w common -- --testPathPattern tyrants
```

- `tyrants.test.js` - Main game tests
- `demonweb.test.js` (57KB) - Demonweb expansion tests
- `testutil.js` - Fixtures: `gameFixture()`, `setHand()`, `testTroops()`, `clearHands()`
