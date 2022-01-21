const { transitionFactory2 } = require('../../lib/transitionFactory.js')

module.exports = function(actionName, gameFuncName) {

  return transitionFactory2({
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
    const { game, actor } = context
    const { card, opts } = context.data
    return game.aCheckKarma(context, actionName, opts)
  }

  function karmaInstead(context) {
    if (context.sentBack.karmaKind === 'would-instead') {
      return context.done()
    }
  }

  function main(context) {
    const { game, actor } = context
    const { card, opts } = context.data
    try {
      const cardId = game[gameFuncName](actor, card, opts).id
      game.rk.addKey(context.data, 'cardId', cardId)
    }
    catch (e) {
      console.log(`No id sent back for game func: ${gameFuncName}`)
      throw e
    }
  }

  function achievementCheck(context) {
    return context.game.aAchievementCheck(context)
  }

  function returnz(context) {
    if (context.data.cardId) {
      context.sendBack({ card: context.data.cardId })
      return context.done()
    }
    else {
      return context.done()
    }
  }

}
