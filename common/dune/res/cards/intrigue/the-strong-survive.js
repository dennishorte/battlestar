'use strict'

const deploy = require('../../../systems/deploy.js')

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
    const choices = [game.actions.option({ id: 'troops', title: '+3 Troops' })]
    const deployed = game.state.conflict.deployedTroops[player.name] || 0
    if (deployed > 0) {
      choices.push(game.actions.option({ id: 'retreat', title: 'Retreat 1 troop -> Trash a card' }))
    }
    const [choice] = game.actions.choose(player, choices, { title: 'The Strong Survive' })
    const chId = typeof choice === 'object' ? choice.id : choice
    const isTroops = chId === 'troops' || (typeof choice === 'string' && choice.includes('+3'))
    if (isTroops) {
      deploy.recruitTroops(game, player, 3)
    }
    else {
      deploy.retreatTroops(game, player, 1)
      resolveEffect(game, player, { type: 'trash-card' }, null, card.name)
    }
  },

}
