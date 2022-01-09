const { transitionFactory2 } = require('../../lib/transitionFactory.js')

module.exports = transitionFactory2({
  steps: [
    {
      name: 'karma',
      func: karma,
    },
    {
      name: 'main',
      func: main
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
  // return game.aCheckTriggers(context, 'before-return')
}

function main(context) {
  const { game, actor } = context
  const { card } = context.data
  const returnedCardId = game.mReturn(actor, card).id
  game.rk.addKey(context.data, 'returnedCard', returnedCardId)
}

function achievementCheck(context) {
  return context.game.aAchievementCheck(context)
}

function returnz(context) {
  if (context.data.returnedCard) {
    return context.return(context.data.returnedCard)
  }
  else {
    return context.done()
  }
}
