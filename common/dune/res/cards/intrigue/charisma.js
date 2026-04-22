'use strict'

module.exports = {
  id: "charisma",
  name: "Charisma",
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
  vpsAvailable: 0,
  combatEffect: null,
  endgameEffect: null,

  plotEffect(game, player) {
    player.incrementCounter('persuasion', 2, { silent: true })
    game.log.add({ template: '{player}: +2 Persuasion this Reveal turn', args: { player } })
  },

}
