const { Agricola } = require('./agricola')

Agricola.prototype.getAvailableMajorImprovements = function() {
  const majorZone = this.zones.byId('common.majorImprovements')
  return majorZone.cardlist().map(c => c.id)
}

/**
 * Check if a player can use the Adoptive Parents card ability.
 * Requirements:
 * - Player has no available workers
 * - Player has newborns from this round
 * - Player has at least 1 food
 * - Player has an occupation with allowImmediateOffspringAction flag
 */
Agricola.prototype.canUseAdoptiveParents = function(player) {
  // Must have no available workers
  if (player.getAvailableWorkers() > 0) {
    return false
  }

  // Must have newborns
  if (player.newborns.length === 0) {
    return false
  }

  // Must be able to adopt (has food)
  if (!player.canAdoptNewborn()) {
    return false
  }

  // Must have a card with allowImmediateOffspringAction
  const occupations = this.zones.byPlayer(player, 'occupations').cardlist()
  return occupations.some(card => card.definition.allowImmediateOffspringAction === true)
}

Agricola.prototype.canUseGuestRoom = function(player) {
  if (player.getAvailableWorkers() > 0) {
    return false
  }
  const card = this._getGuestRoomCard(player)
  if (!card) {
    return false
  }
  const state = this.cardState(card.id)
  if (!state.food || state.food <= 0) {
    return false
  }
  if (state.lastUsedRound === this.state.round) {
    return false
  }
  return true
}

Agricola.prototype._getGuestRoomCard = function(player) {
  const cards = this.getPlayerActiveCards(player)
  return cards.find(c => c.definition.enablesGuestWorker)
}

Agricola.prototype.canUseWorkPermit = function(player) {
  if (player.getAvailableWorkers() > 0) {
    return false
  }
  if (!this.state.workPermitWorkers || this.state.workPermitWorkers.length === 0) {
    return false
  }
  return this.state.workPermitWorkers.some(
    e => e.round === this.state.round && e.playerName === player.name
  )
}

Agricola.prototype.canUseBrotherlyLove = function(player) {
  if (player.getFamilySize() !== 4) {
    return false
  }
  if (player.getPersonPlacedThisRound() !== 2) {
    return false
  }
  if (player.getAvailableWorkers() < 2) {
    return false
  }
  const cards = this.getPlayerActiveCards(player)
  return cards.some(c => c.definition.modifiesWorkerPlacement === 'brotherlyLove')
}
