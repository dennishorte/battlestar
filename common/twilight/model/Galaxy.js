const { getHexDistance } = require('../res/mapLayouts.js')
const { getSystemTile } = require('../res/systemTiles.js')


/**
 * Galaxy manages the hex map, adjacency calculations, and pathfinding.
 * It operates on game.state.systems (the runtime positions of tiles).
 */
class Galaxy {
  constructor(game) {
    this.game = game
  }

  /**
   * Get all system IDs in the galaxy.
   */
  getAllSystemIds() {
    return Object.keys(this.game.state.systems)
  }

  /**
   * Get system runtime state (position, command tokens).
   */
  getSystem(systemId) {
    return this.game.state.systems[systemId]
  }

  /**
   * Get system tile definition (planets, anomaly, wormholes).
   */
  getSystemTile(systemId) {
    return getSystemTile(systemId) || getSystemTile(Number(systemId))
  }

  /**
   * Get all systems adjacent to the given system.
   * Includes physical adjacency (hex neighbors) and wormhole adjacency.
   */
  getAdjacent(systemId) {
    const system = this.getSystem(systemId)
    if (!system) {
      return []
    }

    const adjacent = []
    const pos = system.position

    // Physical adjacency
    for (const [otherId, otherSystem] of Object.entries(this.game.state.systems)) {
      if (String(otherId) === String(systemId)) {
        continue
      }
      const dist = getHexDistance(pos, otherSystem.position)
      if (dist === 1) {
        adjacent.push(String(otherId))
      }
    }

    // Wormhole adjacency — combine tile wormholes with faction-granted wormholes
    const tile = this.getSystemTile(systemId)
    const tileWormholes = tile ? [...tile.wormholes] : []

    // Creuss quantum-entanglement: home system has alpha + beta wormholes
    if (this.game.factionAbilities) {
      const factionWormholes = this.game.factionAbilities.getHomeSystemWormholes(systemId)
      for (const w of factionWormholes) {
        if (!tileWormholes.includes(w)) {
          tileWormholes.push(w)
        }
      }
    }

    if (tileWormholes.length > 0) {
      for (const [otherId] of Object.entries(this.game.state.systems)) {
        if (String(otherId) === String(systemId)) {
          continue
        }
        if (adjacent.includes(String(otherId))) {
          continue
        }

        const otherTile = this.getSystemTile(otherId)
        const otherWormholes = otherTile ? [...otherTile.wormholes] : []

        // Also check faction wormholes on the other system
        if (this.game.factionAbilities) {
          const otherFactionWormholes = this.game.factionAbilities.getHomeSystemWormholes(otherId)
          for (const w of otherFactionWormholes) {
            if (!otherWormholes.includes(w)) {
              otherWormholes.push(w)
            }
          }
        }

        if (otherWormholes.length > 0) {
          const hasMatch = tileWormholes.some(w => otherWormholes.includes(w))
          if (hasMatch) {
            adjacent.push(String(otherId))
          }
        }
      }
    }

    return adjacent
  }

  /**
   * Check if two systems are adjacent (including wormhole adjacency).
   */
  isAdjacent(systemIdA, systemIdB) {
    return this.getAdjacent(systemIdA).includes(String(systemIdB))
  }

  /**
   * Find a valid movement path from one system to another.
   * Respects movement rules: cannot move through systems with enemy ships
   * (unless the destination), anomaly restrictions, etc.
   *
   * Returns array of system IDs in the path, or null if no path exists.
   */
  findPath(fromSystemId, toSystemId, playerName, moveValue) {
    if (String(fromSystemId) === String(toSystemId)) {
      return [String(fromSystemId)]
    }

    // BFS with move value constraint
    const queue = [{ systemId: String(fromSystemId), path: [String(fromSystemId)], distance: 0 }]
    const visited = new Set([String(fromSystemId)])

    while (queue.length > 0) {
      const { systemId, path, distance } = queue.shift()

      if (distance >= moveValue) {
        continue
      }

      const neighbors = this.getAdjacent(systemId)
      for (const neighborId of neighbors) {
        if (visited.has(neighborId)) {
          continue
        }

        // Check if we can move through this system
        const tile = this.getSystemTile(neighborId)

        // Cannot move through asteroid fields (unless it's the destination)
        if (tile?.anomaly === 'asteroid-field' && neighborId !== String(toSystemId)) {
          continue
        }

        // Cannot move through supernova (unless faction allows it)
        if (tile?.anomaly === 'supernova') {
          if (!this.game.factionAbilities?.canMoveThroughSupernovae(playerName)) {
            continue
          }
        }

        // Nebula: ships must stop (cannot pass through, only enter as destination)
        if (tile?.anomaly === 'nebula' && neighborId !== String(toSystemId)) {
          if (!this.game.factionAbilities?.canMoveThroughNebulae(playerName)) {
            continue
          }
        }

        const newPath = [...path, neighborId]
        const newDistance = distance + 1

        if (neighborId === String(toSystemId)) {
          return newPath
        }

        // Cannot move through systems with enemy ships (unless destination)
        const enemyShips = this._getEnemyShipsInSystem(neighborId, playerName)
        if (enemyShips.length > 0) {
          continue  // blocked by enemy fleet
        }

        visited.add(neighborId)
        queue.push({ systemId: neighborId, path: newPath, distance: newDistance })
      }
    }

    return null  // no path found
  }

  /**
   * Get enemy ships in a system (ships owned by players other than the given player).
   */
  _getEnemyShipsInSystem(systemId, playerName) {
    const systemUnits = this.game.state.units[systemId]
    if (!systemUnits) {
      return []
    }
    return systemUnits.space.filter(u => u.owner !== playerName)
  }

  /**
   * Check if a system has a specific anomaly type.
   */
  hasAnomaly(systemId, anomalyType) {
    const tile = this.getSystemTile(systemId)
    if (!tile) {
      return false
    }
    if (anomalyType) {
      return tile.anomaly === anomalyType
    }
    return tile.anomaly !== null
  }

  /**
   * Check if a system has a specific wormhole type.
   */
  hasWormhole(systemId, wormholeType) {
    const tile = this.getSystemTile(systemId)
    if (!tile) {
      return false
    }
    if (wormholeType) {
      return tile.wormholes.includes(wormholeType)
    }
    return tile.wormholes.length > 0
  }

  /**
   * Get all systems containing a specific wormhole type.
   */
  getSystemsWithWormhole(wormholeType) {
    return this.getAllSystemIds().filter(id => this.hasWormhole(id, wormholeType))
  }

  /**
   * Get the hex distance between two systems.
   */
  getDistance(systemIdA, systemIdB) {
    const systemA = this.getSystem(systemIdA)
    const systemB = this.getSystem(systemIdB)
    if (!systemA || !systemB) {
      return Infinity
    }
    return getHexDistance(systemA.position, systemB.position)
  }
}

module.exports = { Galaxy }
