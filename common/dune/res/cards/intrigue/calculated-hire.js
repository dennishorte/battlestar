'use strict'

module.exports = {
  id: "calculated-hire",
  name: "Calculated Hire",
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
  plotText: "Pay 1 Spice → Take the Mentat from its designated space in the Landsraad",

  plotEffect(game, player) {
    // Pay 1 Spice -> Take Mentat (expansion) — stub
    game.log.add({ template: '{player}: Calculated Hire — Mentat not available (expansion)', args: { player }, event: 'memo' })
  },

}
