// Map Configuration for Demonweb Expansion
// Defines hex layouts for different player counts
// Uses axial coordinates (q, r) for hex positioning

// Axial coordinate directions for flat-top hexes:
// N: (0, -1), NE: (+1, -1), SE: (+1, 0), S: (0, +1), SW: (-1, +1), NW: (-1, 0)

const mapConfigs = {
  // 2-Player Small: 7 hexes in slid hexagon (parallelogram)
  // Hexagon with left side slid up, right side slid down
  // B tiles at extreme ends, A in center, C tiles filling in between
  'demonweb-2s': {
    playerCount: 2,
    totalHexes: 7,
    layout: [
      { position: { q: 0, r: -1 }, category: 'C', pool: ['C1', 'C2', 'C3', 'C4', 'C5', 'C6'] },
      { position: { q: -1, r: -1 }, category: 'B', pool: ['B1', 'B2'] },
      { position: { q: -1, r: 0 }, category: 'C', pool: ['C1', 'C2', 'C3', 'C4', 'C5', 'C6'] },
      { position: { q: 0, r: 0 }, category: 'A', pool: ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9'] },
      { position: { q: 1, r: 0 }, category: 'C', pool: ['C1', 'C2', 'C3', 'C4', 'C5', 'C6'] },
      { position: { q: 1, r: 1 }, category: 'B', pool: ['B1', 'B2'] },
      { position: { q: 0, r: 1 }, category: 'C', pool: ['C1', 'C2', 'C3', 'C4', 'C5', 'C6'] },
    ],
  },

  // 2-Player Hexagon: 7 hexes in compact radius-1 hexagon
  // Center column B-A-B, all 4 side hexes are C tiles
  'demonweb-2h': {
    playerCount: 2,
    totalHexes: 7,
    layout: [
      { position: { q: 0, r: -1 }, category: 'B', pool: ['B1', 'B2'] },
      { position: { q: -1, r: 0 }, category: 'C', pool: ['C1', 'C2', 'C3', 'C4', 'C5', 'C6'] },
      { position: { q: 1, r: -1 }, category: 'C', pool: ['C1', 'C2', 'C3', 'C4', 'C5', 'C6'] },
      { position: { q: 0, r: 0 }, category: 'A', pool: ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9'] },
      { position: { q: -1, r: 1 }, category: 'C', pool: ['C1', 'C2', 'C3', 'C4', 'C5', 'C6'] },
      { position: { q: 1, r: 0 }, category: 'C', pool: ['C1', 'C2', 'C3', 'C4', 'C5', 'C6'] },
      { position: { q: 0, r: 1 }, category: 'B', pool: ['B1', 'B2'] },
    ],
  },

  // 2-Player Large: 9 hexes arranged vertically
  // B at top, 6 C around center A, B at bottom
  'demonweb-2': {
    playerCount: 2,
    totalHexes: 9,
    layout: [
      // Top B hex
      { position: { q: 0, r: -2 }, category: 'B', pool: ['B1', 'B2'] },

      // Upper C ring
      { position: { q: 0, r: -1 }, category: 'C', pool: ['C1', 'C2', 'C3', 'C4', 'C5', 'C6'] },
      { position: { q: 1, r: -1 }, category: 'C', pool: ['C1', 'C2', 'C3', 'C4', 'C5', 'C6'] },
      { position: { q: -1, r: 0 }, category: 'C', pool: ['C1', 'C2', 'C3', 'C4', 'C5', 'C6'] },

      // Center A hex
      { position: { q: 0, r: 0 }, category: 'A', pool: ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9'] },

      // Lower C ring
      { position: { q: 1, r: 0 }, category: 'C', pool: ['C1', 'C2', 'C3', 'C4', 'C5', 'C6'] },
      { position: { q: -1, r: 1 }, category: 'C', pool: ['C1', 'C2', 'C3', 'C4', 'C5', 'C6'] },
      { position: { q: 0, r: 1 }, category: 'C', pool: ['C1', 'C2', 'C3', 'C4', 'C5', 'C6'] },

      // Bottom B hex
      { position: { q: 0, r: 2 }, category: 'B', pool: ['B1', 'B2'] },
    ],
  },

  // 3-Player: 10 hexes in right-pointing triangle
  // Columns of 4-3-2-1, B hexes at all 3 corners, A in center
  'demonweb-3': {
    playerCount: 3,
    totalHexes: 10,
    layout: [
      // Column 0 (left edge, 4 hexes)
      { position: { q: 0, r: -1 }, category: 'B', pool: ['B1', 'B2', 'B3'] },
      { position: { q: 0, r: 0 }, category: 'C', pool: ['C1', 'C2', 'C3', 'C4', 'C5', 'C6'] },
      { position: { q: 0, r: 1 }, category: 'C', pool: ['C1', 'C2', 'C3', 'C4', 'C5', 'C6'] },
      { position: { q: 0, r: 2 }, category: 'B', pool: ['B1', 'B2', 'B3'] },

      // Column 1 (3 hexes)
      { position: { q: 1, r: -1 }, category: 'C', pool: ['C1', 'C2', 'C3', 'C4', 'C5', 'C6'] },
      { position: { q: 1, r: 0 }, category: 'A', pool: ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9'] },
      { position: { q: 1, r: 1 }, category: 'C', pool: ['C1', 'C2', 'C3', 'C4', 'C5', 'C6'] },

      // Column 2 (2 hexes)
      { position: { q: 2, r: -1 }, category: 'C', pool: ['C1', 'C2', 'C3', 'C4', 'C5', 'C6'] },
      { position: { q: 2, r: 0 }, category: 'C', pool: ['C1', 'C2', 'C3', 'C4', 'C5', 'C6'] },

      // Column 3 (right tip)
      { position: { q: 3, r: -1 }, category: 'B', pool: ['B1', 'B2', 'B3'] },
    ],
  },

  // 4-Player: 13 hexes in hexagon shape
  // 6 B hexes on outer edges (each adjacent to 2 C tiles), 6 C inner ring, 1 A center
  'demonweb-4': {
    playerCount: 4,
    totalHexes: 13,
    layout: [
      // Top B pair
      { position: { q: -1, r: -1 }, category: 'B', pool: ['B1', 'B2', 'B3', 'B4', 'B5', 'B6'] },
      { position: { q: 1, r: -2 }, category: 'B', pool: ['B1', 'B2', 'B3', 'B4', 'B5', 'B6'] },

      // Upper C ring
      { position: { q: 0, r: -1 }, category: 'C', pool: ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8'] },

      // Middle row
      { position: { q: -2, r: 1 }, category: 'B', pool: ['B1', 'B2', 'B3', 'B4', 'B5', 'B6'] },
      { position: { q: -1, r: 0 }, category: 'C', pool: ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8'] },
      { position: { q: 0, r: 0 }, category: 'A', pool: ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9'] },
      { position: { q: 1, r: -1 }, category: 'C', pool: ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8'] },
      { position: { q: 2, r: -1 }, category: 'B', pool: ['B1', 'B2', 'B3', 'B4', 'B5', 'B6'] },

      // Lower C ring
      { position: { q: -1, r: 1 }, category: 'C', pool: ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8'] },
      { position: { q: 0, r: 1 }, category: 'C', pool: ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8'] },
      { position: { q: 1, r: 0 }, category: 'C', pool: ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8'] },

      // Bottom B pair
      { position: { q: -1, r: 2 }, category: 'B', pool: ['B1', 'B2', 'B3', 'B4', 'B5', 'B6'] },
      { position: { q: 1, r: 1 }, category: 'B', pool: ['B1', 'B2', 'B3', 'B4', 'B5', 'B6'] },
    ],
  },
}

// Get adjacent hex positions for a given position
// Returns array of { q, r } positions that share an edge with the input position
function getAdjacentPositions(q, r) {
  return [
    { q: q + 1, r: r - 1 },  // NE
    { q: q + 1, r: r },      // SE
    { q: q, r: r + 1 },      // S
    { q: q - 1, r: r + 1 },  // SW
    { q: q - 1, r: r },      // NW
    { q: q, r: r - 1 },      // N
  ]
}

// Get the adjacent position in a specific edge direction
function getAdjacentPosition(q, r, edge) {
  const DELTAS = {
    'N': { dq: 0, dr: -1 },
    'NE': { dq: 1, dr: -1 },
    'SE': { dq: 1, dr: 0 },
    'S': { dq: 0, dr: 1 },
    'SW': { dq: -1, dr: 1 },
    'NW': { dq: -1, dr: 0 },
  }
  const delta = DELTAS[edge]
  return { q: q + delta.dq, r: r + delta.dr }
}

// Get the edge direction from position1 to position2
// Returns the edge label on position1 that faces position2
function getEdgeDirection(pos1, pos2) {
  const dq = pos2.q - pos1.q
  const dr = pos2.r - pos1.r

  if (dq === 1 && dr === -1) {
    return 'NE'
  }
  if (dq === 1 && dr === 0) {
    return 'SE'
  }
  if (dq === 0 && dr === 1) {
    return 'S'
  }
  if (dq === -1 && dr === 1) {
    return 'SW'
  }
  if (dq === -1 && dr === 0) {
    return 'NW'
  }
  if (dq === 0 && dr === -1) {
    return 'N'
  }

  return null  // Not adjacent
}

// Convert axial coordinates to pixel coordinates (flat-top orientation)
function axialToPixel(q, r, hexSize) {
  const x = hexSize * (3 / 2 * q)
  const y = hexSize * (Math.sqrt(3) / 2 * q + Math.sqrt(3) * r)
  return { x, y }
}

module.exports = {
  mapConfigs,
  getAdjacentPositions,
  getAdjacentPosition,
  getEdgeDirection,
  axialToPixel,
}
