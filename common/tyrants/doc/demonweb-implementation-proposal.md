# Demonweb Expansion Implementation Proposal

## Overview

The Demonweb expansion replaces the static game board with a modular hex-based map system. This is a significant architectural departure from the current implementation, which uses a fixed graph of 68 predefined locations.

### Current Architecture
- **Map Data**: Static location objects in `res/maps.js` with predefined neighbors
- **Game State**: `TyrantsMapZone` wraps each location as a Zone holding troops/spies
- **Frontend**: Pre-positioned divs with absolute coordinates, SVG curves for connections
- **Topology**: Fixed graph - locations have hardcoded `neighbors` arrays
- **Location Types**: Sites (`points > 0`) and passageways/tunnels (`points = 0`) - same structure

### Demonweb Requirements
- **Dynamic Maps**: 9-15 hex tiles assembled per game based on player count
- **Hex Tiles**: Each tile contains locations (sites + tunnel spaces) with internal connections
- **Edge Connections**: Tiles link via connection points at vertices/mid-edges
- **Rotation**: Tiles rotated during setup to maximize connections
- **Random Tile Selection**: Tiles randomly selected from pools per player count
- **Dark Banner Sites**: Starting positions that players choose from
- **Special Rules**: A2 triad bonus, gemstone rules
- **Existing Concepts**: Tunnel spaces work exactly like current passageways (points=0, size=1)

---

## Proposed Architecture

### Part 1: Data Model

#### 1.1 Hex Tile Definition

Locations within hex tiles use the **same structure as existing maps** - the only new concept is how locations connect across hex boundaries via edge connection points.

```javascript
// common/tyrants/res/hexTiles.js

const HexTile = {
  id: 'A1',
  category: 'A',           // A=center, B=border/start, C=surrounding, X=experimental
  region: 'Araumycos',     // Display name for region

  // Locations use existing format (compatible with TyrantsMapZone)
  locations: [
    {
      name: 'The Great Web',
      short: 'great-web',
      size: 6,              // Total troop capacity
      neutrals: 6,          // Enemy troops (swords ⚔) - pre-populated white troops
      points: 8,            // VP value (0 = tunnel space)
      start: false,         // Dark banner sites have start: true
      control: { influence: 1, points: 0 },
      totalControl: { influence: 1, points: 2 },
      position: { x: 0.5, y: 0.5 },  // Relative position within hex (0-1)
    },
    {
      name: 'ring-1',       // Tunnel spaces named like existing passageways
      short: 'ring-1',
      size: 1,
      neutrals: 0,
      points: 0,            // 0 = tunnel/passageway
      start: false,
      control: { influence: 0, points: 0 },
      totalControl: { influence: 0, points: 0 },
      position: { x: 0.3, y: 0.2 },
    },
    // ... more locations
  ],

  // Internal paths connecting locations within this hex
  paths: [
    ['great-web', 'ring-1'],
    ['ring-1', 'ring-2'],
    // ...
  ],

  // Edge connection points (where tiles link to neighbors)
  // Maps edge position to location that connects there
  edgeConnections: [
    { edge: 'N', location: 'ring-1' },       // Vertex connection at North
    { edge: 'NE', location: 'ring-2' },      // Vertex at NE
    { edge: 'E-mid', location: 'tunnel-3' }, // Mid-edge on East side
    // ...
  ],

  // Special rules (optional)
  specialRules: null,  // or { type: 'triad', ... }
}
```

#### 1.2 Map Configuration

```javascript
// common/tyrants/res/mapConfigs.js

const MapConfig = {
  '2-player': {
    layout: [
      { position: { q: 0, r: -2 }, tilePool: ['B1', 'B2'] },  // Top
      { position: { q: -1, r: -1 }, tilePool: ['C1', 'C2', 'C3', 'C4', 'C5', 'C6'] },
      { position: { q: 1, r: -1 }, tilePool: ['C1', 'C2', 'C3', 'C4', 'C5', 'C6'] },
      { position: { q: 0, r: 0 }, tilePool: ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9'] },
      // ... 9 total positions
    ],
    totalHexes: 9,
  },
  '3-player': { /* ... 10 hexes */ },
  '4-player': { /* ... 15 hexes */ },
}
```

#### 1.3 Assembled Map State

```javascript
// Runtime map state after assembly
const AssembledMap = {
  hexes: [
    { tileId: 'A1', position: { q: 0, r: 0 }, rotation: 0 },  // rotation in 60° increments (0-5)
    { tileId: 'B1', position: { q: 0, r: -2 }, rotation: 2 },
    // ...
  ],

  // Merged graph of all locations (sites + tunnel spaces)
  locations: {
    'A1.great-web': { /* TyrantsMapZone data */ },
    'A1.ring-1': { /* tunnel space */ },
    'B1.council-chamber': { /* site */ },
    // ...
  },

  // Adjacency computed from edge connections
  adjacency: {
    'A1.ring-1': ['A1.great-web', 'A1.ring-2', 'C1.tunnel-3'],  // Cross-hex connection
    // ...
  },
}
```

---

### Part 2: Game Logic Changes

#### 2.1 Location Handling

**No changes needed to TyrantsMapZone** - the existing structure already handles:
- Sites (`points > 0`) with control markers
- Tunnel spaces/passageways (`points = 0`, typically `size: 1`)
- Pre-populated enemy troops via `neutrals`
- Starting positions via `start: true`

The only addition is tracking which hex a location belongs to (for rendering):

```javascript
// When creating zones from hex tiles
const zone = new TyrantsMapZone(locationData)
zone.hexId = 'A1'           // Which hex tile this location is on
zone.hexPosition = { x: 0.5, y: 0.5 }  // Position within hex for rendering
```

#### 2.2 Map Assembly Process

New initialization flow:

```javascript
// In tyrants.js
initializeMap() {
  const config = MapConfig[this.settings.playerCount + '-player']
  const selectedTiles = this.selectTiles(config)  // Random or predetermined
  const rotatedTiles = this.rotateTiles(selectedTiles)  // Maximize connections

  this.assembledMap = this.assembleTiles(rotatedTiles)
  this.initializeMapZones(this.assembledMap)
  this.populateEnemyTroops()  // Place white troops in enemySlots
}
```

#### 2.3 Presence Calculation

Current presence logic needs extension for tunnel spaces:

```javascript
// Presence at a site: have troop/spy there, or troop in adjacent space
// Presence at a tunnel space: have troop there, or troop in adjacent space

hasPresence(player, locationId) {
  const location = this.getLocationById(locationId)

  // Direct presence
  if (location.hasTroop(player) || location.hasSpy(player)) return true

  // Adjacent presence (troop in neighboring space)
  for (const neighborId of this.getNeighbors(locationId)) {
    const neighbor = this.getLocationById(neighborId)
    if (neighbor.hasTroop(player)) return true
  }

  return false
}
```

#### 2.4 Special Hex Rules

A2 triad bonus implementation:

```javascript
// Called at end of turn during VP gain phase
checkSpecialHexRules(player) {
  for (const hex of this.assembledMap.hexes) {
    const tile = HexTiles[hex.tileId]
    if (tile.specialRules?.type === 'triad') {
      this.checkTriadBonus(player, tile.specialRules)
    }
  }
}

checkTriadBonus(player, rules) {
  const sites = rules.sites.map(id => this.getLocationById(id))

  const hasTroopsInAll = sites.every(s => s.hasTroop(player))
  const controlsAll = sites.every(s => s.getController() === player)
  const totalControlsAll = sites.every(s => s.getTotalController() === player)

  if (totalControlsAll) {
    player.gainPower(2)
    player.gainTrophies(2)
    player.gainVP(4)
  } else if (controlsAll) {
    player.gainPower(1)
    player.gainTrophies(1)
    player.gainVP(1)
  } else if (hasTroopsInAll) {
    player.gainPower(1)
  }
}
```

---

### Part 3: Frontend Architecture

#### 3.1 Hex Rendering Approach

**Option A: SVG-based (Recommended)**
- Each hex is an SVG `<g>` group with transform for position/rotation
- Sites and tunnel spaces rendered as positioned elements within the hex
- Paths rendered as SVG lines/curves
- Edge connections shown as dots on hex borders
- Pros: Scalable, easy rotation, good for complex shapes
- Cons: More complex click handling

**Option B: Canvas-based**
- Draw hexes and contents on HTML5 canvas
- Pros: Better performance for very large maps
- Cons: Harder to make interactive, no DOM for styling

**Recommendation**: SVG for flexibility and easier styling/interaction.

#### 3.2 Component Structure

```
HexMap.vue                    # Main map container
├── HexGrid.vue               # Positions hexes in axial coordinates
│   └── HexTile.vue           # Single hex with rotation
│       ├── HexBackground.vue # Hex outline and fill
│       ├── SiteNode.vue      # Site with banner, slots, VP
│       ├── TunnelNode.vue    # Tunnel space (single circle)
│       ├── InternalPaths.vue # Paths within hex
│       └── EdgePoints.vue    # Connection points on border
├── CrossHexConnections.vue   # Lines between adjacent hexes
└── MapControls.vue           # Zoom, pan, rotation controls
```

#### 3.3 Hex Positioning

Use axial coordinates (q, r) for hex grid:

```javascript
// Convert axial to pixel coordinates (pointy-top orientation)
function hexToPixel(q, r, size) {
  const x = size * (Math.sqrt(3) * q + Math.sqrt(3) / 2 * r)
  const y = size * (3 / 2 * r)
  return { x, y }
}
```

#### 3.4 Interaction Handling

```javascript
// In HexMap.vue
methods: {
  onNodeClick(hexId, nodeId) {
    const locationId = `${hexId}.${nodeId}`
    if (this.ui.selectable.includes(locationId)) {
      this.$emit('location-selected', locationId)
    }
  },

  onTroopClick(hexId, nodeId, troopIndex) {
    // Handle troop selection for assassinate/move actions
  }
}
```

---

### Part 4: Migration Strategy

#### Phase 1: Data Layer (Backend)
1. Create hex tile definitions in `common/tyrants/res/hexTiles.js`
2. Create map configuration in `common/tyrants/res/mapConfigs.js`
3. Add map assembly logic to `tyrants.js`
4. Implement rotation algorithm (maximize connections)
5. Add special rule handlers (A2 triad bonus)
6. Implement gemstone rules (dead-end detection, acquire/spend actions)

#### Phase 2: Game Setup Integration
1. Add `mapType: 'demonweb'` to game settings
2. Random tile selection from pools
3. Store assembled map in game state (hex positions, rotations)
4. Serialize/deserialize assembled map
5. Compute neighbors from internal paths + edge connections

#### Phase 3: Frontend - Core Rendering
1. Create `HexMap.vue` component hierarchy
2. Implement hex grid positioning (axial coordinates)
3. Render hex outlines with rotation transforms
4. Render sites and tunnel spaces within hexes
5. Render internal paths and cross-hex connections
6. Render gemstones on dead-end tunnel spaces

#### Phase 4: Frontend - Interactions
1. Port click handlers from existing map
2. Highlight selectable locations/troops
3. Show presence indicators
4. Display control markers
5. Gem acquisition UI (when troop at gem location)
6. Gem spending UI (power/influence choice)

#### Phase 5: Polish
1. Zoom and pan controls
2. Map legend / hex info tooltips
3. Visual feedback for special rules (A2 triad status)
4. Mobile-friendly touch interactions

---

### Part 5: Data Structure Details

#### 5.1 Serialized Game State

The assembled map needs to be serialized with the game:

```javascript
// In game.serialize()
{
  // ... existing fields
  assembledMap: {
    hexes: [
      { tileId: 'A1', position: { q: 0, r: 0 }, rotation: 0 },
      // ...
    ],
  },
  // locations are derived from assembledMap + hexTiles at runtime
}
```

#### 5.2 Location ID Scheme

New compound IDs: `{hexId}.{nodeId}`
- `A1.great-web` - Site "The Great Web" in hex A1
- `B1.tunnel-3` - Tunnel space 3 in hex B1
- `C2.menzoberranzan` - Site "Menzoberranzan" in hex C2

This allows multiple hexes to have nodes with the same local name without collision.

#### 5.3 Neighbor Computation

When assembling the map, compute neighbors by:
1. Internal paths within each hex
2. Edge connections between adjacent hexes (after rotation)

```javascript
function computeNeighbors(assembledMap, hexTiles) {
  const neighbors = {}

  // Internal neighbors from paths
  for (const hex of assembledMap.hexes) {
    const tile = hexTiles[hex.tileId]
    for (const path of tile.paths) {
      const fromId = `${hex.tileId}.${path.from}`
      const toId = `${hex.tileId}.${path.to}`
      addNeighbor(neighbors, fromId, toId)
      addNeighbor(neighbors, toId, fromId)
    }
  }

  // Cross-hex neighbors from edge connections
  for (const [hex1, hex2] of getAdjacentHexPairs(assembledMap)) {
    const connections = findMatchingEdgeConnections(hex1, hex2, hexTiles)
    for (const [conn1, conn2] of connections) {
      const id1 = `${hex1.tileId}.${conn1.nodeId}`
      const id2 = `${hex2.tileId}.${conn2.nodeId}`
      addNeighbor(neighbors, id1, id2)
      addNeighbor(neighbors, id2, id1)
    }
  }

  return neighbors
}
```

---

### Part 6: Risks and Considerations

#### 6.1 Backwards Compatibility
- Existing "base" maps should continue to work
- Add `mapType: 'static' | 'demonweb'` to game settings
- Route to appropriate initialization logic based on mapType

#### 6.2 Performance
- Hex maps have fewer total locations (9-15 hexes vs 68 fixed locations)
- But each hex has internal complexity (5-15 nodes)
- Total nodes likely similar; rendering may be more complex

#### 6.3 Testing
- Need comprehensive tests for:
  - Hex rotation and connection matching
  - Presence calculation across hex boundaries
  - Special rule triggers
  - Map assembly with various tile combinations

#### 6.4 UI Complexity
- Hex-based UI is inherently more complex than absolute-positioned divs
- Consider providing a "simplified" view option
- Mobile responsiveness will need careful handling

---

### Part 7: Gemstone Rules Implementation

Gemstones are placed on dead-end tunnel spaces during setup and can be collected by troops.

#### 7.1 Data Model

```javascript
// In game state
gemstones: {
  'A1.tunnel-5': true,    // Gem present at this dead-end location
  'C3.dead-end': true,
  // ...
},
playerGems: {
  'Player1': 2,           // Gems in player's supply
  'Player2': 0,
},
gemAcquiredThisTurn: false,  // Limit 1 acquisition per turn
```

#### 7.2 Setup

```javascript
// During map initialization (after neighbor computation)
identifyDeadEnds() {
  // A dead end is a tunnel space (points=0) with only one neighbor.
  // This includes:
  // - Tunnel spaces with only one internal path
  // - Edge connections that don't match a connection on the adjacent hex
  for (const location of this.getLocationAll()) {
    if (location.points === 0) {
      const neighbors = this.getNeighbors(location)
      if (neighbors.length === 1) {
        this.gemstones[location.id] = true
      }
    }
  }
}
```

#### 7.3 Actions

```javascript
// New action: Acquire Gem (costs 1 Power, requires troop presence)
acquireGem(player, locationId) {
  if (this.gemAcquiredThisTurn) throw new Error('Already acquired gem this turn')
  if (!this.gemstones[locationId]) throw new Error('No gem at location')
  if (!this.hasPresence(player, locationId)) throw new Error('No presence')
  if (!this.hasTroop(player, locationId)) throw new Error('Need troop, not just spy')

  delete this.gemstones[locationId]
  this.playerGems[player.name] = (this.playerGems[player.name] || 0) + 1
  this.gemAcquiredThisTurn = true
  player.spendPower(1)
}

// New action: Spend Gem (for 3 Power or 3 Influence)
// Cannot spend on same turn acquired
spendGem(player, resource) {
  if (this.playerGems[player.name] < 1) throw new Error('No gems')
  // Track which gems were acquired this turn to prevent immediate spending

  this.playerGems[player.name]--
  if (resource === 'power') player.gainPower(3)
  else player.gainInfluence(3)
}
```

---

### Part 8: Decisions Made

1. **Tile Selection**: Random selection from tile pools (no presets)
2. **Rotation Algorithm**: Greedy per-tile - rotate each hex to maximize connections with already-placed neighbors, then move on
3. **Dark Banner Sites**: Starting positions (`start: true`) - players choose from these
4. **Gemstone Rules**: Included in initial implementation
5. **Unmatched Edge Connections**: Treated as dead ends (tunnel goes nowhere) - these get gems placed on them

---

### Estimated Scope

| Phase | Effort | Dependencies |
|-------|--------|--------------|
| Phase 1: Data Layer | Medium | None |
| Phase 2: Game Setup | Small | Phase 1 |
| Phase 3: Frontend Core | Large | Phases 1-2 |
| Phase 4: Frontend Interactions | Medium | Phase 3 |
| Phase 5: Polish | Small | Phase 4 |

**Key Insight**: The location/zone model doesn't need to change - existing `TyrantsMapZone` handles sites and tunnel spaces (passageways) identically. The main work is:
1. Defining hex tile data with internal topology
2. Map assembly algorithm (tile selection, rotation, neighbor computation)
3. Hex-based SVG rendering (the largest effort)

**Total Estimate**: Medium-Large feature. Less refactoring than initially thought since the location model is compatible.
