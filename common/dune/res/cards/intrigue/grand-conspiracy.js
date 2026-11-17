'use strict'

const constants = require('../../constants.js')
module.exports = {
  id: "grand-conspiracy",
  name: "Grand Conspiracy",
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
  vpsAvailable: 2,
  plotEffect: null,
  combatEffect: null,
  endgameText: "2 Dreadnoughts, 1+ The Spice Must Flow, 4+ Influence on 2+ Influence tracks, A seat on the High Council; If you have any three: +1 Victory Point; If you have all four: +2 Victory Points",

  endgameEffect(game, player) {
    let conditions = 0
    const zones = ['deck', 'hand', 'discard', 'played', 'revealed']
    const hasSpiceMustFlow = zones.some(zone => {
      const pile = game.zones.byId(`${player.name}.${zone}`)
      return pile?.cardlist().some(c => c.name === 'The Spice Must Flow')
    })
    if (hasSpiceMustFlow) {
      conditions++
    }
    const tracksAt4 = constants.FACTIONS.filter(f => player.getInfluence(f) >= 4).length
    if (tracksAt4 >= 2) {
      conditions++
    }
    if (player.hasHighCouncil) {
      conditions++
    }
    let dreadnoughts = player.dreadnoughtsInGarrison + player.dreadnoughtsInConflict
    for (const info of Object.values(game.state.parkedDreadnoughts || {})) {
      if (info?.owner === player.name) {
        dreadnoughts++
      }
    }
    if (dreadnoughts >= 2) {
      conditions++
    }
    const vp = conditions >= 4 ? 2 : conditions >= 3 ? 1 : 0
    if (vp > 0) {
      player.incrementCounter('vp', vp, { silent: true, source: 'Grand Conspiracy (intrigue)' })
      game.log.add({
        template: '{player}: Grand Conspiracy — +{amount} Victory Point(s)',
        args: { player, amount: vp },
      })
    }
  },

}
