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

// 3-player layout (smaller map)
const layout3p = {
  playerCount: 3,
  mecatol: { q: 0, r: 0, tileId: 18 },
  homePositions: [
    { q: 0, r: -3 },   // north
    { q: 3, r: 0 },    // southeast
    { q: -3, r: 3 },   // southwest
  ],
  ring1: hexRing({ q: 0, r: 0 }, 1),
  ring2: hexRing({ q: 0, r: 0 }, 2),
  blueTileCount: 12,
  redTileCount: 6,
}

// 4-player layout
const layout4p = {
  playerCount: 4,
  mecatol: { q: 0, r: 0, tileId: 18 },
  homePositions: [
    { q: 0, r: -3 },   // north
    { q: 3, r: -3 },   // northeast
    { q: 0, r: 3 },    // south
    { q: -3, r: 3 },   // southwest
  ],
  ring1: hexRing({ q: 0, r: 0 }, 1),
  ring2: hexRing({ q: 0, r: 0 }, 2),
  blueTileCount: 15,
  redTileCount: 9,
}

// 2-player layout (for testing, small map)
const layout2p = {
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
  6: layout6p,
}

function getLayout(playerCount) {
  const layout = layouts[playerCount]
  if (!layout) {
    throw new Error(`No map layout for ${playerCount} players`)
  }
  return layout
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
  getHexDistance,
  getHexNeighbors,
}
