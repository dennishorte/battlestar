'use strict'

module.exports = {
  id: "machine-culture",
  name: "Machine Culture",
  source: "Rise of Ix",
  compatibility: "All",
  count: 1,
  hasTech: true,
  hasShipping: false,
  hasResearch: false,
  hasSpies: false,
  hasSandworms: false,
  hasContracts: false,
  hasBattleIcons: false,
  hasSardaukar: false,
  isTwisted: false,
  vpsAvailable: 1,
  combatEffect: null,
  plotText: "Acquire Tech",
  endgameText: "If you have three or more Tech tiles: +1 Victory Point",

  plotEffect(game, player) {
    require('../../../systems/tech.js').acquireTech(game, player)
  },

  endgameEffect(game, player) {
    const owned = game.state.ownedTech?.[player.name] || []
    if (owned.length < 3) {
      return
    }
    player.incrementCounter('vp', 1, { silent: true, source: 'Machine Culture' })
    game.log.add({
      template: '{player}: Machine Culture — +1 Victory Point',
      args: { player },
    })
  },

}
