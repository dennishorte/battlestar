const { BaseCard } = require('../lib/game/index.js')


class AgricolaCard extends BaseCard {
  constructor(game, cardDef) {
    super(game, { id: cardDef.id })
    this.definition = cardDef
  }

  get name() {
    return this.definition.name
  }

  get type() {
    return this.definition.type
  }

  get cost() {
    return this.definition.cost
  }

  get prereqs() {
    return this.definition.prereqs
  }

  get passLeft() {
    return this.definition.passLeft
  }

  get victoryPoints() {
    return this.definition.victoryPoints
  }

  get bakingConversion() {
    return this.definition.bakingConversion
  }

  get cookingRates() {
    return this.definition.cookingRates
  }

  get harvestConversion() {
    return this.definition.harvestConversion
  }

  get vps() {
    return this.definition.vps
  }

  get text() {
    return this.definition.text
  }

  get isField() {
    return this.definition.isField
  }

  get upgradesFrom() {
    return this.definition.upgradesFrom
  }

  callHook(hookName, ...args) {
    if (typeof this.definition[hookName] === 'function') {
      return this.definition[hookName](...args)
    }
    return undefined
  }

  hasHook(hookName) {
    return typeof this.definition[hookName] === 'function'
  }

  _afterMoveTo(newZone) {
    const zoneOwner = newZone.owner?.() ?? null
    if (zoneOwner) {
      this.owner = zoneOwner
    }
  }
}

module.exports = { AgricolaCard }
