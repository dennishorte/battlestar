'use strict'

module.exports = {
  id: "corner-the-market",
  name: "Corner The Market",
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
  endgameText: "· If you have at least 2 \"The Spice Must Flow\": +1 Victory Point\n· If you have more \"The Spice Must Flow\" than each opponent: +1 Victory Point",

  endgameEffect(game, player) {
    // Count TSMF cards
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
      player.incrementCounter('vp', 1, { silent: true })
      game.log.add({ template: '{player}: +1 VP (2+ TSMF)', args: { player } })
    }
  },

}
