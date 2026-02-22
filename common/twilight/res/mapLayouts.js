// Galaxy map layouts for Twilight Imperium 4th Edition
//
// Maps use axial hex coordinates (q, r) with Mecatol Rex at (0, 0).
// Home systems are placed at fixed positions per player count.
// Interior tiles are filled from blue/red tile pools.
//
// Position layout for 6-player (standard ring structure):
//   Ring 0: Mecatol Rex (0,0)
//   Ring 1: 6 hexes adjacent to Mecatol
//   Ring 2: 12 hexes (equidistant tiles, includes home systems)
//   Ring 3: 18 hexes (outer ring, 6 home systems at fixed positions)

// Axial hex directions (flat-top orientation)
const HEX_DIRECTIONS = [
  { q: 1, r: 0 },   // east
  { q: 0, r: 1 },   // southeast
  { q: -1, r: 1 },  // southwest
  { q: -1, r: 0 },  // west
  { q: 0, r: -1 },  // northwest
  { q: 1, r: -1 },  // northeast
]

// Generate ring of hex positions at given radius from center
function hexRing(center, radius) {
  if (radius === 0) {
    return [center]
  }

  const results = []
  // Start at the hex that is `radius` steps in direction 4 (west) from center
  let q = center.q + HEX_DIRECTIONS[4].q * radius
  let r = center.r + HEX_DIRECTIONS[4].r * radius

  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < radius; j++) {
      results.push({ q, r })
      q += HEX_DIRECTIONS[i].q
      r += HEX_DIRECTIONS[i].r
    }
  }
  return results
}

// Standard 6-player layout
// Home systems at ring 3, equidistant positions
const layout6p = {
  name: 'Standard',
  playerCount: 6,
  mecatol: { q: 0, r: 0, tileId: 18 },
  homePositions: [
    { q: 0, r: -3 },   // north (seat 1)
    { q: 3, r: -3 },   // northeast (seat 2)
    { q: 3, r: 0 },    // southeast (seat 3)
    { q: 0, r: 3 },    // south (seat 4)
    { q: -3, r: 3 },   // southwest (seat 5)
    { q: -3, r: 0 },   // northwest (seat 6)
  ],
  // Positions for equidistant (non-home, non-mecatol) tiles
  // Ring 1 (6 tiles) + Ring 2 (12 tiles) + remaining Ring 3 (12 tiles) = 30 tiles
  ring1: hexRing({ q: 0, r: 0 }, 1),
  ring2: hexRing({ q: 0, r: 0 }, 2),
  // Ring 3 minus home positions (filled dynamically)
  blueTileCount: 18,
  redTileCount: 12,
}

// 3-player layout
// Shape: ring1 + ring2 + 6 outer tiles flanking each home system (2 per home)
const layout3p = {
  name: 'Standard',
  playerCount: 3,
  mecatol: { q: 0, r: 0, tileId: 18 },
  homePositions: [
    { q: 0, r: -3 },   // north
    { q: 3, r: 0 },    // southeast
    { q: -3, r: 3 },   // southwest
  ],
  ring1: hexRing({ q: 0, r: 0 }, 1),
  ring2: hexRing({ q: 0, r: 0 }, 2),
  // Ring-3 positions adjacent to each home system
  outerPositions: [
    { q: 1, r: -3 },   // east of north home
    { q: -1, r: -2 },  // southwest of north home
    { q: 3, r: -1 },   // northwest of southeast home
    { q: 2, r: 1 },    // southwest of southeast home
    { q: -3, r: 2 },   // northwest of southwest home
    { q: -2, r: 3 },   // east of southwest home
  ],
  blueTileCount: 16,
  redTileCount: 8,
}

// 4-player layout
// Full 3-ring hexagon (4-5-6-7-6-5-4), homes at edges of rows 2 and 6
const layout4p = {
  name: 'Standard',
  playerCount: 4,
  mecatol: { q: 0, r: 0, tileId: 18 },
  homePositions: [
    { q: -1, r: -2 },  // top-left
    { q: 3, r: -2 },   // top-right
    { q: 1, r: 2 },    // bottom-right
    { q: -3, r: 2 },   // bottom-left
  ],
  ring1: hexRing({ q: 0, r: 0 }, 1),
  ring2: hexRing({ q: 0, r: 0 }, 2),
  outerPositions: hexRing({ q: 0, r: 0 }, 3),
  blueTileCount: 21,
  redTileCount: 11,
}

// 5-player layout
// Full 3-ring hexagon, 5 homes with trade goods bonuses for asymmetric positions
const layout5p = {
  name: 'Standard',
  playerCount: 5,
  mecatol: { q: 0, r: 0, tileId: 18 },
  homePositions: [
    { q: 2, r: -3 },                       // top
    { q: 3, r: 0, bonusTradeGoods: 2 },    // right
    { q: 0, r: 3, bonusTradeGoods: 4 },    // bottom-right
    { q: -3, r: 3, bonusTradeGoods: 2 },   // bottom-left
    { q: -2, r: -1 },                      // left
  ],
  ring1: hexRing({ q: 0, r: 0 }, 1),
  ring2: hexRing({ q: 0, r: 0 }, 2),
  outerPositions: hexRing({ q: 0, r: 0 }, 3),
  blueTileCount: 21,
  redTileCount: 10,
}

// 5-player hyperlane layout
// Pentagonal map using hyperlane tiles to create adjacency across gaps
//
//      * . . *           r=-3
//     . . . . .          r=-2
//    . . . . . .         r=-1
//   * . . M . . *        r=0
//    . . c 1 5 g         r=1
//     . b 6 d 4          r=2
//      * a 2 3           r=3
//
// Hyperlane tiles (1-6) are not valid unit positions but create adjacency
// between the systems they connect.
const layout5pHyperlane = {
  name: 'Hyperlane',
  playerCount: 5,
  mecatol: { q: 0, r: 0, tileId: 18 },
  homePositions: [
    { q: 0, r: -3 },   // north
    { q: 3, r: -3 },   // northeast
    { q: -3, r: 0 },   // west
    { q: 3, r: 0 },    // east
    { q: -3, r: 3 },   // southwest
  ],
  // Non-standard shape — all tile positions listed explicitly in outerPositions
  ring1: [],
  ring2: [],
  outerPositions: [
    // Row r=-3 (homes at (0,-3) and (3,-3))
    { q: 1, r: -3 },
    { q: 2, r: -3 },
    // Row r=-2
    { q: -1, r: -2 },
    { q: 0, r: -2 },
    { q: 1, r: -2 },
    { q: 2, r: -2 },
    { q: 3, r: -2 },
    // Row r=-1
    { q: -2, r: -1 },
    { q: -1, r: -1 },
    { q: 0, r: -1 },
    { q: 1, r: -1 },
    { q: 2, r: -1 },
    { q: 3, r: -1 },
    // Row r=0 (home at (-3,0), mecatol at (0,0), home at (3,0))
    { q: -2, r: 0 },
    { q: -1, r: 0 },
    { q: 1, r: 0 },
    { q: 2, r: 0 },
    // Row r=1 (hyperlanes at (0,1) and (1,1))
    { q: -3, r: 1 },
    { q: -2, r: 1 },
    { q: -1, r: 1 },   // c
    { q: 2, r: 1 },    // g
    // Row r=2 (hyperlanes at (-1,2) and (1,2))
    { q: -3, r: 2 },
    { q: -2, r: 2 },   // b
    { q: 0, r: 2 },    // d
    // Row r=3 (home at (-3,3), hyperlanes at (-1,3) and (0,3))
    { q: -2, r: 3 },   // a
  ],
  // Hyperlane positions — tiles placed here create adjacency but cannot hold units
  hyperlanePositions: [
    { q: 0, r: 1 },    // HL 1
    { q: 1, r: 1 },    // HL 5
    { q: -1, r: 2 },   // HL 6
    { q: 1, r: 2 },    // HL 4
    { q: -1, r: 3 },   // HL 2
    { q: 0, r: 3 },    // HL 3
  ],
  // Hyperlane connections — pairs of positions made adjacent by hyperlane tiles
  // Each entry is [posA, posB] where both become 1-hop neighbors
  hyperlaneConnections: [
    // HL 1: c ↔ e (where e = {1,0})
    [{ q: -1, r: 1 }, { q: 1, r: 0 }],
    // HL 2-3-4 chain: a ↔ g
    [{ q: -2, r: 3 }, { q: 2, r: 1 }],
    // HL 5: d ↔ e
    [{ q: 0, r: 2 }, { q: 1, r: 0 }],
    // HL 5: d ↔ f (where f = {2,0})
    [{ q: 0, r: 2 }, { q: 2, r: 0 }],
    // HL 5: d ↔ g
    [{ q: 0, r: 2 }, { q: 2, r: 1 }],
    // HL 6: d ↔ c
    [{ q: 0, r: 2 }, { q: -1, r: 1 }],
    // HL 6: d ↔ b
    [{ q: 0, r: 2 }, { q: -2, r: 2 }],
    // HL 6: d ↔ a
    [{ q: 0, r: 2 }, { q: -2, r: 3 }],
  ],
  // Per-tile routing lines inside each hyperlane hex.
  // Each entry maps "q,r" → array of [entryDir, exitDir] pairs.
  // Directions: 0=E, 1=SE, 2=SW, 3=W, 4=NW, 5=NE
  hyperlaneRoutes: {
    '0,1':  [[3, 5]],                 // HL 1: W(c) → NE(e)
    '1,1':  [[2, 4], [2, 5], [2, 0]], // HL 5: SW(d) → NW(e), NE(f), E(g)
    '-1,2': [[0, 4], [0, 3], [0, 2]], // HL 6: E(d) → NW(c), W(b), SW(a)
    '1,2':  [[2, 5]],                 // HL 4: SW(HL3) → NE(g)  (chain a↔g)
    '-1,3': [[3, 0]],                 // HL 2: W(a) → E(HL3)    (chain a↔g)
    '0,3':  [[3, 5]],                 // HL 3: W(HL2) → NE(HL4) (chain a↔g)
  },
  blueTileCount: 17,
  redTileCount: 8,
}

// 2-player layout (for testing, small map)
const layout2p = {
  name: 'Standard',
  playerCount: 2,
  mecatol: { q: 0, r: 0, tileId: 18 },
  homePositions: [
    { q: 0, r: -3 },   // north
    { q: 0, r: 3 },    // south
  ],
  ring1: hexRing({ q: 0, r: 0 }, 1),
  ring2: hexRing({ q: 0, r: 0 }, 2),
  blueTileCount: 10,
  redTileCount: 6,
}

const layouts = {
  2: layout2p,
  3: layout3p,
  4: layout4p,
  5: layout5p,
  '5-hyperlane': layout5pHyperlane,
  6: layout6p,
}

function getLayout(key) {
  const layout = layouts[key]
  if (!layout) {
    throw new Error(`No map layout for key: ${key}`)
  }
  return layout
}

function getLayoutsForPlayerCount(playerCount) {
  const result = {}
  for (const [key, layout] of Object.entries(layouts)) {
    if (layout.playerCount === playerCount) {
      result[key] = layout
    }
  }
  return result
}

function getHexDistance(a, b) {
  return (Math.abs(a.q - b.q) + Math.abs(a.q + a.r - b.q - b.r) + Math.abs(a.r - b.r)) / 2
}

function getHexNeighbors(pos) {
  return HEX_DIRECTIONS.map(d => ({ q: pos.q + d.q, r: pos.r + d.r }))
}

module.exports = {
  HEX_DIRECTIONS,
  hexRing,
  layouts,
  getLayout,
  getLayoutsForPlayerCount,
  getHexDistance,
  getHexNeighbors,
}
