const { transitionFactory2 } = require('../../lib/transitionFactory.js')

module.exports = transitionFactory2({
  steps: [
    {
      name: 'karma',
      func: karma,
    },
    {
      name: 'meld',
      func: meld
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
  // return game.aCheckKarma(context, 'meld')
}

function meld(context) {
  const { game, actor } = context
  const { card } = context.data
  const meldedCardId = game.mMeld(actor, card).id
  game.rk.addKey(context.data, 'meldedCard', meldedCardId)
}

function achievementCheck(context) {
  return context.game.aAchievementCheck(context)
}

function returnz(context) {
  if (context.data.meldedCard) {
    return context.return(context.data.meldedCard)
  }
  else {
    return context.done()
  }
}