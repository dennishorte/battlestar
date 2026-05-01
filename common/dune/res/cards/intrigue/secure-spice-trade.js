'use strict'

module.exports = {
  id: "secure-spice-trade",
  name: "Secure Spice Trade",
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
  endgameText: "If you have at least two The Spice Must Flow, +1 Victory Point and +2 Spice",

  endgameEffect(game, player) {
    const allZones = [
      game.zones.byId(`${player.name}.deck`),
      game.zones.byId(`${player.name}.hand`),
      game.zones.byId(`${player.name}.discard`),
      game.zones.byId(`${player.name}.played`),
    ]
    let tsmfCount = 0
    for (const zone of allZones) {
      tsmfCount += zone.cardlist().filter(c => c.name === 'The Spice Must Flow').length
    }
    if (tsmfCount >= 2) {
      player.gainVp(1, 'Secure Spice Trade (intrigue)')
      player.incrementCounter('spice', 2, { silent: true })
      game.log.add({ template: '{player}: +1 VP, +2 Spice (2+ TSMF)', args: { player } })
    }
  },

}
