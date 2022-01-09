const { transitionFactory2 } = require('../../lib/transitionFactory.js')

module.exports = transitionFactory2({
  steps: [
    {
      name: 'karma',
      func: karma,
    },
    {
      name: 'score',
      func: score
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
  // return game.aCheckTriggers(context, 'before-score')
}

function score(context) {
  const { game, actor } = context
  const { card } = context.data
  const scoredCardId = game.mScore(actor, card).id
  game.rk.addKey(context.data, 'scoredCard', scoredCardId)
  game.mLog({
    template: '{player} scores {card}',
    args: {
      player: actor,
      card
    }
  })
}

function achievementCheck(context) {
  return context.game.aAchievementCheck(context)
}

function returnz(context) {
  if (context.data.scoredCard) {
    return context.return(context.data.scoredCard)
  }
  else {
    return context.done()
  }
}
