const { BaseCard } = require('../lib/game/index.js')

class DuneCard extends BaseCard {
  constructor(game, data) {
    super(game, data)
    this.definition = data
  }

  get name() {
    return this.definition.name
  }
  get type() {
    return this.definition.type
  }
  get persuasionCost() {
    return this.definition.persuasionCost || 0
  }
  get agentIcons() {
    return this.definition.agentIcons || []
  }
  get factionAccess() {
    return this.definition.factionAccess || []
  }
  get spyAccess() {
    return this.definition.spyAccess || false
  }
  get factionAffiliation() {
    return this.definition.factionAffiliation || null
  }
  get revealPersuasion() {
    return this.definition.revealPersuasion || 0
  }
  get revealSwords() {
    return this.definition.revealSwords || 0
  }

  hasAgentIcon(icon) {
    return this.agentIcons.includes(icon) || this.factionAccess.includes(icon)
  }

  canSendAgentTo(boardSpace) {
    // Check if any of the card's icons match the board space's required icon
    if (this.hasAgentIcon(boardSpace.icon)) {
      return true
    }
    // Spy access: can send to spaces connected to observation posts with player's spy
    if (this.spyAccess && boardSpace.hasConnectedSpy) {
      return true
    }
    return false
  }
}

module.exports = { DuneCard }
