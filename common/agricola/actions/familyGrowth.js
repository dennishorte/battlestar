const { AgricolaActionManager } = require('../AgricolaActionManager.js')
const res = require('../res/index.js')

AgricolaActionManager.prototype.familyGrowth = function(player, requiresRoom = true) {
  if (!player.canGrowFamily(requiresRoom)) {
    // Check if a card allows growth without room (e.g., FieldDoctor, DeliveryNurse)
    let allowedByCard = false
    if (requiresRoom && player.canGrowFamily(false)) {
      for (const card of this.game.getPlayerActiveCards(player)) {
        if (card.hasHook('allowsFamilyGrowthWithoutRoom') &&
            card.callHook('allowsFamilyGrowthWithoutRoom', this.game, player)) {
          allowedByCard = true
          card.callHook('onFamilyGrowthWithoutRoom', this.game, player)
          break
        }
      }
    }
    if (!allowedByCard) {
      if (player.familyMembers >= res.constants.maxFamilyMembers) {
        this.log.add({
          template: '{player} already has maximum family members',
          args: { player },
        })
      }
      else {
        this.log.add({
          template: '{player} needs more rooms for family growth',
          args: { player },
        })
      }
      return false
    }
  }

  player.growFamily()

  this.log.add({
    template: '{player} grows their family (now {count} members)',
    args: { player, count: player.familyMembers },
  })

  this.game.callPlayerCardHook(player, 'afterFamilyGrowth')

  // Call onAnyFamilyGrowth for all players (e.g., PartyOrganizer)
  for (const other of this.game.players.all()) {
    const cards = this.game.getPlayerActiveCards(other)
    for (const card of cards) {
      if (card.hasHook('onAnyFamilyGrowth')) {
        card.callHook('onAnyFamilyGrowth', this.game, player, other)
      }
    }
  }

  return true
}

