'use strict'

module.exports = {
  id: "bypass-protocol",
  name: "Bypass Protocol",
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
    // Acquire card costing 3 or less, OR pay 2 Spice for card costing 5 or less
    const choices = ['Acquire card costing 3 Persuasion or less']
    if (player.spice >= 2) {
      choices.push('Pay 2 Spice: Acquire card costing 5 or less')
    }
    choices.push('Pass')
    const [choice] = game.actions.choose(player, choices, { title: 'Bypass Protocol' })
    if (choice.includes('3')) {
      player.incrementCounter('persuasion', 3, { silent: true })
    }
    else if (choice.includes('5')) {
      player.decrementCounter('spice', 2, { silent: true })
      player.incrementCounter('persuasion', 5, { silent: true })
    }
  },

}
