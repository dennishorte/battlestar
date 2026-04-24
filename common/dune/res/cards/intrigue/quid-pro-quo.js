'use strict'

const factions = require('../../../systems/factions.js')
module.exports = {
  id: "quid-pro-quo",
  name: "Quid Pro Quo",
  source: "Rise of Ix",
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
  plotText: "Pay 2 Spice → Gain one Influence with each Faction that has at least one of your Agents on its board spaces",

  plotEffect(game, player) {
    if (player.spice >= 2) {
      const choices = ['Pass', 'Pay 2 Spice for +1 Influence per faction with agents']
      const [choice] = game.actions.choose(player, choices, { title: 'Quid Pro Quo' })
      if (choice !== 'Pass') {
        player.decrementCounter('spice', 2, { silent: true })
        // Gain influence with each faction that has at least one of your agents
        const boardSpacesData = require('../../boardSpaces.js')
        const factionSet = new Set()
        for (const space of boardSpacesData) {
          if ((game.state.boardSpaces[space.id] || []).includes(player.name) && space.faction) {
            factionSet.add(space.faction)
          }
        }
        for (const faction of factionSet) {
          factions.gainInfluence(game, player, faction)
        }
      }
    }
  },

}
