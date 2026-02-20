const { getSystemTile } = require('../res/systemTiles.js')
const { getPlanetsBySystem } = require('../res/planets.js')


/**
 * System represents a hex tile on the galaxy map.
 * Provides convenience accessors over game.state.systems[id].
 */
class System {
  constructor(game, systemId) {
    this.game = game
    this.systemId = systemId
  }

  get state() {
    return this.game.state.systems[this.systemId]
  }

  get tile() {
    return getSystemTile(this.systemId) || getSystemTile(Number(this.systemId))
  }

  get position() {
    return this.state?.position
  }

  get planets() {
    return this.tile?.planets || []
  }

  get planetData() {
    return getPlanetsBySystem(this.tile?.id)
  }

  get anomaly() {
    return this.tile?.anomaly || null
  }

  get wormholes() {
    return this.tile?.wormholes || []
  }

  get type() {
    return this.tile?.type || null
  }

  get commandTokens() {
    return this.state?.commandTokens || []
  }

  /**
   * Check if a player has a command token in this system.
   */
  hasCommandToken(playerName) {
    return this.commandTokens.includes(playerName)
  }

  /**
   * Add a command token for a player.
   */
  addCommandToken(playerName) {
    this.state.commandTokens.push(playerName)
  }

  /**
   * Remove a command token for a player.
   */
  removeCommandToken(playerName) {
    const idx = this.state.commandTokens.indexOf(playerName)
    if (idx !== -1) {
      this.state.commandTokens.splice(idx, 1)
    }
  }

  /**
   * Get all ships in the space area of this system.
   */
  getShips(ownerName) {
    const units = this.game.state.units[this.systemId]
    if (!units) {
      return []
    }
    if (ownerName) {
      return units.space.filter(u => u.owner === ownerName)
    }
    return units.space
  }

  /**
   * Get ground forces on a specific planet.
   */
  getGroundForces(planetId, ownerName) {
    const units = this.game.state.units[this.systemId]
    if (!units || !units.planets[planetId]) {
      return []
    }
    if (ownerName) {
      return units.planets[planetId].filter(u => u.owner === ownerName)
    }
    return units.planets[planetId]
  }

  /**
   * Check if a player has any units (ships or ground forces) in this system.
   */
  hasUnits(playerName) {
    const ships = this.getShips(playerName)
    if (ships.length > 0) {
      return true
    }

    for (const planetId of this.planets) {
      const ground = this.getGroundForces(planetId, playerName)
      if (ground.length > 0) {
        return true
      }
    }

    return false
  }

  /**
   * Check if this is a home system.
   */
  isHomeSystem() {
    return this.type === 'home'
  }

  /**
   * Check if this is the Mecatol Rex system.
   */
  isMecatolRex() {
    return this.systemId === 18 || this.systemId === '18'
  }
}

module.exports = { System }
