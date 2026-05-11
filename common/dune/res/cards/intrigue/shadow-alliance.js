'use strict'

const constants = require('../../constants.js')

module.exports = {
  id: "shadow-alliance",
  name: "Shadow Alliance",
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
  vpsAvailable: 1,
  plotEffect: null,
  combatEffect: null,
  endgameText: "If you have 4+ Influence on a Faction track where an opponent has the Alliance: +1 Victory Point",

  endgameEffect(game, player) {
    const qualifies = constants.FACTIONS.some(faction => {
      const allianceHolder = game.state.alliances[faction]
      if (!allianceHolder || allianceHolder === player.name) {
        return false
      }
      return player.getInfluence(faction) >= 4
    })
    if (qualifies) {
      player.incrementCounter('vp', 1, { silent: true, source: 'Shadow Alliance' })
      game.log.add({ template: '{player} gains 1 Victory Point', args: { player } })
    }
  },
}
