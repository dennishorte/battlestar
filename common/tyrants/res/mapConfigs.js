// Map Configuration for Demonweb Expansion
// Defines hex layouts for different player counts
// Uses axial coordinates (q, r) for hex positioning

// Axial coordinate directions for pointy-top hexes:
// NE: (+1, -1), E: (+1, 0), SE: (0, +1), SW: (-1, +1), W: (-1, 0), NW: (0, -1)

const mapConfigs = {
  // 2-Player: 9 hexes arranged vertically
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

  // 3-Player: 10 hexes in triangular arrangement
  // 3 B hexes at corners, 6 C around center A
  'demonweb-3': {
    playerCount: 3,
    totalHexes: 10,
    layout: [
      // Top B hex
      { position: { q: 0, r: -2 }, category: 'B', pool: ['B1', 'B2', 'B3'] },

      // Upper row
      { position: { q: -1, r: -1 }, category: 'C', pool: ['C1', 'C2', 'C3', 'C4', 'C5', 'C6'] },
      { position: { q: 0, r: -1 }, category: 'C', pool: ['C1', 'C2', 'C3', 'C4', 'C5', 'C6'] },

      // Middle row with B hexes on sides
      { position: { q: -2, r: 0 }, category: 'B', pool: ['B1', 'B2', 'B3'] },
      { position: { q: -1, r: 0 }, category: 'C', pool: ['C1', 'C2', 'C3', 'C4', 'C5', 'C6'] },
      { position: { q: 0, r: 0 }, category: 'A', pool: ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9'] },
      { position: { q: 1, r: 0 }, category: 'B', pool: ['B1', 'B2', 'B3'] },

      // Lower row
      { position: { q: -1, r: 1 }, category: 'C', pool: ['C1', 'C2', 'C3', 'C4', 'C5', 'C6'] },
      { position: { q: 0, r: 1 }, category: 'C', pool: ['C1', 'C2', 'C3', 'C4', 'C5', 'C6'] },
    ],
  },

  // 4-Player: 15 hexes in diamond/rhombus shape
  // Full layout with all B hexes and C7, C8
  'demonweb-4': {
    playerCount: 4,
    totalHexes: 15,
    layout: [
      // Top tip
      { position: { q: 0, r: -3 }, category: 'C', pool: ['C7', 'C8'] },

      // Upper edge
      { position: { q: -1, r: -2 }, category: 'B', pool: ['B1', 'B2'] },
      { position: { q: 1, r: -2 }, category: 'B', pool: ['B3', 'B4'] },

      // Upper middle row
      { position: { q: -2, r: -1 }, category: 'C', pool: ['C1', 'C2', 'C3', 'C4', 'C5', 'C6'] },
      { position: { q: -1, r: -1 }, category: 'C', pool: ['C1', 'C2', 'C3', 'C4', 'C5', 'C6'] },
      { position: { q: 0, r: -1 }, category: 'C', pool: ['C1', 'C2', 'C3', 'C4', 'C5', 'C6'] },

      // Center row
      { position: { q: -2, r: 0 }, category: 'B', pool: ['B5', 'B6'] },
      { position: { q: -1, r: 0 }, category: 'C', pool: ['C1', 'C2', 'C3', 'C4', 'C5', 'C6'] },
      { position: { q: 0, r: 0 }, category: 'A', pool: ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9'] },
      { position: { q: 1, r: 0 }, category: 'C', pool: ['C1', 'C2', 'C3', 'C4', 'C5', 'C6'] },
      { position: { q: 2, r: 0 }, category: 'B', pool: ['B5', 'B6'] },

      // Lower edge
      { position: { q: -1, r: 1 }, category: 'B', pool: ['B3', 'B4'] },
      { position: { q: 1, r: 1 }, category: 'B', pool: ['B1', 'B2'] },

      // Bottom tip
      { position: { q: 0, r: 2 }, category: 'C', pool: ['C7', 'C8'] },
    ],
  },
}

// Get adjacent hex positions for a given position
// Returns array of { q, r } positions that share an edge with the input position
function getAdjacentPositions(q, r) {
  return [
    { q: q + 1, r: r - 1 },  // NE
    { q: q + 1, r: r },      // E (SE in pointy-top)
    { q: q, r: r + 1 },      // SE (S in pointy-top)
    { q: q - 1, r: r + 1 },  // SW
    { q: q - 1, r: r },      // W (NW in pointy-top)
    { q: q, r: r - 1 },      // NW (N in pointy-top)
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

// Convert axial coordinates to pixel coordinates (pointy-top orientation)
function axialToPixel(q, r, hexSize) {
  const x = hexSize * (Math.sqrt(3) * q + Math.sqrt(3) / 2 * r)
  const y = hexSize * (3 / 2 * r)
  return { x, y }
}

module.exports = {
  mapConfigs,
  getAdjacentPositions,
  getAdjacentPosition,
  getEdgeDirection,
  axialToPixel,
}
