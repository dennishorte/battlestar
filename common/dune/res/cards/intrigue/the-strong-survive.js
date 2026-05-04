'use strict'

module.exports = {
  id: "the-strong-survive",
  name: "The Strong Survive",
  source: "Bloodlines",
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
  plotEffect: null,
  endgameEffect: null,
  combatText: "+3 Troops OR Retreat one of your troops → Trash a card",

  combatEffect(game, player, card, { resolveEffect }) {
    const choices = ['+3 Troops']
    const deployed = game.state.conflict.deployedTroops[player.name] || 0
    if (deployed > 0) {
      choices.push('Retreat 1 troop -> Trash a card')
    }
    const [choice] = game.actions.choose(player, choices, { title: 'The Strong Survive' })
    if (choice.includes('+3')) {
      const recruit = Math.min(3, player.troopsInSupply)
      if (recruit > 0) {
        player.decrementCounter('troopsInSupply', recruit, { silent: true })
        player.incrementCounter('troopsInGarrison', recruit, { silent: true })
      }
    }
    else {
      game.state.conflict.deployedTroops[player.name]--
      player.incrementCounter('troopsInSupply', 1, { silent: true })
      resolveEffect(game, player, { type: 'trash-card' }, null, card.name)
    }
  },

}
