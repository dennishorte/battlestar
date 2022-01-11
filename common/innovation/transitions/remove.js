const { transitionFactory2 } = require('../../lib/transitionFactory.js')

module.exports = transitionFactory2({
  steps: [
    {
      name: 'karma',
      func: karma,
    },
    {
      name: 'remove',
      func: remove
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
  // return game.aCheckTriggers(context, 'before-remove')
}

function remove(context) {
  const { game, actor } = context
  const { card } = context.data
  const removedCardId = game.mRemove(actor, card).id
  game.rk.addKey(context.data, 'removedCard', removedCardId)
}

function achievementCheck(context) {
  return context.game.aAchievementCheck(context)
}

function returnz(context) {
  if (context.data.removedCard) {
    return context.return(context.data.removedCard)
  }
  else {
    return context.done()
  }
}
