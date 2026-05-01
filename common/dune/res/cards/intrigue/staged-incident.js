'use strict'

module.exports = {
  id: "staged-incident",
  name: "Staged Incident",
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
  vpsAvailable: 1,
  plotEffect: null,
  endgameEffect: null,
  combatText: "Lose 3 of your troops in the Conflict → +1 Victory Point\n(If you remove 3 of your troops after playing this card, you gain 1 VP.)",

  combatEffect(game, player) {
    const deployed = game.state.conflict.deployedTroops[player.name] || 0
    if (deployed >= 3) {
      game.state.conflict.deployedTroops[player.name] -= 3
      player.incrementCounter('troopsInSupply', 3, { silent: true })
      player.gainVp(1, 'Staged Incident (intrigue)')
      game.log.add({ template: '{player}: Loses 3 troops, +1 VP', args: { player } })
    }
  },

}
