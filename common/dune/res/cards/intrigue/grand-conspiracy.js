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
    // Complex multi-condition check (Dreadnoughts, TSMF, Influence, High Council)
    // Check the non-expansion conditions
    let conditions = 0
    // 1+ TSMF
    const allZones = [game.zones.byId(`${player.name}.deck`), game.zones.byId(`${player.name}.hand`),
      game.zones.byId(`${player.name}.discard`), game.zones.byId(`${player.name}.played`)]
    const hasTSMF = allZones.some(z => z.cardlist().some(c => c.name === 'The Spice Must Flow'))
    if (hasTSMF) {
      conditions++
    }
    // 4+ Influence on 2+ tracks
    const tracksAt4 = constants.FACTIONS.filter(f => player.getInfluence(f) >= 4).length
    if (tracksAt4 >= 2) {
      conditions++
    }
    // High Council seat
    if (player.hasHighCouncil) {
      conditions++
    }
    // Dreadnoughts — expansion, skip
    // Any 3 of these: +1 VP; all 5: +3 VP (but we only have 3 non-expansion conditions)
    if (conditions >= 3) {
      player.gainVp(1, 'Grand Conspiracy (intrigue)')
      game.log.add({ template: '{player}: Grand Conspiracy — +1 VP ({count}/5 conditions)', args: { player, count: conditions } })
    }
  },

}
