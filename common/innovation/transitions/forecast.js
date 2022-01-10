const { transitionFactory2 } = require('../../lib/transitionFactory.js')

module.exports = transitionFactory2({
  steps: [
    {
      name: 'karma',
      func: karma,
    },
    {
      name: 'forecast',
      func: forecast
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
  // return game.aCheckTriggers(context, 'before-forecast')
}

function forecast(context) {
  const { game, actor } = context
  const { card } = context.data
  const forecastedCardId = game.mForecast(actor, card).id
  game.rk.addKey(context.data, 'forecastedCard', forecastedCardId)
}

function achievementCheck(context) {
  return context.game.aAchievementCheck(context)
}

function returnz(context) {
  if (context.data.forecastedCard) {
    return context.return(context.data.forecastedCard)
  }
  else {
    return context.done()
  }
}
