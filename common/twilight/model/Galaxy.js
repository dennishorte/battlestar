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
   * Get effective tile wormholes, accounting for Wormhole Nexus activation state.
   * Rule 100: inactive nexus has only gamma; active has alpha + beta + gamma.
   */
  _getTileWormholes(systemId) {
    const tile = this.getSystemTile(systemId)
    if (!tile) {
      return []
    }

    // Wormhole Nexus (system 82): inactive = gamma only, active = all
    if (tile.id === 82 && !this.game.state.wormholeNexusActive) {
      return ['gamma']
    }

    return [...tile.wormholes]
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

    // Hyperlane systems are not valid adjacency sources or targets
    if (system.isHyperlane) {
      return []
    }

    const adjacent = []
    const pos = system.position

    // Physical adjacency (skip hyperlane tiles)
    for (const [otherId, otherSystem] of Object.entries(this.game.state.systems)) {
      if (String(otherId) === String(systemId)) {
        continue
      }
      if (otherSystem.isHyperlane) {
        continue
      }
      const dist = getHexDistance(pos, otherSystem.position)
      if (dist === 1) {
        adjacent.push(String(otherId))
      }
    }

    // Hyperlane connection adjacency
    if (this.game.state.hyperlaneConnections) {
      const posKey = `${pos.q},${pos.r}`
      for (const [posA, posB] of this.game.state.hyperlaneConnections) {
        const keyA = `${posA.q},${posA.r}`
        const keyB = `${posB.q},${posB.r}`
        let targetPos = null
        if (keyA === posKey) {
          targetPos = posB
        }
        else if (keyB === posKey) {
          targetPos = posA
        }
        if (targetPos) {
          const targetId = Object.keys(this.game.state.systems).find(id => {
            const sys = this.game.state.systems[id]
            return sys.position.q === targetPos.q && sys.position.r === targetPos.r && !sys.isHyperlane
          })
          if (targetId && !adjacent.includes(String(targetId))) {
            adjacent.push(String(targetId))
          }
        }
      }
    }

    // Wormhole adjacency — combine tile wormholes with faction-granted wormholes
    // Enforced Travel Ban: alpha/beta wormholes have no effect during movement
    const enforcedTravelBan = this.game._isLawActive?.('enforced-travel-ban') ?? false
    let tileWormholes = this._getTileWormholes(systemId)
    if (enforcedTravelBan) {
      tileWormholes = tileWormholes.filter(w => w !== 'alpha' && w !== 'beta')
    }

    // Creuss quantum-entanglement: home system has alpha + beta wormholes
    if (this.game.factionAbilities) {
      const factionWormholes = this.game.factionAbilities.getHomeSystemWormholes(systemId)
      for (const w of factionWormholes) {
        if (!tileWormholes.includes(w)) {
          tileWormholes.push(w)
        }
      }
    }

    // Gamma wormhole tokens (from exploration cards)
    if (this.game.state.gammaWormholeTokens?.includes(String(systemId))) {
      if (!tileWormholes.includes('gamma')) {
        tileWormholes.push('gamma')
      }
    }

    // Ion Storm token
    const ionStorm = this.game.state.ionStormToken
    if (ionStorm && String(ionStorm.systemId) === String(systemId)) {
      if (!tileWormholes.includes(ionStorm.side)) {
        tileWormholes.push(ionStorm.side)
      }
    }

    // Faction-granted additional adjacency (e.g., Spatial Conduit Cylinder)
    // stored as game.state.temporaryAdjacency = [{ systemId, adjacentTo: [...] }]
    if (this.game.state.temporaryAdjacency) {
      for (const entry of this.game.state.temporaryAdjacency) {
        if (String(entry.systemId) === String(systemId)) {
          for (const adjId of entry.adjacentTo) {
            if (!adjacent.includes(String(adjId))) {
              adjacent.push(String(adjId))
            }
          }
        }
        // Also check reverse: if this system is in another entry's adjacentTo
        if (entry.adjacentTo.includes(String(systemId))) {
          if (!adjacent.includes(String(entry.systemId))) {
            adjacent.push(String(entry.systemId))
          }
        }
      }
    }

    if (tileWormholes.length > 0) {
      for (const [otherId, otherSystem] of Object.entries(this.game.state.systems)) {
        if (String(otherId) === String(systemId)) {
          continue
        }
        if (adjacent.includes(String(otherId))) {
          continue
        }
        if (otherSystem.isHyperlane) {
          continue
        }

        let otherWormholes = this._getTileWormholes(otherId)
        if (enforcedTravelBan) {
          otherWormholes = otherWormholes.filter(w => w !== 'alpha' && w !== 'beta')
        }

        // Also check faction wormholes on the other system
        if (this.game.factionAbilities) {
          const otherFactionWormholes = this.game.factionAbilities.getHomeSystemWormholes(otherId)
          for (const w of otherFactionWormholes) {
            if (!otherWormholes.includes(w)) {
              otherWormholes.push(w)
            }
          }
        }

        // Gamma wormhole tokens on other system
        if (this.game.state.gammaWormholeTokens?.includes(String(otherId))) {
          if (!otherWormholes.includes('gamma')) {
            otherWormholes.push('gamma')
          }
        }

        // Ion Storm token on other system
        if (ionStorm && String(ionStorm.systemId) === String(otherId)) {
          if (!otherWormholes.includes(ionStorm.side)) {
            otherWormholes.push(ionStorm.side)
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

    // Void Tether: remove adjacency for non-owner players on tethered borders
    if (this.game.state.voidTetherTokens && this.game.state._voidTetherCheckPlayer) {
      const checkPlayer = this.game.state._voidTetherCheckPlayer
      const filtered = adjacent.filter(adjId => {
        return !this.game.state.voidTetherTokens.some(token => {
          if (token.owner === checkPlayer) {
            return false  // Empyrean player is not blocked by own tethers
          }
          const [a, b] = token.systems
          return (String(a) === String(systemId) && String(b) === String(adjId)) ||
                 (String(b) === String(systemId) && String(a) === String(adjId))
        })
      })
      return filtered
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

        // Circlet of the Void: ignore all anomaly movement restrictions
        const movingPlayer = this.game.players?.byName(playerName)
        const hasCirclet = movingPlayer && this.game._hasRelic?.(movingPlayer, 'circlet-of-the-void')

        // Cannot move through asteroid fields (unless destination or Antimass Deflectors)
        if (tile?.anomaly === 'asteroid-field' && neighborId !== String(toSystemId)) {
          if (!hasCirclet && (!movingPlayer || !movingPlayer.hasTechnology('antimass-deflectors'))) {
            continue
          }
        }

        // Cannot move through supernova (unless faction allows it)
        // canMoveThroughSupernovae allows transit (passing through)
        // canMoveIntoSupernovae allows entering as destination only
        if (tile?.anomaly === 'supernova' && !hasCirclet) {
          const canTransit = this.game.factionAbilities?.canMoveThroughSupernovae(playerName)
          const canEnter = this.game.factionAbilities?.canMoveIntoSupernovae(playerName)
          if (!canTransit && !canEnter) {
            continue
          }
          // canMoveIntoSupernovae only allows entering as destination, not transiting
          if (!canTransit && canEnter && neighborId !== String(toSystemId)) {
            continue
          }
        }

        // Nebula: ships must stop (cannot pass through, only enter as destination)
        if (tile?.anomaly === 'nebula' && neighborId !== String(toSystemId)) {
          if (!hasCirclet && !this.game.factionAbilities?.canMoveThroughNebulae(playerName)) {
            continue
          }
        }

        const newPath = [...path, neighborId]

        // Gravity Rift: exiting a gravity rift costs 0 movement (Rule 41.1)
        const currentTile = this.getSystemTile(systemId)
        const isGravityRift = currentTile?.anomaly === 'gravity-rift'
          || !!this.game._getDimensionalTearOwner?.(systemId)
        const newDistance = isGravityRift ? distance : distance + 1

        if (neighborId === String(toSystemId)) {
          return newPath
        }

        // Cannot move through systems with enemy ships (unless destination or Light/Wave Deflector)
        // Aetherpassage: skip blocking by the granting player's ships
        // The Table's Grace: Mentak cruisers can pass through enemy systems
        const movingPlayerForFleet = this.game.players?.byName(playerName)
        const hasLightWave = movingPlayerForFleet && movingPlayerForFleet.hasTechnology('light-wave-deflector')
        const tablesGrace = this.game.state?._tablesGraceActive
        if (!hasLightWave && !tablesGrace) {
          const aetherGrant = this.game.state?.aetherpassageGrant
          const enemyShips = this._getEnemyShipsInSystem(neighborId, playerName)
            .filter(u => !aetherGrant || u.owner !== aetherGrant)
          if (enemyShips.length > 0) {
            continue  // blocked by enemy fleet
          }
        }

        // Aerie Hololattice: cannot move through systems with another player's structures
        if (this.game.factionAbilities?.isStructureBlocking(neighborId, playerName)) {
          continue
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
    const tileWormholes = this._getTileWormholes(systemId)

    if (wormholeType) {
      if (tileWormholes.includes(wormholeType)) {
        return true
      }
      // Gamma wormhole tokens from exploration cards
      if (wormholeType === 'gamma'
        && this.game.state.gammaWormholeTokens?.includes(String(systemId))) {
        return true
      }
      // Ion Storm token
      const ionStorm = this.game.state.ionStormToken
      if (ionStorm
        && String(ionStorm.systemId) === String(systemId)
        && ionStorm.side === wormholeType) {
        return true
      }
      return false
    }

    // No type specified — check if any wormhole is present
    if (tileWormholes.length > 0) {
      return true
    }
    if (this.game.state.gammaWormholeTokens?.includes(String(systemId))) {
      return true
    }
    const ionStorm = this.game.state.ionStormToken
    if (ionStorm && String(ionStorm.systemId) === String(systemId)) {
      return true
    }
    return false
  }

  /**
   * Get all systems containing a specific wormhole type.
   */
  getSystemsWithWormhole(wormholeType) {
    const systems = this.getAllSystemIds().filter(id => this.hasWormhole(id, wormholeType))

    // Include gamma wormhole token systems
    if (wormholeType === 'gamma' && this.game.state.gammaWormholeTokens) {
      for (const sysId of this.game.state.gammaWormholeTokens) {
        if (!systems.includes(String(sysId))) {
          systems.push(String(sysId))
        }
      }
    }

    // Include ion storm system if matching
    const ionStorm = this.game.state.ionStormToken
    if (ionStorm && ionStorm.side === wormholeType) {
      const stormId = String(ionStorm.systemId)
      if (!systems.includes(stormId)) {
        systems.push(stormId)
      }
    }

    return systems
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
