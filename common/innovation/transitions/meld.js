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
      name: 'main',
      func: main
    },
    {
      name: 'achievementCheck',
      func: achievementCheck,
    },
    {
      // If there is a trigger, the triggered effect will handle additional
      // achievement checks.
      name: 'whenKarma',
      func: whenKarma,
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
  return game.aCheckKarma(context, 'meld', opts)
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
    const cardId = game.mMeld(actor, card, opts).id
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

function whenKarma(context) {
  const { game, actor } = context
  const { cardId } = context.data
  const card = game.getCardData(cardId)
  const impl = card.getImpl('karma-meld-after')
  if (impl.length > 0) {
    return context.push('action-dogma-one-effect', {
      effect: {
        card: cardId,
        kind: 'karma-meld-after',
        implIndex: 0,
        leader: actor.name,
        args: [],
      },
      sharing: [],
      demanding: [],
      biscuits: {},

    })
  }
}

function returnz(context) {
  if (context.data.cardId) {
    context.sendBack({ card: context.data.cardId })
  }
  return context.done()
}
