'use strict'

module.exports = {
  name: 'Prince Rhombur Vernius',
  source: 'Rise of Ix',
  compatibility: 'Rise of Ix',
  house: 'Vernius',
  startingEffect: null,
  leaderAbility: 'Heavy Lasgun Cannons\nYour dreadnoughts have 4 Swords (instead of 3).',
  signetRingAbility: 'Ixian Technology\n· Acquire Tech or Ixian Negotiation',
  complexity: 1,

  resolveSignetRing(game, player, resolveEffect) {
    const [choice] = game.actions.choose(player, [
      game.actions.option({ id: 'acquire', title: 'Acquire Tech' }),
      game.actions.option({ id: 'negotiate', title: 'Ixian Negotiation' }),
    ], { title: 'Ixian Technology' })
    const choiceId = typeof choice === 'object' ? choice.id : choice
    if (choiceId === 'negotiate' || choice === 'Ixian Negotiation') {
      resolveEffect(game, player, { type: 'tech-negotiation' })
      return
    }
    resolveEffect(game, player, { type: 'acquire-tech' })
  },
}
