const { BaseLogManager } = require('../lib/game/index.js')


class TwilightLogManager extends BaseLogManager {
  _registerDefaultHandlers() {
    super._registerDefaultHandlers()

    // Override base card* handler — Twilight passes plain strings, not card objects
    this.registerHandler('card*', (card) => ({
      value: typeof card === 'object' ? (card.name || card.id) : card,
      classes: ['card-name'],
    }))

    // Handler for technology names/IDs
    this.registerHandler('tech*', (tech) => ({
      value: typeof tech === 'object' ? (tech.name || tech.id) : tech,
      classes: ['tech-name'],
    }))

    // Handler for objective names
    this.registerHandler('objective*', (objective) => ({
      value: typeof objective === 'object' ? (objective.name || objective.id) : objective,
      classes: ['objective-name'],
    }))

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
