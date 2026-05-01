'use strict'

const constants = require('../../constants.js')
module.exports = {
  id: "plans-within-plans",
  name: "Plans Within Plans",
  source: "Base",
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
  vpsAvailable: 2,
  plotEffect: null,
  combatEffect: null,
  endgameText: "· Having 3 Influence (or more) on 3 Factions tracks: +1 Victory Point\n  OR\n· Having 3 Influence (or more) on four Faction tracks: +2 Victory Points",

  endgameEffect(game, player) {
    // Having 3+ Influence on 3 Factions: +1 VP OR 3+ on all 4: +2 VP
    const factionsAt3 = constants.FACTIONS.filter(f => player.getInfluence(f) >= 3).length
    if (factionsAt3 >= 4) {
      player.gainVp(2, 'Plans Within Plans (intrigue)')
      game.log.add({ template: '{player}: +2 VP (3+ on all 4 Factions)', args: { player } })
    }
    else if (factionsAt3 >= 3) {
      player.gainVp(1, 'Plans Within Plans (intrigue)')
      game.log.add({ template: '{player}: +1 VP (3+ on 3 Factions)', args: { player } })
    }
  },

}
