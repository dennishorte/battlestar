const { transitionFactory2 } = require('../../lib/transitionFactory.js')

module.exports = transitionFactory2({
  steps: [
    {
      name: 'empire',
      func: (context) => test(context, 'Empire')
    },
    {
      name: 'monument',
      func: (context) => test(context, 'Monument')
    },
    {
      name: 'wonder',
      func: (context) => test(context, 'Wonder')
    },
    {
      name: 'world',
      func: (context) => test(context, 'World')
    },
    {
      name: 'universe',
      func: (context) => test(context, 'Universe')
    },
    {
      name: 'destiny',
      func: (context) => test(context, 'Destiny')
    },
    {
      name: 'heritage',
      func: (context) => test(context, 'Heritage')
    },
    {
      name: 'history',
      func: (context) => test(context, 'History')
    },
    {
      name: 'supremacy',
      func: (context) => test(context, 'Supremacy')
    },
    {
      name: 'wealth',
      func: (context) => test(context, 'Wealth')
    },
  ]
})

function test(context, name) {
  const { game } = context

  // Skip already claimed or unused achievements
  if (!game.checkAchievementAvailable(name)) {
    return
  }

  const card = game.getCardData(name)
  const test = card.checkPlayerIsEligible

  // From the current player, test each player to see if they got it.
  // If any player claims it, safely push the claim achievement transition, since
  // no other player will be able to claim it.
  for (const player of game.getPlayerAllFrom(game.getPlayerCurrentTurn())) {
    if (test(game, player)) {
      return game.aClaimAchievement(context, player, name)
    }
  }

  return undefined
}
