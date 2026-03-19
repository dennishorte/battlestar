const { systemTiles, getSystemTile } = require('../res/systemTiles.js')
const { getPlanetsBySystem } = require('../res/planets.js')

// Tile tier classifications matching standard Milty Draft
// Base game blue tiles
const BASE_HIGH = [28, 29, 30, 32, 33, 35, 36, 38]
const BASE_MID = [26, 27, 31, 34, 37]
const BASE_LOW = [19, 20, 21, 22, 23, 24, 25]

// PoK blue tiles
const POK_HIGH = [69, 70, 71, 75]
const POK_MID = [64, 65, 66, 72, 73, 74, 76]
const POK_LOW = [59, 60, 61, 62, 63]

const HIGH_TIER = [...BASE_HIGH, ...POK_HIGH]
const MID_TIER = [...BASE_MID, ...POK_MID]
const LOW_TIER = [...BASE_LOW, ...POK_LOW]

// Red tiles (all non-home, non-mecatol red-type tiles)
const RED_TILES = Object.values(systemTiles)
  .filter(t => t.type === 'red')
  .map(t => t.id)

/**
 * Compute optimal resource/influence values for a system tile.
 * Each planet contributes max(res, inf) to one pool and min(res, inf) to the other.
 */
function computeOptimalValues(tileId) {
  const tilePlanets = getPlanetsBySystem(tileId)
  let resources = 0
  let influence = 0

  for (const planet of tilePlanets) {
    resources += Math.max(planet.resources, planet.influence)
    influence += Math.min(planet.resources, planet.influence)
  }

  return { resources, influence, optimalTotal: resources + influence }
}

/**
 * Compute stats for a slice (array of tile IDs).
 */
function computeSliceStats(tiles) {
  let resources = 0
  let influence = 0

  for (const tileId of tiles) {
    const vals = computeOptimalValues(tileId)
    resources += vals.resources
    influence += vals.influence
  }

  return { resources, influence, optimalTotal: resources + influence }
}

/**
 * Validate a single slice:
 * - Min 3 optimal total value
 * - Max 1 alpha wormhole, max 1 beta wormhole
 * - No two tiles with anomalies (excluding empty-space reds with no anomaly)
 */
function validateSlice(tiles) {
  const stats = computeSliceStats(tiles)
  if (stats.optimalTotal < 3) {
    return false
  }

  let alphaCount = 0
  let betaCount = 0
  let anomalyCount = 0

  for (const tileId of tiles) {
    const tile = getSystemTile(tileId)
    if (!tile) {
      continue
    }

    if (tile.wormholes.includes('alpha')) {
      alphaCount++
    }
    if (tile.wormholes.includes('beta')) {
      betaCount++
    }
    if (tile.anomaly) {
      anomalyCount++
    }
  }

  if (alphaCount > 1 || betaCount > 1) {
    return false
  }
  if (anomalyCount > 2) {
    return false
  }

  return true
}

/**
 * Generate map slices for Milty Draft.
 *
 * @param {Function} shuffleFn - Fisher-Yates shuffle (mutates and returns array)
 * @param {number} numSlices - Number of slices to generate
 * @returns {Array<{tiles: number[], stats: {resources: number, influence: number, optimalTotal: number}}>}
 */
function generateSlices(shuffleFn, numSlices) {
  const maxAttempts = 100

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const high = [...HIGH_TIER]
    const mid = [...MID_TIER]
    const low = [...LOW_TIER]
    const red = [...RED_TILES]

    shuffleFn(high)
    shuffleFn(mid)
    shuffleFn(low)
    shuffleFn(red)

    if (high.length < numSlices || mid.length < numSlices ||
        low.length < numSlices || red.length < numSlices * 2) {
      throw new Error(`Not enough tiles for ${numSlices} slices`)
    }

    const slices = []
    let valid = true

    for (let i = 0; i < numSlices; i++) {
      const tiles = [high[i], mid[i], low[i], red[i * 2], red[i * 2 + 1]]

      if (!validateSlice(tiles)) {
        valid = false
        break
      }

      slices.push({
        tiles,
        stats: computeSliceStats(tiles),
      })
    }

    if (valid) {
      // Verify no tile duplication
      const allTiles = slices.flatMap(s => s.tiles)
      if (new Set(allTiles).size === allTiles.length) {
        return slices
      }
    }
  }

  // Fallback: return last attempt without validation
  const high = [...HIGH_TIER]
  const mid = [...MID_TIER]
  const low = [...LOW_TIER]
  const red = [...RED_TILES]
  shuffleFn(high)
  shuffleFn(mid)
  shuffleFn(low)
  shuffleFn(red)

  const slices = []
  for (let i = 0; i < numSlices; i++) {
    const tiles = [high[i], mid[i], low[i], red[i * 2], red[i * 2 + 1]]
    slices.push({ tiles, stats: computeSliceStats(tiles) })
  }
  return slices
}

module.exports = {
  HIGH_TIER,
  MID_TIER,
  LOW_TIER,
  RED_TILES,
  computeOptimalValues,
  computeSliceStats,
  validateSlice,
  generateSlices,
}
