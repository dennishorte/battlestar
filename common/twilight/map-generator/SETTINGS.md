# TI4 Map Generator Settings

## Required

| Setting | Type | Description |
|---------|------|-------------|
| `numPlayers` | `number` | Number of players (2-8) |

## Optional

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `seed` | `number\|string` | random | Random seed for deterministic generation |
| `boardStyle` | `string` | `'normal'` | Board layout variant (see below) |
| `pickStyle` | `string` | `'balanced'` | Tile weighting strategy (see below) |
| `placementStyle` | `string` | `'slice'` | Position fill order (see below) |
| `usePok` | `boolean` | `false` | Include Prophecy of Kings expansion tiles |
| `races` | `string[]` | `null` | Specific factions to assign to home systems |
| `ensureRacialAnomalies` | `boolean` | `true` | Ensure anomalies required by specific factions |
| `shuffleBoards` | `boolean` | `false` | Shuffle position groups before applying placement style |
| `reversePlacementOrder` | `boolean` | `false` | Reverse tile priority order |
| `customWeights` | `object` | see below | Custom tile scoring weights (for `pickStyle: 'custom'`) |
| `shuffleThreshold` | `number` | `5` | Weight range within which tiles are shuffled into tiers |
| `excludedTiles` | `string[]` | `[]` | Tile IDs to exclude from the pool |

## Board Styles

| Players | Styles |
|---------|--------|
| 2 | `normal` |
| 3 | `normal`, `compact` |
| 4 | `normal`, `horizontal`, `vertical` |
| 5 | `normal`, `diamond` |
| 6 | `normal`, `spiral`, `large` (POK) |
| 7 | `normal` (POK, hyperlanes) |
| 8 | `normal` |

## Pick Styles

| Style | Description |
|-------|-------------|
| `balanced` | Optimized weights for a fair game (different for base vs POK) |
| `random` | Pure random shuffle, no quality ordering |
| `resource` | Maximize resource output |
| `influence` | Maximize political influence |
| `custom` | Use `customWeights` values |

## Placement Styles

| Style | Description |
|-------|-------------|
| `slice` | Primary → Secondary → Tertiary positions filled in order (balanced slices) |
| `initial` | Primary positions separate; secondary+tertiary shuffled together |
| `home` | Positions adjacent to home systems receive best tiles first |
| `random` | All positions shuffled randomly |

## Custom Weights

When `pickStyle: 'custom'`, provide weights via `customWeights`:

```js
{
  resource: 70,      // Weight for planet resources
  influence: 30,     // Weight for planet influence
  planetCount: 15,   // Weight per planet on a tile
  specialty: 50,     // Weight for tech specialty presence
  anomaly: 10,       // Weight for red-backed tiles
  wormhole: 25,      // Weight for wormhole presence
  racial: 20,        // Weight for faction-required anomalies
}
```

## Racial Anomaly Requirements

When `ensureRacialAnomalies: true` and specific races are assigned:

| Faction | Required Anomaly |
|---------|-----------------|
| The Clan of Saar | Asteroid Field |
| The Embers of Muaat | Supernova |
| The Empyrean | Nebula |
| The Vuil'raith Cabal | Gravity Rift |

## Result Object

```js
{
  map: string[],        // Position index → tile ID (or -1 for unused)
  positions: [{         // Enriched position data
    index: number,
    tileId: string,
    tile: object|null,  // Full tile data (planets, anomalies, wormholes)
    isHomeWorld: boolean,
    isMecatolRex: boolean,
    isHyperlane: boolean,
  }],
  seed: number|string,  // Seed used (for reproducibility)
  settings: object,     // Effective settings
  layout: {
    numPlayers: number,
    boardStyle: string,
    totalPositions: number,
    homeWorldPositions: number[],
    description: string,
  },
}
```

## Usage

```js
const { generateMap } = require('./twilight/map-generator')

const result = generateMap({
  numPlayers: 6,
  seed: 42,
  usePok: true,
  pickStyle: 'balanced',
  races: ['The Federation of Sol', 'The Barony of Letnev', ...],
})

console.log(result.map)       // ['18', '26', '35', ...]
console.log(result.positions)  // [{index: 0, tileId: '18', tile: {...}, ...}]
```
