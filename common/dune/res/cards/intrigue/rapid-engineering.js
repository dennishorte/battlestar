'use strict'

module.exports = {
  id: "rapid-engineering",
  name: "Rapid Engineering",
  source: "Bloodlines",
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
  vpsAvailable: 0,
  combatEffect: null,
  endgameEffect: null,

  plotEffect(game, player) {
    // Discard -> Buy Tech (expansion) OR 3+ Tech -> Influence (expansion)
    game.log.add({ template: '{player}: Rapid Engineering — Tech not available (expansion)', args: { player }, event: 'memo' })
  },

}
