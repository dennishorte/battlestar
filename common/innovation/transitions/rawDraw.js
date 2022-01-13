const { transitionFactory2 } = require('../../lib/transitionFactory.js')

module.exports = transitionFactory2({
  steps: [
    {
      name: 'karma',
      func: karma,
    },
    {
      name: 'karmaInstead',
      func: karmaInstead,
    },
    {
      name: 'draw',
      func: draw
    },
    {
      name: 'achievementCheck',
      func: achievementCheck,
    },
    {
      name: 'returnz',
      func: returnz
    }
  ]
})

function karma(context) {
  const { game } = context
  return game.aCheckKarma(context, 'draw')
}

function karmaInstead(context) {
  const { game } = context
  const { returned } = context.data

  if (returned === 'would-instead') {
    return context.done()
  }
}

function draw(context) {
  const { game, actor } = context
  const { isShareBonus } = context.data


  // Determine which expansion to draw from.
  let exp = 'base'
  if (game.getExpansionList().includes('echo')) {
    throw new Error('Drawing cards not supported in Echoes of the Past yet.')
  }
  if (
    game.getExpansionList().includes('figs')
    && isShareBonus
    && exp === 'base'
  ) {
    exp = 'figs'
  }

  // If age is not specified, draw based on player's current highest top card.
  const baseAge = context.data.age || game.getHighestTopCard(actor).age || 1

  // Adjust age based on empty decks.
  const { adjustedAge, adjustedExp } = game.getAdjustedDeck(baseAge, exp)

  const drawnCardId = game.mDraw(actor, adjustedExp, adjustedAge).id
  game.rk.addKey(context.data, 'drawnCard', drawnCardId)
}

function achievementCheck(context) {
  return context.game.aAchievementCheck(context)
}

function returnz(context) {
  if (context.data.drawnCard) {
    return context.return(context.data.drawnCard)
  }
  else {
    return context.done()
  }
}
