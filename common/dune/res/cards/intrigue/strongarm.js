'use strict'

const factions = require('../../../systems/factions.js')
const deploy = require('../../../systems/deploy.js')
const boardSpaces = require('../../boardSpaces.js')

function visitedFaction(game) {
  const spaceId = game.state.turnTracking?.agentSpaceId
  const space = boardSpaces.getBoardSpaces(game.settings).find(candidate => candidate.id === spaceId)
  return space?.faction || null
}

module.exports = {
  id: "strongarm",
  name: "Strongarm",
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
  plotText: "Lose a Troop → Gain one Influence with a Faction whose board space you sent an Agent to this turn",

  canPlayPlot(game, player) {
    return visitedFaction(game) != null && player.troopsInGarrison > 0
  },

  plotEffect(game, player) {
    const faction = visitedFaction(game)
    if (!faction || player.troopsInGarrison <= 0) {
      return
    }
    deploy.loseTroops(game, player, 1, { from: 'garrison' })
    factions.gainInfluence(game, player, faction)
  },

}
