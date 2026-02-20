const { BaseLogManager } = require('../lib/game/index.js')


class TwilightLogManager extends BaseLogManager {
  _registerDefaultHandlers() {
    super._registerDefaultHandlers()

    // Handler for faction names
    this.registerHandler('faction*', (faction) => ({
      value: faction.name || faction,
      classes: ['faction'],
    }))

    // Handler for system/tile references
    this.registerHandler('system*', (system) => ({
      value: system.name || `System ${system.id || system}`,
      classes: ['system'],
    }))

    // Handler for unit types
    this.registerHandler('unit*', (unit) => ({
      value: unit.name || unit,
      classes: ['unit'],
    }))
  }
}

module.exports = { TwilightLogManager }
