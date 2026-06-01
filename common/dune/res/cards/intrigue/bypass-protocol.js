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
  plotText: "· Acquire a card that costs 3 Persuasion or less\n  OR\n· Pay 2 Spice → Acquire a card that costs 5 Persuasion to the top of your deck",

  plotEffect(game, player) {
    // Acquire card costing 3 or less, OR pay 2 Spice for card costing 5 or less
    const choices = [game.actions.option({ id: 'cheap', title: 'Acquire card costing 3 Persuasion or less' })]
    if (player.spice >= 2) {
      choices.push(game.actions.option({ id: 'expensive', title: 'Pay 2 Spice: Acquire card costing 5 or less' }))
    }
    choices.push(game.actions.option({ id: 'pass', title: 'Pass' }))
    const [choice] = game.actions.choose(player, choices, { title: 'Bypass Protocol' })
    const chId = typeof choice === 'object' ? choice.id : choice
    const isCheap = chId === 'cheap' || (typeof choice === 'string' && choice.includes('3'))
    const isExpensive = chId === 'expensive' || (typeof choice === 'string' && choice.includes('5'))
    if (isCheap) {
      player.incrementCounter('persuasion', 3, { silent: true })
    }
    else if (isExpensive) {
      player.decrementCounter('spice', 2, { silent: true })
      player.incrementCounter('persuasion', 5, { silent: true })
    }
  },

}
