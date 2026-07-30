'use strict'

const deploy = require('../../../systems/deploy.js')

module.exports = {
  id: "shaddams-favor",
  name: "Shaddam's Favor",
  source: "Uprising",
  compatibility: "All",
  count: 1,
  hasTech: false,
  hasShipping: false,
  hasResearch: false,
  hasSpies: false,
  hasSandworms: false,
  hasContracts: false,
  hasBattleIcons: false,
  hasSardaukar: false,
  isTwisted: false,
  vpsAvailable: 0,
  combatEffect: null,
  endgameEffect: null,
  plotText: "+1 Troop, and if you have 3 Influence with the Emperor: +3 Solari",

  plotEffect(game, player) {
    deploy.recruitTroops(game, player, 1)
    if (player.getInfluence('emperor') >= 3) {
      player.incrementCounter('solari', 3, { silent: true })
      game.log.add({
        template: '{player}: Emperor synergy — +{amount} {resource}',
        args: { player, amount: 3, resource: 'solari' },
      })
    }
  },

}
