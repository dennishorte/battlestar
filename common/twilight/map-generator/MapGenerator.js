'use strict'

const tileData = require('./data/tileData')
const boardData = require('./data/boardData')
const adjacencyData = require('./data/adjacencyData')
const raceData = require('./data/raceData')

const { hexRing } = require('../res/mapLayouts')

const { ANOMALIES, WORMHOLES, tiles, pokTileIds } = tileData

// ─── Position-to-Hex mapping ────────────────────────────────────────────────────
// Maps board position indices (0-60) to axial hex coordinates {q, r}.
// Index 0 = center (Mecatol), 1-6 = ring 1, 7-18 = ring 2, 19-36 = ring 3, 37-60 = ring 4.

const POSITION_TO_HEX = (() => {
  const center = { q: 0, r: 0 }
  const positions = [center]
  for (let ring = 1; ring <= 4; ring++) {
    positions.push(...hexRing(center, ring))
  }
  return positions
})()

// ─── Seeded RNG ────────────────────────────────────────────────────────────────
// Deterministic PRNG using the sin-based approach from the source project.
// Accepts an initial seed and tracks internal state for successive calls.

class SeededRng {
  constructor(seed) {
    this.seed = typeof seed === 'number' ? seed : _hashString(String(seed))
  }

  /** Returns a float in [0, 1) */
  next() {
    const x = Math.sin(this.seed++) * 10000
    return x - Math.floor(x)
  }

  /** Fisher-Yates shuffle (in-place, returns the array) */
  shuffle(array) {
    let m = array.length
    while (m) {
      const i = Math.floor(this.next() * m--)
      const t = array[m]
      array[m] = array[i]
      array[i] = t
    }
    return array
  }
}

function _hashString(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash) % 10000
}

// ─── Default Settings ──────────────────────────────────────────────────────────

/**
 * @typedef {Object} MapGeneratorSettings
 *
 * @property {number} numPlayers
 *   Number of players (2-8). Required.
 *
 * @property {string} [boardStyle='normal']
 *   Board layout variant. Available styles vary by player count:
 *   - 2 players: 'normal'
 *   - 3 players: 'normal', 'compact'
 *   - 4 players: 'normal', 'horizontal', 'vertical'
 *   - 5 players: 'normal', 'diamond'
 *   - 6 players: 'normal', 'spiral', 'large'
 *   - 7 players: 'normal' (requires POK, uses hyperlanes)
 *   - 8 players: 'normal'
 *
 * @property {string} [pickStyle='balanced']
 *   How tiles are weighted/ordered before placement:
 *   - 'balanced': Optimized weights for a fair game
 *   - 'random': Pure random shuffle, no weighting
 *   - 'resource': Favor high-resource tiles
 *   - 'influence': Favor high-influence tiles
 *   - 'custom': Use the customWeights object
 *
 * @property {string} [placementStyle='slice']
 *   How tile positions are ordered for filling:
 *   - 'slice': Primary → Secondary → Tertiary (default, balanced slices)
 *   - 'initial': Primary separate, secondary+tertiary shuffled together
 *   - 'home': Positions adjacent to home systems get best tiles first
 *   - 'random': All positions shuffled randomly
 *
 * @property {boolean} [usePok=false]
 *   Include Prophecy of Kings expansion tiles and races.
 *
 * @property {string[]} [races]
 *   Specific races to assign to home systems. If provided, length must
 *   equal numPlayers. If omitted, home systems are marked as position 0
 *   (unassigned). When races are provided, they are shuffled and assigned
 *   to home world positions.
 *
 * @property {boolean} [ensureRacialAnomalies=true]
 *   When races are specified, ensure the map contains anomalies required
 *   by certain factions (e.g., Clan of Saar needs an asteroid field).
 *
 * @property {boolean} [shuffleBoards=false]
 *   Shuffle the primary/secondary/tertiary position groups before
 *   applying placement style. Adds variety without changing the algorithm.
 *
 * @property {boolean} [reversePlacementOrder=false]
 *   Reverse the order in which tile groups are filled. Makes tertiary
 *   positions receive the best tiles instead of primary.
 *
 * @property {Object} [customWeights]
 *   Custom tile-scoring weights (only used when pickStyle='custom'):
 *   - resource: Weight for planet resources (default 70)
 *   - influence: Weight for planet influence (default 30)
 *   - planetCount: Weight per planet on a tile (default 15)
 *   - specialty: Weight for tech specialty presence (default 50)
 *   - anomaly: Weight for red-backed tiles (default 10)
 *   - wormhole: Weight for wormhole presence (default 25)
 *   - racial: Weight for race-required anomalies (default 20)
 *
 * @property {number} [shuffleThreshold=5]
 *   Tiles within this weight difference are shuffled together after
 *   sorting, creating natural quality "tiers" for variety.
 *
 * @property {number|string} [seed]
 *   Random seed for deterministic generation. Can be a number or string.
 *   If omitted, a random seed is chosen.
 *
 * @property {string[]} [excludedTiles=[]]
 *   Tile IDs to exclude from the available pool.
 */

const DEFAULTS = {
  boardStyle: 'normal',
  pickStyle: 'balanced',
  placementStyle: 'slice',
  usePok: false,
  races: null,
  ensureRacialAnomalies: true,
  shuffleBoards: false,
  reversePlacementOrder: false,
  customWeights: {
    resource: 70,
    influence: 30,
    planetCount: 15,
    specialty: 50,
    anomaly: 10,
    wormhole: 25,
    racial: 20,
  },
  shuffleThreshold: 5,
  seed: null,
  excludedTiles: [],
}

// ─── Main API ──────────────────────────────────────────────────────────────────

class MapGenerator {
  /**
   * Generate a TI4 map.
   *
   * @param {MapGeneratorSettings} settings
   * @returns {MapGeneratorResult}
   */
  static generate(settings) {
    const gen = new MapGenerator(settings)
    return gen._generate()
  }

  constructor(settings) {
    if (!settings || !settings.numPlayers) {
      throw new Error('numPlayers is required')
    }
    this.settings = { ...DEFAULTS, ...settings }
    if (this.settings.customWeights) {
      this.settings.customWeights = { ...DEFAULTS.customWeights, ...this.settings.customWeights }
    }

    const seed = this.settings.seed != null
      ? this.settings.seed
      : Math.floor(Math.random() * 9999)
    this.rng = new SeededRng(seed)
    this.resolvedSeed = seed
  }

  _generate() {
    const { numPlayers, boardStyle, usePok } = this.settings

    // Validate
    const styleGroup = boardData.styles[String(numPlayers)]
    if (!styleGroup) {
      throw new Error(`No board layouts for ${numPlayers} players`)
    }
    const layout = styleGroup[boardStyle]
    if (!layout) {
      throw new Error(`Unknown board style '${boardStyle}' for ${numPlayers} players. Available: ${Object.keys(styleGroup).join(', ')}`)
    }

    // Skip layouts with hyperlanes for now
    if (layout.hyperlane_tiles.length > 0) {
      // Still generate, but place hyperlanes
    }

    // Determine which tile IDs are eligible based on expansion
    const expansionFilter = (id) => {
      if (!usePok && pokTileIds.includes(id)) {
        return false
      }
      return true
    }

    // Get ordered board positions to fill
    const systemIndexes = this._getPositionsToFill(layout)

    // Resolve races
    let currentRaces = this._resolveRaces()

    // Get ordered tiles to place
    const newSystems = this._getSystemsToPlace(systemIndexes.length, currentRaces, expansionFilter)

    // Build the map
    const map = boardData.blankMap()

    // Mecatol Rex at center
    map[0] = '18'

    // Place hyperlanes
    this._placeHyperlanes(map, layout)

    // Place home systems
    this._placeHomeSystems(map, layout, currentRaces)

    // Fill positions with systems
    for (const idx of systemIndexes) {
      map[idx] = newSystems.shift()
    }

    // Post-processing: fix adjacent anomalies
    this._fixAnomalyAdjacencies(map, expansionFilter)

    // Build result
    return this._buildResult(map, layout)
  }

  // ── Position ordering ──────────────────────────────────────────────────────

  _getPositionsToFill(layout) {
    let primary = [...layout.primary_tiles]
    let secondary = [...layout.secondary_tiles]
    let tertiary = [...layout.tertiary_tiles]

    if (this.settings.shuffleBoards) {
      this.rng.shuffle(primary)
      this.rng.shuffle(secondary)
      this.rng.shuffle(tertiary)
    }

    let positions
    switch (this.settings.placementStyle) {
      case 'random': {
        const all = this.settings.reversePlacementOrder
          ? tertiary.concat(secondary).concat(primary)
          : primary.concat(secondary).concat(tertiary)
        positions = this.rng.shuffle(all)
        break
      }
      case 'initial': {
        const rest = this.rng.shuffle(secondary.concat(tertiary))
        positions = this.settings.reversePlacementOrder
          ? rest.concat(primary)
          : primary.concat(rest)
        break
      }
      case 'home': {
        let remaining = primary.concat(secondary).concat(tertiary)
        const homePositions = [...layout.home_worlds]
        const adjacent = []
        for (const hw of homePositions) {
          for (const adj of (adjacencyData[hw] || [])) {
            const idx = remaining.indexOf(adj)
            if (idx >= 0) {
              adjacent.push(adj)
              remaining.splice(idx, 1)
            }
          }
        }
        this.rng.shuffle(adjacent)
        positions = this.settings.reversePlacementOrder
          ? remaining.concat(adjacent)
          : adjacent.concat(remaining)
        break
      }
      case 'slice':
      default:
        positions = this.settings.reversePlacementOrder
          ? tertiary.concat(secondary).concat(primary)
          : primary.concat(secondary).concat(tertiary)
        break
    }

    return positions
  }

  // ── Race resolution ────────────────────────────────────────────────────────

  _resolveRaces() {
    const { races, numPlayers, usePok } = this.settings
    if (!races) {
      return null
    }

    // If specific races provided, validate and use them
    if (Array.isArray(races) && races.length > 0) {
      if (races.length < numPlayers) {
        throw new Error(`Need at least ${numPlayers} races, got ${races.length}`)
      }
      const pool = [...races]
      this.rng.shuffle(pool)
      return pool.slice(0, numPlayers)
    }

    // Auto-select: pick from available race pool
    const available = usePok
      ? [...raceData.races, ...raceData.pokRaces]
      : [...raceData.races]
    this.rng.shuffle(available)
    return available.slice(0, numPlayers)
  }

  // ── Tile selection ─────────────────────────────────────────────────────────

  _getSystemsToPlace(count, currentRaces, expansionFilter) {
    let allBlues = tileData.blue.filter(expansionFilter)
    let allReds = tileData.red.filter(expansionFilter)

    // Remove excluded tiles
    for (const id of this.settings.excludedTiles) {
      _removeFromArray(allReds, id)
      _removeFromArray(allBlues, id)
    }

    // Filter wormhole types to at most 3 types with 2+ tiles available
    this._filterWormholeTypes(allBlues, allReds, expansionFilter)

    // Shuffle pools
    this.rng.shuffle(allBlues)
    this.rng.shuffle(allReds)

    // Calculate blue/red ratio
    const { blueTileRatio, redTileRatio } = this._getTileRatios()

    let redsToPlace = Math.round((count / (blueTileRatio + redTileRatio)) * redTileRatio)
    let bluesToPlace = Math.round((count / (blueTileRatio + redTileRatio)) * blueTileRatio)

    let newSystems = []
    const ensuredAnomalies = []

    // Ensure racial anomalies
    if (this.settings.ensureRacialAnomalies && currentRaces) {
      for (const race of currentRaces) {
        const requiredAnomaly = raceData.racialAnomalyRequirements[race]
        if (!requiredAnomaly || redsToPlace <= 0) {
          continue
        }

        const anomalyPool = this._getAnomalyTilesOfType(requiredAnomaly, expansionFilter)
        const alreadyIncluded = anomalyPool.some(t => newSystems.includes(t))
        if (!alreadyIncluded) {
          this.rng.shuffle(anomalyPool)
          if (anomalyPool.length > 0) {
            newSystems.push(anomalyPool[0])
            ensuredAnomalies.push(anomalyPool[0])
            _removeFromArray(allReds, anomalyPool[0])
            redsToPlace--
          }
        }
        else {
          ensuredAnomalies.push(newSystems.find(s => anomalyPool.includes(s)))
        }
      }
    }

    // Fill remaining slots
    if (redsToPlace > allReds.length) {
      newSystems = newSystems.concat(allBlues.slice(0, bluesToPlace + (redsToPlace - allReds.length)).concat(allReds))
    }
    else if (bluesToPlace > allBlues.length) {
      newSystems = newSystems.concat(allBlues.concat(allReds.slice(0, redsToPlace + (bluesToPlace - allBlues.length))))
    }
    else {
      newSystems = newSystems.concat(allBlues.slice(0, bluesToPlace).concat(allReds.slice(0, redsToPlace)))
    }

    // Ensure wormhole pairs
    for (const key in WORMHOLES) {
      if (WORMHOLES[key] === WORMHOLES.GAMMA || WORMHOLES[key] === WORMHOLES.DELTA) {
        continue
      }
      const wormholesOfType = (tileData.wormholeLists[WORMHOLES[key]] || []).filter(expansionFilter)
      newSystems = this._ensureWormholePairs(newSystems, wormholesOfType, ensuredAnomalies, expansionFilter, 'add')
    }
    // Second pass: remove singletons
    for (const key in WORMHOLES) {
      if (WORMHOLES[key] === WORMHOLES.GAMMA || WORMHOLES[key] === WORMHOLES.DELTA) {
        continue
      }
      const wormholesOfType = (tileData.wormholeLists[WORMHOLES[key]] || []).filter(expansionFilter)
      newSystems = this._ensureWormholePairs(newSystems, wormholesOfType, ensuredAnomalies, expansionFilter, 'remove')
    }

    // Weight and order tiles
    return this._orderByWeight(newSystems, ensuredAnomalies)
  }

  _filterWormholeTypes(allBlues, allReds, expansionFilter) {
    const eligible = []
    for (const key in WORMHOLES) {
      if (WORMHOLES[key] === WORMHOLES.DELTA) {
        continue
      }
      const type = WORMHOLES[key]
      const wormholesOfType = (tileData.wormholeLists[type] || []).filter(expansionFilter)
      const count = wormholesOfType.filter(id => allReds.includes(id) || allBlues.includes(id)).length
      if (count <= 1) {
        // Remove all of this type
        for (const id of wormholesOfType) {
          _removeFromArray(allReds, id)
          _removeFromArray(allBlues, id)
        }
      }
      else {
        eligible.push(key)
      }
    }
    // Keep at most 3 wormhole types
    this.rng.shuffle(eligible)
    const toRemove = eligible.slice(3)
    for (const key of toRemove) {
      const type = WORMHOLES[key]
      const wormholesOfType = (tileData.wormholeLists[type] || [])
      for (const id of wormholesOfType) {
        _removeFromArray(allReds, id)
        _removeFromArray(allBlues, id)
      }
    }
  }

  _getTileRatios() {
    const { numPlayers, boardStyle } = this.settings
    const layout = boardData.styles[String(numPlayers)][boardStyle]

    if (layout.overrideRatios) {
      return {
        blueTileRatio: layout.overrideRatios.blueTileRatio,
        redTileRatio: layout.overrideRatios.redTileRatio,
      }
    }

    switch (numPlayers) {
      case 3: return { blueTileRatio: 3, redTileRatio: 1 }
      case 4: return { blueTileRatio: 5, redTileRatio: 3 }
      case 6: return { blueTileRatio: 3, redTileRatio: 2 }
      default: return { blueTileRatio: 2, redTileRatio: 1 }
    }
  }

  _getAnomalyTilesOfType(anomalyType, expansionFilter) {
    switch (anomalyType) {
      case ANOMALIES.ASTEROID_FIELD: return tileData.asteroidFields.filter(expansionFilter)
      case ANOMALIES.GRAVITY_RIFT: return tileData.gravityRifts.filter(expansionFilter)
      case ANOMALIES.NEBULA: return tileData.nebulae.filter(expansionFilter)
      case ANOMALIES.SUPERNOVA: return tileData.supernovas.filter(expansionFilter)
      default: return []
    }
  }

  _ensureWormholePairs(systems, wormholesOfType, ensuredAnomalies, expansionFilter, method) {
    const planetWormholes = wormholesOfType.filter(id => !tileData.blankRed.includes(id))
    const used = wormholesOfType.filter(id => systems.includes(id))
    const unused = wormholesOfType.filter(id => !systems.includes(id))

    if (used.length !== 1) {
      return systems
    }

    if (method === 'add') {
      this.rng.shuffle(unused)
      const excludedFromReplacement = [...tileData.wormholes, ...ensuredAnomalies]

      let replacementPool
      if (!planetWormholes.includes(used[0])) {
        // Used is a red wormhole → try to add a planet wormhole
        replacementPool = planetWormholes.filter(id => !systems.includes(id))
        // Exclude all red tiles from being replaced
        const excluded = excludedFromReplacement.concat(tileData.red.filter(() => true))
        systems = this._reverseReplace(systems, 1, replacementPool, excluded)
      }
      else {
        // Used is a planet wormhole → add a red wormhole
        const redWormholes = unused.filter(id => !planetWormholes.includes(id))
        systems = this._reverseReplace(systems, 1, redWormholes, excludedFromReplacement)
      }
    }
    else if (method === 'remove') {
      const excludedTiles = systems.filter(id => id !== used[0])
      if (!planetWormholes.includes(used[0])) {
        const unusedReds = tileData.red.filter(expansionFilter).filter(id => !systems.includes(id))
        systems = this._reverseReplace(systems, 1, unusedReds, excludedTiles)
      }
      else {
        const unusedSinglePlanets = tileData.blue.filter(expansionFilter)
          .filter(id => tiles[id].planets.length === 1)
          .filter(id => !systems.includes(id))
        systems = this._reverseReplace(systems, 1, unusedSinglePlanets, excludedTiles)
      }
    }

    return systems
  }

  _reverseReplace(systems, numToReplace, replacements, excluded) {
    let idx = systems.length - 1
    while (numToReplace > 0 && replacements.length > 0 && idx > 0) {
      const tile = systems[idx]
      if (!excluded.includes(tile) && tile !== -1 && tile !== '18' && tile !== 0) {
        systems[idx] = replacements.shift()
        numToReplace--
      }
      idx--
    }
    return systems
  }

  // ── Tile weighting ─────────────────────────────────────────────────────────

  _orderByWeight(systems, ensuredAnomalies) {
    const { pickStyle, shuffleThreshold } = this.settings

    if (pickStyle === 'random') {
      return this.rng.shuffle(systems)
    }

    const weights = this._getWeights()

    // Score each tile
    const scored = systems.map(id => [id, this._scoreTile(id, weights, ensuredAnomalies)])
    scored.sort((a, b) => b[1] - a[1])

    // Shuffle tiles within the same weight tier
    const result = []
    let tierStart = 0
    while (tierStart < scored.length) {
      const highVal = scored[tierStart][1]
      let tierEnd = tierStart
      while (tierEnd < scored.length && scored[tierEnd][1] >= highVal - shuffleThreshold) {
        tierEnd++
      }
      const tier = scored.slice(tierStart, tierEnd)
      this.rng.shuffle(tier)
      result.push(...tier)
      tierStart = tierEnd
    }

    return result.map(entry => entry[0])
  }

  _getWeights() {
    const { pickStyle, usePok } = this.settings

    switch (pickStyle) {
      case 'resource':
        return { resource: 100, influence: 10, planet_count: 10, specialty: 10, anomaly: 10, wormhole: 10, racial: 5 }
      case 'influence':
        return { resource: 10, influence: 100, planet_count: 10, specialty: 10, anomaly: 10, wormhole: 10, racial: 5 }
      case 'custom': {
        const cw = this.settings.customWeights
        return {
          resource: cw.resource,
          influence: cw.influence,
          planet_count: cw.planetCount,
          specialty: cw.specialty,
          anomaly: cw.anomaly,
          wormhole: cw.wormhole,
          racial: cw.wormhole - 5,
        }
      }
      case 'balanced':
      default:
        return usePok
          ? { resource: 80, influence: 30, planet_count: 15, specialty: 50, anomaly: 40, wormhole: 25, racial: 20 }
          : { resource: 80, influence: 30, planet_count: 15, specialty: 40, anomaly: 30, wormhole: 25, racial: 20 }
    }
  }

  _scoreTile(tileId, weights, ensuredAnomalies) {
    const tile = tiles[String(tileId)]
    if (!tile) {
      return 0
    }

    let score = 0
    for (const planet of tile.planets) {
      score += (planet.resources / 4) * weights.resource
      score += (planet.influence / 4) * weights.influence
      score += weights.planet_count / 2
      if (planet.specialty) {
        score += weights.specialty
      }
    }

    if (tile.type === 'red') {
      score += weights.anomaly + 40
    }
    if (tile.wormhole && tile.wormhole.length > 0) {
      score += weights.wormhole
    }
    if (ensuredAnomalies.includes(tileId)) {
      score += weights.racial
    }

    return score
  }

  // ── Placement ──────────────────────────────────────────────────────────────

  _placeHyperlanes(map, layout) {
    for (const [position, tileId, orientation] of layout.hyperlane_tiles) {
      map[position] = `${tileId}-${orientation}`
    }
  }

  _placeHomeSystems(map, layout, currentRaces) {
    for (let i = 0; i < layout.home_worlds.length; i++) {
      const pos = layout.home_worlds[i]
      if (currentRaces && currentRaces[i]) {
        const homeSystem = raceData.raceToHomeSystemMap[currentRaces[i]]
        map[pos] = homeSystem != null ? String(homeSystem) : '0'
      }
      else {
        map[pos] = '0' // Unassigned home system marker
      }
    }
  }

  // ── Post-processing ────────────────────────────────────────────────────────

  _fixAnomalyAdjacencies(map, expansionFilter) {
    const allAnomalies = tileData.anomaly.filter(expansionFilter)

    // Find anomalies on the map that are adjacent to other anomalies
    // Skip home system tiles (green) — they should never be moved even if they have anomalies (e.g. Empyrean nebula)
    const mapAnomalies = map.filter(id => {
      const tile = tiles[id]
      return tile && tile.type !== 'green' && tile.anomaly && tile.anomaly.length > 0
    })
    const conflicts = []

    for (const anomalyId of mapAnomalies) {
      const pos = map.indexOf(anomalyId)
      const adjacent = adjacencyData[pos] || []
      const adjacentAnomalies = adjacent.filter(adjPos => {
        const adjTile = map[adjPos]
        return allAnomalies.includes(adjTile)
      })
      if (adjacentAnomalies.length > 0) {
        conflicts.push([anomalyId, adjacentAnomalies.length])
      }
    }

    // Sort by most conflicts first
    conflicts.sort((a, b) => b[1] - a[1])

    for (const [anomalyId] of conflicts) {
      const pos = map.indexOf(anomalyId)
      if (pos < 0) {
        continue
      }

      // Re-check adjacencies (may have been fixed by earlier swap)
      const adjacent = adjacencyData[pos] || []
      const stillConflicting = adjacent.some(adjPos => {
        const adjTile = map[adjPos]
        return allAnomalies.includes(adjTile)
      })
      if (!stillConflicting) {
        continue
      }

      const tile = tiles[anomalyId]

      // Try to swap with a non-anomaly tile on the board that has no anomaly neighbors
      if (tile.planets.length > 0 && !tile.anomaly.includes(ANOMALIES.SUPERNOVA)) {
        // Planet anomaly: swap with a blue tile
        const blueTiles = tileData.blue.filter(expansionFilter)
        for (const blueId of blueTiles) {
          const bluePos = map.indexOf(blueId)
          if (bluePos < 0) {
            continue
          }
          const blueAdj = adjacencyData[bluePos] || []
          const safe = !blueAdj.some(adjPos => {
            const t = map[adjPos]
            return allAnomalies.includes(t) && adjPos !== pos
          })
          if (safe) {
            map[pos] = blueId
            map[bluePos] = anomalyId
            break
          }
        }
      }
      else {
        // Empty anomaly: swap with a blank red
        const blankReds = tileData.blankRed.filter(expansionFilter)
        // Try unused blanks first
        const unusedBlanks = blankReds.filter(id => !map.includes(id))
        this.rng.shuffle(unusedBlanks)
        if (unusedBlanks.length > 0) {
          map[pos] = unusedBlanks[0]
          continue
        }
        // Swap with an on-board blank red
        for (const blankId of blankReds) {
          const blankPos = map.indexOf(blankId)
          if (blankPos < 0) {
            continue
          }
          const blankAdj = adjacencyData[blankPos] || []
          const safe = !blankAdj.some(adjPos => {
            const t = map[adjPos]
            return allAnomalies.includes(t) && adjPos !== pos
          })
          if (safe) {
            map[pos] = blankId
            map[blankPos] = anomalyId
            break
          }
        }
      }
    }
  }

  // ── Result construction ────────────────────────────────────────────────────

  _buildResult(map, layout) {
    // Determine used positions
    const usedSize = layout.home_worlds.some(hw => hw >= 37)
      ? boardData.POK_BOARD_SIZE
      : boardData.BOARD_SIZE

    // Build enriched position data
    const positions = []
    for (let i = 0; i < usedSize; i++) {
      const tileId = map[i]
      const tileInfo = tiles[String(tileId)]
      positions.push({
        index: i,
        tileId: tileId === -1 ? null : String(tileId),
        tile: tileInfo || null,
        hex: POSITION_TO_HEX[i] || null,
        isHomeWorld: layout.home_worlds.includes(i),
        isMecatolRex: i === 0,
        isHyperlane: typeof tileId === 'string' && tileId.includes('-') && !tileInfo,
      })
    }

    return {
      /** The raw map array (position index → tile ID string or -1) */
      map: map.slice(0, usedSize),

      /** Enriched position data with tile info */
      positions,

      /** The seed used for generation (for reproducibility) */
      seed: this.resolvedSeed,

      /** Effective settings used */
      settings: { ...this.settings },

      /** Board layout metadata */
      layout: {
        numPlayers: this.settings.numPlayers,
        boardStyle: this.settings.boardStyle,
        totalPositions: usedSize,
        homeWorldPositions: layout.home_worlds,
        description: layout.description,
      },
    }
  }

  /**
   * Convert a generator result into the state.systems format used by the game.
   * Returns an object mapping system IDs to { tileId, position: {q,r}, commandTokens: [] }.
   * Handles Creuss gate/home split automatically.
   *
   * @param {MapGeneratorResult} result
   * @returns {Object} systems map compatible with game.state.systems
   */
  static toGameSystems(result) {
    const systems = {}

    for (const pos of result.positions) {
      if (!pos.tileId || pos.tileId === '-1' || pos.tileId === '0') {
        continue
      }
      if (!pos.hex) {
        continue
      }

      // Hyperlane tiles
      if (pos.isHyperlane) {
        const hlId = `hyperlane-${pos.index}`
        systems[hlId] = {
          tileId: 'hyperlane',
          position: { ...pos.hex },
          commandTokens: [],
          isHyperlane: true,
        }
        continue
      }

      // Creuss gate: place gate at board position, home system off-map
      if (pos.tileId === 'creuss-gate') {
        systems['creuss-gate'] = {
          tileId: 'creuss-gate',
          position: { ...pos.hex },
          commandTokens: [],
        }
        systems['creuss-home'] = {
          tileId: 'creuss-home',
          position: { q: 99, r: 99 },
          commandTokens: [],
        }
        continue
      }

      systems[pos.tileId] = {
        tileId: pos.tileId,
        position: { ...pos.hex },
        commandTokens: [],
      }
    }

    return systems
  }
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function _removeFromArray(arr, item) {
  const idx = arr.indexOf(item)
  if (idx >= 0) {
    arr.splice(idx, 1)
  }
}

module.exports = MapGenerator
