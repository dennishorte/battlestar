'use strict'

module.exports = {
  name: 'Prince Rhombur Vernius',
  source: 'Rise of Ix',
  compatibility: 'Rise of Ix',
  house: 'Vernius',
  startingEffect: null,
  leaderAbility: 'Heavy Lasgun Cannons\nYour dreadnoughts have 4 Swords (instead of 3).',
  signetRingAbility: 'Ixian Technology\n· Acquire Tech or Place a Negotiator',
  complexity: 1,

  resolveSignetRing(game, player, resolveEffect) {
    const [choice] = game.actions.choose(player, [
      game.actions.option({ id: 'acquire', title: 'Acquire Tech' }),
      game.actions.option({ id: 'negotiator', title: 'Place a Negotiator' }),
    ], { title: 'Ixian Technology' })
    const choiceId = typeof choice === 'object' ? choice.id : choice
    if (choiceId === 'negotiator' || choice === 'Place a Negotiator') {
      resolveEffect(game, player, { type: 'place-negotiator' })
      return
    }
    resolveEffect(game, player, { type: 'acquire-tech' })
  },
}
