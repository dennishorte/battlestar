'use strict'

// Tile data derived from existing res modules — single source of truth.

const { systemTiles } = require('../../res/systemTiles')
const { planets: planetData } = require('../../res/planets')

// ── Constants ──────────────────────────────────────────────────────────────────

const ANOMALIES = {
  NEBULA: 'nebula',
  GRAVITY_RIFT: 'gravity-rift',
  ASTEROID_FIELD: 'asteroid-field',
  SUPERNOVA: 'supernova',
}

const WORMHOLES = {
  ALPHA: 'alpha',
  BETA: 'beta',
  GAMMA: 'gamma',
  DELTA: 'delta',
}

const EXPANSIONS = {
  BASE: 'Base Game',
  POK: 'Prophecy of Kings',
}

// Tiles excluded from blue/red placement pools (placed specially or off-map)
const SPECIAL_TILE_IDS = new Set(['18', '81', '82'])

// ── Build tiles from systemTiles + planets ────────────────────────────────────

const tiles = {}
for (const [id, tile] of Object.entries(systemTiles)) {
  if (tile.type === 'hyperlane') {
    continue
  }

  const key = String(id)

  // Resolve inline planet data from planets.js
  const planetInfos = tile.planets.map(planetId => {
    const planet = planetData[planetId]
    if (planet) {
      return {
        name: planet.name,
        resources: planet.resources,
        influence: planet.influence,
        trait: planet.trait || null,
        specialty: planet.techSpecialty || null,
        legendary: planet.legendary || false,
      }
    }
    return { name: planetId, resources: 0, influence: 0, trait: null, specialty: null, legendary: false }
  })

  // Map system type to generator type
  let type = tile.type
  if (type === 'mecatol') {
    type = 'blue'
  }
  if (type === 'home') {
    type = 'green'
  }

  const entry = {
    type,
    wormhole: [...(tile.wormholes || [])],
    anomaly: tile.anomaly ? [tile.anomaly] : [],
    planets: planetInfos,
  }

  if (SPECIAL_TILE_IDS.has(key)) {
    entry.special = true
  }

  if (tile.faction) {
    entry.race = tile.faction
  }

  tiles[key] = entry
}

// ── Expansion Membership ────────────────────────────────────────────────────

const pokTileIds = []
for (let i = 52; i <= 82; i++) {
  pokTileIds.push(String(i))
}

// ── Computed Categories ─────────────────────────────────────────────────────

function notSpecial(id) {
  return !tiles[id].special
}

const green = Object.keys(tiles).filter(id => tiles[id].type === 'green')
const blue = Object.keys(tiles).filter(id => tiles[id].type === 'blue').filter(notSpecial)
const red = Object.keys(tiles).filter(id => tiles[id].type === 'red').filter(notSpecial)
const anomaly = red.filter(id => tiles[id].anomaly.length > 0)
const blankRed = red.filter(id => tiles[id].anomaly.length === 0)
const wormholes = Object.keys(tiles).filter(id => tiles[id].wormhole.length > 0).filter(notSpecial)

const asteroidFields = anomaly.filter(id => tiles[id].anomaly.includes(ANOMALIES.ASTEROID_FIELD))
const gravityRifts = anomaly.filter(id => tiles[id].anomaly.includes(ANOMALIES.GRAVITY_RIFT))
const nebulae = anomaly.filter(id => tiles[id].anomaly.includes(ANOMALIES.NEBULA))
const supernovas = anomaly.filter(id => tiles[id].anomaly.includes(ANOMALIES.SUPERNOVA))

// Per-wormhole-type lists
const wormholeLists = {}
for (const key in WORMHOLES) {
  const type = WORMHOLES[key]
  wormholeLists[type] = Object.keys(tiles)
    .filter(id => Array.isArray(tiles[id].wormhole) && tiles[id].wormhole.includes(type))
    .filter(notSpecial)
}

module.exports = {
  ANOMALIES,
  WORMHOLES,
  EXPANSIONS,
  tiles,
  pokTileIds,
  green,
  blue,
  red,
  anomaly,
  blankRed,
  wormholes,
  asteroidFields,
  gravityRifts,
  nebulae,
  supernovas,
  wormholeLists,
}
